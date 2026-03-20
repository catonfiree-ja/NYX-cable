import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'productVariant',
  title: 'ขนาดสินค้า (Variant)',
  type: 'document',
  icon: () => '📐',
  fields: [
    defineField({
      name: 'title',
      title: 'ชื่อรุ่น',
      type: 'string',
      description: 'เช่น YSLY-JZ 5G35, YSLY-OZ 2X0.5',
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
      name: 'parentProduct',
      title: 'สินค้าหลัก',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'model',
      title: 'รุ่น (Model)',
      type: 'string',
      description: 'เช่น YSLY-JZ 5G35',
    }),
    defineField({
      name: 'cores',
      title: 'จำนวนแกน (Cores)',
      type: 'number',
    }),
    defineField({
      name: 'crossSection',
      title: 'พื้นที่หน้าตัด (mm²)',
      type: 'number',
    }),
    defineField({
      name: 'strandsInfo',
      title: 'จำนวนเส้น x ขนาดเส้น (mm)',
      type: 'string',
      description: 'เช่น 16x0.20',
    }),
    defineField({
      name: 'outerDiameter',
      title: 'เส้นผ่านศูนย์กลางภายนอก (mm)',
      type: 'number',
    }),
    defineField({
      name: 'copperWeight',
      title: 'น้ำหนักทองแดง (kg/km)',
      type: 'number',
    }),
    defineField({
      name: 'totalWeight',
      title: 'น้ำหนักรวม (kg/km)',
      type: 'number',
    }),
    defineField({
      name: 'conductorResistance',
      title: 'ความต้านทาน @20°C (Ω/km)',
      type: 'number',
    }),
    defineField({
      name: 'price',
      title: 'ราคา (บาท/เมตร)',
      type: 'number',
    }),
    defineField({
      name: 'unit',
      title: 'หน่วย',
      type: 'string',
      initialValue: 'เมตร',
      options: {
        list: ['เมตร', 'ม้วน', 'เส้น', 'ชุด'],
      },
    }),
    defineField({
      name: 'inStock',
      title: 'มีสินค้า',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'packingLength',
      title: 'ความยาวบรรจุ (m)',
      type: 'number',
      description: 'ความยาวมาตรฐานต่อม้วน',
    }),
    defineField({
      name: 'description',
      title: 'รายละเอียดเพิ่มเติม',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'รูป Variant',
      type: 'image',
      options: { hotspot: true },
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
  orderings: [
    {
      title: 'จำนวนแกน',
      name: 'coresAsc',
      by: [{ field: 'cores', direction: 'asc' }, { field: 'crossSection', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'model',
      price: 'price',
      media: 'image',
    },
    prepare({ title, subtitle, price, media }) {
      return {
        title: title || subtitle,
        subtitle: price ? `฿${price}/m` : undefined,
        media,
      }
    },
  },
})
