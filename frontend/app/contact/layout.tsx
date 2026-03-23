import type { Metadata } from "next"
import { getContactPage } from '@/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactPage()
  return {
    title: contact?.metaTitle || 'ติดต่อเรา | NYX Cable',
    description: contact?.metaDescription || 'ติดต่อ NYX Cable สอบถามราคาสายไฟอุตสาหกรรม โทร 02-111-5588',
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
