import type { Metadata } from "next";
import "./globals.css";
import { OrganizationSchema } from "@/components/StructuredData";
import NavLinks from "@/components/NavLinks";

export const metadata: Metadata = {
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
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "NYX Cable",
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
    <html lang="th">
      <body>
        <OrganizationSchema />
        {/* Top Info Bar */}
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-contact">
              <a href="tel:021115588">02-111-5588</a>
              <a href="tel:0957275453">095-727-5453</a>
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
          {/* Corner Product Ribbon */}
          <a href="/products" className="corner-ribbon">PRODUCTS</a>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Pre-Footer CTA Buttons */}
        <section className="prefooter-cta">
          <a href="tel:021115588" className="cta-big cta-call">
            <span className="cta-big-icon">Tel</span>
            <span className="cta-big-text">
              <strong>Call หาเราทันที</strong>
              <small>02-111-5588</small>
            </span>
          </a>
          <a href="https://page.line.me/ubb9405u" target="_blank" rel="noopener noreferrer" className="cta-big cta-line-big">
            <span className="cta-big-icon">LINE</span>
            <span className="cta-big-text">
              <strong>LINE ปรึกษาฟรี</strong>
              <small>@nyxcable</small>
            </span>
          </a>
          <a href="mailto:sales@nyxcable.com" className="cta-big cta-email">
            <span className="cta-big-icon">Mail</span>
            <span className="cta-big-text">
              <strong>Email สอบถาม</strong>
              <small>sales@nyxcable.com</small>
            </span>
          </a>
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
              </div>

              {/* Quick Links */}
              <div>
                <h4>เมนู</h4>
                <ul className="footer-links">
                  <li><a href="/">หน้าแรก</a></li>
                  <li><a href="/products">ผลิตภัณฑ์</a></li>
                  <li><a href="/blog">บทความ</a></li>
                  <li><a href="/about">เกี่ยวกับเรา</a></li>
                  <li><a href="/contact">ติดต่อเรา</a></li>
                </ul>
              </div>

              {/* Products */}
              <div>
                <h4>ผลิตภัณฑ์</h4>
                <ul className="footer-links">
                  <li><a href="/products">สายคอนโทรล</a></li>
                  <li><a href="/products">สาย VFD / Servo</a></li>
                  <li><a href="/products">สายทนความร้อน</a></li>
                  <li><a href="/products">สายชีลด์</a></li>
                  <li><a href="/products">สายเครน</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4>ติดต่อเรา</h4>
                <div className="footer-contact-item">
                  <span className="icon">Tel</span>
                  <div>
                    <div>02-111-5588</div>
                    <div>095-727-5453</div>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <span className="icon">Mail</span>
                  <span>sales@nyxcable.com</span>
                </div>
                <div className="footer-contact-item">
                  <span className="icon">Loc</span>
                  <span>บางนา, กรุงเทพฯ</span>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} NYX Cable. All Rights Reserved.</span>
              <span>สายไฟอุตสาหกรรมคุณภาพสูง มาตรฐานยุโรป</span>
            </div>
          </div>
        </footer>

        {/* Floating LINE Button */}
        <a
          href="https://page.line.me/ubb9405u"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-line"
        >
          LINE สอบถาม
        </a>
        <script dangerouslySetInnerHTML={{ __html: `
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
