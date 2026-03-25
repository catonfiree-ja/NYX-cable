import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'privacyPage',
  title: 'นโยบายความเป็นส่วนตัว (Privacy)',
  type: 'document',
  icon: () => '🔒',
  fields: [
    defineField({
      name: 'heading',
      title: 'หัวข้อหลัก',
      type: 'string',
      initialValue: 'นโยบายความเป็นส่วนตัว',
    }),
    defineField({
      name: 'subheading',
      title: 'หัวข้อย่อย',
      type: 'string',
      initialValue: 'Privacy Policy — บริษัท นิกซ์ เคเบิ้ล จำกัด',
    }),
    defineField({
      name: 'body',
      title: 'เนื้อหา',
      type: 'array',
      of: [
        { type: 'block' },
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'ปรับปรุงล่าสุด',
      type: 'string',
      initialValue: 'มีนาคม 2026',
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
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare() {
      return { title: 'นโยบายความเป็นส่วนตัว' }
    },
  },
})
