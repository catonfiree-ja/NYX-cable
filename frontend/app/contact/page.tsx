import type { Metadata } from 'next'
import { getSiteSettings, getContactPage } from '@/lib/queries'
import ContactClient from './ContactClient'
import type { ContactInfo } from './ContactClient'

export const metadata: Metadata = {
  title: 'ติดต่อเรา | NYX Cable',
  description: 'ติดต่อทีมงาน NYX Cable สอบถามราคาสายไฟอุตสาหกรรม สั่งซื้อ ขอใบเสนอราคา — โทร 02-111-5588 หรือ LINE @nyxcable',
  alternates: { canonical: 'https://www.nyxcable.com/contact' },
}

export default async function ContactPage() {
  let cms: ContactInfo = {}

  try {
    const [settings, contactCms] = await Promise.all([
      getSiteSettings().catch(() => null),
      getContactPage().catch(() => null),
    ])

    if (settings) {
      cms.phone = settings.phone
      cms.phoneRaw = settings.phone?.replace(/[^0-9]/g, '')
      cms.lineOA = settings.lineOA
      cms.lineUrl = settings.lineUrl
      cms.email = settings.email
      cms.address = settings.address
      cms.addressUrl = settings.googleMapsUrl
    }

    if (contactCms) {
      cms.heroHeading = contactCms.heroHeading
      cms.heroSubheading = contactCms.heroSubheading
      cms.businessHours = contactCms.businessHours
      cms.mapsEmbedUrl = contactCms.googleMapsEmbed
    }
  } catch {
    // Use defaults in ContactClient
  }

  return <ContactClient cms={cms} />
}
