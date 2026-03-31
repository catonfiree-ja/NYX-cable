/**
 * Sync all current website data → Sanity CMS
 * Populates: siteSettings, contactPage, reviews, and SEO for products/categories
 */
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: '30wikoy9',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN || 'sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP',
})

// ─── 1. Site Settings ───
async function syncSiteSettings() {
    console.log('\n📋 Syncing Site Settings...')
    const existing = await client.fetch('*[_type == "siteSettings"][0]')

    const data = {
        _type: 'siteSettings',
        companyName: 'NYX Cable',
        tagline: 'สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
        phone: '02-111-5588',
        lineOA: '@nyxcable',
        lineUrl: 'https://page.line.me/ubb9405u',
        email: 'sales@nyxcable.com',
        address: '2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72)\nอ.เมือง สมุทรปราการ 10270',
        googleMapsUrl: 'https://maps.app.goo.gl/ovpmCTPfoeTeNRwV8',
        footerText: '© 2025 NYX Cable Co., Ltd. สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
        socialLinks: {
            facebook: 'https://www.facebook.com/NyxCableThailand',
        },
        seoTitle: 'NYX Cable | สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
        seoDescription: 'จำหน่ายสายไฟอุตสาหกรรม สายคอนโทรล สายชีลด์ สายทนความร้อน สายเครน คุณภาพมาตรฐาน VDE IEC มอก. พร้อมจัดส่งทั่วไทย',
    }

    if (existing?._id) {
        await client.patch(existing._id).set(data).commit()
        console.log('  ✅ Updated existing siteSettings')
    } else {
        await client.create({ ...data, _id: 'siteSettings' })
        console.log('  ✅ Created siteSettings')
    }
}

// ─── 2. Contact Page ───
async function syncContactPage() {
    console.log('\n📞 Syncing Contact Page...')
    const existing = await client.fetch('*[_type == "contactPage"][0]')

    const data = {
        _type: 'contactPage',
        heroHeading: 'ติดต่อเรา',
        heroSubheading: 'ทีมวิศวกรพร้อมให้คำปรึกษา สอบถามราคาและสต็อกสินค้า',
        businessHours: 'จันทร์ - ศุกร์ 8:30 - 17:30',
        googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.5!2d100.5993!3d13.6581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM5JzI5LjIiTiAxMDDCsDM1JzU3LjYiRQ!5e0!3m2!1sth!2sth!4v1234567890',
        metaTitle: 'ติดต่อเรา | NYX Cable',
        metaDescription: 'ติดต่อทีมงาน NYX Cable สอบถามราคาสายไฟอุตสาหกรรม สั่งซื้อ ขอใบเสนอราคา — โทร 02-111-5588 หรือ LINE @nyxcable',
    }

    if (existing?._id) {
        await client.patch(existing._id).set(data).commit()
        console.log('  ✅ Updated existing contactPage')
    } else {
        await client.create({ ...data, _id: 'contactPage' })
        console.log('  ✅ Created contactPage')
    }
}

