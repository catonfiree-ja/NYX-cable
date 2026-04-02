import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'สินค้า (Product)',
  type: 'document',
  icon: () => '📦',
  groups: [
    { name: 'basic', title: 'ข้อมูลพื้นฐาน' },
    { name: 'specs', title: 'สเปกเทคนิค' },
    { name: 'content', title: 'รายละเอียด' },
    { name: 'related', title: 'เกี่ยวข้อง' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Basic ───
    defineField({
      name: 'title',
      title: 'ชื่อสินค้า',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productCode',
      title: 'รหัสสินค้า',
      type: 'string',
      group: 'basic',
      description: 'เช่น YSLY-JZ, H07RN-F, PROFIBUS',
    }),
    defineField({
      name: 'categories',
      title: 'หมวดหมู่',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'productCategory' }] }],
      group: 'basic',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'images',
      title: 'รูปภาพสินค้า',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
          ],
        },
      ],
      group: 'basic',
    }),
    defineField({
      name: 'shortDescription',
      title: 'คำอธิบายสั้น',
      type: 'text',
      rows: 3,
      group: 'basic',
      description: 'แสดงในการ์ดสินค้าและผลการค้นหา',
    }),
    defineField({
      name: 'featured',
      title: 'สินค้าเด่น',
      type: 'boolean',
      initialValue: false,
      group: 'basic',
    }),

    // ─── Specifications ───
    defineField({
      name: 'voltageRating',
      title: 'แรงดันไฟฟ้า (V)',
      type: 'string',
      group: 'specs',
      description: 'เช่น 300/500V, 0.6/1kV',
    }),
    defineField({
      name: 'temperatureRange',
      title: 'ช่วงอุณหภูมิ',
      type: 'string',
      group: 'specs',
      description: 'เช่น -40°C to +80°C',
    }),
    defineField({
      name: 'standards',
      title: 'มาตรฐาน',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'specs',
      description: 'เช่น VDE, IEC, CE, UL',
    }),
    defineField({
      name: 'specifications',
      title: 'คุณสมบัติทางเทคนิค',
      type: 'array',
      group: 'specs',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'key', type: 'string', title: 'คุณสมบัติ' },
            { name: 'value', type: 'string', title: 'ค่า' },
          ],
          preview: {
            select: { title: 'key', subtitle: 'value' },
          },
        },
      ],
    }),
    defineField({
      name: 'datasheet',
      title: 'Datasheet (PDF)',
      type: 'file',
      group: 'specs',
      options: { accept: '.pdf' },
    }),

    // ─── Content ───
    defineField({
      name: 'description',
      title: 'รายละเอียดสินค้า',
      type: 'array',
      group: 'content',
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
    }),
    defineField({
      name: 'faqItems',
      title: 'คำถามที่พบบ่อย (FAQ)',
      type: 'array',
      group: 'content',
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

    // ─── Related ───
    defineField({
      name: 'relatedProducts',
      title: 'สินค้าที่เกี่ยวข้อง',
      type: 'array',
      group: 'related',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),

    // ─── SEO ───
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
      description: 'แนะนำ 120-160 ตัวอักษร อธิบายจุดเด่นสินค้าพร้อมคีย์เวิร์ดหลัก',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (รูปแชร์ Social)',
      type: 'image',
      group: 'seo',
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
      description: 'รูปที่แสดงเมื่อแชร์สินค้าในโซเชียล (แนะนำ 1200×630px)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'productCode',
      media: 'images.0',
    },
  },
})
