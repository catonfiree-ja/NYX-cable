import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'ตั้งค่าเว็บไซต์ (Settings)',
  type: 'document',
  icon: () => '⚙️',
  groups: [
    { name: 'contact', title: '📞 ข้อมูลติดต่อ', default: true },
    { name: 'social', title: '🔗 โซเชียล' },
    { name: 'homepage', title: '🏠 หน้าแรก' },
    { name: 'seo', title: '🔍 SEO' },
    { name: 'advanced', title: '⚙️ ขั้นสูง' },
  ],
  fields: [
    // ─── ข้อมูลบริษัท ───
    defineField({
      name: 'companyName',
      title: 'ชื่อบริษัท',
      type: 'string',
      initialValue: 'NYX Cable',
      group: 'contact',
    }),
    defineField({
      name: 'tagline',
      title: 'สโลแกน',
      type: 'string',
      group: 'contact',
    }),

    // ─── ข้อมูลติดต่อ ───
    defineField({
      name: 'phone',
      title: 'เบอร์โทรศัพท์',
      type: 'string',
      initialValue: '02-111-5588',
      description: 'เบอร์โทรที่แสดงทั่วทั้งเว็บ (Header, Footer, CTA)',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'อีเมล',
      type: 'string',
      initialValue: 'sales@nyxcable.com',
      description: 'อีเมลที่แสดงทั่วทั้งเว็บ',
      group: 'contact',
    }),
    defineField({
      name: 'lineOA',
      title: 'LINE Official Account',
      type: 'string',
      initialValue: '@nyxcable',
      description: 'ชื่อ LINE OA เช่น @nyxcable',
      group: 'contact',
    }),
    defineField({
      name: 'lineUrl',
      title: 'LINE URL',
      type: 'url',
      initialValue: 'https://page.line.me/ubb9405u',
      description: 'ลิงก์สำหรับแอด LINE (ปุ่มทั่วเว็บ)',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'ที่อยู่',
      type: 'text',
      rows: 3,
      description: 'ที่อยู่บริษัทที่แสดงใน Footer และหน้าติดต่อ',
      group: 'contact',
    }),
    defineField({
      name: 'businessHours',
      title: 'เวลาทำการ',
      type: 'string',
      initialValue: 'จันทร์ - ศุกร์ 8:30 - 17:30',
      description: 'เวลาทำการที่แสดงในหน้าติดต่อ',
      group: 'contact',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL (นำทาง)',
      type: 'url',
      description: 'ลิงก์ Google Maps สำหรับปุ่มนำทาง',
      group: 'contact',
    }),
    defineField({
      name: 'mapsEmbedUrl',
      title: 'Google Maps Embed URL (แผนที่ฝัง)',
      type: 'url',
      description: 'ลิงก์ embed สำหรับแสดงแผนที่ในหน้าติดต่อ (เริ่มด้วย https://www.google.com/maps/embed)',
      group: 'contact',
    }),

    // ─── โซเชียล ───
    defineField({
      name: 'socialLinks',
      title: 'ลิงก์โซเชียล',
      type: 'object',
      group: 'social',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'youtube', type: 'url', title: 'YouTube' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'tiktok', type: 'url', title: 'TikTok' },
      ],
    }),

    // ─── หน้าแรก ───
    defineField({
      name: 'heroSlides',
      title: 'สไลด์หน้าแรก (Hero)',
      type: 'array',
      group: 'homepage',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', type: 'image', title: 'รูป', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }] },
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
      group: 'homepage',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'clientLogos',
      title: 'โลโก้ลูกค้า',
      type: 'array',
      group: 'homepage',
      of: [
        {
          type: 'image',
          fields: [
            { name: 'name', type: 'string', title: 'ชื่อบริษัท' },
            { name: 'alt', type: 'string', title: 'Alt Text', description: 'ถ้าไม่กรอก ระบบจะใช้ชื่อบริษัทแทน' },
          ],
        },
      ],
    }),

    // ─── Footer ───
    defineField({
      name: 'footerText',
      title: 'ข้อความ Footer',
      type: 'text',
      rows: 3,
      group: 'advanced',
    }),

    // ─── SEO ───
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
      description: 'คำอธิบายที่ใช้เป็นค่า default เมื่อ share ลิงก์',
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (รูปแชร์ Social)',
      type: 'image',
      description: 'รูปที่แสดงเมื่อแชร์ลิงก์ในโซเชียล (แนะนำ 1200×630px)',
      group: 'seo',
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
    }),

    // ─── ขั้นสูง ───
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      description: 'เช่น G-XXXXXXXXXX',
      group: 'advanced',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'ตั้งค่าเว็บไซต์' }
    },
  },
})

