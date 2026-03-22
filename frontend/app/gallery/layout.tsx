import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'แกลเลอรี่ ผลงาน & การจัดส่ง | NYX Cable',
  description: 'ภาพผลงานการติดตั้งสายไฟอุตสาหกรรม NYX Cable และการจัดส่งทั่วประเทศ',
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