// ─── 3. Reviews ───
async function syncReviews() {
    console.log('\n⭐ Syncing Reviews...')
    const existing = await client.fetch('*[_type == "review"]{ _id, name }')
    const existingNames = new Set(existing.map(r => r.name))

    const reviews = [
        { name: 'Waterford Diamond', initial: 'W', stars: 5, text: 'ลองติดต่อสอบถามข้อมูลกับ NYX Cable แล้วประทับใจมากค่ะ ทางบริษัทให้ข้อมูลชัดเจนและแนะนำรายละเอียดสินค้าได้ดีมาก ติดต่อสอบถามง่าย ตอบคำถามรวดเร็ว แม้จะเป็นวันหยุดนักขัตฤกษ์ก็ยังมีพนักงานรับโทรศัพท์และให้ข้อมูลอยู่ ทำให้รู้สึกว่าดูแลลูกค้าดีจริง ๆ สินค้ากดีมีมาตรฐานและเชื่อถือได้ อีกทั้งยังมีบริการจัดส่งด่วน ได้ของเร็วทันใช้งาน อยู่ไกลก็ส่งประทับใจค่ะ', time: '2 สัปดาห์ที่แล้ว', orderRank: 12 },
        { name: 'ธัญนภัทร์ นะเทศ', initial: 'ธ', stars: 5, text: 'สั่ง สาย ST-TP เดินสัญญาณ RS485 ประจำ มีให้เลือกหลายขนาด ไม่ต้องรอของนานเลยค่ะ', time: '3 เดือนที่แล้ว', orderRank: 11 },
        { name: 'Typspossi Sskksjs', initial: 'T', stars: 5, text: 'ใช้ของด่วน ขับมารับเอง พนักงานช่วยเช็กให้ครบ มีห้องรับรอง บริการดีเลย', time: '3 เดือนที่แล้ว', orderRank: 10 },
        { name: 'Na Na', initial: 'N', stars: 5, text: 'ได้ดีจริง สมคำรีวิว แนะนำ ของตรงตามสเปคเลยค่ะ', time: '3 เดือนที่แล้ว', orderRank: 9 },
        { name: 'Somchettana chaiyalap', initial: 'S', stars: 5, text: 'งานด่วนจบได้สบายมาก คุณภาพ + สามารถแบ่งขายได้ด้วย...บริการสุดประทับใจ', time: 'เดือนที่แล้ว', orderRank: 8 },
        { name: 'Nuss Chonticha Champasee', initial: 'N', stars: 5, text: 'NYX CABLE ส่งไวเหมือนเดิมเลยย บริการดีมากกก ที่นี่ไม่ทำให้เสียใจเลยค่ะ 💜💜💜', time: '4 เดือนที่แล้ว', orderRank: 7 },
        { name: 'account AIT', initial: 'A', stars: 5, text: 'ฝ่ายขายคุณจิตตี้ ให้บริการได้ดี รวดเร็ว ตรงกับความต้องการ ถึงแม้บางครั้งจะเป็นงานด่วน ก็สามารถตอบสนองความต้องการลูกค้าได้ทันเวลาค่ะ', time: '8 เดือนที่แล้ว', orderRank: 6 },
        { name: 'Aun Zaa', initial: 'A', stars: 5, text: 'สายไฟดีแนะนำ ใช้งานไม่เคยมีปัญหา กลับมาซื้อที่ NYX ตลอด พนักงานให้ความช่วยเหลือดีมาก', time: '6 เดือนที่แล้ว', orderRank: 5 },
        { name: 'ปัทมา มหัคฆพงศ์', initial: 'ป', stars: 5, text: 'เจ้าหน้าที่ใส่ใจในรายละเอียดสินค้า พร้อมนำเสนอสินค้าที่ตรงกับการใช้งานของเราและการบริการรวดเร็วดีมาก สำหรับผู้รับเหมาที่มีงานหลายระบบแบบเรา การสื่อสารที่ถูกต้อง-ความรวดเร็วของพนักงานขายสำคัญมาก ซึ่งทำให้งานของเราสำเร็จทันกำหนดเวลาและตรงตามมาตรฐาน', time: '9 เดือนที่แล้ว', orderRank: 4 },
        { name: 'Suchada Nusawat', initial: 'S', stars: 5, text: 'พนักงานพูดจาดี ให้คำแนะนำชัดเจน จะมาใช้บริการอีกค่ะ', time: '3 เดือนที่แล้ว', orderRank: 3 },
        { name: 'Worawak Phunoo', initial: 'W', stars: 5, text: 'ราคาสมเหตุสมผลเมื่อเทียบกับมาตราฐานยุโรป ได้ของดีในราคาที่จับต้องได้ แนะนะเลยครับ', time: '6 เดือนที่แล้ว', orderRank: 2 },
        { name: 'Ratikorn Jansatitpaiboon', initial: 'R', stars: 5, text: 'เลือกใช้สายคอนโทรลจาก NYX Cable มาหลายรุ่น เช่น OPVC-JZ, LiYCY, YSLY-JZ คุณภาพดีตามมาตรฐานยุโรป สายอ่อนตัว ใช้งานง่าย มีความยืดหยุ่นดี รองรับงานอุตสาหกรรมได้สบาย บริการตอบไว จัดส่งรวดเร็ว ประทับใจทั้งคุณภาพและบริการค่ะ', time: '8 เดือนที่แล้ว', orderRank: 1 },
    ]

    let created = 0
    for (const r of reviews) {
        if (!existingNames.has(r.name)) {
            await client.create({ _type: 'review', ...r })
            created++
        }
    }
    console.log(`  ✅ ${created} new reviews created (${existing.length} already existed)`)
}

// ─── 4. SEO for Products ───
async function syncProductSEO() {
    console.log('\n📦 Syncing Product SEO...')
    const products = await client.fetch('*[_type == "product"]{ _id, title, "slug": slug.current, metaTitle, metaDescription, productCode }')

    let updated = 0
    for (const p of products) {
        if (!p.metaTitle || !p.metaDescription) {
            const metaTitle = `${p.title} | สายไฟอุตสาหกรรม NYX Cable`
            const metaDescription = `${p.title} ${p.productCode ? `(${p.productCode})` : ''} สายไฟคุณภาพมาตรฐานยุโรป VDE IEC — จำหน่ายพร้อมจัดส่ง สอบถามราคา โทร 02-111-5588`

            const patch = {}
            if (!p.metaTitle) patch.metaTitle = metaTitle.slice(0, 60)
            if (!p.metaDescription) patch.metaDescription = metaDescription.slice(0, 160)

            await client.patch(p._id).set(patch).commit()
            updated++
        }
    }
    console.log(`  ✅ ${updated} products updated with SEO (${products.length - updated} already had SEO)`)
}

// ─── 5. SEO for Categories ───
async function syncCategorySEO() {
    console.log('\n📂 Syncing Category SEO...')
    const categories = await client.fetch('*[_type == "productCategory"]{ _id, title, "slug": slug.current, metaTitle, metaDescription }')

    let updated = 0
    for (const c of categories) {
        if (!c.metaTitle || !c.metaDescription) {
            const metaTitle = `${c.title} | สายไฟอุตสาหกรรม NYX Cable`
            const metaDescription = `${c.title} — สายไฟคุณภาพมาตรฐานยุโรป จำหน่ายพร้อมจัดส่งทั่วไทย โทร 02-111-5588 LINE @nyxcable`

            const patch = {}
            if (!c.metaTitle) patch.metaTitle = metaTitle.slice(0, 60)
            if (!c.metaDescription) patch.metaDescription = metaDescription.slice(0, 160)

            await client.patch(c._id).set(patch).commit()
            updated++
        }
    }
    console.log(`  ✅ ${updated} categories updated with SEO (${categories.length - updated} already had SEO)`)
}

// ─── Run all ───
async function main() {
    console.log('🚀 Syncing all data to Sanity CMS...\n')

    await syncSiteSettings()
    await syncContactPage()
    await syncReviews()
    await syncProductSEO()
    await syncCategorySEO()

    console.log('\n✅ ALL DONE — Sanity CMS is fully populated!')
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1) })
