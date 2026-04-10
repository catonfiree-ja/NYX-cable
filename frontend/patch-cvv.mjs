import { createClient } from '@sanity/client'
import crypto from 'crypto'

// Configure Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '30wikoy9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Helper to create simple text blocks
const createBlock = (text, style = 'normal', listItem = undefined) => {
  const block = {
    _key: crypto.randomUUID(),
    _type: 'block',
    style: style,
    markDefs: [],
    children: [
      {
        _key: crypto.randomUUID(),
        _type: 'span',
        marks: [],
        text: text,
      },
    ],
  }
  if (listItem) {
    block.listItem = listItem
    block.level = 1
  }
  return block
}

const createLinkedBlock = (parts, style = 'normal', listItem = undefined) => {
  const markDefs = []
  const children = parts.map(p => {
    const marks = []
    if (p.bold) marks.push('strong')
    if (p.link) {
      const k = crypto.randomUUID().slice(0, 8)
      markDefs.push({ _key: k, _type: 'link', href: p.link })
      marks.push(k)
    }
    return { _key: crypto.randomUUID(), _type: 'span', marks, text: p.text }
  })
  const block = { _key: crypto.randomUUID(), _type: 'block', style, markDefs, children }
  if (listItem) { block.listItem = listItem; block.level = 1 }
  return block
}

