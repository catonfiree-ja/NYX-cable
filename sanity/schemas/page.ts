import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'หน้าเว็บ (Page)',
  type: 'document',
  icon: () => '📄',
  fields: [
    defineField({
      name: 'title',
      title: 'ชื่อหน้า',
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
      name: 'template',
      title: 'เทมเพลต',
      type: 'string',
      options: {
        list: [
          { title: 'ทั่วไป (Default)', value: 'default' },
          { title: 'แกลเลอรี่ (Gallery)', value: 'gallery' },
          { title: 'ติดต่อเรา (Contact)', value: 'contact' },
          { title: 'เกี่ยวกับเรา (About)', value: 'about' },
          { title: 'รีวิว (Reviews)', value: 'reviews' },
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'body',
      title: 'เนื้อหา',
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
      ],
    }),
    defineField({
      name: 'galleryImages',
      title: 'รูปแกลเลอรี่',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
      hidden: ({ document }) => document?.template !== 'gallery',
    }),
    defineField({
      name: 'parent',
      title: 'หน้าหลัก (Parent)',
      type: 'reference',
      to: [{ type: 'page' }],
    }),
    defineField({
      name: 'menuOrder',
      title: 'ลำดับในเมนู',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      template: 'template',
    },
    prepare({ title, template }) {
      const templateLabels: Record<string, string> = {
        default: 'ทั่วไป',
        gallery: 'แกลเลอรี่',
        contact: 'ติดต่อเรา',
        about: 'เกี่ยวกับเรา',
        reviews: 'รีวิว',
      }
      return {
        title,
        subtitle: templateLabels[template] || template,
      }
    },
  },
})
