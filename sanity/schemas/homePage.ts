import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'หน้าแรก (Homepage)',
  type: 'document',
  icon: () => '🏠',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'clients', title: 'โลโก้ลูกค้า' },
    { name: 'services', title: 'บริการเสริม' },
    { name: 'cta', title: 'ปุ่มติดต่อ' },
    { name: 'whyNyx', title: 'จุดเด่นบริษัท' },
    { name: 'delivery', title: 'คลังสินค้าและจัดส่ง' },
    { name: 'articles', title: 'วิดีโอและบทความ' },
    { name: 'comparison', title: 'เปรียบเทียบ' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Hero Section ───
    defineField({
      name: 'heroContent',
      title: '✏️ เนื้อหา Hero (แก้ สี/ขนาด ได้)',
      type: 'heroRichText',
      group: 'hero',
      description: 'แก้ไขข้อความ Hero พร้อมปรับสี ปรับขนาด ได้ทั้งหมด (ไฮไลท์ข้อความ → กดปุ่ม 🎨 เลือกสี / กดปุ่ม Aa เลือกขนาด)',
    }),
    defineField({
      name: 'heroTitle',
      title: 'หัวข้อ Hero (เก่า — ใช้ช่อง Rich Text ด้านบนแทน)',
      type: 'string',
      initialValue: 'NYX CABLE',
      group: 'hero',
      hidden: true,
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'คำอธิบาย Hero (เก่า)',
      type: 'text',
      rows: 2,
      initialValue: 'ผู้นำด้านสายไฟอุตสาหกรรมมาตรฐานยุโรป ครบวงจร ส่งไว ราคาโรงงาน',
      group: 'hero',
      hidden: true,
    }),
    defineField({
      name: 'heroTagline',
      title: 'ข้อความ Tagline Hero (เก่า)',
      type: 'text',
      rows: 3,
      group: 'hero',
      hidden: true,
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
      group: 'clients',
      description: 'อัปโหลดโลโก้ลูกค้าที่ใช้งานสายไฟ NYX Cable (แสดงเป็นแถวสไลด์)',
    }),

    // ─── Services Section ───
    defineField({
      name: 'servicesHeading',
      title: 'หัวข้อส่วน "บริการของเรา"',
      type: 'string',
      initialValue: 'บริการของเรา',
      group: 'services',
    }),
    defineField({
      name: 'servicesItems',
      title: 'รายการบริการ',
      type: 'array',
      group: 'services',
      description: 'รายการบริการ 4 ช่อง แต่ละรายการมีไอคอน หัวข้อ และคำอธิบาย 2 บรรทัด',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              type: 'image',
              title: 'ไอคอน',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string', title: 'Alt Text' },
              ],
            },
            { name: 'title', type: 'string', title: 'หัวข้อ' },
            { name: 'line1', type: 'string', title: 'บรรทัดที่ 1' },
            { name: 'line2', type: 'string', title: 'บรรทัดที่ 2' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'line1', media: 'icon' },
          },
        },
      ],
    }),

    // ─── CTA Buttons Section ───
    defineField({
      name: 'ctaCallText',
      title: 'ปุ่ม CTA โทร: ข้อความหลัก',
      type: 'string',
      initialValue: 'Call หาเราทันที',
      group: 'cta',
    }),
    defineField({
      name: 'ctaCallSub',
      title: 'ปุ่ม CTA โทร: ข้อความรอง',
      type: 'string',
      initialValue: 'Click เลย !!!',
      group: 'cta',
    }),
    defineField({
      name: 'ctaCallLink',
      title: 'ปุ่ม CTA โทร: เบอร์โทร / ลิงก์',
      type: 'string',
      group: 'cta',
      description: 'เช่น 021115588 (ระบบจะแปลงเป็น tel: อัตโนมัติ)',
    }),
    defineField({
      name: 'ctaLineText',
      title: 'ปุ่ม CTA LINE: ข้อความหลัก',
      type: 'string',
      initialValue: 'LINE ปรึกษาฟรี',
      group: 'cta',
    }),
    defineField({
      name: 'ctaLineSub',
      title: 'ปุ่ม CTA LINE: ข้อความรอง',
      type: 'string',
      initialValue: 'Click เลย !!!',
      group: 'cta',
    }),
    defineField({
      name: 'ctaLineLink',
      title: 'ปุ่ม CTA LINE: URL ลิงก์',
      type: 'string',
      group: 'cta',
      description: 'เช่น https://line.me/R/ti/p/@ubb9405u',
    }),
    defineField({
      name: 'ctaEmailText',
      title: 'ปุ่ม CTA อีเมล: ข้อความหลัก',
      type: 'string',
      initialValue: 'Email สอบถาม',
      group: 'cta',
    }),
    defineField({
      name: 'ctaEmailSub',
      title: 'ปุ่ม CTA อีเมล: ข้อความรอง',
      type: 'string',
      initialValue: 'Click เลย !!!',
      group: 'cta',
    }),
    defineField({
      name: 'ctaEmailLink',
      title: 'ปุ่ม CTA อีเมล: อีเมล / ลิงก์',
      type: 'string',
      group: 'cta',
      description: 'เช่น sales@nyxcable.com (ระบบจะแปลงเป็น mailto: อัตโนมัติ)',
    }),

    // ─── Why NYX Section ───
    defineField({
      name: 'whyNyxHeading',
      title: 'หัวข้อ "ทำไมต้อง NYX Cable"',
      type: 'string',
      initialValue: 'ทำไมต้อง NYX Cable?',
      group: 'whyNyx',
    }),
    defineField({
      name: 'whyNyxSubheading',
      title: 'คำอธิบายย่อย',
      type: 'text',
      rows: 2,
      group: 'whyNyx',
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
      group: 'whyNyx',
    }),

    // ─── Delivery Gallery Section ───
    defineField({
      name: 'deliveryHeading',
      title: 'หัวข้อส่วน "การส่งสินค้า"',
      type: 'string',
      initialValue: 'การส่งสินค้า',
      group: 'delivery',
    }),
    defineField({
      name: 'deliveryPhotos',
      title: 'รูปภาพการส่งสินค้า',
      type: 'array',
      group: 'delivery',
      description: 'รูปภาพแกลเลอรี่การส่งสินค้า สามารถเพิ่ม/ลบ/เรียงลำดับได้',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'คำอธิบายรูป (Alt Text)' },
            { name: 'gridColumn', type: 'string', title: 'Grid Column', description: 'เช่น 1, 2, 1 / 3 (ข้ามคอลัมน์)' },
            { name: 'gridRow', type: 'string', title: 'Grid Row', description: 'เช่น 1, 2 / 4 (ข้ามแถว)' },
          ],
        },
      ],
    }),

    // ─── Video & Articles Section ───
    defineField({
      name: 'videoHeading',
      title: 'หัวข้อส่วนวิดีโอ',
      type: 'string',
      initialValue: 'แนะนำ NYX Cable',
      group: 'articles',
    }),
    defineField({
      name: 'videoUrl',
      title: 'YouTube Video URL',
      type: 'string',
      initialValue: 'https://www.youtube.com/watch?v=IEu9jZBH3qQ',
      group: 'articles',
    }),
    defineField({
      name: 'articlesHeading',
      title: 'หัวข้อส่วน "ข่าวสารและบทความ"',
      type: 'string',
      initialValue: 'ข่าวสารและบทความล่าสุด',
      group: 'articles',
    }),
    defineField({
      name: 'articlesSubheading',
      title: 'คำอธิบายส่วนบทความ',
      type: 'text',
      rows: 2,
      initialValue: 'ความรู้เกี่ยวกับสายไฟอุตสาหกรรม อัพเดทเทรนด์และเทคนิคต่างๆ',
      group: 'articles',
    }),
    defineField({
      name: 'faqHeading',
      title: 'หัวข้อส่วน FAQ',
      type: 'string',
      initialValue: 'ความรู้เกี่ยวกับสายไฟ',
      group: 'articles',
    }),
    defineField({
      name: 'faqSubheading',
      title: 'คำอธิบายย่อย FAQ',
      type: 'string',
      group: 'articles',
    }),

    // ─── Comparison Table Section ───
    defineField({
      name: 'comparisonHeading',
      title: 'หัวข้อส่วน "เปรียบเทียบ"',
      type: 'string',
      initialValue: 'เปรียบเทียบ NYX Cable กับสายไฟทั่วไป',
      group: 'comparison',
    }),
    defineField({
      name: 'comparisonSubheading',
      title: 'คำอธิบายส่วนเปรียบเทียบ',
      type: 'text',
      rows: 2,
      initialValue: 'ดูข้อแตกต่างที่ชัดเจน ทำไมโรงงานชั้นนำเลือก NYX Cable',
      group: 'comparison',
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
  preview: {
    prepare() {
      return { title: 'หน้าแรก' }
    },
  },
})
