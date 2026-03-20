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
            // Site Settings (singleton)
            S.listItem()
              .id('siteSettings')
              .title('⚙️ ตั้งค่าเว็บไซต์')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),

            S.divider(),

            // Products
            S.listItem()
              .id('products')
              .title('📦 สินค้า')
              .child(
                S.list()
                  .id('productsList')
                  .title('สินค้า')
                  .items([
                    S.documentTypeListItem('product').title('สินค้าทั้งหมด'),
                    S.documentTypeListItem('productVariant').title('ขนาดสินค้า (Variants)'),
                    S.documentTypeListItem('productCategory').title('หมวดหมู่สินค้า'),
                  ])
              ),

            S.divider(),

            // Content
            S.listItem()
              .id('content')
              .title('📝 เนื้อหา')
              .child(
                S.list()
                  .id('contentList')
                  .title('เนื้อหา')
                  .items([
                    S.documentTypeListItem('blogPost').title('บทความ'),
                    S.documentTypeListItem('postCategory').title('หมวดหมู่บทความ'),
                    S.documentTypeListItem('page').title('หน้าเว็บ'),
                    S.documentTypeListItem('faq').title('คำถามที่พบบ่อย'),
                  ])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: {
    types: schemaTypes,
  },
})
