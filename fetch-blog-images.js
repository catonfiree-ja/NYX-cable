// Fetch WP blog post slugs + featured image URLs
// Outputs BOTH encoded and decoded slug keys for maximum matching
const fs = require('fs');

async function main() {
  const mapping = {};
  let page = 1;
  
  while (true) {
    const url = `https://nyxcable.com/wp-json/wp/v2/posts?per_page=50&page=${page}&_embed`;
    console.log(`Fetching page ${page}...`);
    
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      
      const posts = await res.json();
      if (!posts.length) break;
      
      for (const post of posts) {
        const slug = post.slug;
        const media = post._embedded && post._embedded['wp:featuredmedia'];
        if (media && media[0]) {
          const m = media[0];
          const imgUrl = m.source_url_webp || m.source_url;
          const sizes = m.media_details && m.media_details.sizes;
          const cardUrl = (sizes && (
            (sizes['fusion-800'] && (sizes['fusion-800'].source_url_webp || sizes['fusion-800'].source_url)) ||
            (sizes['recent-posts'] && (sizes['recent-posts'].source_url_webp || sizes['recent-posts'].source_url))
          )) || imgUrl;
          
          // Add both encoded slug (original from WP) AND decoded slug (for Sanity matching)
          mapping[slug] = cardUrl;
          const decodedSlug = decodeURIComponent(slug);
          if (decodedSlug !== slug) {
            mapping[decodedSlug] = cardUrl;
          }
          console.log(`  ${decodedSlug} -> ${cardUrl.split('/').pop()}`);
        }
      }
      
      const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1');
      if (page >= totalPages) break;
      page++;
    } catch (e) {
      console.error('Error:', e.message);
      break;
    }
  }

  console.log(`\nTotal entries: ${Object.keys(mapping).length}`);
  
  const outDir = 'frontend/data';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/blog-images.json`, JSON.stringify(mapping, null, 2));
  console.log('Saved to frontend/data/blog-images.json');
}

main();
