import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const PROJECT_ID = '30wikoy9'
const DATASET = 'production'

export default defineConfig({
  name: 'nyx-cable',
  title: 'NYX Cable — CMS',

  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('root')
          .title('NYX Cable CMS')
          .items([
            // ─── 1. หน้าแรก (ตรงกับหน้าบ้าน: แรกสุด) ───
            S.listItem()
              .id('homePage')
              .title('🏠 หน้าแรก')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
              ),

            S.divider(),

            // ─── 2. สินค้า (Menu: สินค้า / Products) ───
            S.listItem()
              .id('products')
              .title('📦 สินค้า')
              .child(
                S.list()
                  .id('productsList')
                  .title('จัดการสินค้า')
                  .items([
                    S.documentTypeListItem('productCategory').title('📂 หมวดหมู่สินค้า'),
                    S.documentTypeListItem('product').title('📦 สินค้าทั้งหมด'),
                    S.documentTypeListItem('productVariant').title('📏 ขนาดสินค้า (Variants)'),
                  ])
              ),

            S.divider(),

            // ─── 3. เกี่ยวกับเรา (Menu: เกี่ยวกับเรา) ───
            S.listItem()
              .id('aboutPage')
              .title('🏢 เกี่ยวกับเรา')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
              ),

            // ─── 4. ติดต่อเรา (Menu: ติดต่อเรา) ───
            S.listItem()
              .id('contactPage')
              .title('📞 ติดต่อเรา')
              .child(
                S.document()
                  .schemaType('contactPage')
                  .documentId('contactPage')
              ),

            S.divider(),

            // ─── 5. บทความ (Menu: บทความ / Blog) ───
            S.listItem()
              .id('blog')
              .title('📝 บทความ')
              .child(
                S.list()
                  .id('blogList')
                  .title('จัดการบทความ')
                  .items([
                    S.documentTypeListItem('blogPost').title('📝 บทความทั้งหมด'),
                    S.documentTypeListItem('postCategory').title('📁 หมวดหมู่บทความ'),
                  ])
              ),

            // ─── 6. รีวิวลูกค้า (Menu: รีวิว) ───
            S.documentTypeListItem('review').title('⭐ รีวิวลูกค้า'),

            // ─── 7. แกลเลอรี่ (Menu: แกลเลอรี่) ───
            S.documentTypeListItem('galleryAlbum').title('📸 แกลเลอรี่'),

            S.divider(),

            // ─── 8. FAQ + หน้าอื่นๆ ───
            S.listItem()
              .id('extras')
              .title('📋 อื่นๆ')
              .child(
                S.list()
                  .id('extrasList')
                  .title('อื่นๆ')
                  .items([
                    S.documentTypeListItem('faq').title('❓ คำถามที่พบบ่อย'),
                    S.documentTypeListItem('page').title('📄 หน้าเว็บทั่วไป'),
                    S.listItem()
                      .id('privacyPage')
                      .title('🔒 นโยบายความเป็นส่วนตัว')
                      .child(
                        S.document()
                          .schemaType('privacyPage')
                          .documentId('privacyPage')
                      ),
                  ])
              ),

            S.divider(),

            // ─── 9. ตั้งค่าเว็บไซต์ (ล่างสุด) ───
            S.listItem()
              .id('siteSettings')
              .title('⚙️ ตั้งค่าเว็บไซต์')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: {
    types: schemaTypes,
    // Prevent creating new documents for singleton types
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) =>
          !['siteSettings', 'homePage', 'aboutPage', 'contactPage', 'privacyPage'].includes(schemaType)
      ),
  },
})

