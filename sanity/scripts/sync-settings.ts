import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

async function run() {
    console.log('🔄 Full Data Sync Starting...\n')

    // ─── 1. Create privacyPage document (currently missing!) ───
    console.log('1️⃣ Creating privacyPage document...')
    try {
        const existing = await client.fetch('*[_type == "privacyPage" && _id == "privacyPage"][0]')
        if (!existing) {
            await client.createIfNotExists({
                _id: 'privacyPage',
                _type: 'privacyPage',
                heading: 'นโยบายความเป็นส่วนตัว',
                subheading: 'Privacy Policy — บริษัท นิกซ์ เคเบิ้ล จำกัด',
                lastUpdated: 'มีนาคม 2026',
                metaTitle: 'นโยบายความเป็นส่วนตัว | NYX Cable',
                metaDescription: 'นโยบายความเป็นส่วนตัวของ NYX Cable — การเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
            })
            console.log('   ✅ Created privacyPage document')
        } else {
            // Ensure SEO fields are set
            await client.patch('privacyPage').setIfMissing({
                metaTitle: 'นโยบายความเป็นส่วนตัว | NYX Cable',
                metaDescription: 'นโยบายความเป็นส่วนตัวของ NYX Cable — การเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
                lastUpdated: 'มีนาคม 2026',
            }).commit()
            console.log('   ✅ privacyPage already exists, verified SEO fields')
        }
    } catch (err) {
        console.error('   ❌ Error:', err.message)
    }

    // ─── 2. Verify/update siteSettings (main data) ───
    console.log('\n2️⃣ Verifying siteSettings...')
    try {
        await client.patch('siteSettings').setIfMissing({
            companyName: 'NYX Cable',
            tagline: 'สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
            phone: '02-111-5588',
            email: 'sales@nyxcable.com',
            lineOA: '@nyxcable',
            lineUrl: 'https://page.line.me/ubb9405u',
            address: '2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72)\nอ.เมือง สมุทรปราการ 10270',
            businessHours: 'จันทร์ - ศุกร์ 8:30 - 17:30',
            googleMapsUrl: 'https://maps.app.goo.gl/ovpmCTPfoeTeNRwV8',
            mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.5!2d100.5993!3d13.6581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM5JzI5LjIiTiAxMDDCsDM1JzU3LjYiRQ!5e0!3m2!1sth!2sth!4v1234567890',
            socialLinks: { facebook: 'https://www.facebook.com/NyxCableThailand' },
            seoTitle: 'NYX Cable | สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
            seoDescription: 'จำหน่ายสายไฟอุตสาหกรรม สายคอนโทรล สายชีลด์ สายทนความร้อน สายเครน คุณภาพมาตรฐาน VDE IEC มอก. พร้อมจัดส่งทั่วไทย',
        }).commit()
        // Force correct year
        await client.patch('siteSettings').set({
            footerText: '© 2026 NYX Cable Co., Ltd. สายไฟอุตสาหกรรมคุณภาพมาตรฐานยุโรป',
        }).commit()
        console.log('   ✅ siteSettings verified and updated')
    } catch (err) {
        console.error('   ❌ Error:', err.message)
    }

    // ─── 3. Verify contactPage has all required fields ───
    console.log('\n3️⃣ Verifying contactPage...')
    try {
        await client.patch('contactPage').setIfMissing({
            heroHeading: 'ติดต่อเรา',
            heroSubheading: 'ทีมวิศวกรพร้อมให้คำปรึกษา สอบถามราคาและสต็อกสินค้า',
            businessHours: 'จันทร์ - ศุกร์ 8:30 - 17:30',
            googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.5!2d100.5993!3d13.6581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM5JzI5LjIiTiAxMDDCsDM1JzU3LjYiRQ!5e0!3m2!1sth!2sth!4v1234567890',
            metaTitle: 'ติดต่อเรา | NYX Cable',
            metaDescription: 'ติดต่อทีมงาน NYX Cable สอบถามราคาสายไฟอุตสาหกรรม สั่งซื้อ ขอใบเสนอราคา — โทร 02-111-5588 หรือ LINE @nyxcable',
        }).commit()
        console.log('   ✅ contactPage verified')
    } catch (err) {
        console.error('   ❌ Error:', err.message)
    }

    // ─── 4. Verify homePage has all required fields ───
    console.log('\n4️⃣ Verifying homePage...')
    try {
        await client.patch('homePage').setIfMissing({
            metaTitle: 'NYX Cable — ผู้เชี่ยวชาญสายไฟอุตสาหกรรมคุณภาพยุโรป',
            metaDescription: 'NYX Cable ผู้นำด้านสายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป สายคอนโทรล สาย VFD สายทนความร้อน สายชีลด์ ส่งตรงจากโรงงาน',
        }).commit()
        console.log('   ✅ homePage verified')
    } catch (err) {
        console.error('   ❌ Error:', err.message)
    }

    // ─── 5. Verify aboutPage ───
    console.log('\n5️⃣ Verifying aboutPage...')
    try {
        await client.patch('aboutPage').setIfMissing({
            metaTitle: 'เกี่ยวกับ NYX Cable | ผู้นำสายไฟอุตสาหกรรมมาตรฐานยุโรป',
            metaDescription: 'NYX Cable ผู้นำด้านสายไฟอุตสาหกรรมมาตรฐาน DIN VDE จากยุโรป ประสบการณ์กว่า 10 ปี พร้อมส่งทั่วประเทศ',
        }).commit()
        console.log('   ✅ aboutPage verified')
    } catch (err) {
        console.error('   ❌ Error:', err.message)
    }

    // ─── 6. Check product categories SEO ───
    console.log('\n6️⃣ Checking productCategory SEO...')
    try {
        const cats = await client.fetch('*[_type == "productCategory"]{ _id, title, metaTitle, metaDescription }')
        let missing = 0
        for (const cat of cats) {
            if (!cat.metaTitle || !cat.metaDescription) {
                missing++
                console.log(`   ⚠️ ${cat.title}: metaTitle=${cat.metaTitle ? '✅' : '❌'} metaDescription=${cat.metaDescription ? '✅' : '❌'}`)
            }
        }
        if (missing === 0) console.log(`   ✅ All ${cats.length} categories have SEO`)
        else console.log(`   ⚠️ ${missing}/${cats.length} categories missing SEO`)
    } catch (err) {
        console.error('   ❌ Error:', err.message)
    }

    // ─── 7. Check product SEO ───
    console.log('\n7️⃣ Checking product SEO (sample)...')
    try {
        const products = await client.fetch('*[_type == "product"]{ _id, title, metaTitle, metaDescription }')
        let missing = 0
        for (const p of products) {
            if (!p.metaTitle || !p.metaDescription) missing++
        }
        console.log(`   📊 ${products.length} products total, ${missing} missing SEO fields`)
    } catch (err) {
        console.error('   ❌ Error:', err.message)
    }

    console.log('\n✅ Full sync complete!')
}

run()
