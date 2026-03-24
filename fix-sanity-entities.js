const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: path.join(__dirname, 'frontend/.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

function decodeHtmlEntities(text) {
    if (!text) return '';
    let decoded = text
        .replace(/&#8230;/g, '…')
        .replace(/&#183;/g, '·')
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—')
        .replace(/&#8216;/g, "'")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\[&#8230;\]/g, '…')
        .replace(/\[…\]/g, '…');

    return decoded;
}

async function fixEntities() {
    console.log('Fetching documents with HTML entities in shortDescription...');

    // Find products, categories, or posts with & in shortDescription
    const query = `*[_type in ["product", "category", "post"] && defined(shortDescription)] {
    _id,
    _type,
    title,
    shortDescription
  }`;

    const docs = await client.fetch(query);
    const toUpdate = docs.filter(doc => doc.shortDescription !== decodeHtmlEntities(doc.shortDescription));

    console.log(`Found ${toUpdate.length} documents needing entity decoding.`);

    if (toUpdate.length === 0) {
        console.log('Nothing to do!');
        return;
    }

    for (const doc of toUpdate) {
        const newDesc = decodeHtmlEntities(doc.shortDescription);
        console.log(`Updating [${doc._type}] ${doc.title}:`);
        console.log(`  OLD: ${doc.shortDescription.substring(0, 60)}...`);
        console.log(`  NEW: ${newDesc.substring(0, 60)}...`);

        await client
            .patch(doc._id)
            .set({ shortDescription: newDesc })
            .commit();

        console.log(`✅ Patched ${doc._id}`);
    }

    console.log('All entities fixed in Sanity!');
}

fixEntities().catch(console.error);
