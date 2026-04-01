// FAQ Seed Script — สร้าง FAQ ทั่วไปเกี่ยวกับสินค้า NYX Cable
// วิธีใช้: cd sanity && npx sanity exec scripts/seed-faq.ts --with-user-token

import { getCliClient } from 'sanity/cli'

const client = getCliClient().withConfig({ apiVersion: '2024-01-01' })

interface FAQ {
    _type: 'faq'
    question: string
    answer: Array<{
        _type: 'block'
        _key: string
        style: 'normal'
        markDefs: never[]
        children: Array<{
            _type: 'span'
            _key: string
            text: string
            marks: never[]
        }>
    }>
    orderRank: number
}

function makeBlock(text: string, key: string) {
    return {
        _type: 'block' as const,
        _key: key,
        style: 'normal' as const,
        markDefs: [] as never[],
        children: [
            {
                _type: 'span' as const,
                _key: `${key}s`,
                text,
                marks: [] as never[],
            },
        ],
    }
}

const faqs: FAQ[] = [
    {
        _type: 'faq',
        question: 'สายคอนโทรลคืออะไร? ใช้งานอย่างไร?',
        answer: [
            makeBlock(
                'สายคอนโทรล (Control Cable) คือสายไฟที่ใช้ส่งสัญญาณควบคุมในระบบอุตสาหกรรม เช่น ระบบอัตโนมัติ (Automation), เครื่องจักร CNC, ระบบคอนเวเยอร์ และตู้คอนโทรล ต่างจากสายไฟฟ้าทั่วไปตรงที่สายคอนโทรลออกแบบมาให้ทนทานต่อสภาพแวดล้อมในโรงงาน เช่น ทนน้ำมัน ทนความร้อน และทนสารเคมี',
                'f1a'
            ),
        ],
        orderRank: 1,
    },
    {
        _type: 'faq',
        question: 'สายคอนโทรล NYX Cable ผ่านมาตรฐานอะไรบ้าง?',
        answer: [
            makeBlock(
                'สินค้า NYX Cable ผ่านมาตรฐานสากลหลายรายการ ได้แก่ มอก. (TISI) มาตรฐานอุตสาหกรรมไทย, CE มาตรฐานยุโรป, VDE มาตรฐานเยอรมนี, IEC มาตรฐานสากล และ EN มาตรฐานยุโรปเฉพาะทาง ทุกรุ่นมีใบรับรองคุณภาพพร้อมจัดส่ง',
                'f2a'
            ),
        ],
        orderRank: 2,
    },
    {
        _type: 'faq',
        question: 'สายชีลด์ (Shielded Cable) ต่างจากสายคอนโทรลธรรมดาอย่างไร?',
        answer: [
            makeBlock(
                'สายชีลด์ (Shielded Cable) มีชั้นป้องกันสัญญาณรบกวนแม่เหล็กไฟฟ้า (EMI/RFI) ห่อหุ้มแกนสาย เหมาะสำหรับงานที่ต้องการความแม่นยำของสัญญาณสูง เช่น ระบบเซ็นเซอร์ ระบบวัดค่า และระบบสื่อสารข้อมูลในโรงงาน ส่วนสายคอนโทรลธรรมดาไม่มีชั้นชีลด์ เหมาะสำหรับงานควบคุมทั่วไปที่ไม่มีสัญญาณรบกวนมาก',
                'f3a'
            ),
        ],
        orderRank: 3,
    },
    {
        _type: 'faq',
        question: 'สาย YSLY-JZ กับ JZ-500 ต่างกันอย่างไร?',
        answer: [
            makeBlock(
                'YSLY-JZ เป็นสายคอนโทรลมาตรฐานทั่วไป เหมาะสำหรับงานเดินสายถาวรในตู้คอนโทรลและเครื่องจักร ส่วน JZ-500 เป็นรุ่นงานหนัก (Heavy Duty) ที่มีเปลือกหนากว่า ทนแรงกระแทกและทนน้ำมันได้ดีกว่า เหมาะสำหรับสภาพแวดล้อมที่รุนแรงกว่า เช่น โรงงานเคมี โรงงานอาหาร',
                'f4a'
            ),
        ],
        orderRank: 4,
    },
    {
        _type: 'faq',
        question: 'NYX Cable ส่งสินค้าอย่างไร? จัดส่งทั่วประเทศหรือไม่?',
        answer: [
            makeBlock(
                'NYX Cable จัดส่งสินค้าทั่วประเทศ ผ่านบริการขนส่งเอกชนและรถบริษัท สำหรับลูกค้าในกรุงเทพฯ และปริมณฑล สามารถจัดส่งภายในวันเดียวกัน (สำหรับสินค้าที่มีในสต็อค) สินค้าตัดสายตามขนาดที่ต้องการ ใช้เวลาประมาณ 1-3 วันทำการ',
                'f5a'
            ),
        ],
        orderRank: 5,
    },
    {
        _type: 'faq',
        question: 'สาย H07RN-F (สายยาง) ใช้งานอะไรได้บ้าง?',
        answer: [
            makeBlock(
                'สาย H07RN-F หรือสายยาง เป็นสายไฟที่ทำจากยางสังเคราะห์ (Rubber) ทนน้ำ ทนน้ำมัน ทนสารเคมี และทนแสง UV ใช้งานได้ทั้งในร่มและกลางแจ้ง เหมาะสำหรับงานก่อสร้าง งานเหมืองแร่ งานเวที อุปกรณ์เคลื่อนที่ และงานที่ต้องการความยืดหยุ่นสูง',
                'f6a'
            ),
        ],
        orderRank: 6,
    },
    {
        _type: 'faq',
        question: 'สั่งซื้อขั้นต่ำกี่เมตร? ตัดสายตามขนาดได้หรือไม่?',
        answer: [
            makeBlock(
                'NYX Cable รับตัดสายตามขนาดที่ลูกค้าต้องการ ไม่มีขั้นต่ำ สามารถสั่งซื้อได้ตั้งแต่ 1 เมตรขึ้นไป สำหรับสั่งจำนวนมากจะได้ราคาพิเศษ กรุณาติดต่อฝ่ายขายเพื่อสอบถามราคา',
                'f7a'
            ),
        ],
        orderRank: 7,
    },
    {
        _type: 'faq',
        question: 'จะเลือกขนาดสายคอนโทรลให้เหมาะกับงานได้อย่างไร?',
        answer: [
            makeBlock(
                'การเลือกขนาดสายคอนโทรลขึ้นอยู่กับหลายปัจจัย ได้แก่ จำนวนแกนสาย (cores) ที่ต้องการ, พื้นที่หน้าตัดของแต่ละแกน (mm²) ซึ่งขึ้นอยู่กับกระแสไฟฟ้าที่ใช้, ระยะทาง และสภาพแวดล้อมการใช้งาน เช่น ต้องทนน้ำมันหรือไม่ ต้องมีชีลด์หรือไม่ สามารถปรึกษาทีม NYX Cable ได้ฟรีโดยไม่มีค่าใช้จ่าย',
                'f8a'
            ),
        ],
        orderRank: 8,
    },
]

async function seedFAQs() {
    console.log('🔧 กำลังสร้าง FAQ documents...\n')

    // ตรวจสอบ FAQ ที่มีอยู่แล้ว
    const existing = await client.fetch<number>(`count(*[_type == "faq"])`)
    if (existing > 0) {
        console.log(`⚠️ มี FAQ อยู่แล้ว ${existing} ข้อ — ข้าม`)
        return
    }

    for (const faq of faqs) {
        const doc = await client.create(faq)
        console.log(`✅ สร้าง FAQ: "${faq.question.substring(0, 50)}..." → ${doc._id}`)
    }

    console.log(`\n🎉 สร้าง FAQ สำเร็จ ${faqs.length} ข้อ`)
}

seedFAQs().catch(console.error)
