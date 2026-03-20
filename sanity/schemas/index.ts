import product from './product'
import productVariant from './productVariant'
import productCategory from './productCategory'
import blogPost from './blogPost'
import page from './page'
import postCategory from './postCategory'
import faq from './faq'
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Products
  product,
  productVariant,
  productCategory,

  // Content
  blogPost,
  page,
  postCategory,
  faq,

  // Settings
  siteSettings,
]
