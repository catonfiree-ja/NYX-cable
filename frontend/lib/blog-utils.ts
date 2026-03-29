/**
 * Filter blog posts — remove invalid / empty posts
 */
export function filterBlogPosts(posts: any[]): any[] {
  if (!posts || !Array.isArray(posts)) return []
  return posts.filter((post) => {
    if (!post) return false
    if (!post.title || !post.slug) return false
    return true
  })
}
