import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'review',
    title: 'รีวิวจากลูกค้า (Review)',
    type: 'document',
    icon: () => '⭐',
    fields: [
        defineField({
            name: 'name',
            title: 'ชื่อลูกค้า',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'initial',
            title: 'ตัวอักษรย่อ',
            type: 'string',
            description: 'ตัวอักษรแรกของชื่อ สำหรับ avatar (เช่น W, ธ, N)',
        }),
        defineField({
            name: 'stars',
            title: 'คะแนนดาว',
            type: 'number',
            initialValue: 5,
            validation: (Rule) => Rule.min(1).max(5).required(),
        }),
        defineField({
            name: 'text',
            title: 'ข้อความรีวิว',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'time',
            title: 'เวลา',
            type: 'string',
            description: 'เช่น "2 สัปดาห์ที่แล้ว", "เดือนที่แล้ว"',
        }),
        defineField({
            name: 'orderRank',
            title: 'ลำดับการแสดงผล',
            type: 'number',
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'text',
        },
    },
})
