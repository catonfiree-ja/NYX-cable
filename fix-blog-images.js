/**
 * Download blog thumbnails from WordPress and upload to Sanity as proper assets
 * Then update the blog post documents to reference the new Sanity assets
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: path.join(__dirname, 'frontend/.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

const TEMP_DIR = path.join(__dirname, 'tmp-blog-imgs');
fs.mkdirSync(TEMP_DIR, { recursive: true });

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        const makeRequest = (u) => {
            const proto = u.startsWith('https') ? https : http;
            proto.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    makeRequest(res.headers.location);
                    return;
                }
                if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', reject);
        };
        makeRequest(url);
    });
}

async function main() {
    console.log('Fetching blog posts with WordPress mainImage URLs...\n');

    // Find posts whose mainImage.asset._ref is missing but have a URL
    // Actually, WP-imported posts might store the image URL directly
    const posts = await client.fetch(`*[_type == "blogPost"] {
    _id,
    title,
    "imageUrl": mainImage.asset->url,
    "imageRef": mainImage.asset._ref,
    mainImage
  }`);

    console.log(`Found ${posts.length} blog posts total`);

    const wpPosts = posts.filter(p => {
        const url = p.imageUrl || '';
        return url.includes('wp-content');
    });

    console.log(`${wpPosts.length} posts have WP image URLs\n`);

    if (wpPosts.length === 0) {
        // Check if images are stored as external URLs in a different way
        const postsRaw = await client.fetch(`*[_type == "blogPost" && defined(mainImage)] {
      _id,
      title,
      mainImage
    }`);

        console.log('Checking raw mainImage fields...');
        for (const p of postsRaw) {
            const img = p.mainImage;
            if (img && typeof img === 'object') {
                // Check all keys for WP URLs
                const json = JSON.stringify(img);
                if (json.includes('wp-content')) {
                    console.log(`  ${p.title}: WP URL in mainImage`);
                    console.log(`    ${JSON.stringify(img).substring(0, 200)}`);
                }
            }
        }

        // Also check featuredImage or coverImage fields
        const postsAlt = await client.fetch(`*[_type == "blogPost"] {
      _id,
      title,
      featuredImage,
      coverImage,
      "allKeys": keys(@)
    }[0..2]`);

        console.log('\nSample post keys:', postsAlt[0]?.allKeys);
        return;
    }

    // Download and re-upload each image
    let success = 0;
    let failed = 0;

    for (const post of wpPosts) {
        const url = post.imageUrl;
        const filename = url.split('/').pop().split('?')[0];

        try {
            console.log(`Downloading: ${filename}...`);
            const buffer = await downloadFile(url);

            // Upload to Sanity
            const contentType = filename.endsWith('.webp') ? 'image/webp'
                : filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

            const asset = await client.assets.upload('image', buffer, {
                filename,
                contentType,
            });

            // Update the post to reference the new asset
            await client.patch(post._id)
                .set({
                    mainImage: {
                        _type: 'image',
                        asset: { _type: 'reference', _ref: asset._id }
                    }
                })
                .commit();

            console.log(`  ✅ ${post.title} — uploaded & linked (${Math.round(buffer.length / 1024)}KB)`);
            success++;
        } catch (err) {
            console.log(`  ❌ ${post.title} — ${err.message}`);
            failed++;
        }
    }

    console.log(`\nDone: ${success} uploaded, ${failed} failed`);
}

main().catch(console.error);
