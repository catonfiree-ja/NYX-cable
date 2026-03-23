import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'หน้าแรก (Homepage)',
  type: 'document',
  icon: () => '🏠',
  fields: [
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

    // ─── Delivery Gallery Section ───
    defineField({
      name: 'deliveryHeading',
      title: 'หัวข้อส่วน "ภาพส่งสินค้า"',
      type: 'string',
      initialValue: '🚛 ภาพส่งสินค้าจริง',
      group: 'sections',
    }),
    defineField({
      name: 'deliverySubheading',
      title: 'คำอธิบาย',
      type: 'text',
      rows: 2,
      group: 'sections',
    }),

    // ─── CTA Section ───
    defineField({
      name: 'ctaHeading',
      title: 'หัวข้อ CTA',
      type: 'string',
      initialValue: 'สนใจสินค้า? ติดต่อเราวันนี้',
      group: 'sections',
    }),
    defineField({
      name: 'ctaSubheading',
      title: 'คำอธิบาย CTA',
      type: 'text',
      rows: 2,
      group: 'sections',
    }),
    defineField({
      name: 'ctaButtons',
      title: 'ปุ่ม CTA',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'ข้อความปุ่ม' },
            { name: 'url', type: 'string', title: 'ลิงก์' },
            { name: 'style', type: 'string', title: 'สไตล์', options: { list: ['primary', 'secondary', 'outline'] } },
          ],
          preview: {
            select: { title: 'text', subtitle: 'url' },
          },
        },
      ],
      group: 'sections',
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
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (รูปแชร์ Social)',
      type: 'image',
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'sections', title: 'ส่วนเนื้อหา' },
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare() {
      return { title: 'หน้าแรก' }
    },
  },
})