// 1. Recreate the EXACT LONG DESCRIPTION
const description = [
  createBlock('สายไฟ CVV, CVV-F และ CVV-S เป็นชุดสายไฟฟ้าควบคุมและจ่ายไฟที่ได้รับความนิยมในงานอุตสาหกรรม ด้วยคุณสมบัติเด่นด้านความอ่อนตัวและโครงสร้างตัวนำหลายแกน ทำให้เหมาะสำหรับระบบควบคุมเครื่องจักร ระบบอัตโนมัติ และงานติดตั้งในรางไฟฟ้าในโรงงานทุกประเภท'),
  createBlock('NYX CABLE เป็นผู้เชี่ยวชาญและนำเข้าสายไฟ CVV คุณภาพยุโรปในประเทศไทย ด้วยประสบการณ์มากกว่า 20 ปี ทางบริษัทมีสินค้าพร้อมส่งหลายรุ่น ทั้งสาย CVV สาย CVV-F สำหรับงานคอนโทรลเครื่องจักรทั่วไปที่ต้องการความอ่อนตัว รวมถึงสาย CVV-S สำหรับงานที่ต้องการป้องกันสัญญาณรบกวนจากสภาพแวดล้อมภายในโรงงาน เช่น สาย Power และ Motor VDF'),
  createBlock('สาย CVV คือสายไฟฟ้าควบคุมที่นิยมใช้กันอย่างแพร่หลายในอุตสาหกรรม โดยใช้ตัวนำทำจากทองแดงเปลือยแบบเส้นฝอยละเอียด จึงมีความอ่อนตัว หุ้มด้วยฉนวน PVC และออกแบบให้มีตัวนำหลายแกน เหมาะสำหรับการใช้งานในระบบเครื่องจักร ระบบคอนโทรลโดยเฉพาะ มีให้เลือกหลายจำนวนคอร์ (2-48 คอร์) และหลายขนาดหน้าตัด (0.5-6 mm²) เพื่อรองรับการใช้งานทั้งระบบไฟฟ้าขนาดเล็กและขนาดใหญ่'),
  createBlock('รองรับแรงดันไฟฟ้าสูงสุด 600V', 'normal', 'bullet'),
  createBlock('จำนวนคอร์ ตั้งแต่ 2 คอร์ จนถึง 48 คอร์ (เพื่อรองรับการใช้งานที่ซับซ้อน)', 'normal', 'bullet'),
  createBlock('ขนาดหน้าตัดตั้งแต่ 0.5-6 mm²', 'normal', 'bullet'),
  createBlock('ทนต่อความร้อนอุณหภูมิใช้งานสูงสุด 70 องศาเซลเซียส', 'normal', 'bullet'),
  createBlock('การกันสัญญาณรบกวน  : สายรุ่นพิเศษ เช่น CVV-S ที่มีชีลด์ทำจาก Copper Tape สำหรับกันสัญญาณรบกวน', 'normal', 'bullet'),
  
  createBlock('สาย CVV เหมาะสำหรับการใช้งานประเภทใด ?', 'h2'),
  createBlock('สาย CVV ออกแบบมาเพื่อใช้งานในอุตสาหกรรมและระบบควบคุมเครื่องจักร โดยเหมาะสำหรับ'),
  createBlock('งานคอนโทรลและจ่ายไฟเครื่องจักรอัตโนมัติ : ใช้เชื่อมต่อสัญญาณและจ่ายไฟเลี้ยงระหว่างตู้คอนโทรล (Control Panel) กับเครื่องจักร', 'normal', 'bullet'),
  createBlock('งานติดตั้งในตู้ควบคุม : เหมาะสำหรับการเดินสายภายในตู้ไฟฟ้าและตู้คอนโทรล เนื่องจากมีหลายคอร์และประหยัดพื้นที่', 'normal', 'bullet'),
  createBlock('งานติดตั้งรางสายไฟฟ้า (Cable Tray) : เหมาะสำหรับการติดตั้งแบบอยู่กับที่ (Fixed Installation) ในรางเคเบิล', 'normal', 'bullet'),
  createBlock('งานอุตสาหกรรมทั่วไป : โรงงานผลิตอาหาร เครื่องจักรโลหะ โรงงานพลาสติก ระบบสายพานลำเลียง (Conveyor Systems)', 'normal', 'bullet'),
  createBlock('งานที่ต้องการป้องกันสัญญาณรบกวน : สาย CVV-S และสายคุณภาพสูงของ NYX CABLE ซึ่งออกแบบให้มีชีลด์ (Shield) ช่วยลดการรบกวนของสัญญาณไฟฟ้าที่เกิดจากสภาพแวดล้อมภายในโรงงานได้อย่างมีประสิทธิภาพ', 'normal', 'bullet'),
  createBlock('ด้วยความหลากหลายของขนาดคอร์และหน้าตัด สาย CVV จึงใช้งานได้ทั้งระบบไฟฟ้าขนาดเล็กและขนาดใหญ่ ทำให้เหมาะกับทุกอุตสาหกรรมที่ต้องการความปลอดภัยและความทนทานสูง'),

  createBlock('ประเภทของสาย CVV', 'h2'),
  createBlock('สาย CVV เป็นสายไฟฟ้าควบคุมและจ่ายไฟสำหรับงานอุตสาหกรรมที่นิยมใช้กันอย่างแพร่หลาย โดยสาย CVV สามารถแบ่งได้เป็น 2 รุ่นดังนี้'),
  
  createBlock('สาย CVV หรือ CVV-F', 'h3'),
  createBlock('ลักษณะ : สาย CVV มีตัวนำเป็นทองแดงเส้นฝอยละเอียด (Class 5) ทำให้สามารถดัดงอและจัดสายได้สะดวก รองรับแรงดันไฟฟ้า 600V', 'normal', 'bullet'),
  createBlock('ข้อดี : ยืดหยุ่นสูง ติดตั้งง่าย ลดเวลาการจัดสาย เหมาะกับงานที่ต้องมีการโค้งงอในการติดตั้ง', 'normal', 'bullet'),
  createBlock('ข้อจำกัด : ไม่เหมาะสำหรับการใช้งานในรางกระดูกงู (Drag Chain) ที่มีการเคลื่อนที่ซ้ำ ๆ ตลอดเวลา และหน้างานที่มีสัญญาณรบกวน', 'normal', 'bullet'),
  createBlock('การใช้งาน : งานติดตั้งในตู้คอนโทรลที่ต้องการความยืดหยุ่น งานเชื่อมต่ออุปกรณ์ที่มีการเคลื่อนที่เล็กน้อยระบบควบคุมเครื่องจักรทั่วไป รวมถึงการเดินสายแบบติดตั้งคงที่บนรางไฟฟ้า (Cable Tray)', 'normal', 'bullet'),

  createBlock('สาย CVV-S (Shielded CVV)', 'h3'),
  createBlock('ลักษณะ : สาย CVV ที่เพิ่มชีลด์ (Shielded) สำหรับป้องกันสัญญาณรบกวนไฟฟ้า (EMI) หุ้มตัวนำ', 'normal', 'bullet'),
  createBlock('ข้อดี : ป้องกันสัญญาณรบกวนได้ดีเยี่ยม ทำให้การส่งสัญญาณควบคุมมีความเสถียร เหมาะกับงานระบบควบคุมละเอียดและระบบเซนเซอร์', 'normal', 'bullet'),
  createBlock('ข้อจำกัด : ราคาสูงกว่าสาย CVV แบบปกติมาก และมีความอ่อนตัวต่ำลงมากเนื่องจากชีลด์ทำจาก Copper Tape', 'normal', 'bullet'),
  createBlock('การใช้งาน : งานเครื่องจักรอัตโนมัติที่มีความแม่นยำสูง ระบบเซนเซอร์วัดค่า งานอุตสาหกรรมที่มีสัญญาณรบกวนสูง', 'normal', 'bullet'),

  createBlock('การเลือกซื้อสาย CVV ที่เหมาะสมเป็นสิ่งสำคัญสำหรับความปลอดภัยและประสิทธิภาพของระบบไฟฟ้าในโรงงานอุตสาหกรรม โดยไม่ควรเน้นที่ราคาถูก แต่ต้องพิจารณาหลายปัจจัยดังนี้'),
  createBlock('1. กำหนดประเภทของสายให้ตรงกับการใช้งาน', 'h3'),
  createBlock('สาย CVV สาย CVV-F สำหรับงานติดตั้งอยู่กับที่และงานคอนโทรลทั่วไป และงานที่ต้องการความยืดหยุ่น เช่น การเดินสายในตู้คอนโทรล หรือเครื่องจักรที่มีการโค้งงอในการติดตั้ง', 'normal', 'bullet'),
  createBlock('สาย CVV-S สำหรับงานที่มีสัญญาณรบกวนสูงหรือระบบเซนเซอร์ละเอียด', 'normal', 'bullet'),
  
  createBlock('2. ตรวจสอบจำนวนคอร์และขนาดหน้าตัด', 'h3'),
  createBlock('เลือกจำนวนคอร์ให้ตรงกับการเชื่อมต่ออุปกรณ์และระบบควบคุม', 'normal', 'bullet'),
  createBlock('ขนาดหน้าตัด (mm²) ต้องเหมาะสมกับกระแสไฟฟ้าและระยะทางที่ใช้งาน', 'normal', 'bullet'),
  createBlock('ทั้งนี้ การเลือกคอร์และหน้าตัดที่ไม่เหมาะสม อาจทำให้สายร้อน เกิดปัญหาวงจรลัดวงจร หรือ Voltage Drop สัญญาณหายได้'),

  createBlock('3. พิจารณาฉนวนและเปลือกสายไฟ', 'h3'),
  createBlock('ตรวจสอบวัสดุฉนวนและเปลือกให้เหมาะกับงาน เช่น PVC ทนความร้อนและสารเคมีได้ดี', 'normal', 'bullet'),
  createBlock('สายที่มีชีลด์ (CVV-S) จะช่วยป้องกันสัญญาณรบกวนทางไฟฟ้าได้ดี', 'normal', 'bullet'),

  createBlock('4. ตรวจสอบแรงดันใช้งาน', 'h3'),
  createBlock('เลือกสายที่รองรับแรงดันไฟฟ้าที่เหมาะสมกับระบบไฟฟ้า', 'normal', 'bullet'),
  createBlock('สาย CVV มาตรฐาน รองรับแรงดัน 600V', 'normal', 'bullet'),

  createBlock('5. เลือกผู้ผลิตหรือแบรนด์ที่เชื่อถือได้', 'h3'),
  createBlock('เลือกผู้ผลิตที่มีประสบการณ์ด้านสายไฟอุตสาหกรรม เช่น NYX CABLE', 'normal', 'bullet'),
  createBlock('แบรนด์ที่มีบริการส่งด่วนและให้คำแนะนำสเปกที่เหมาะสม จะช่วยให้ติดตั้งสาย CVV ได้ตรงตามหน้างาน', 'normal', 'bullet'),

  createLinkedBlock([
    { text: 'สายไฟ CVV, CVV-F และ CVV-S จาก ' },
    { text: 'NYX CABLE', link: '/products', bold: true },
    { text: ' เป็นสายไฟคุณภาพสูงสำหรับงานอุตสาหกรรม ออกแบบให้ใช้สำหรับระบบคอนโทรลในโรงงานอุตสาหกรรมโดยเฉพาะ และใช้งานได้ยาวนาน ครอบคลุมทุกงานตั้งแต่ระบบเครื่องจักร รางไฟฟ้า จนถึงงานควบคุมอัตโนมัติ พร้อมมาตรฐานยุโรป VDE และ IEC มีสต๊อกพร้อมส่ง และบริการให้คำปรึกษาด้านสเปกสายไฟ ทำให้เลือกใช้งานได้ตรงตามหน้างาน ปลอดภัย และมีประสิทธิภาพสูง สนใจสั่งซื้อสอบถามข้อมูลเพิ่มเติมได้ที่โทร ' },
    { text: '02-111-5588', link: 'tel:021115588', bold: true },
    { text: ' หรือ LINE : ' },
    { text: '@nyxcable', link: 'https://page.line.me/nyxcable', bold: true },
  ])
]

