import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'หน้าแรก (Homepage)',
  type: 'document',
  icon: () => '🏠',
  fields: [
    // ─── Hero Section ───
    defineField({
      name: 'heroTitle',
      title: 'หัวข้อ Hero',
      type: 'string',
      initialValue: 'NYX CABLE',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'คำอธิบาย Hero',
      type: 'text',
      rows: 2,
      initialValue: 'ผู้นำด้านสายไฟอุตสาหกรรมมาตรฐานยุโรป ครบวงจร ส่งไว ราคาโรงงาน',
      group: 'hero',
    }),


    defineField({
      name: 'heroTagline',
      title: 'ข้อความ Tagline Hero',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'ข้อความรองใต้ subtitle เช่น "ใช้เทคโนโลยีการผลิตขั้นสูงจากยุโรป..."',
    }),
    defineField({
      name: 'heroTrustBadges',
      title: 'Trust Badges (กล่องด้านขวา)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'หัวข้อ' },
            { name: 'description', type: 'string', title: 'คำอธิบาย' },
            { name: 'url', type: 'string', title: 'ลิงก์' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      group: 'hero',
    }),

    // ─── Video Section ───
    defineField({
      name: 'videoUrl',
      title: 'YouTube Video URL',
      type: 'string',
      initialValue: 'https://www.youtube.com/watch?v=IEu9jZBH3qQ',
      group: 'sections',
    }),
    defineField({
      name: 'videoHeading',
      title: 'หัวข้อส่วนวิดีโอ',
      type: 'string',
      initialValue: 'แนะนำ NYX Cable',
      group: 'sections',
    }),

    // ─── FAQ Section ───
    defineField({
      name: 'faqHeading',
      title: 'หัวข้อส่วน FAQ',
      type: 'string',
      initialValue: 'ความรู้เกี่ยวกับสายไฟ',
      group: 'sections',
    }),
    defineField({
      name: 'faqSubheading',
      title: 'คำอธิบายย่อย FAQ',
      type: 'string',
      group: 'sections',
    }),

    // ─── Why NYX Section ───
    defineField({
      name: 'whyNyxHeading',
      title: 'หัวข้อ "ทำไมต้อง NYX Cable"',
      type: 'string',
      initialValue: 'ทำไมต้อง NYX Cable?',
      group: 'sections',
    }),
    defineField({
      name: 'whyNyxSubheading',
      title: 'คำอธิบายย่อย',
      type: 'text',
      rows: 2,
      group: 'sections',
    }),
    defineField({
      name: 'whyNyxItems',
      title: 'จุดเด่น',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Emoji', description: 'เช่น 🏭, ⚡, 📦' },
            { name: 'title', type: 'string', title: 'หัวข้อ' },
            { name: 'description', type: 'text', title: 'คำอธิบาย', rows: 2 },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      group: 'sections',
    }),

    // ─── Services Section ───
    defineField({
      name: 'servicesHeading',
      title: 'หัวข้อส่วน "บริการของเรา"',
      type: 'string',
      initialValue: 'บริการของเรา',
      group: 'sections',
    }),

    // ─── CTA Buttons Section ───
    defineField({
      name: 'ctaCallText',
      title: 'ปุ่ม CTA โทร: ข้อความหลัก',
      type: 'string',
      initialValue: 'Call หาเราทันที',
      group: 'sections',
    }),
    defineField({
      name: 'ctaCallSub',
      title: 'ปุ่ม CTA โทร: ข้อความรอง',
      type: 'string',
      initialValue: 'Click เลย !!!',
      group: 'sections',
    }),
    defineField({
      name: 'ctaLineText',
      title: 'ปุ่ม CTA LINE: ข้อความหลัก',
      type: 'string',
      initialValue: 'LINE ปรึกษาฟรี',
      group: 'sections',
    }),
    defineField({
      name: 'ctaLineSub',
      title: 'ปุ่ม CTA LINE: ข้อความรอง',
      type: 'string',
      initialValue: 'Click เลย !!!',
      group: 'sections',
    }),
    defineField({
      name: 'ctaEmailText',
      title: 'ปุ่ม CTA อีเมล: ข้อความหลัก',
      type: 'string',
      initialValue: 'Email สอบถาม',
      group: 'sections',
    }),
    defineField({
      name: 'ctaEmailSub',
      title: 'ปุ่ม CTA อีเมล: ข้อความรอง',
      type: 'string',
      initialValue: 'Click เลย !!!',
      group: 'sections',
    }),

    // ─── Delivery Gallery Section ───
    defineField({
      name: 'deliveryHeading',
      title: 'หัวข้อส่วน "การส่งสินค้า"',
      type: 'string',
      initialValue: 'การส่งสินค้า',
      group: 'sections',
    }),

    // ─── Articles Section ───
    defineField({
      name: 'articlesHeading',
      title: 'หัวข้อส่วน "ข่าวสารและบทความ"',
      type: 'string',
      initialValue: 'ข่าวสารและบทความล่าสุด',
      group: 'sections',
    }),
    defineField({
      name: 'articlesSubheading',
      title: 'คำอธิบายส่วนบทความ',
      type: 'text',
      rows: 2,
      initialValue: 'ความรู้เกี่ยวกับสายไฟอุตสาหกรรม อัพเดทเทรนด์และเทคนิคต่างๆ',
      group: 'sections',
    }),

    // ─── Client Logos ───
    defineField({
      name: 'clientLogos',
      title: 'โลโก้ลูกค้า (Client Logos)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'ชื่อบริษัท (Alt Text)' },
          ],
        },
      ],
      group: 'sections',
      description: 'อัปโหลดโลโก้ลูกค้าที่ใช้งานสายไฟ NYX Cable (แสดงเป็นแถวสไลด์)',
    }),

    // ─── Comparison Table Section ───
    defineField({
      name: 'comparisonHeading',
      title: 'หัวข้อส่วน "เปรียบเทียบ"',
      type: 'string',
      initialValue: 'เปรียบเทียบ NYX Cable กับสายไฟทั่วไป',
      group: 'sections',
    }),
    defineField({
      name: 'comparisonSubheading',
      title: 'คำอธิบายส่วนเปรียบเทียบ',
      type: 'text',
      rows: 2,
      initialValue: 'ดูข้อแตกต่างที่ชัดเจน ทำไมโรงงานชั้นนำเลือก NYX Cable',
      group: 'sections',
    }),

    // ─── SEO ───
    defineField({
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'แนะนำ 50-60 ตัวอักษร เช่น "สายไฟอุตสาหกรรมคุณภาพสูง | NYX Cable"',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'แนะนำ 120-160 ตัวอักษร อธิบายจุดเด่นของบริษัทพร้อมคีย์เวิร์ดหลัก',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (รูปแชร์ Social)',
      type: 'image',
      group: 'seo',
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
      description: 'รูปที่แสดงเมื่อแชร์หน้าแรกในโซเชียล (แนะนำ 1200×630px)',
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'sections', title: 'ส่วนเนื้อหา' },
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare() {
      return { title: 'หน้าแรก' }
    },
  },
})
