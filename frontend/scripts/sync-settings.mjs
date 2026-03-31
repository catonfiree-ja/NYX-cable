import { createClient } from '@sanity/client'

const client = createClient({
    projectId: '30wikoy9',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_TOKEN,
})

// Data that should be in Sanity to match the website
const updates = {
    // Contact info (verify these match the website)
    companyName: 'NYX Cable',
    tagline: 'สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
    phone: '02-111-5588',
    email: 'sales@nyxcable.com',
    lineOA: '@nyxcable',
    lineUrl: 'https://page.line.me/ubb9405u',
    address: '2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72)\nอ.เมือง สมุทรปราการ 10270',

    // NEW fields that were missing
    businessHours: 'จันทร์ - ศุกร์ 8:30 - 17:30',
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.5!2d100.5993!3d13.6581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM5JzI5LjIiTiAxMDDCsDM1JzU3LjYiRQ!5e0!3m2!1sth!2sth!4v1234567890',
    googleMapsUrl: 'https://maps.app.goo.gl/ovpmCTPfoeTeNRwV8',

    // Social links
    socialLinks: {
        facebook: 'https://www.facebook.com/NyxCableThailand',
    },

    // Footer — fix year
    footerText: '© 2026 NYX Cable Co., Ltd. สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',

    // SEO
    seoTitle: 'NYX Cable | สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
    seoDescription: 'จำหน่ายสายไฟอุตสาหกรรม สายคอนโทรล สายชีลด์ สายทนความร้อน สายเครน คุณภาพมาตรฐาน VDE IEC มอก. พร้อมจัดส่งทั่วไทย',
}

if (!process.env.SANITY_TOKEN) {
    console.log('❌ ต้องตั้ง SANITY_TOKEN ก่อน')
    console.log('   set SANITY_TOKEN=your-token-here')
    console.log('')
    console.log('📋 ข้อมูลที่จะอัพเดท:')
    console.log(JSON.stringify(updates, null, 2))
    process.exit(1)
}

try {
    const result = await client
        .patch('siteSettings')
        .set(updates)
        .commit()
    console.log('✅ อัพเดท siteSettings สำเร็จ!')
    console.log('Updated fields:', Object.keys(updates).join(', '))
} catch (err) {
    console.error('❌ Error:', err.message)
}
