import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'ตั้งค่าเว็บไซต์ (Settings)',
  type: 'document',
  icon: () => '⚙️',
  groups: [
    { name: 'contact', title: '📞 ข้อมูลติดต่อ', default: true },
    { name: 'navigation', title: '🧭 เมนูนำทาง' },
    { name: 'social', title: '🔗 โซเชียล' },
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
      title: 'Email Address',
      type: 'string',
      description: 'อีเมลติดต่อหลัก',
      group: 'contact',
    }),
    defineField({
      name: 'lineOA',
      title: 'LINE Official Account',
      type: 'string',
      description: 'ชื่อ LINE OA เช่น @nyxcable',
      group: 'contact',
    }),
    defineField({
      name: 'lineUrl',
      title: 'LINE URL',
      type: 'url',
      description: 'ลิงก์สำหรับคลิกแอดไลน์',
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



    // ─── Footer ───
    defineField({
      name: 'footerText',
      title: 'ข้อความ Footer',
      type: 'text',
      rows: 3,
      group: 'advanced',
    }),
    defineField({
      name: 'lineQrImage',
      title: 'LINE QR Code',
      type: 'image',
      group: 'contact',
      description: 'รูป QR Code สำหรับแอดไลน์',
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
    }),
    defineField({
      name: 'businessHoursNote',
      title: 'หมายเหตุเวลาทำการ',
      type: 'string',
      group: 'contact',
      description: 'เช่น "พักเที่ยง 12:00-13:00" หรือ "เสาร์-อาทิตย์ ปิดทำการ"',
    }),

    // ─── เมนูนำทาง ───
    defineField({
      name: 'headerNavigation',
      title: 'เมนู Header',
      type: 'array',
      group: 'navigation',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'ชื่อเมนู' },
            { name: 'href', type: 'string', title: 'ลิงก์' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'footerNavigation',
      title: 'เมนู Footer (Quick Links)',
      type: 'array',
      group: 'navigation',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'ชื่อลิงก์' },
            { name: 'href', type: 'string', title: 'ลิงก์' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
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

