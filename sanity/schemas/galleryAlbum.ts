import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryAlbum',
  title: 'อัลบั้มแกลเลอรี่',
  type: 'document',
  icon: () => '📸',
  fields: [
    defineField({
      name: 'title',
      title: 'ชื่ออัลบั้ม',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'ภาพปก',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'รูปภาพในอัลบั้ม',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'คำอธิบาย',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'year',
      title: 'ปี',
      type: 'number',
      description: 'ปีของอัลบั้ม (เช่น 2025)',
    }),
    defineField({
      name: 'orderRank',
      title: 'ลำดับการแสดง',
      type: 'number',
      initialValue: 0,
      description: 'ตัวเลขน้อย = แสดงก่อน',
    }),
    defineField({
      name: 'linkUrl',
      title: 'ลิงก์ภายนอก',
      type: 'url',
      description: 'ถ้าใส่ URL จะลิงก์ไปหน้านั้นแทนการเปิดแกลเลอรี่ (เช่น Facebook)',
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
      title: 'title',
      media: 'cover',
      year: 'year',
    },
    prepare({ title, media, year }) {
      return {
        title,
        subtitle: year ? `ปี ${year}` : '',
        media,
      }
    },
  },
})