// 2. Recreate the EXACT FAQ items
const faqItems = [
  {
    _key: crypto.randomUUID(),
    question: 'สาย CVV คืออะไร แตกต่างจากสายไฟทั่วไปอย่างไร ?',
    answer: [
      createBlock('สาย CVV เป็นสายไฟฟ้าควบคุม (Control Cable) ที่มีฉนวน PVC และเปลือกนอกหุ้มป้องกัน เหมาะสำหรับงานควบคุมเครื่องจักรและระบบอุตสาหกรรม แตกต่างจากสายไฟทั่วไปตรงที่มีหลายคอร์มากถึง 48 คอร์ ตัวนำทำจากทองแดงเส้นฝอยละเอียดทำให้มีความอ่อนตัว และสามารถทนแรงดันไฟฟ้าและสัญญาณรบกวนได้ดีกว่า')
    ]
  },
  {
    _key: crypto.randomUUID(),
    question: 'สาย CVV-S แตกต่างจากสาย CVV และสาย CVV-F แบบมาตรฐานอย่างไร ?',
    answer: [
      createBlock('CVV, CVV-F เป็นสายแบบยืดหยุ่น (Flexible) เหมาะกับงานที่ต้องการความอ่อนตัว เช่น ในตู้คอนโทรล', 'normal', 'bullet'),
      createBlock('CVV-S เป็นสายแบบมีชิลด์ (Shielded) ป้องกันสัญญาณรบกวนทางไฟฟ้า เหมาะกับระบบที่ต้องการความมีเสถียรภาพของสัญญาณ', 'normal', 'bullet')
    ]
  },
  {
    _key: crypto.randomUUID(),
    question: 'สาย CVV ใช้กับแรงดันไฟฟ้ากี่โวลต์ได้บ้าง ?',
    answer: [
      createBlock('สาย CVV รองรับแรงดันไฟฟ้าสูงสุด 600V เหมาะสำหรับระบบควบคุมในอุตสาหกรรมทั่วไป และสามารถเลือกขนาดหน้าตัดได้ตามโหลดไฟที่ต้องการ')
    ]
  },
  {
    _key: crypto.randomUUID(),
    question: 'จะเลือกขนาดสาย CVV ให้เหมาะกับการใช้งานได้อย่างไร ?',
    answer: [
      createBlock('ควรพิจารณาจากจำนวนคอร์ ขนาดหน้าตัด (mm²) และกระแสไฟฟ้าที่ใช้จริงและระยะเดินสาย โดยสามารถปรึกษาผู้เชี่ยวชาญจาก NYX CABLE เพื่อช่วยเลือกขนาดสายที่ปลอดภัยและคุ้มค่าที่สุด')
    ]
  },
  {
    _key: crypto.randomUUID(),
    question: 'สาย CVV จาก NYX CABLE มีมาตรฐานอะไรรับรองบ้าง ?',
    answer: [
      createBlock('สายไฟของ NYX CABLE ผ่านมาตรฐาน VDE และ IEC พร้อมรับรองคุณภาพด้านความปลอดภัย เหมาะสำหรับงานอุตสาหกรรมทุกประเภท')
    ]
  },
  {
    _key: crypto.randomUUID(),
    question: 'สาย CVV และ สาย CVV-F ต่างกันหรือไม่ ?',
    answer: [
      createBlock('โดยพื้นฐานแล้ว สาย CVV และสาย CVV-F เป็นสายชนิดเดียวกัน'),
      createBlock('บางยี่ห้อหรือบางแค็ตตาล็อก ระบุเพียง CVV เนื่องจากเป็นที่เข้าใจกันอยู่แล้วว่าเป็นสายอ่อน', 'normal', 'bullet'),
      createBlock('บางผู้ผลิตระบุเป็น CVV-F เพื่อเน้นย้ำว่าเป็นสายชนิด ไม่มีชีลด์ (Non-Shielded)', 'normal', 'bullet'),
      createBlock('การระบุ CVV-F ช่วยแยกประเภทให้ชัดเจนเมื่อเทียบกับ สาย CVV-S ซึ่งเป็นรุ่นที่มีชีลด์', 'normal', 'bullet'),
      createBlock('ข้อควรระวัง'),
      createBlock('CVV / CVV-F : ไม่มีชีลด์ เหมาะสำหรับงานควบคุมทั่วไป', 'normal', 'bullet'),
      createBlock('CVV-S : มีชีลด์หุ้ม เหมาะสำหรับงานที่ต้องการป้องกันสัญญาณรบกวนสูง', 'normal', 'bullet')
    ]
  }
]

async function patchProduct() {
  console.log('Fetching CVV product...')
  
  const products = await client.fetch(`*[_type == "product" && slug.current == "cvv" ]{_id, title}`)
  
  if (products.length === 0) {
    console.error('CRITICAL: Product "cvv" not found in dataset!')
    process.exit(1)
  }
  
  const product = products[0]
  console.log('Found product:', product.title, '-', product._id)
  
  console.log('Patching description and faqItems...')
  try {
    const res = await client
      .patch(product._id)
      .set({
        description: description,
        faqItems: faqItems,
        shortDescription: 'สาย CVV, CVV-F, CVV-S จาก NYX CABLE คุณภาพดี เหมาะสำหรับงานอุตสาหกรรมและเครื่องจักร มีสินค้าพร้อมสต๊อก ไม่ต้องรอผลิต พร้อมส่งด่วนภายใน 3 ชม.'
      })
      .commit()
    
    console.log('SUCCESS! Patched CVV product:', res._id)
  } catch (e) {
    console.error('Failed to patch document:', e.message)
    process.exit(1)
  }
}

patchProduct()
