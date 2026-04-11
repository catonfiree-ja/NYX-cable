import { createClient } from '@sanity/client'
import crypto from 'crypto'

const client = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skJ5kRM7I1M1vvpxPqnGUcwXMLfnMSzYhM9ee92f0dovI77y7EuvbzGjbQofg4ck1BXghdR47ExHM7wdjxhaUQpz6HGXRaYEUgeA6yRtRc579f55rUBADf0s7KPpyhO1zt1oAT9gFqiTo6GJRqRsYzDB81ZCiGJPNFWZ4rgY0qp7uCeUihs9',
  useCdn: false,
})

const key = () => crypto.randomBytes(12).toString('hex').slice(0, 12)

function block(text, style = 'normal', marks = []) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks }],
  }
}

function listBlock(text, level = 1) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'number',
    level,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }
}

async function main() {
  // === H05V-K Description ===
  const h05Description = [
    block('H05V-K – สายทองแดงฝอย อ่อนตัวได้ดี', 'h2'),
    block('Wiring ตู้คอนโทรล (MDB) / เดินเชื่อมต่อระหว่าง Battery / ใช้ได้ทั้งไฟ AC-DC', 'h3'),
    block('มีขนาด 0.5 /0.75 และ 1 mm2 ใช้สำหรับเชื่อมต่อระบบสัญญาณทางไฟฟ้าในตู้คอนโทรลโดยเฉพาะ ตัวฉนวนเป็นเกรดอย่างดีทำให้ H05V-K สามารถรับแรงดันไฟฟ้าได้สูงถึง 500 V และมีฉนวนที่บางกว่า VSF / THWF / IEC02 / IEC06 ทำให้สามารถเข้าหัวอุปกรณ์ต่างๆ ได้ง่ายขึ้น เร็วขึ้น ประหยัดค่าแรง'),
    // spec table for H05V-K (from H07V-K variants that are H05V-K models)
    {
      _type: 'specTable',
      _key: key(),
      caption: 'ตารางขนาดสาย H05V-K',
      headers: ['รุ่น', 'พื้นที่หน้าตัด (mm²)', 'เส้นผ่านศูนย์กลาง (mm)', 'น้ำหนัก (kg/km)'],
      rows: [
        ['H05V-K 1X0.5mm²', '0.5', '2.1', '7'],
        ['H05V-K 1X0.75mm²', '0.75', '2.4', '11'],
        ['H05V-K 1X1mm²', '1.0', '2.7', '14'],
      ],
    },
    // spec table for H07V-K  
    {
      _type: 'specTable',
      _key: key(),
      caption: 'ตารางขนาดสาย H07V-K',
      headers: ['รุ่น', 'พื้นที่หน้าตัด (mm²)', 'เส้นผ่านศูนย์กลาง (mm)', 'น้ำหนัก (kg/km)'],
      rows: [
        ['H07V-K 1X1.5mm²', '1.5', '3.0', '20'],
        ['H07V-K 1X2.5mm²', '2.5', '3.6', '32'],
        ['H07V-K 1X4mm²', '4', '4.2', '49'],
        ['H07V-K 1X6mm²', '6', '4.8', '70'],
        ['H07V-K 1X10mm²', '10', '5.9', '115'],
        ['H07V-K 1X16mm²', '16', '7.0', '175'],
        ['H07V-K 1X25mm²', '25', '8.4', '270'],
        ['H07V-K 1X35mm²', '35', '9.6', '370'],
        ['H07V-K 1X50mm²', '50', '11.1', '510'],
        ['H07V-K 1X70mm²', '70', '13.0', '710'],
        ['H07V-K 1X95mm²', '95', '14.9', '960'],
        ['H07V-K 1X120mm²', '120', '16.8', '1210'],
        ['H07V-K 1X150mm²', '150', '18.6', '1500'],
        ['H07V-K 1X185mm²', '185', '20.6', '1860'],
        ['H07V-K 1X240mm²', '240', '23.2', '2410'],
      ],
    },
    block('สินค้ามีในสต๊อกพร้อมส่ง', 'normal', ['strong']),
  ]

  // Patch H05V-K
  console.log('Patching H05V-K (prod-19270)...')
  await client
    .patch('prod-19270')
    .set({ description: h05Description })
    .commit()
  console.log('✅ H05V-K description updated!')

  // === H07V-K Description ===
  const h07Description = [
    block('H07V-K – สายทองแดงฝอย อ่อนตัวได้ดี', 'h2'),
    block('Wiring ตู้คอนโทรล (MDB) / เดินเชื่อมต่อระหว่าง Battery / ใช้ได้ทั้งไฟ AC-DC', 'h3'),
    block('มีขนาด 1.5 mm2 จนถึง 240 mm2 ใช้สำหรับเชื่อมต่อระบบสัญญาณทางไฟฟ้าในตู้คอนโทรลโดยเฉพาะ ตัวฉนวนเป็นเกรดอย่างดีทำให้ H07V-K สามารถรับแรงดันไฟฟ้าได้สูงถึง 750 V และมีฉนวนที่บางกว่า VSF / THWF / IEC02 / IEC06 ทำให้สามารถเข้าหัวอุปกรณ์ต่างๆ ได้ง่ายขึ้น เร็วขึ้น ประหยัดค่าแรง'),
    {
      _type: 'specTable',
      _key: key(),
      caption: 'ตารางขนาดสาย H07V-K',
      headers: ['รุ่น', 'พื้นที่หน้าตัด (mm²)', 'เส้นผ่านศูนย์กลาง (mm)', 'น้ำหนัก (kg/km)'],
      rows: [
        ['H07V-K 1X1.5mm²', '1.5', '3.0', '20'],
        ['H07V-K 1X2.5mm²', '2.5', '3.6', '32'],
        ['H07V-K 1X4mm²', '4', '4.2', '49'],
        ['H07V-K 1X6mm²', '6', '4.8', '70'],
        ['H07V-K 1X10mm²', '10', '5.9', '115'],
        ['H07V-K 1X16mm²', '16', '7.0', '175'],
        ['H07V-K 1X25mm²', '25', '8.4', '270'],
        ['H07V-K 1X35mm²', '35', '9.6', '370'],
        ['H07V-K 1X50mm²', '50', '11.1', '510'],
        ['H07V-K 1X70mm²', '70', '13.0', '710'],
        ['H07V-K 1X95mm²', '95', '14.9', '960'],
        ['H07V-K 1X120mm²', '120', '16.8', '1210'],
        ['H07V-K 1X150mm²', '150', '18.6', '1500'],
        ['H07V-K 1X185mm²', '185', '20.6', '1860'],
        ['H07V-K 1X240mm²', '240', '23.2', '2410'],
      ],
    },
    block('สินค้ามีในสต๊อกพร้อมส่ง', 'normal', ['strong']),
  ]

  console.log('Patching H07V-K (prod-19271)...')
  await client
    .patch('prod-19271')
    .set({ description: h07Description })
    .commit()
  console.log('✅ H07V-K description updated!')

  console.log('\n🎉 Done! Both H05V-K and H07V-K updated with clean CMS content + spec tables.')
}

main().catch(console.error)
