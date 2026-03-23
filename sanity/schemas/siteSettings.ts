import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'ตั้งค่าเว็บไซต์ (Settings)',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'companyName',
      title: 'ชื่อบริษัท',
      type: 'string',
      initialValue: 'NYX Cable',
    }),
    defineField({
      name: 'tagline',
      title: 'สโลแกน',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'เบอร์โทรศัพท์',
      type: 'string',
      initialValue: '02-111-5588',
    }),
    defineField({
      name: 'lineOA',
      title: 'LINE Official Account',
      type: 'string',
      initialValue: '@nyxcable',
    }),
    defineField({
      name: 'lineUrl',
      title: 'LINE URL',
      type: 'url',
      initialValue: 'https://page.line.me/ubb9405u',
    }),
    defineField({
      name: 'email',
      title: 'อีเมล',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'ที่อยู่',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
    }),
    defineField({
      name: 'heroSlides',
      title: 'สไลด์หน้าแรก (Hero)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', type: 'image', title: 'รูป', options: { hotspot: true } },
            { name: 'heading', type: 'string', title: 'หัวข้อ' },
            { name: 'subheading', type: 'string', title: 'หัวข้อย่อย' },
            { name: 'ctaText', type: 'string', title: 'ข้อความปุ่ม' },
            { name: 'ctaUrl', type: 'string', title: 'ลิงก์ปุ่ม' },
          ],
          preview: {
            select: { title: 'heading', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'featuredProducts',
      title: 'สินค้าแนะนำ (หน้าแรก)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'clientLogos',
      title: 'โลโก้ลูกค้า',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            { name: 'name', type: 'string', title: 'ชื่อบริษัท' },
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'ลิงก์โซเชียล',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'youtube', type: 'url', title: 'YouTube' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'tiktok', type: 'url', title: 'TikTok' },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'ข้อความ Footer',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      description: 'เช่น G-XXXXXXXXXX',
    }),

    // ─── Global SEO ───
    defineField({
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
      description: 'Title ที่ใช้เป็นค่า default สำหรับทุกหน้า',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (รูปแชร์ Social)',
      type: 'image',
      description: 'รูปที่แสดงเมื่อแชร์ลิงก์ในโซเชียล',
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare() {
      return { title: 'ตั้งค่าเว็บไซต์' }
    },
  },
})
