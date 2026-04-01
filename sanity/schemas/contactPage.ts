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
      name: 'phoneSubtext',
      title: 'คำอธิบายย่อย: โทรศัพท์',
      type: 'string',
      group: 'info',
      description: 'เช่น "ตอบทันที ในเวลาทำการ"',
    }),
    defineField({
      name: 'lineSubtext',
      title: 'คำอธิบายย่อย: LINE Official',
      type: 'string',
      group: 'info',
      description: 'เช่น "ตอบไว 5 นาที"',
    }),
    defineField({
      name: 'emailSubtext',
      title: 'คำอธิบายย่อย: อีเมล',
      type: 'string',
      group: 'info',
      description: 'เช่น "ตอบกลับภายใน 1 ชม."',
    }),
    defineField({
      name: 'businessHoursSubtext',
      title: 'คำอธิบายย่อย: เวลาทำการ',
      type: 'string',
      group: 'info',
      description: 'เช่น "เสาร์-อาทิตย์ ปิดทำการ"',
    }),
    defineField({
      name: 'googleMapsEmbed',
      title: 'Google Maps Embed URL',
      type: 'url',
      description: 'URL สำหรับ iframe embed แผนที่',
      group: 'info',
    }),

    // ─── Warehouse Images ───
    defineField({
      name: 'warehouseHeading',
      title: 'หัวข้อคลังสินค้า',
      type: 'string',
      initialValue: 'สำนักงานและคลังสินค้า',
      group: 'gallery',
    }),
    defineField({
      name: 'warehouseImages',
      title: 'รูปภาพคลังสินค้า/สำนักงาน',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        },
      ],
      group: 'gallery',
      description: 'เพิ่มรูปภาพสำหรับแสดงด้านล่างของหน้าติดต่อเรา (แนะนำ 4 หรือ 8 รูป)',
    }),

    // ─── Form Options ───
    defineField({
      name: 'productInterestOptions',
      title: 'ตัวเลือก "สินค้าที่สนใจ" ในฟอร์ม',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'info',
      description: 'รายชื่อตัวเลือกใน Dropdown เช่น "สายคอนโทรล", "สายกันน้ำ", "สาย Profibus"',
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
    { name: 'gallery', title: 'รูปภาพ' },
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare() {
      return { title: 'หน้าติดต่อเรา' }
    },
  },
})
