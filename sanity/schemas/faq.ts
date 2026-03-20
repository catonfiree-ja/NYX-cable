import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'คำถามที่พบบ่อย (FAQ)',
  type: 'document',
  icon: () => '❓',
  fields: [
    defineField({
      name: 'question',
      title: 'คำถาม',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'คำตอบ',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'product',
      title: 'สินค้าที่เกี่ยวข้อง',
      type: 'reference',
      to: [{ type: 'product' }],
    }),
    defineField({
      name: 'category',
      title: 'หมวดหมู่ที่เกี่ยวข้อง',
      type: 'reference',
      to: [{ type: 'productCategory' }],
    }),
    defineField({
      name: 'orderRank',
      title: 'ลำดับ',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'ลำดับ',
      name: 'orderAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'question',
      product: 'product.title',
      category: 'category.title',
    },
    prepare({ title, product, category }) {
      return {
        title,
        subtitle: product || category || 'ทั่วไป',
      }
    },
  },
})
