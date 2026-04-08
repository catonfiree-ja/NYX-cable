import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'หน้าเกี่ยวกับเรา (About)',
  type: 'document',
  icon: () => '🏢',
  fields: [
    // ─── Hero ───
    defineField({
      name: 'heroHeading',
      title: 'หัวข้อ Hero',
      type: 'string',
      initialValue: 'เกี่ยวกับ NYX Cable',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'คำอธิบาย Hero',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroBadges',
      title: 'ป้ายแสดง Hero',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'hero',
      description: 'เช่น "🏭 มาตรฐานยุโรป", "📦 สต็อกพร้อมส่ง"',
    }),

    // ─── Company Story ───
    defineField({
      name: 'storyHeading',
      title: 'หัวข้อเรื่องราวบริษัท',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'storyContent',
      title: 'เนื้อหาเรื่องราว',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
      group: 'content',
    }),

    defineField({
      name: 'videoUrl',
      title: 'URL วีดีโอ YouTube',
      type: 'url',
      group: 'content',
      description: 'ลิงก์วีดีโอ YouTube เช่น https://www.youtube.com/watch?v=xxxxx',
    }),
    defineField({
      name: 'videoHeading',
      title: 'หัวข้อวีดีโอ',
      type: 'string',
      group: 'content',
      description: 'เช่น "แนะนำ NYX Cable"',
    }),

    // ─── Stats ───
    defineField({
      name: 'stats',
      title: 'ตัวเลขสถิติ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'ตัวเลข', description: 'เช่น 10+, 500+' },
            { name: 'label', type: 'string', title: 'คำอธิบาย', description: 'เช่น ปีประสบการณ์' },
          ],
          preview: {
            select: { title: 'number', subtitle: 'label' },
          },
        },
      ],
      group: 'content',
    }),

    // ─── Vision / Mission ───
    defineField({
      name: 'visionHeading',
      title: 'หัวข้อวิสัยทัศน์',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'visionContent',
      title: 'เนื้อหาวิสัยทัศน์',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),

    // ─── Why NYX ───
    defineField({
      name: 'whyNyxHeading',
      title: 'หัวข้อ "ทำไมต้อง NYX"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'whyNyxItems',
      title: 'จุดเด่น',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Emoji/Icon', description: 'เช่น 🏭, ⚡, 📦' },
            { name: 'title', type: 'string', title: 'หัวข้อ' },
            { name: 'description', type: 'text', title: 'คำอธิบาย', rows: 2 },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'icon' },
            prepare({ title, subtitle }) {
              return { title, subtitle }
            },
          },
        },
      ],
      group: 'content',
    }),


    // ─── Atmosphere Gallery ───
    defineField({
      name: 'atmospherePhotos',
      title: 'รูปภาพบรรยากาศบริษัท',
      type: 'array',
      group: 'gallery',
      description: 'รูปภาพบรรยากาศบริษัท/คลังสินค้า แสดงเป็น Grid (แนะนำ 8-12 รูป)',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        },
      ],
    }),

    // ─── Standards & Quality Box ───
    defineField({
      name: 'standardsHeading',
      title: 'หัวข้อ "มาตรฐานและคุณภาพ"',
      type: 'string',
      initialValue: 'มาตรฐานและคุณภาพ',
      group: 'content',
    }),
    defineField({
      name: 'standardsContent',
      title: 'เนื้อหามาตรฐานฯ',
      type: 'text',
      rows: 4,
      group: 'content',
    }),

    // ─── CTA Section ───
    defineField({
      name: 'ctaHeading',
      title: 'หัวข้อ CTA',
      type: 'string',
      initialValue: 'พร้อมให้บริการคุณ',
      group: 'content',
    }),
    defineField({
      name: 'ctaSubheading',
      title: 'คำอธิบาย CTA',
      type: 'string',
      initialValue: 'ติดต่อเราวันนี้ เพื่อรับคำปรึกษาจากผู้เชี่ยวชาญ',
      group: 'content',
    }),

    // ─── SEO ───
    defineField({
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'แนะนำ 120-160 ตัวอักษร',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (รูปแชร์ Social)',
      type: 'image',
      group: 'seo',
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
      description: 'รูปที่แสดงเมื่อแชร์หน้า About ในโซเชียล (แนะนำ 1200×630px)',
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'content', title: 'เนื้อหา' },
    { name: 'gallery', title: 'รูปภาพ' },
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare() {
      return { title: 'หน้าเกี่ยวกับเรา' }
    },
  },
})
