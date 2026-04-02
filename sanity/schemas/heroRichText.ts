import { defineType, defineArrayMember } from 'sanity'

/**
 * Rich text block type for Hero section
 * Supports: bold, italic, color (8 curated colors), font size (4 sizes), and links
 */
export default defineType({
  name: 'heroRichText',
  title: 'Hero Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'color',
            title: 'สี',
            type: 'object',
            icon: () => '🎨',
            fields: [
              {
                name: 'hex',
                title: 'สี (Hex)',
                type: 'string',
                description: 'เลือกสี เช่น #fbb03b (ทอง), #4fc3f7 (ฟ้าอ่อน), #ffffff (ขาว)',
                options: {
                  list: [
                    { title: '⬜ ขาว', value: '#ffffff' },
                    { title: '🟡 ทอง NYX', value: '#fbb03b' },
                    { title: '🔵 ฟ้าอ่อน', value: '#4fc3f7' },
                    { title: '🔷 น้ำเงิน NYX', value: '#0e76bd' },
                    { title: '⚫ เทา', value: 'rgba(255,255,255,0.7)' },
                    { title: '🟢 เขียว', value: '#4caf50' },
                    { title: '🔴 แดง', value: '#ef5350' },
                    { title: '⬛ ดำ', value: '#000000' },
                  ],
                },
              },
            ],
          },
          {
            name: 'fontSize',
            title: 'ขนาดตัวอักษร',
            type: 'object',
            icon: () => 'Aa',
            fields: [
              {
                name: 'size',
                title: 'ขนาด',
                type: 'string',
                options: {
                  list: [
                    { title: 'เล็ก (0.85rem)', value: '0.85rem' },
                    { title: 'ปกติ (1rem)', value: '1rem' },
                    { title: 'กลาง (1.2rem)', value: '1.2rem' },
                    { title: 'ใหญ่ (1.5rem)', value: '1.5rem' },
                    { title: 'ใหญ่มาก (2rem)', value: '2rem' },
                  ],
                },
              },
            ],
          },
          {
            name: 'link',
            title: 'ลิงก์',
            type: 'object',
            fields: [
              { name: 'href', title: 'URL', type: 'url' },
            ],
          },
        ],
      },
    }),
  ],
})
