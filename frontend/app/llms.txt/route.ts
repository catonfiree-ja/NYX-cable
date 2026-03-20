import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# NYX Cable — สายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป

> NYX Cable เป็นผู้นำเข้าและจำหน่ายสายไฟอุตสาหกรรมคุณภาพสูง ผลิตด้วยเทคโนโลยีจากยุโรป มาตรฐาน DIN VDE
> ส่งตรงจากโรงงาน สต็อกพร้อมส่งกว่า 150 ขนาด พร้อมทีมวิศวกรให้คำปรึกษา

## Company Info
- Company: NYX Cable (บริษัท เอ็นวายเอ็กซ์ เคเบิ้ล จำกัด)
- Website: https://www.nyxcable.com
- Phone: 02-111-5588, 095-727-5453, 095-547-9536
- Email: sales@nyxcable.com
- LINE: @nyxcable (https://page.line.me/ubb9405u)
- Location: บางนา, กรุงเทพมหานคร

## Products (50+ Models, 150+ Sizes)
- Control Cable (YSLY-JZ, YSLY-JB): สายคอนโทรลหลายแกน มาตรฐาน DIN VDE 0281, 300/500V
- VFD / Servo Cable: สายสำหรับ Variable Frequency Drive, ชีลด์ป้องกัน EMI
- Heat Resistant Cable (SiHF, SiLi): ทนความร้อน 180°C, ซิลิโคน
- Shielded Cable (YSLYCY): สายชีลด์ป้องกันคลื่นแม่เหล็กไฟฟ้า
- Crane Cable: สายทนแรงดึง สำหรับเครนและระบบขนถ่าย
- Bus / Data Cable: Profibus, DeviceNet, CC-Link
- High-Flex Motion Cable: สายทนงอ สำหรับหุ่นยนต์และเครื่อง CNC

## Standards & Certifications
- DIN VDE 0281, DIN VDE 0282
- IEC 60502, IEC 60332
- CE Marking
- RoHS Compliant

## Key Pages
- Homepage: https://www.nyxcable.com/
- All Products: https://www.nyxcable.com/products
- Blog & Knowledge: https://www.nyxcable.com/blog
- About Us: https://www.nyxcable.com/about
- Contact: https://www.nyxcable.com/contact

## FAQ
Q: สายคอนโทรล YSLY-JZ กับ YSLY-JB ต่างกันอย่างไร?
A: YSLY-JZ เหมาะสำหรับเดินสายภายนอก ส่วน YSLY-JB เป็นชนิดฝังดิน ทนความชื้นและแรงกดได้ดีกว่า

Q: มีสต็อกพร้อมส่งไหม?
A: NYX Cable มีสต็อกพร้อมส่งกว่า 150 ขนาด สามารถจัดส่งภายใน 1-2 วันทำการ

Q: สายไฟ NYX Cable ผลิตที่ไหน?
A: ผลิตด้วยเทคโนโลยีขั้นสูงจากยุโรป ผ่านมาตรฐาน DIN VDE ทุกรุ่น
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
