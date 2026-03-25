import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'หน้าติดต่อเรา (Contact)',
  type: 'document',
  icon: () => '📞',
  fields: [
    // ─── Hero ───
    defineField({
      name: 'heroHeading',
      title: 'หัวข้อ Hero',
      type: 'string',
      initialValue: 'ติดต่อเรา',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'คำอธิบาย Hero',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),

    // ─── Business Hours ───
    defineField({
      name: 'businessHours',
      title: 'เวลาทำการ',
      type: 'string',
      initialValue: 'จันทร์-ศุกร์ 8:30-17:30',
      group: 'info',
    }),
    defineField({
      name: 'googleMapsEmbed',
      title: 'Google Maps Embed URL',
      type: 'url',
      description: 'URL สำหรับ iframe embed แผนที่',
      group: 'info',
    }),

    // ─── Additional Info ───
    defineField({
      name: 'additionalInfo',
      title: 'ข้อมูลเพิ่มเติม',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', type: 'string', title: 'Emoji/Icon' },
            { name: 'title', type: 'string', title: 'หัวข้อ' },
            { name: 'content', type: 'text', title: 'เนื้อหา', rows: 2 },
          ],
          preview: {
            select: { title: 'title', subtitle: 'content' },
          },
        },
      ],
      group: 'info',
    }),

    // ─── SEO ───
    defineField({
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'แนะนำ 50-60 ตัวอักษร เช่น "ติดต่อเรา | NYX Cable"',
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
      description: 'แนะนำ 1200×630px',
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'info', title: 'ข้อมูลติดต่อ' },
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare() {
      return { title: 'หน้าติดต่อเรา' }
    },
  },
})
