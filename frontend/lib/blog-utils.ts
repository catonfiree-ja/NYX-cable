/**
 * Titles of blog posts to exclude from display.
 * These are legacy WordPress articles unrelated to industrial cables.
 * Client feedback #14.
 */
export const EXCLUDED_BLOG_TITLES = [
  'ไอเดียรถเข็นไฟฟ้า',
  'สนามบินรักษ์โลก',
  'ไอเดียรถสาธารณะพลังงานแสงอาทิตย์',
  'ลาก่อนนิวเคลียร์',
  'Stella',
  'เสาไฟฟ้าแรงสูง',
  'โซล่าฟาร์ม ดีจริงหรือไม่',
  'กระทรวงพลังงาน ร่วม การไฟฟ้า',
  'ขายไฟฟ้า คืนกำไรกลับมา',
  'Solar Roof ของระบบโซล่าเซลล์',
]

/**
 * Filter out excluded blog posts by title match
 */
export function filterBlogPosts<T extends { title?: string }>(posts: T[]): T[] {
  return posts.filter(p => !EXCLUDED_BLOG_TITLES.some(t => (p.title || '').includes(t)))
}
