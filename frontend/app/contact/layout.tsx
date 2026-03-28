import type { Metadata } from "next"
import { getContactPage } from '@/lib/queries'
import { LocalBusinessSchema, BreadcrumbSchema } from '@/components/StructuredData'

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactPage()
  return {
    title: contact?.metaTitle || 'ติดต่อเรา | NYX Cable',
    description: contact?.metaDescription || 'ติดต่อ NYX Cable สอบถามราคาสายไฟอุตสาหกรรม โทร 02-111-5588',
    alternates: { canonical: 'https://www.nyxcable.com/contact' },
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'หน้าแรก', url: 'https://www.nyxcable.com' },
        { name: 'ติดต่อเรา', url: 'https://www.nyxcable.com/contact' },
      ]} />
      <LocalBusinessSchema />
      {children}
    </>
  )
}
