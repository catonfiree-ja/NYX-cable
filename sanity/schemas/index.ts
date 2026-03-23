import product from './product'
import productVariant from './productVariant'
import productCategory from './productCategory'
import blogPost from './blogPost'
import page from './page'
import postCategory from './postCategory'
import faq from './faq'
import galleryAlbum from './galleryAlbum'
import siteSettings from './siteSettings'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import homePage from './homePage'
import privacyPage from './privacyPage'

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

  // Gallery
  galleryAlbum,

  // Pages (Singleton)
  homePage,
  aboutPage,
  contactPage,
  privacyPage,

  // Settings
  siteSettings,
]

