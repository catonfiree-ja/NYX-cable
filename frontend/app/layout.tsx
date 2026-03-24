import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { OrganizationSchema } from "@/components/StructuredData";
import NavLinks from "@/components/NavLinks";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import FloatingContactFAB from "@/components/FloatingContactFAB";

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
    description: "ผู้นำด้านสายไฟอุตสาหกรรม สต็อกพร้อมส่ง ปรึกษาวิศวกรฟรี โทร 02-111-5588",
    images: ["/images/gallery/profile.webp"],
  },
};

function NyxLogo() {
  return (
    <svg width="50" height="50" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="#3b82f6" strokeWidth="6" fill="none" />
      <circle cx="60" cy="60" r="45" stroke="#1e40af" strokeWidth="2" fill="none" />
      <text x="60" y="55" textAnchor="middle" dominantBaseline="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="32" fill="#1e3a5f">NYX</text>
      <text x="60" y="80" textAnchor="middle" dominantBaseline="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="#3b82f6" letterSpacing="4">CABLE</text>
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={prompt.variable}>
      <body className={prompt.className}>
        <a href="#main-content" className="skip-nav">ข้ามไปเนื้อหาหลัก</a>
        <OrganizationSchema />
        <GoogleAnalytics />
        {/* Corner Ribbon — PRODUCTS */}
        <a href="/products" className="corner-ribbon">PRODUCTS</a>
        {/* Top Info Bar */}
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-contact">
              <span style={{ color: '#ffc107', fontWeight: 700 }}>Hot Line :</span>
              <a href="tel:021115588" style={{ color: '#ffc107', fontWeight: 700 }}>02-111-5588</a>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
              <a href="mailto:sales@nyxcable.com">sales@nyxcable.com</a>
            </div>
            <div className="top-bar-contact">
              <span>จ-ศ 8:30-17:30</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="header">
          <div className="container">
            <a href="/" className="header-logo">
              <NyxLogo />
              <span>NYX CABLE</span>
            </a>
            <NavLinks />
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content">{children}</main>

        {/* Pre-Footer CTA — Original Style */}
        <section className="prefooter-cta">
          <div className="prefooter-cta-buttons">
            <a href="tel:021115588" className="cta-big cta-call cta-pulse">
              <span className="cta-big-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" /></svg>
              </span>
              <span className="cta-big-text">
                <strong>Call หาเราทันที</strong>
                <span className="cta-blink-text">Click เลย !!!</span>
              </span>
            </a>
            <a href="https://line.me/R/ti/p/@ubb9405u" target="_blank" rel="noopener noreferrer" className="cta-big cta-line-big cta-pulse">
              <span className="cta-big-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.51.43-.596.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
              </span>
              <span className="cta-big-text">
                <strong>LINE ปรึกษาฟรี</strong>
                <span className="cta-blink-text">Click เลย !!!</span>
              </span>
            </a>
            <a href="mailto:sales@nyxcable.com" className="cta-big cta-email cta-pulse">
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <NyxLogo />
                  <h3 style={{ margin: 0 }}>NYX CABLE</h3>
                </div>
                <p>
                  ผู้เชี่ยวชาญด้านสายไฟอุตสาหกรรมคุณภาพสูง
                  มาตรฐานยุโรป ส่งตรงจากโรงงาน
                  พร้อมบริการให้คำปรึกษาโดยทีมวิศวกร
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <a href="https://www.facebook.com/NYXCable" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem', textDecoration: 'none' }} aria-label="Facebook">Facebook</a>
                  <a href="https://www.youtube.com/@nyxcable" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem', textDecoration: 'none' }} aria-label="YouTube">YouTube</a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4>เมนู</h4>
                <ul className="footer-links">
                  <li><a href="/">หน้าแรก</a></li>
                  <li><a href="/products">ผลิตภัณฑ์</a></li>
                  <li><a href="/blog">บทความ & คู่มือ</a></li>
                  <li><a href="/gallery">แกลเลอรี่</a></li>
                  <li><a href="/about">เกี่ยวกับเรา</a></li>
                  <li><a href="/contact">ติดต่อเรา</a></li>
                  <li><a href="/privacy-policy">นโยบายความเป็นส่วนตัว</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4>ติดต่อเรา</h4>
                <div className="footer-contact-item">
                  <span className="icon" style={{ fontSize: '1.2rem' }}>📞</span>
                  <a href="tel:021115588" style={{ color: 'inherit', textDecoration: 'none' }}>02-111-5588</a>
                </div>
                <div className="footer-contact-item">
                  <span className="icon" style={{ fontSize: '1.2rem' }}>✉️</span>
                  <a href="mailto:sales@nyxcable.com" style={{ color: 'inherit', textDecoration: 'none' }}>sales@nyxcable.com</a>
                </div>
                <div className="footer-contact-item">
                  <span className="icon" style={{ fontSize: '1.2rem' }}>💬</span>
                  <a href="https://line.me/R/ti/p/@ubb9405u" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>LINE: @nyxcable</a>
                </div>
                <div className="footer-contact-item">
                  <span className="icon" style={{ fontSize: '1.2rem' }}>📍</span>
                  <span>2098 หมู่ 1 ต.สำโรงเหนือ (ซ.สุขุมวิท 72) อ.เมือง สมุทรปราการ 10270</span>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="footer-contact-item">
                    <span className="icon" style={{ fontSize: '1.2rem' }}>🕐</span>
                    <span>เวลาทำการ Mon-Fri | 8.30-17.30 น.<br />หยุดพักกลางวัน 12.00-13.00 น.</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    <a href="https://www.facebook.com/NYXCable" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      Facebook
                    </a>
                    <a href="https://www.youtube.com/@nyxcable" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                      YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} NYX Cable. All Rights Reserved.</span>
              <span><a href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>Privacy Policy</a> · สายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป</span>
            </div>
          </div>
        </footer>

        {/* Floating Contact FAB — appears after 60s, bottom-left */}
        <FloatingContactFAB />
        <CookieConsent />
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(){
            var sel='.btn-primary,.btn-line,.btn-accent,[style*="border-radius: 50px"]';
            document.addEventListener('mousemove',function(e){
              document.querySelectorAll(sel).forEach(function(btn){
                var r=btn.getBoundingClientRect();
                var cx=r.left+r.width/2, cy=r.top+r.height/2;
                var dx=e.clientX-cx, dy=e.clientY-cy;
                var dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<100){
                  var pull=Math.min((100-dist)/100*0.35,0.35);
                  btn.style.transform='translate('+dx*pull+'px,'+dy*pull+'px) scale(1.03)';
                  btn.style.transition='transform 0.15s ease-out';
                } else {
                  btn.style.transform='';
                  btn.style.transition='transform 0.4s ease-out';
                }
              });
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
    </html>
  );
}
