import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'postCategory',
  title: 'หมวดหมู่บทความ',
  type: 'document',
  icon: () => '🏷️',
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
      name: 'description',
      title: 'คำอธิบาย',
      type: 'text',
      rows: 3,
    }),
  ],
})
