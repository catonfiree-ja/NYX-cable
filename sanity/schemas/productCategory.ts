import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'productCategory',
  title: 'หมวดหมู่สินค้า (Category)',
  type: 'document',
  icon: () => '📂',
  fields: [
    defineField({
      name: 'title',
      title: 'ชื่อหมวดหมู่',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'หมวดหมู่หลัก',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      description: 'เลือกถ้าเป็นหมวดหมู่ย่อย',
    }),
    defineField({
      name: 'shortDescription',
      title: 'คำอธิบายสั้น',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'เนื้อหา SEO (บทความหมวดหมู่)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
        {
          type: 'object',
          name: 'specTable',
          title: 'ตารางสเปก',
          fields: [
            { name: 'caption', type: 'string', title: 'หัวตาราง' },
            {
              name: 'headers',
              type: 'array',
              of: [{ type: 'string' }],
              title: 'หัวคอลัมน์',
            },
            {
              name: 'rows',
              type: 'array',
              title: 'แถวข้อมูล',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'cells',
                      type: 'array',
                      of: [{ type: 'string' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      description: 'บทความ SEO ยาว — หมวดหมู่บางตัวมีเนื้อหา 5,000–8,000 คำ',
    }),
    defineField({
      name: 'image',
      title: 'รูปหมวดหมู่',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text (สำคัญต่อ SEO)', description: 'อธิบายภาพสั้นๆ เช่น "สายคอนโทรล YSLY-JZ"' },
      ],
    }),
    defineField({
      name: 'icon',
      title: 'ไอคอน',
      type: 'string',
      description: 'Emoji หรือ icon name',
    }),
    defineField({
      name: 'faqItems',
      title: 'คำถามที่พบบ่อย (FAQ)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'คำถาม' },
            {
              name: 'answer',
              type: 'array',
              of: [{ type: 'block' }],
              title: 'คำตอบ',
            },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),
    defineField({
      name: 'orderRank',
      title: 'ลำดับการแสดงผล',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'แนะนำ 50-60 ตัวอักษร เช่น "สายคอนโทรล YSLY-JZ คุณภาพสูง | NYX Cable"',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'แนะนำ 120-160 ตัวอักษร อธิบายหมวดหมู่พร้อมคีย์เวิร์ดหลัก',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (รูปแชร์ Social)',
      type: 'image',
      group: 'seo',
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
      description: 'รูปที่แสดงเมื่อแชร์ลิงก์หมวดหมู่ในโซเชียล (แนะนำ 1200×630px)',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    select: {
      title: 'title',
      parent: 'parent.title',
      media: 'image',
    },
    prepare({ title, parent, media }) {
      return {
        title,
        subtitle: parent ? `↳ ย่อยของ ${parent}` : 'หมวดหมู่หลัก',
        media,
      }
    },
  },
})
