import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { OrganizationSchema } from "@/components/StructuredData";
import NavLinks from "@/components/NavLinks";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import LazyWidgets from "@/components/LazyWidgets";
import { getSiteSettings } from "@/lib/queries";

export const revalidate = 60;

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nyxcable.com'),
  title: {
    default: "NYX Cable — ผู้เชี่ยวชาญสายไฟอุตสาหกรรมคุณภาพยุโรป",
    template: "%s | NYX Cable",
  },
  description:
    "NYX Cable ผู้นำด้านสายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป สายคอนโทรล สาย VFD สายทนความร้อน สายชีลด์ ส่งตรงจากโรงงาน พร้อมบริการให้คำปรึกษาโดยวิศวกร",
  keywords: [
    "สายไฟอุตสาหกรรม",
    "สายคอนโทรล",
    "NYX Cable",
    "สายไฟคุณภาพยุโรป",
    "สาย VFD",
    "สายทนความร้อน",
    "สายชีลด์",
    "สายเครน",
    "DIN VDE",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.nyxcable.com",
    languages: { "th-TH": "https://www.nyxcable.com" },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "NYX Cable",
    title: "NYX Cable — สายไฟอุตสาหกรรมคุณภาพยุโรป มาตรฐาน DIN VDE",
    description: "ผู้นำด้านสายไฟอุตสาหกรรม สายคอนโทรล สาย VFD สายทนความร้อน สต็อกพร้อมส่ง ปรึกษาวิศวกรฟรี",
    images: [{ url: "/images/gallery/profile.webp", width: 1200, height: 630, alt: "NYX Cable สำนักงานใหญ่" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NYX Cable — สายไฟอุตสาหกรรมคุณภาพยุโรป",
    description: "ผู้นำด้านสายไฟอุตสาหกรรม สต็อกพร้อมส่ง ปรึกษาวิศวกรฟรี",
    images: ["/images/gallery/profile.webp"],
  },
};

function NyxLogo({ size = 50 }: { size?: number }) {
  return (
    <img
      src="/images/nyx-logo.svg"
      alt="NYX Cable Logo"
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings().catch(() => null);
  const phone = settings?.phone || '02-111-5588';
  const phoneRaw = phone.replace(/[^0-9]/g, '');
  const email = settings?.email || 'sales@nyxcable.com';
  const lineOA = settings?.lineOA || '@nyxcable';
  const lineUrl = settings?.lineUrl || 'https://page.line.me/ubb9405u';
  const lineDeepLink = `https://line.me/R/ti/p/${lineOA}`;
  const address = settings?.address || '2098 หมู่ 1 ต.สำโรงเหนือ\n(ซ.สุขุมวิท 72) อ.เมือง สมุทรปราการ 10270';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/eiNSyf1Rqcwnh58M7';
  const fbUrl = settings?.socialLinks?.facebook || 'https://www.facebook.com/NYXCable';
  return (
    <html lang="th" className={prompt.variable}>
      <head>
        <Script id="gtm-head" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N7JX4QS');`}</Script>
      </head>
      <body className={prompt.className}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N7JX4QS" height="0" width="0" style={{display:'none',visibility:'hidden'}} /></noscript>
        <a href="#main-content" className="skip-nav">ข้ามไปเนื้อหาหลัก</a>
        <OrganizationSchema phone={`+66-${phoneRaw}`} email={email} lineUrl={lineUrl} fbUrl={fbUrl} />
        <GoogleAnalytics />
        {/* Corner Ribbon — PRODUCTS */}
        <Link href="/products" className="corner-ribbon">PRODUCTS</Link>
        {/* Top Info Bar */}
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-contact">
              <span style={{ color: '#fff', fontWeight: 300 }}>Hot Line :</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 4 }}><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" /></svg>
              <a href={`tel:${phoneRaw}`} style={{ color: '#ffc107', fontWeight: 300 }}>{phone}</a>
              <span style={{ color: '#fff' }}>|</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
              <a href={`https://mail.google.com/mail/?view=cm&to=${email}`} target="_blank" rel="noopener noreferrer" style={{ color: '#ffc107', fontWeight: 300 }}>{email}</a>
            </div>
            <div className="top-bar-contact">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: 4 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
              <span style={{ color: '#fbb03b' }}>จ-ศ 8:30-17:30</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="header">
          <div className="container">
            <Link href="/" className="header-logo">
              <Image src="/images/NYXcable-Logo.png" alt="NYX Cable สายไฟอุตสาหกรรมคุณภาพยุโรป" width={160} height={40} style={{ display: 'block', height: '40px', width: 'auto' }} priority />
            </Link>
            <NavLinks />
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content">{children}</main>

        {/* Pre-Footer CTA — Original Style */}
        <section className="prefooter-cta">
          <div className="prefooter-cta-buttons">
            <a href={`tel:${phoneRaw}`} className="cta-big cta-call cta-pulse">
              <span className="cta-big-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" /></svg>
              </span>
              <span className="cta-big-text">
                <strong>Call หาเราทันที</strong>
                <span className="cta-blink-text">Click เลย !!!</span>
              </span>
            </a>
            <a href={lineDeepLink} target="_blank" rel="noopener noreferrer" className="cta-big cta-line-big cta-pulse">
              <span className="cta-big-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.51.43-.596.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
              </span>
              <span className="cta-big-text">
                <strong>LINE ปรึกษาฟรี</strong>
                <span className="cta-blink-text">Click เลย !!!</span>
              </span>
            </a>
            <a href={`https://mail.google.com/mail/?view=cm&to=${email}`} target="_blank" rel="noopener noreferrer" className="cta-big cta-email cta-pulse">
              <span className="cta-big-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
              </span>
              <span className="cta-big-text">
                <strong>Email สอบถาม</strong>
                <span className="cta-blink-text">Click เลย !!!</span>
              </span>
            </a>
          </div>

        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              {/* Brand */}
              <div className="footer-brand">
                <div style={{ marginBottom: '16px' }}>
                  <Image src="/images/NYXcable-Logo.png" alt="NYX Cable โลโก้" width={180} height={45} style={{ display: 'block', height: '45px', width: 'auto' }} />
                </div>
                <p>
                  ผู้เชี่ยวชาญด้านสายไฟอุตสาหกรรมคุณภาพสูง
                  มาตรฐานยุโรป ส่งตรงจากโรงงาน
                  พร้อมบริการให้คำปรึกษาโดยทีมวิศวกร
                </p>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ flexShrink: 0 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
                    <span><span style={{ color: '#fff' }}>เวลาทำการ</span> <span style={{ color: '#fbb03b' }}>Mon - Fri | 8.30 - 17.30 น.</span><br /><span style={{ color: '#fff' }}>หยุดพักกลางวัน</span> <span style={{ color: '#fbb03b' }}>12.00 - 13.00 น.</span></span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: 42, height: 42, borderRadius: '50%', background: '#3b5998', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z" /></svg>
                    </a>
                    <a href="https://www.youtube.com/@time7222" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ width: 42, height: 42, borderRadius: '50%', background: '#c4302b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" /></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4>เมนู</h4>
                <ul className="footer-links">
                  <li><Link href="/">หน้าแรก</Link></li>
                  <li><Link href="/products">ผลิตภัณฑ์</Link></li>
                  <li><Link href="/blog">บทความ & คู่มือ</Link></li>
                  <li><Link href="/gallery">แกลเลอรี่</Link></li>
                  <li><Link href="/about">เกี่ยวกับเรา</Link></li>
                  <li><Link href="/contact">ติดต่อเรา</Link></li>
                  <li><Link href="/privacy-policy">นโยบายความเป็นส่วนตัว</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4>ติดต่อเรา</h4>
                <div className="footer-contact-item" style={{ gap: '12px' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(240,165,0,0.2), rgba(240,165,0,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#f0a500"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" /></svg>
                  </span>
                  <a href={`tel:${phoneRaw}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{phone}</a>
                </div>
                <div className="footer-contact-item" style={{ gap: '12px' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(0,102,204,0.2), rgba(0,102,204,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4da6ff"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                  </span>
                  <a href={`https://mail.google.com/mail/?view=cm&to=${email}`} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{email}</a>
                </div>
                <div className="footer-contact-item" style={{ gap: '12px' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(6,199,85,0.2), rgba(6,199,85,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#06c755"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.629.629 0 01-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.51.43-.596.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
                  </span>
                  <a href={lineDeepLink} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>LINE: {lineOA}</a>
                </div>
                <div className="footer-contact-item" style={{ gap: '12px' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
                  </span>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.82rem' }}>{address?.split('\n').map((line: string, i: number) => <span key={i}>{i > 0 && <br />}{line}</span>)}</a>
                </div>
                {/* LINE QR */}
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <a href={lineDeepLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#fff', borderRadius: 12, padding: 8, lineHeight: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                    <Image src="/images/NYXLineQR.jpg" alt="LINE QR Code @nyxcable" width={110} height={110} style={{ borderRadius: 6, filter: 'grayscale(100%) sepia(100%) hue-rotate(190deg) saturate(300%) brightness(0.85) contrast(1.5)', display: 'block' }} />
                  </a>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 8, letterSpacing: '0.02em' }}>สแกนเพิ่มเพื่อน LINE</span>
                </div>

              </div>
            </div>

            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} NYX Cable. All Rights Reserved.</span>
              <span><Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Privacy Policy</Link> · สายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป</span>
            </div>
          </div>
        </footer>

        {/* Lazy-loaded: CookieConsent + FloatingContactFAB */}
        <LazyWidgets phoneRaw={phoneRaw} lineUrl={lineUrl} />
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(){
            if('ontouchstart' in window || navigator.maxTouchPoints>0) return;
            var sel='.btn-primary,.btn-line,.btn-accent,[style*="border-radius: 50px"]';
            var ticking=false;
            var mx=0, my=0;
            function update(){
              var btns=document.querySelectorAll(sel);
              for(var i=0;i<btns.length;i++){
                var btn=btns[i];
                var r=btn.getBoundingClientRect();
                var cx=r.left+r.width/2, cy=r.top+r.height/2;
                var dx=mx-cx, dy=my-cy;
                var dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<100){
                  var pull=Math.min((100-dist)/100*0.35,0.35);
                  btn.style.transform='translate('+dx*pull+'px,'+dy*pull+'px) scale(1.03)';
                  btn.style.transition='transform 0.15s ease-out';
                } else {
                  btn.style.transform='';
                  btn.style.transition='transform 0.4s ease-out';
                }
              }
              ticking=false;
            }
            document.addEventListener('mousemove',function(e){
              mx=e.clientX; my=e.clientY;
              if(!ticking){ ticking=true; requestAnimationFrame(update); }
            });
            document.addEventListener('mouseleave',function(){
              document.querySelectorAll(sel).forEach(function(btn){
                btn.style.transform='';
                btn.style.transition='transform 0.4s ease-out';
              });
            },true);
          })();
        `}} />
      </body>
    </html >
  );
}
