import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'รีวิวจากลูกค้า | NYX Cable',
  description: 'รีวิวและความคิดเห็นจากลูกค้าที่ใช้สายไฟอุตสาหกรรม NYX Cable คุณภาพมาตรฐานยุโรป',
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
