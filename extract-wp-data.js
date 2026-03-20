/**
 * NYX Cable — WordPress Data Extraction Script
 * Extracts all content via WP REST API (public endpoints)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://www.nyxcable.com/wp-json/wp/v2';
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    console.log(`  → Fetching: ${fullUrl}`);
    
    https.get(fullUrl, { headers: { 'User-Agent': 'NYXCable-Extractor/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const totalPages = res.headers['x-wp-totalpages'];
          const totalItems = res.headers['x-wp-total'];
          const json = JSON.parse(data);
          resolve({ json, totalPages: parseInt(totalPages || '1'), totalItems: parseInt(totalItems || '0'), headers: res.headers });
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${fullUrl}: ${e.message}\nResponse: ${data.substring(0, 500)}`));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchAllPages(endpoint, perPage = 100) {
  const allItems = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${endpoint}${separator}per_page=${perPage}&page=${page}`;
    const result = await fetchJSON(url);
    
    if (Array.isArray(result.json)) {
      allItems.push(...result.json);
    } else {
      console.log(`  ⚠ Non-array response on page ${page}`);
      break;
    }
    
    totalPages = result.totalPages;
    console.log(`  📄 Page ${page}/${totalPages} — ${result.json.length} items (total: ${result.totalItems})`);
    page++;
  }

  return allItems;
}

function saveJSON(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✅ Saved: ${filepath} (${Array.isArray(data) ? data.length + ' items' : 'object'})\n`);
}

async function extractProducts() {
  console.log('\n🔧 EXTRACTING PRODUCTS...');
  const products = await fetchAllPages('/product');
  saveJSON('products.json', products);
  
  // Extract summary
  const summary = products.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title?.rendered,
    link: p.link,
    categories: p.product_cat,
    tags: p.product_tag,
    featured_media: p.featured_media,
    status: p.status,
  }));
  saveJSON('products-summary.json', summary);
  
  return products;
}

async function extractCategories() {
  console.log('\n📂 EXTRACTING PRODUCT CATEGORIES...');
  const categories = await fetchAllPages('/product_cat');
  saveJSON('product-categories.json', categories);
  
  // Also get regular post categories
  console.log('\n📂 EXTRACTING POST CATEGORIES...');
  const postCats = await fetchAllPages('/categories');
  saveJSON('post-categories.json', postCats);
  
  // Get tags
  console.log('\n🏷️ EXTRACTING TAGS...');
  try {
    const tags = await fetchAllPages('/tags');
    saveJSON('tags.json', tags);
  } catch (e) {
    console.log('  ⚠ No tags or error:', e.message);
  }
  
  // Get product tags
  console.log('\n🏷️ EXTRACTING PRODUCT TAGS...');
  try {
    const productTags = await fetchAllPages('/product_tag');
    saveJSON('product-tags.json', productTags);
  } catch (e) {
    console.log('  ⚠ No product tags or error:', e.message);
  }
  
  return categories;
}

async function extractPosts() {
  console.log('\n📝 EXTRACTING BLOG POSTS...');
  const posts = await fetchAllPages('/posts');
  saveJSON('posts.json', posts);
  
  const summary = posts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title?.rendered,
    date: p.date,
    modified: p.modified,
    categories: p.categories,
    tags: p.tags,
    featured_media: p.featured_media,
    link: p.link,
    excerpt: p.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim().substring(0, 200),
  }));
  saveJSON('posts-summary.json', summary);
  
  return posts;
}

async function extractPages() {
  console.log('\n📄 EXTRACTING PAGES...');
  const pages = await fetchAllPages('/pages');
  saveJSON('pages.json', pages);
  
  const summary = pages.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title?.rendered,
    link: p.link,
    parent: p.parent,
    template: p.template,
    menu_order: p.menu_order,
    status: p.status,
  }));
  saveJSON('pages-summary.json', summary);
  
  return pages;
}

async function extractMedia() {
  console.log('\n🖼️ EXTRACTING MEDIA...');
  const media = await fetchAllPages('/media');
  saveJSON('media.json', media);
  
  const summary = media.map(m => ({
    id: m.id,
    title: m.title?.rendered,
    source_url: m.source_url,
    mime_type: m.mime_type,
    alt_text: m.alt_text,
    width: m.media_details?.width,
    height: m.media_details?.height,
    file: m.media_details?.file,
    sizes: m.media_details?.sizes ? Object.keys(m.media_details.sizes) : [],
  }));
  saveJSON('media-summary.json', summary);
  
  return media;
}

async function extractMenus() {
  console.log('\n🗂️ EXTRACTING MENUS & NAVIGATION...');
  try {
    const result = await fetchJSON(`${BASE_URL}/../`);
    // Check available endpoints
    const namespaces = result.json?.namespaces || [];
    console.log('  Available namespaces:', namespaces.join(', '));
    saveJSON('api-namespaces.json', { namespaces, routes: Object.keys(result.json?.routes || {}) });
  } catch (e) {
    console.log('  ⚠ Could not fetch API index:', e.message);
  }
}

async function generateAnalysisReport(products, categories, posts, pages, media) {
  console.log('\n📊 GENERATING ANALYSIS REPORT...');
  
  const report = {
    extractedAt: new Date().toISOString(),
    summary: {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalPosts: posts.length,
      totalPages: pages.length,
      totalMedia: media.length,
    },
    products: {
      count: products.length,
      items: products.map(p => ({
        id: p.id,
        title: p.title?.rendered,
        slug: p.slug,
        categories: p.product_cat,
        hasContent: !!(p.content?.rendered?.trim()),
        contentLength: p.content?.rendered?.length || 0,
      })),
    },
    categories: {
      count: categories.length,
      items: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parent: c.parent,
        count: c.count,
        description: c.description,
      })),
    },
    pages: {
      count: pages.length,
      items: pages.map(p => ({
        id: p.id,
        title: p.title?.rendered,
        slug: p.slug,
        template: p.template,
        parent: p.parent,
        hasContent: !!(p.content?.rendered?.trim()),
      })),
    },
    posts: {
      count: posts.length,
      items: posts.map(p => ({
        id: p.id,
        title: p.title?.rendered,
        slug: p.slug,
        date: p.date,
      })),
    },
    media: {
      count: media.length,
      types: media.reduce((acc, m) => {
        acc[m.mime_type] = (acc[m.mime_type] || 0) + 1;
        return acc;
      }, {}),
    },
  };
  
  saveJSON('analysis-report.json', report);
  return report;
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  NYX Cable — WordPress Data Extraction');
  console.log('═══════════════════════════════════════════');
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Output: ${DATA_DIR}`);
  console.log('═══════════════════════════════════════════');

  try {
    const products = await extractProducts();
    const categories = await extractCategories();
    const posts = await extractPosts();
    const pages = await extractPages();
    const media = await extractMedia();
    await extractMenus();
    
    const report = await generateAnalysisReport(products, categories, posts, pages, media);
    
    console.log('\n═══════════════════════════════════════════');
    console.log('  ✅ EXTRACTION COMPLETE');
    console.log('═══════════════════════════════════════════');
    console.log(`  Products:   ${report.summary.totalProducts}`);
    console.log(`  Categories: ${report.summary.totalCategories}`);
    console.log(`  Posts:      ${report.summary.totalPosts}`);
    console.log(`  Pages:      ${report.summary.totalPages}`);
    console.log(`  Media:      ${report.summary.totalMedia}`);
    console.log('═══════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ EXTRACTION FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
