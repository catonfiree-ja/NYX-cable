const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: path.join(__dirname, 'frontend/.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function findWpUrls() {
    console.log('Searching Sanity for wp-content/uploads...');

    // Find strings containing wp-content
    const query = `*[
    pt::text(body) match "wp-content/uploads" || 
    description match "wp-content/uploads" || 
    content match "wp-content/uploads" ||
    url match "wp-content/uploads" ||
    coverUrl match "wp-content/uploads"
  ] {
    _id,
    _type,
    title,
    coverUrl
  }`;

    const docs = await client.fetch(query);
    console.log(`Found ${docs.length} documents with WP URLs.`);

    docs.forEach(d => {
        console.log(`- [${d._type}] ${d.title || d._id}: ${d.coverUrl || 'in body'}`);
    });
}

findWpUrls().catch(console.error);
