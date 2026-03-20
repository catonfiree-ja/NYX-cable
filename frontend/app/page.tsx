import { getProducts, getBlogPosts, getFAQs } from '@/lib/queries'

export default async function HomePage() {
  // Fetch real data from Sanity
  const products = await getProducts()
  const blogPosts = await getBlogPosts()
  const faqs = await getFAQs()
  const topProducts = products.slice(0, 8)
  const latestPosts = blogPosts.slice(0, 3)

  const categories = [
    { name: "สายคอนโทรล (Control Cable)", slug: "control-cable", abbr: "CC", desc: "YSLY-JZ, YSLY-JB สายคอนโทรลประสิทธิภาพสูง มาตรฐาน DIN VDE", count: 12 },
    { name: "สาย VFD / Servo Cable", slug: "vfd-servo-cable", abbr: "VFD", desc: "สายไฟสำหรับระบบ VFD และ Servo Motor ชีลด์ป้องกัน EMI", count: 8 },
    { name: "สายทนความร้อน", slug: "heat-resistant-cable", abbr: "HRC", desc: "SiHF, SiLi ทนความร้อนสูงถึง 180°C สำหรับงานที่ต้องทนอุณหภูมิ", count: 6 },
    { name: "สายชีลด์ (Shielded Cable)", slug: "shielded-cable", abbr: "SHD", desc: "สายไฟมีชีลด์ป้องกันคลื่นแม่เหล็กไฟฟ้า สำหรับระบบอัตโนมัติ", count: 7 },
    { name: "สายเครน (Crane Cable)", slug: "crane-cable", abbr: "CRN", desc: "สายไฟทนแรงดึง สำหรับเครนและระบบขนถ่ายสินค้า", count: 5 },
    { name: "สาย Bus / Data Cable", slug: "bus-data-cable", abbr: "BUS", desc: "Profibus, DeviceNet สายสื่อสารข้อมูลอุตสาหกรรม", count: 4 },
  ];

  // ─── ข้อมูลจากต้นฉบับ — ทำไมต้องเลือก NYX CABLE ───
  const whyNyx = [
    {
      num: "01",
      title: "มั่นใจคุณภาพ",
      desc: "ด้วยเทคโนโลยีการผลิตล่าสุดจากยุโรป",
      stat: "DIN VDE Standard"
    },
    {
      num: "02",
      title: "บริการรวดเร็วทันใจ",
      desc: "สินค้าพร้อมส่งด่วนจากโกดังบางนา เพียง 2 ชม.",
      stat: "ส่งด่วน 2 ชั่วโมง"
    },
    {
      num: "03",
      title: "ราคาดี",
      desc: "เราเป็นโรงงาน นำเข้าสายไฟฟ้าเองโดยตรง",
      stat: "โรงงานผู้นำเข้าตรง"
    },
    {
      num: "04",
      title: "ยืนยันจากผู้ใช้จริง",
      desc: "ลูกค้ากว่า 99% กลับมาซื้อซ้ำ",
      stat: "99% ซื้อซ้ำ"
    },
  ];

  // ─── รายชื่อสินค้าหลักพร้อมคำอธิบายไทย (จากต้นฉบับ) ───
  const mainProducts = [
    { name: "YSLY-JZ", thaiName: "สายคอนโทรล", slug: "ysly-jz" },
    { name: "LiYCY", thaiName: "สายคอนโทรลมีชีลด์", slug: "liycy" },
    { name: "ST-TP", thaiName: "สายชีลด์ สำหรับ RS485/RS422 โดยเฉพาะ", slug: "st-tp" },
    { name: "H07RN-F", thaiName: "สายไฟกันน้ำ สายไฟใต้น้ำ", slug: "h07rn-f" },
    { name: "NSHTÖU", thaiName: "สายไฟทนแรงดึงงาน Cable Reel", slug: "nshtou" },
    { name: "H07V-K", thaiName: "สายเดี่ยวสำหรับ Wiring ขนาด 0.5–240 mm²", slug: "h07v-k" },
    { name: "H07VVH6-F", thaiName: "สายไฟแบนสำหรับ Crane", slug: "h07vvh6-f" },
    { name: "SiHF", thaiName: "สายไฟทนความร้อน", slug: "sihf" },
    { name: "Multiflex", thaiName: "สายไฟรางกระดูกงู สายไฟหุ่นยนต์", slug: "multiflex" },
  ];

  // ─── FAQ ความรู้จากต้นฉบับ ───
  const knowledgeFAQs = [
    {
      q: "สายคอนโทรล คืออะไร?",
      a: "สายไฟที่มีตัวนำเป็นเส้นฝอยขนาดเล็กทำให้มีความอ่อนตัวสูง เหมาะสำหรับเชื่อมต่อเพื่อนำสัญญาณระหว่างอุปกรณ์วัดและคอมพิวเตอร์ ลักษณะของสายคอนโทรลสำหรับโรงงานอุตสาหกรรมนั้นมีหลายรูปแบบ ตามสภาพหน้างาน โดยสิ่งที่ทำให้แต่ละชนิดแตกต่างกัน คือ ตัวนำไฟฟ้า ฉนวน Shield และฉนวนภายนอก",
      link: "/products"
    },
    {
      q: "LiYCY อ่านว่าอะไร?",
      a: "LiYCY (อ่านว่า ลี-วาย-ซี-วาย) เป็นชื่อที่กำหนดตามมาตรฐาน DIN VDE โดยตัวอักษรแต่ละตัวมีความหมาย: Li = Litze (ตัวนำเส้นฝอย), Y = PVC (ฉนวน), C = Cu Screen (ชีลด์ทองแดง), Y = PVC (เปลือกนอก) — เป็นสายคอนโทรลมีชีลด์ป้องกันสัญญาณรบกวน",
      link: "/products/detail/liycy"
    },
    {
      q: "สายไฟชนิดใดเดินใต้น้ำได้?",
      a: "สาย H07RN-F ฉนวนภายในและฉนวนภายนอกทำจากยาง Neoprene ซึ่งมีคุณสมบัติยอดเยี่ยมทั้งในเรื่องของการทนน้ำ ทนแดด ทนสารเคมี H07RN-F ทนต่อแรงดันของน้ำได้ดีกว่าสายไฟคอนโทรลปกติที่ทำจาก PVC",
      link: "/products/detail/h07rn-f"
    },
    {
      q: "YSLY-JZ รับกระแสได้เท่าไหร่?",
      a: "สาย YSLY-JZ ผลิตตั้งแต่ขนาด 0.5 mm² ถึง 2.5 mm² โดยรับกระแสได้ตั้งแต่ 3A (0.5mm²) ถึง 18A (2.5mm²) ที่พื้นผิว 30°C เดิน 1 เส้น ซึ่งเพียงพอสำหรับงานคอนโทรลและสัญญาณในโรงงาน",
      link: "/products/detail/ysly-jz"
    },
  ];

  const clients = [
    'SCG', 'PTT', 'Toyota', 'Mitsubishi', 'Panasonic',
    'Delta', 'CP Group', 'Thai Union'
  ];

  const heroStyle = `
    /* ─── PREMIUM DESIGN SYSTEM ─── */
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(251,176,59,0.2); } 50% { box-shadow: 0 0 20px 4px rgba(251,176,59,0.15); } }

    /* ─── Hero ─── */
    .hero-v2 {
      position: relative;
      background: linear-gradient(160deg, #001a33 0%, #002d5c 35%, #003d7a 70%, #002244 100%);
      color: #fff;
      padding: 90px 0 70px;
      overflow: hidden;
    }
    .hero-v2::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse 600px 400px at 20% 50%, rgba(0,153,255,0.12), transparent),
        radial-gradient(ellipse 500px 500px at 80% 30%, rgba(251,176,59,0.08), transparent);
      z-index: 0;
    }
    .hero-v2::after {
      content: '';
      position: absolute;
      inset: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/></pattern></defs><rect fill="url(%23g)" width="100" height="100"/></svg>');
      z-index: 0;
    }
    .hero-v2 .container { position: relative; z-index: 1; }
    .hero-v2 h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.5px; animation: fadeInUp 0.8s ease; }
    .hero-v2 h1 .blue { color: #7ab8ff; }
    .hero-v2 h1 .yellow { color: #fbb03b; text-shadow: 0 0 30px rgba(251,176,59,0.3); }
    .hero-v2 .subtitle { font-size: 1.5rem; font-weight: 300; margin-bottom: 10px; color: #93c5fd; animation: fadeInUp 0.8s ease 0.1s both; }
    .hero-v2 .tagline { font-size: 1.05rem; color: rgba(255,255,255,0.6); line-height: 1.8; max-width: 560px; margin-bottom: 32px; animation: fadeInUp 0.8s ease 0.2s both; }
    .hero-v2-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 48px; align-items: center; }
    .hero-v2-right { display: flex; flex-direction: column; gap: 14px; }
    .hero-trust-badge {
      display: flex; align-items: center; gap: 14px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-left: 3px solid rgba(251,176,59,0.6);
      border-radius: 10px; padding: 16px 20px;
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease both;
    }
    .hero-trust-badge:nth-child(1) { animation-delay: 0.3s; }
    .hero-trust-badge:nth-child(2) { animation-delay: 0.45s; }
    .hero-trust-badge:nth-child(3) { animation-delay: 0.6s; }
    .hero-trust-badge:hover { background: rgba(255,255,255,0.08); border-left-color: #fbb03b; transform: translateX(4px); }
    .hero-trust-badge .trust-icon { font-size: 0.85rem; font-weight: 800; color: #fbb03b; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(251,176,59,0.3); border-radius: 8px; flex-shrink: 0; letter-spacing: -0.5px; }
    .hero-trust-badge .trust-text h4 { font-size: 0.9rem; font-weight: 600; margin: 0; letter-spacing: 0.3px; }
    .hero-trust-badge .trust-text p { font-size: 0.78rem; margin: 4px 0 0; opacity: 0.55; line-height: 1.4; }
    .hero-v2 .cta-row { display: flex; gap: 14px; flex-wrap: wrap; animation: fadeInUp 0.8s ease 0.3s both; }

    /* ─── Clients ─── */
    .clients-section { background: #fff; padding: 44px 0; border-bottom: none; position: relative; }
    .clients-section::after { content: ''; position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, #f0a500, #e2e8f0, transparent); }
    .clients-section h3 { text-align: center; font-size: 0.8rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 24px; }
    .clients-grid { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; align-items: center; }
    .client-logo { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 24px; font-size: 0.85rem; font-weight: 700; color: #334155; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); min-width: 110px; text-align: center; letter-spacing: 0.5px; }
    .client-logo:hover { border-color: #003366; color: #003366; box-shadow: 0 4px 12px rgba(0,51,102,0.08); transform: translateY(-2px); }

    /* ─── Product Cards ─── */
    .home-products { padding: 70px 0; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); }
    .home-products h2 { font-size: 1.9rem; font-weight: 800; color: #003366; text-align: center; margin-bottom: 8px; letter-spacing: -0.3px; }
    .home-products .section-sub { text-align: center; color: #64748b; margin-bottom: 36px; font-size: 0.95rem; }
    .home-product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .home-product-card {
      background: #fff; border: 1px solid rgba(0,51,102,0.06); border-radius: 14px;
      padding: 0; text-decoration: none; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      position: relative; overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,51,102,0.04);
    }
    .home-product-card:hover { transform: translateY(-6px); box-shadow: 0 12px 36px rgba(0,51,102,0.12); border-color: rgba(0,153,255,0.3); }
    .home-product-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #003366, #0099ff, #003366); opacity: 0; transition: opacity 0.3s; }
    .home-product-card:hover::before { opacity: 1; }
    .home-product-card .product-abbr {
      font-size: 0.95rem; font-weight: 800; color: #003366;
      text-align: center; display: flex; align-items: center; justify-content: center;
      padding: 28px 0; background: linear-gradient(135deg, #f0f7ff, #e8f0fe); letter-spacing: 1.5px;
      border-bottom: 1px solid rgba(0,51,102,0.06);
    }
    .home-product-card h4 { font-size: 0.88rem; font-weight: 600; color: #003366; margin-bottom: 6px; line-height: 1.4; padding: 16px 16px 0; }
    .home-product-card p { font-size: 0.78rem; color: #64748b; line-height: 1.5; margin-bottom: 12px; padding: 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .home-product-card .view-more { font-size: 0.78rem; color: #0099ff; font-weight: 600; padding: 0 16px 16px; display: block; }
    .view-all-btn { text-align: center; margin-top: 36px; }

    /* ─── Product List ─── */
    .main-product-list { padding: 60px 0; background: #fff; position: relative; }
    .main-product-list::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); }
    .main-product-list h2 { font-size: 1.9rem; font-weight: 800; color: #003366; text-align: center; margin-bottom: 12px; letter-spacing: -0.3px; }
    .main-product-list h2::after { content: ''; display: block; width: 50px; height: 3px; background: linear-gradient(90deg, #fbb03b, #f0a500); margin: 12px auto 28px; border-radius: 2px; }
    .product-list-items { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 920px; margin: 0 auto; }
    .product-list-item {
      display: flex; align-items: center; gap: 14px; padding: 14px 18px;
      background: #fff; border: 1px solid #e8edf3; border-radius: 10px;
      text-decoration: none; transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      position: relative; overflow: hidden;
    }
    .product-list-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, #003366, #0066cc); opacity: 0; transition: opacity 0.2s; }
    .product-list-item:hover { border-color: #0077cc; background: #f7faff; transform: translateX(4px); box-shadow: 0 2px 12px rgba(0,51,102,0.06); }
    .product-list-item:hover::before { opacity: 1; }
    .product-list-item .pli-model { font-weight: 800; color: #003366; font-size: 0.88rem; white-space: nowrap; letter-spacing: 0.3px; }
    .product-list-item .pli-sep { color: #cbd5e1; margin: 0 4px; }
    .product-list-item .pli-name { color: #64748b; font-size: 0.82rem; }

    /* ─── Stats Bar ─── */
    .stats-bar {
      background: linear-gradient(135deg, #001a33 0%, #003366 50%, #002d5c 100%);
      padding: 48px 0;
      position: relative;
    }
    .stats-bar::before {
      content: ''; position: absolute; inset: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><pattern id="s" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="1" fill="rgba(255,255,255,0.04)"/></pattern></defs><rect fill="url(%23s)" width="60" height="60"/></svg>');
    }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; color: #fff; position: relative; z-index: 1; }
    .stat-item { padding: 8px 0; }
    .stat-item .stat-num { font-size: 2.6rem; font-weight: 800; color: #fbb03b; letter-spacing: -1px; text-shadow: 0 0 20px rgba(251,176,59,0.2); }
    .stat-item .stat-label { font-size: 0.82rem; opacity: 0.65; margin-top: 6px; letter-spacing: 0.5px; text-transform: uppercase; }

    /* ─── Why NYX ─── */
    .why-nyx { padding: 70px 0; background: #fff; }
    .why-nyx h2 { font-size: 1.9rem; font-weight: 800; color: #003366; text-align: center; margin-bottom: 8px; letter-spacing: -0.3px; }
    .why-nyx .section-sub { text-align: center; color: #64748b; margin-bottom: 36px; }
    .why-nyx-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .why-nyx-card {
      background: #fff; border: 1px solid #e8edf3; border-radius: 14px;
      padding: 28px 20px; text-align: center;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      position: relative; overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,51,102,0.03);
    }
    .why-nyx-card::after { content: ''; position: absolute; bottom: 0; left: 20%; right: 20%; height: 2px; background: linear-gradient(90deg, transparent, #fbb03b, transparent); opacity: 0; transition: opacity 0.3s; }
    .why-nyx-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,51,102,0.08); border-color: rgba(251,176,59,0.4); }
    .why-nyx-card:hover::after { opacity: 1; }
    .why-nyx-card .wnc-num {
      font-size: 1.3rem; font-weight: 800; color: #fff; margin: 0 auto 14px;
      width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #003366, #0066cc); border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,51,102,0.2);
    }
    .why-nyx-card h3 { font-size: 1rem; color: #003366; font-weight: 700; margin-bottom: 8px; }
    .why-nyx-card p { font-size: 0.82rem; color: #64748b; line-height: 1.6; margin-bottom: 14px; }
    .why-nyx-card .wnc-stat {
      display: inline-block; font-size: 0.72rem; font-weight: 700;
      padding: 5px 14px; border-radius: 6px;
      background: linear-gradient(135deg, #003366, #004488); color: #fbb03b;
      letter-spacing: 0.3px;
    }

    /* ─── Articles ─── */
    .latest-articles { padding: 70px 0; background: linear-gradient(180deg, #f8fafc, #f1f5f9); }
    .latest-articles h2 { font-size: 1.9rem; font-weight: 800; color: #003366; text-align: center; margin-bottom: 8px; letter-spacing: -0.3px; }
    .latest-articles .section-sub { text-align: center; color: #64748b; margin-bottom: 36px; }
    .articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
    .article-card {
      background: #fff; border: 1px solid rgba(0,51,102,0.06); border-radius: 14px;
      padding: 0; text-decoration: none; overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 0 2px 8px rgba(0,51,102,0.04);
    }
    .article-card::before { content: ''; display: block; height: 4px; background: linear-gradient(90deg, #003366, #0099ff, #fbb03b); }
    .article-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,51,102,0.1); }
    .article-card .ac-badge { display: inline-block; background: linear-gradient(135deg, #e8f4ff, #dbeafe); color: #0055aa; font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: 6px; margin: 20px 20px 12px; letter-spacing: 0.3px; }
    .article-card h3 { font-size: 1rem; color: #003366; font-weight: 600; margin-bottom: 8px; line-height: 1.5; padding: 0 20px; }
    .article-card p { font-size: 0.82rem; color: #64748b; line-height: 1.6; margin-bottom: 12px; padding: 0 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .article-card .read-more { font-size: 0.78rem; color: #0099ff; font-weight: 600; padding: 0 20px 20px; display: block; }

    /* ─── FAQ ─── */
    .knowledge-section { padding: 70px 0; background: #fff; }
    .knowledge-section h2 { font-size: 1.9rem; font-weight: 800; color: #003366; text-align: center; margin-bottom: 8px; letter-spacing: -0.3px; }
    .knowledge-section .section-sub { text-align: center; color: #64748b; margin-bottom: 36px; }
    .faq-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
    .faq-item {
      background: #fff; border: 1px solid #e8edf3; border-left: 3px solid #003366;
      border-radius: 0 12px 12px 0; padding: 22px 28px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 6px rgba(0,51,102,0.03);
    }
    .faq-item:hover { border-left-color: #fbb03b; box-shadow: 0 4px 16px rgba(0,51,102,0.06); transform: translateX(4px); }
    .faq-item h3 { font-size: 1rem; color: #003366; font-weight: 700; margin-bottom: 8px; }
    .faq-item h3::before { content: 'Q. '; color: #0099ff; font-weight: 800; }
    .faq-item p { font-size: 0.86rem; color: #475569; line-height: 1.7; }
    .faq-item .faq-link { display: inline-block; margin-top: 10px; font-size: 0.8rem; color: #0099ff; font-weight: 600; text-decoration: none; transition: color 0.2s; }
    .faq-item .faq-link:hover { color: #003366; }

    /* ─── Delivery ─── */
    .delivery-section {
      padding: 60px 0;
      background: linear-gradient(160deg, #001a33, #003366, #002d5c);
      color: #fff; position: relative;
    }
    .delivery-section::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(251,176,59,0.06), transparent 60%);
    }
    .delivery-section h2 { font-size: 1.9rem; font-weight: 800; text-align: center; margin-bottom: 10px; position: relative; letter-spacing: -0.3px; }
    .delivery-section .section-sub { text-align: center; opacity: 0.6; margin-bottom: 36px; position: relative; }
    .delivery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; text-align: center; position: relative; }
    .delivery-card {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px; padding: 28px 20px;
      backdrop-filter: blur(8px);
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    .delivery-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(251,176,59,0.3); transform: translateY(-4px); }
    .delivery-card .dc-num {
      font-size: 1.2rem; font-weight: 800; color: #fbb03b; margin: 0 auto 14px;
      width: 50px; height: 50px;
      border: 2px solid rgba(251,176,59,0.25); border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(251,176,59,0.08);
    }
    .delivery-card h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 6px; letter-spacing: 0.2px; }
    .delivery-card p { font-size: 0.8rem; opacity: 0.6; line-height: 1.5; }

    @media (max-width: 768px) {
      /* Hero mobile */
      .hero-v2 { padding: 40px 0 24px; box-shadow: none; }
      .hero-v2::before, .hero-v2::after { border-radius: 0; }
      .hero-v2 h1 { font-size: 1.4rem; line-height: 1.3; }
      .hero-v2 .subtitle { font-size: 0.9rem; margin-bottom: 6px; }
      .hero-v2 .tagline { font-size: 0.82rem; margin-bottom: 16px; }
      .hero-v2-grid { grid-template-columns: 1fr; gap: 16px; }
      .hero-v2 .cta-row { flex-direction: column; }
      .hero-v2 .cta-row a { text-align: center; width: 100%; padding: 12px 16px; font-size: 0.9rem; }

      /* Trust badges — hide scrollbar */
      .hero-v2-right {
        flex-direction: row; overflow-x: auto; gap: 8px;
        padding-bottom: 4px; -webkit-overflow-scrolling: touch;
        scrollbar-width: none; -ms-overflow-style: none;
      }
      .hero-v2-right::-webkit-scrollbar { display: none; }
      .hero-trust-badge { flex-shrink: 0; padding: 8px 12px; min-width: 150px; }
      .hero-trust-badge .trust-icon { font-size: 1.2rem; }
      .hero-trust-badge .trust-text h4 { font-size: 0.75rem; }
      .hero-trust-badge .trust-text p { font-size: 0.65rem; }

      /* Client logos */
      .clients-section { padding: 20px 0; }
      .clients-section h3 { font-size: 0.75rem; margin-bottom: 12px; }
      .clients-grid { gap: 6px; }
      .client-logo { min-width: 70px; padding: 6px 10px; font-size: 0.7rem; }

      /* Stats */
      .stats-bar { padding: 20px 0; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .stat-item .stat-num { font-size: 1.3rem; }
      .stat-item .stat-label { font-size: 0.7rem; }

      /* Product grid — list view on mobile */
      .home-products { padding: 28px 0; }
      .home-products h2 { font-size: 1.2rem; margin-bottom: 4px; }
      .home-products .section-sub { font-size: 0.8rem; margin-bottom: 16px; }
      .home-product-grid { grid-template-columns: 1fr; gap: 8px; }
      .home-product-card {
        padding: 12px 16px !important;
        display: flex; align-items: center; gap: 12px;
        border-radius: 10px;
      }
      .home-product-card::before { display: none; }
      .home-product-card .product-abbr {
        font-size: 0.7rem; padding: 6px !important; margin-bottom: 0;
        background: #f0f7ff; border-radius: 8px; flex-shrink: 0;
        width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
        font-weight: 800; color: #003366; letter-spacing: 0.5px;
        border-bottom: none;
      }
      .home-product-card h4 { font-size: 0.82rem; margin: 0; padding: 0 !important; }
      .home-product-card p { display: none; }
      .home-product-card .view-more { display: none; }

      /* Main product list */
      .product-list-items { grid-template-columns: 1fr; }
      .main-product-list h2 { font-size: 1.3rem; }

      /* Why NYX */
      .why-nyx-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .why-nyx-card { padding: 16px; }
      .why-nyx-card .wnc-icon { font-size: 1.8rem; }
      .why-nyx-card h3 { font-size: 0.85rem; }
      .why-nyx-card p { font-size: 0.75rem; }
      .why-nyx h2 { font-size: 1.3rem; }

      /* Articles */
      .articles-grid { grid-template-columns: 1fr; gap: 12px; }
      .latest-articles h2 { font-size: 1.3rem; }

      /* Knowledge FAQ */
      .faq-item { padding: 14px 16px; }
      .faq-item h3 { font-size: 0.88rem; }
      .faq-item p { font-size: 0.8rem; }
      .knowledge-section h2 { font-size: 1.3rem; }

      /* Delivery */
      .delivery-grid { grid-template-columns: 1fr; gap: 12px; }
      .delivery-section h2 { font-size: 1.3rem; }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .hero-v2 h1 { font-size: 2.2rem; }
      .hero-v2-grid { gap: 24px; }
      .home-product-grid { grid-template-columns: repeat(2, 1fr); }
      .product-list-items { grid-template-columns: repeat(2, 1fr); }
      .why-nyx-grid { grid-template-columns: repeat(2, 1fr); }
      .articles-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* ─── CTA Section ─── */
    .cta-section {
      padding: 70px 0;
      background: linear-gradient(160deg, #001a33, #003366, #002d5c);
      color: #fff;
      text-align: center;
      position: relative;
    }
    .cta-section::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 50%, rgba(251,176,59,0.06), transparent 70%);
    }
    .cta-section h2 { font-size: 2rem; font-weight: 800; margin-bottom: 14px; position: relative; letter-spacing: -0.3px; }
    .cta-section p { font-size: 0.95rem; opacity: 0.6; max-width: 500px; margin: 0 auto 32px; line-height: 1.7; position: relative; }
    .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }
    .cta-actions .btn { min-width: 180px; justify-content: center; border-radius: 10px; font-weight: 700; letter-spacing: 0.3px; }
    .cta-actions .btn-accent { box-shadow: 0 4px 20px rgba(240,165,0,0.25); }
    .cta-actions .btn-accent:hover { box-shadow: 0 6px 28px rgba(240,165,0,0.35); }
    .cta-actions .btn-line { box-shadow: 0 4px 20px rgba(6,199,85,0.2); }
    .cta-actions .btn-secondary { border-color: rgba(255,255,255,0.2); }
    .cta-actions .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroStyle }} />

      {/* ─── Hero Section (Industrial Style) ─── */}
      <section className="hero-v2" id="hero">
        <div className="container">
          <div className="hero-v2-grid">
            <div>
              <h1>
                <span className="blue">NYX CABLE</span>
                <br />
                Experts in Control Cables
                <br />
                for <span className="yellow">Industrial Excellence</span>
              </h1>
              <div className="subtitle">สายไฟฟ้าสำหรับโรงงานอุตสาหกรรม</div>
              <p className="tagline">
                ใช้เทคโนโลยีการผลิตขั้นสูงจากยุโรปทุกขั้นตอน มั่นใจในคุณภาพ
                สายไฟคุณภาพมาตรฐาน DIN VDE สต็อกพร้อมส่งทุกขนาด บริการจัดส่งทั่วประเทศ
              </p>
              <div className="cta-row">
                <a href="/products" className="btn btn-accent btn-lg">ดูผลิตภัณฑ์ทั้งหมด →</a>
                <a href="https://page.line.me/ubb9405u" className="btn btn-secondary btn-lg" target="_blank" rel="noopener noreferrer">LINE สอบถาม</a>
              </div>
            </div>
            <div className="hero-v2-right">
              <div className="hero-trust-badge">
                <span className="trust-icon">01</span>
                <div className="trust-text">
                  <h4>ให้คำแนะนำ</h4>
                  <p>จากผู้เชี่ยวชาญด้านสายไฟฟ้าคอนโทรลโดยเฉพาะ</p>
                </div>
              </div>
              <div className="hero-trust-badge">
                <span className="trust-icon">02</span>
                <div className="trust-text">
                  <h4>แก้ไขปัญหา</h4>
                  <p>แก้ไขปัญหาตรงจุดกับปรึกษามืออาชีพ</p>
                </div>
              </div>
              <div className="hero-trust-badge">
                <span className="trust-icon">03</span>
                <div className="trust-text">
                  <h4>จัดส่งสินค้า</h4>
                  <p>ถึงที่หมายอย่างเป็นระบบและตรงต่อเวลา</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Clients (Trust Section) ─── */}
      <section className="clients-section">
        <div className="container">
          <h3>ลูกค้าที่ไว้วางใจเรา</h3>
          <div className="clients-grid">
            {clients.map(c => (
              <div key={c} className="client-logo">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-num">50+</div>
              <div className="stat-label">รุ่นสินค้า</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">150+</div>
              <div className="stat-label">ขนาดพร้อมส่ง</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">DIN VDE</div>
              <div className="stat-label">มาตรฐานยุโรป</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">10+</div>
              <div className="stat-label">ปีประสบการณ์</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Product List (from original — with Thai names) ─── */}
      <section className="main-product-list">
        <div className="container">
          <h2>สายคอนโทรล</h2>
          <div className="product-list-items">
            {mainProducts.map(p => (
              <a key={p.slug} href={`/products/detail/${p.slug}`} className="product-list-item">
                <span className="pli-model">{p.name}</span>
                <span className="pli-sep">:</span>
                <span className="pli-name">{p.thaiName}</span>
              </a>
            ))}
          </div>
          <div className="view-all-btn" style={{ marginTop: '24px' }}>
            <a href="/products" className="btn btn-primary">ดูสินค้าเพิ่มเติม →</a>
          </div>
        </div>
      </section>

      {/* ─── Why NYX Cable (ข้อมูลจากต้นฉบับ) ─── */}
      <section className="why-nyx" id="features">
        <div className="container">
          <h2>ทำไมต้องเลือก NYX CABLE</h2>
          <p className="section-sub">มั่นใจคุณภาพ + บริการรวดเร็วทันใจ + ราคาดี + ยืนยันจากผู้ใช้จริง</p>
          <div className="why-nyx-grid">
            {whyNyx.map((item, i) => (
              <div key={i} className="why-nyx-card">
                <div className="wnc-num">{item.num}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="wnc-stat">{item.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Delivery Section (from original) ─── */}
      <section className="delivery-section">
        <div className="container">
          <h2>การส่งสินค้า</h2>
          <p className="section-sub">จัดส่งถึงที่หมายอย่างรวดเร็ว ปลอดภัย ตรงต่อเวลา</p>
          <div className="delivery-grid">
            <div className="delivery-card">
              <div className="dc-num">01</div>
              <h4>ส่งตรงจากโกดังบางนา</h4>
              <p>สต็อกพร้อมส่งด่วนเพียง 2 ชม. ในกรุงเทพฯ</p>
            </div>
            <div className="delivery-card">
              <div className="dc-num">02</div>
              <h4>จัดส่งทั่วประเทศ</h4>
              <p>ขนส่งปลอดภัย พร้อมแพ็คกิ้งมาตรฐานโรงงาน</p>
            </div>
            <div className="delivery-card">
              <div className="dc-num">03</div>
              <h4>ติดตามสถานะได้</h4>
              <p>แจ้งเลขพัสดุและสถานะจัดส่งผ่าน LINE ทุกออเดอร์</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Products from Sanity ─── */}
      <section className="home-products">
        <div className="container">
          <h2>สินค้าแนะนำ</h2>
          <p className="section-sub">สายไฟคุณภาพสูง มาตรฐานยุโรป — สต็อกพร้อมส่ง {products.length} รุ่น</p>
          <div className="home-product-grid">
            {topProducts.map((p: any) => (
              <a key={p._id} href={`/products/detail/${p.slug?.current}`} className="home-product-card">
                <span className="product-abbr">{(p.productCode || p.title || '').substring(0, 3).toUpperCase()}</span>
                <h4>{p.title}</h4>
                <p>{p.shortDescription || p.categories?.[0]?.title || 'สายไฟอุตสาหกรรม'}</p>
                <span className="view-more">ดูรายละเอียด →</span>
              </a>
            ))}
          </div>
          <div className="view-all-btn">
            <a href="/products" className="btn btn-primary btn-lg">ดูสินค้าทั้งหมด ({products.length} รุ่น) →</a>
          </div>
        </div>
      </section>

      {/* ─── Product Categories ─── */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-header">
            <h2>หมวดหมู่ผลิตภัณฑ์</h2>
            <div className="accent-line"></div>
            <p>สายไฟอุตสาหกรรมคุณภาพสูง ครบทุกประเภทสำหรับทุกระบบงาน</p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <a key={cat.slug} href="/products" className="category-card">
                <div className="category-card-image">{cat.abbr}</div>
                <div className="category-card-body">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  <span className="product-count">{cat.count} รุ่น</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Latest Articles (from original) ─── */}
      <section className="latest-articles">
        <div className="container">
          <h2>ข่าวสารและบทความล่าสุด</h2>
          <p className="section-sub">ความรู้เกี่ยวกับสายไฟอุตสาหกรรม อัพเดทเทรนด์และเทคนิคต่างๆ</p>
          <div className="articles-grid">
            {latestPosts.map((post: any) => (
              <a key={post._id} href={`/blog/${post.slug?.current}`} className="article-card">
                <span className="ac-badge">
                  {post.categories?.[0]?.title || 'บทความ'}
                </span>
                <h3>{post.title}</h3>
                <p>{post.excerpt || 'อ่านเพิ่มเติม...'}</p>
                <span className="read-more">อ่านต่อ →</span>
              </a>
            ))}
          </div>
          <div className="view-all-btn" style={{ marginTop: '24px' }}>
            <a href="/blog" className="btn btn-primary">ดูบทความทั้งหมด ({blogPosts.length} บทความ) →</a>
          </div>
        </div>
      </section>

      {/* ─── Knowledge FAQ (from original) ─── */}
      <section className="knowledge-section">
        <div className="container">
          <h2>ความรู้เกี่ยวกับสายไฟ</h2>
          <p className="section-sub">คำตอบที่ลูกค้าถามบ่อย เกี่ยวกับสายไฟอุตสาหกรรม</p>
          <div className="faq-list">
            {knowledgeFAQs.map((faq, i) => (
              <div key={i} className="faq-item">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
                <a href={faq.link} className="faq-link">ดูสินค้าที่เกี่ยวข้อง →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="cta-section" id="contact-cta">
        <div className="container">
          <h2>สนใจสินค้า? ติดต่อเราวันนี้</h2>
          <p>
            ทีมวิศวกรพร้อมให้คำปรึกษาเลือกสายไฟที่เหมาะกับงานของคุณ
            สอบถามราคาและสต็อกได้ทุกวันทำการ
          </p>
          <div className="cta-actions">
            <a href="tel:021115588" className="btn btn-accent btn-lg">โทร 02-111-5588</a>
            <a href="https://page.line.me/ubb9405u" className="btn btn-line btn-lg" target="_blank" rel="noopener noreferrer">แอด LINE</a>
            <a href="/contact" className="btn btn-secondary btn-lg">ส่งอีเมล</a>
          </div>
        </div>
      </section>
    </>
  );
}
