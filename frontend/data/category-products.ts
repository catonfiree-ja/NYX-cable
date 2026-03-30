// Hardcoded product lists per category — source of truth from nyxcable.com
// This replaces Sanity CMS data for category pages

export interface CategoryProduct {
  slug: string
  title: string
  code: string
  shortDescription: string
  image?: string // URL from nyxcable.com CDN
}

export interface CategoryData {
  title: string
  shortDescription: string
  products: CategoryProduct[]
}

export const categoryProductsMap: Record<string, CategoryData> = {
  // ─── 1. สายคอนโทรล (Control Cable) — 10 Models ─── 
  'control-cable': {
    title: 'สายคอนโทรล',
    shortDescription: 'สายไฟคอนโทรลคุณภาพยุโรป สำหรับงานระบบอัตโนมัติ ตู้ควบคุม เครื่องจักรในโรงงานอุตสาหกรรม',
    products: [
      {
        slug: 'ysly-jz',
        title: 'YSLY-JZ : สายคอนโทรล',
        code: 'YSLY-JZ',
        shortDescription: 'สายคอนโทรลมาตรฐานยุโรป DIN VDE ตัวนำทองแดงฝอยละเอียด ฉนวน PVC อ่อนตัวสูง 300/500V',
        image: '/images/products/ysly-jz.jpg',
      },
      {
        slug: 'olflex-classic-110',
        title: 'Olflex Classic 110 : สายคอนโทรล',
        code: 'OLFLEX-110',
        shortDescription: 'สายคอนโทรลพรีเมี่ยมจาก LAPP ตัวนำทองแดงฝอยละเอียด ฉนวน PVC 300/500V มาตรฐาน VDE',
        image: '/images/products/olflex-classic-110.jpg',
      },
      {
        slug: 'jz-500',
        title: 'JZ 500 Volt : สายคอนโทรล',
        code: 'JZ-500',
        shortDescription: 'สายคอนโทรล 500V ตัวนำทองแดงฝอย ฉนวน PVC คุณภาพสูง เหมาะสำหรับงานอุตสาหกรรมทั่วไป',
        image: '/images/products/jz-500.jpg',
      },
      {
        slug: 'opvc-jz',
        title: 'OPVC-JZ : สายคอนโทรล',
        code: 'OPVC-JZ',
        shortDescription: 'สายคอนโทรล OPVC ราคาคุ้มค่า ตัวนำทองแดงฝอย ฉนวน PVC 300/500V',
        image: '/images/products/opvc-jz.jpg',
      },
      {
        slug: 'flex-jz',
        title: 'Flex-JZ : สายคอนโทรล',
        code: 'FLEX-JZ',
        shortDescription: 'สายคอนโทรลอ่อนตัวนุ่ม ตัวนำทองแดงฝอยละเอียดพิเศษ เดินสายง่ายในพื้นที่แคบ',
        image: '/images/products/flex-jz.jpg',
      },
      {
        slug: 'cvv',
        title: 'CVV / CVV-F / CVV-S : สายคอนโทรล',
        code: 'CVV',
        shortDescription: 'สายคอนโทรลมาตรฐาน JIS ใช้งานกันอย่างแพร่หลายในประเทศไทย 600V ทนความร้อน 70°C',
        image: '/images/products/cvv.png',
      },
      {
        slug: 'vct',
        title: 'VCT : สายไฟอ่อน',
        code: 'VCT',
        shortDescription: 'สายไฟอ่อน VCT มาตรฐาน มอก. ตัวนำทองแดงฝอย ฉนวน PVC 450/750V เหมาะงานทั่วไป',
        image: '/images/products/vct.png',
      },
      {
        slug: 'multicore-cable',
        title: 'Multicore Cable : สายมัลติคอร์',
        code: 'MULTI',
        shortDescription: 'สายไฟมัลติคอร์หลายแกน เหมาะสำหรับงานคอนโทรลและจ่ายไฟเครื่องจักรอุตสาหกรรม',
        image: '/images/products/multicore-cable.jpg',
      },
      {
        slug: 'ysly-jz-1kv',
        title: 'YSLY-JZ 1kV : สายคอนโทรล 1000V',
        code: 'YSLY-1KV',
        shortDescription: 'สายคอนโทรลรับแรงดัน 1000V สำหรับงาน Power ที่ต้องการความอ่อนตัวสูง ใช้แทนสาย NYY ได้',
        image: '/images/products/ysly-jz-1kv.jpg',
      },
      {
        slug: 'control-cable',
        title: 'Control Cable : สายคอนโทรล (ภาพรวม)',
        code: 'CTRL',
        shortDescription: 'รวมข้อมูลสายคอนโทรลทุกรุ่น วิธีเลือก คุณสมบัติเปรียบเทียบ สำหรับงานอุตสาหกรรม',
        image: '/images/products/control-cable-overview.jpg',
      },
    ],
  },

  // ─── 2. สายชีลด์ (Shielded Cable) ─── 
  'shielded-cable': {
    title: 'สายชีลด์ (Shielded Cable)',
    shortDescription: 'สายไฟมีชีลด์ป้องกัน EMI/RFI คุณภาพยุโรป สำหรับงานสัญญาณควบคุม ระบบ PLC และ Automation',
    products: [
      {
        slug: 'liycy',
        title: 'LiYCY : สายชีลด์',
        code: 'LIYCY',
        shortDescription: 'สายชีลด์มาตรฐานยุโรป ชีลด์ทองแดงเคลือบดีบุกถัก ป้องกัน EMI 300/500V',
        image: '/images/products/liycy.jpg',
      },
      {
        slug: 'liycy-jz',
        title: 'LiYCY-JZ : สายชีลด์ + สายดิน',
        code: 'LIYCY-JZ',
        shortDescription: 'สายชีลด์มาตรฐานยุโรป พร้อมสายดินเขียว-เหลือง ป้องกัน EMI 300/500V',
        image: '/images/products/liycy-jz.jpg',
      },
      {
        slug: 'olflex-classic-115-cy',
        title: 'Olflex Classic 115 CY : สายชีลด์',
        code: 'CY-115',
        shortDescription: 'สายชีลด์พรีเมี่ยมจาก LAPP มีชีลด์ทองแดงเคลือบดีบุกถัก ป้องกัน EMI/RFI',
        image: '/images/products/olflex-classic-115-cy.jpg',
      },
      {
        slug: 'multiflex-cy',
        title: 'Multiflex CY : สายชีลด์รางกระดูกงู',
        code: 'MF-CY',
        shortDescription: 'สายชีลด์สำหรับรางกระดูกงู (Drag Chain) มีชีลด์กัน EMI ทนโค้งงอซ้ำๆ',
        image: '/images/products/multiflex.jpg',
      },
      {
        slug: 'double-shielded-cable',
        title: 'Double Shielded Cable : สายชีลด์สองชั้น',
        code: 'DBL-SHD',
        shortDescription: 'สายชีลด์สองชั้น (Foil+Braid) ป้องกัน EMI สูงสุด สำหรับงานวิกฤตที่ต้องการความแม่นยำ',
        image: '/images/products/double-shielded-cable.jpg',
      },
    ],
  },

  // ─── 3. สายคู่บิดเกลียว RS485 / RS422 ─── 
  'twisted-pair-cable': {
    title: 'สายคู่บิดเกลียว RS485 / RS422',
    shortDescription: 'สาย Twisted Pair สำหรับงานสัญญาณ RS485 RS422 และ Instrument ในระบบอุตสาหกรรม',
    products: [
      {
        slug: 'liyy-tp',
        title: 'LiYY-TP : สายคู่บิดเกลียว (ไม่มีชีลด์)',
        code: 'LIYY-TP',
        shortDescription: 'สายคู่บิดเกลียว ไม่มีชีลด์ สำหรับสัญญาณ 4-20mA และสัญญาณดิจิตอลทั่วไป',
        image: '/images/products/liyy-tp.jpg',
      },
      {
        slug: 'rs485-rs422',
        title: 'ST-TP : สาย RS485/RS422',
        code: 'ST-TP',
        shortDescription: 'สาย RS485/RS422 คู่บิดเกลียว ตัวนำทองแดงเคลือบดีบุก ทนความชื้น',
        image: '/images/products/rs485-rs422.jpg',
      },
      {
        slug: 'rs485-rs422-sttp',
        title: 'STTP : สาย RS485/RS422 มีชีลด์',
        code: 'STTP',
        shortDescription: 'สาย RS485/RS422 มีชีลด์ฟอยล์ป้องกัน EMI/RFI ได้ดีเยี่ยม',
      },
      {
        slug: 'rs485-rs422-belden',
        title: 'Belden : สาย RS485/RS422',
        code: 'BELDEN',
        shortDescription: 'สาย RS485/RS422 Belden คุณภาพระดับโลก ชีลด์หลายชั้น ความเสถียรสูงสุด',
      },
      {
        slug: 'rs485-rs422-hosiwell',
        title: 'Hosiwell : สาย RS485/RS422',
        code: 'HOSIWELL',
        shortDescription: 'สาย RS485/RS422 Hosiwell คุณภาพสูง ราคาคุ้มค่า มีชีลด์ป้องกันสัญญาณรบกวน',
        image: '/images/products/rs485-rs422-hosiwell.jpg',
      },
      {
        slug: 'rs485-rs422-liycy-tp',
        title: 'LiYCY-TP : สาย RS485 มีชีลด์ถัก',
        code: 'LIYCY-TP',
        shortDescription: 'สายคู่บิดเกลียวมีชีลด์ทองแดงถัก ป้องกัน EMI ดีเยี่ยม อ่อนตัวสูง',
        image: '/images/products/rs485-rs422-liycy-tp.jpg',
      },
    ],
  },

  // ─── 4. สายไฟฉนวนยาง / กันน้ำ ─── 
  'rubber-cable': {
    title: 'สายไฟฉนวนทำจากยาง / กันน้ำ',
    shortDescription: 'สายไฟฉนวนยาง กันน้ำ ทนสภาพอากาศ สำหรับปั๊มน้ำ เครื่องจักรกลางแจ้ง งานก่อสร้าง',
    products: [
      {
        slug: 'h07rn-f',
        title: 'H07RN-F : สายไฟกันน้ำ',
        code: 'H07RN-F',
        shortDescription: 'สายไฟฉนวนยาง กันน้ำ EPR+Neoprene 450/750V สำหรับปั๊มน้ำ เครื่องจักรกลางแจ้ง',
        image: '/images/products/h07rn-f.jpg',
      },
      {
        slug: 'welding-cable',
        title: 'สายเชื่อม (Welding Cable)',
        code: 'WELD',
        shortDescription: 'สายเชื่อมไฟฟ้า ตัวนำทองแดงฝอยละเอียดมากพิเศษ ฉนวนยาง EPR ทนความร้อนจากการเชื่อม',
        image: '/images/products/welding-cable.jpg',
      },
      {
        slug: 'nsshoeu',
        title: 'NSSHÖu : สายไฟสำหรับงานเหมือง',
        code: 'NSSHOEU',
        shortDescription: 'สายรับแรงดึงพิเศษ ฉนวนยาง Neoprene ทนแรงกระแทก สภาพอากาศรุนแรง',
        image: '/images/products/nshtou.jpg',
      },
      {
        slug: 'lift-2s',
        title: 'Lift-2S : สายลิฟต์ Crane Pendant',
        code: 'LIFT-2S',
        shortDescription: 'สายไฟสลิงคู่สำหรับ Crane Pendant cable Lift Cable ยืดหยุ่นสูง รับแรงดึง',
        image: '/images/products/lift-2s.jpg',
      },
      {
        slug: 'nsgafou',
        title: 'NSGAFou : สายไฟทนการขีดข่วนและน้ำมัน',
        code: 'NSGAFOU',
        shortDescription: 'สายไฟรับแรงดึงฉนวนยาง Cable Reel/Trolley 1.8/3 kV ตามมาตรฐาน VDE',
      },
    ],
  },

  // ─── 5. สาย Wiring ตู้คอนโทรล (VSF) ─── 
  'wiring-cable': {
    title: 'สายวายริ่งตู้ (VSF)',
    shortDescription: 'สายเดี่ยวสำหรับเดินวงจรภายในตู้ Switchboard คุณภาพมาตรฐานยุโรป',
    products: [
      {
        slug: 'h05v-k',
        title: 'H05V-K : สาย Wiring ตู้คอนโทรล MDB (500V)',
        code: 'H05V-K',
        shortDescription: 'สาย Wiring 500V ขนาด 0.5-1 mm² สำหรับเดินภายในตู้ MDB คุณภาพยุโรป',
        image: '/images/products/h05v-k.jpg',
      },
      {
        slug: 'h07v-k',
        title: 'H07V-K : สาย Wiring ตู้คอนโทรล MDB (750V)',
        code: 'H07V-K',
        shortDescription: 'สาย Wiring 750V ขนาด 1.5-240 mm² สำหรับเดินภายในตู้ MDB คุณภาพยุโรป',
        image: '/images/products/h07v-k.jpg',
      },
    ],
  },

  // ─── 6. High-Flex Motion Cables ─── 
  'high-flex-cable': {
    title: 'สายเคเบิลสำหรับงานเคลื่อนที่',
    shortDescription: 'สายไฟสำหรับรางกระดูกงู (Drag Chain) หุ่นยนต์ และเครื่องจักรที่เคลื่อนที่ ทนโค้งงอซ้ำๆ',
    products: [
      {
        slug: 'multiflex-y',
        title: 'Multiflex Y : สายรางกระดูกงู',
        code: 'MF-Y',
        shortDescription: 'สายไฟรางกระดูกงูมาตรฐาน ฉนวน PVC ทนโค้งงอซ้ำๆ ใช้แทน FD CLASSIC 810 ได้',
        image: '/images/products/multiflex-y.jpg',
      },
      {
        slug: 'igus',
        title: 'Multiflex CP : สายรางกระดูกงูมีชีลด์ ทนน้ำมัน',
        code: 'MF-CP',
        shortDescription: 'สายรางกระดูกงูมีชีลด์ ฉนวน PUR ทนน้ำมัน/สารเคมี ใช้แทน FD CLASSIC 810 CP ได้',
      },
      {
        slug: 'multiflex-p',
        title: 'Multiflex P : สายรางกระดูกงู PUR',
        code: 'MF-P',
        shortDescription: 'สายรางกระดูกงู ฉนวน PUR ทนน้ำมัน สารเคมี แรงขูดขีด สำหรับ Drag Chain',
        image: '/images/products/multiflex-p.jpg',
      },
      {
        slug: 'robot-cable',
        title: 'Robot Welding Cable : สายหุ่นยนต์เชื่อม',
        code: 'ROBOT',
        shortDescription: 'สายไฟสำหรับหุ่นยนต์เชื่อม ทนแรงบิดซ้ำๆ ตัวนำฝอยละเอียดพิเศษ ทนความร้อนจากการเชื่อม',
      },
    ],
  },

  // ─── 7. Industrial Bus Cables ─── 
  'industrial-bus-cable': {
    title: 'สายฟิลด์บัส (Industrial Bus Cables)',
    shortDescription: 'สาย Profibus Profinet CC-Link DeviceNet EIB/KNX สำหรับ Factory Automation',
    products: [
      {
        slug: 'profibus-cable',
        title: 'Profibus Cable',
        code: 'PROFIBUS',
        shortDescription: 'สาย Profibus DP/PA สีม่วง ตามมาตรฐาน IEC 61158 สำหรับ PLC Siemens',
        image: '/images/products/profibus-cable.jpg',
      },
      {
        slug: 'profibus-drag-chain',
        title: 'Profibus Drag Chain',
        code: 'PB-DC',
        shortDescription: 'สาย Profibus สำหรับรางกระดูกงู ตัวนำฝอยละเอียดพิเศษ ฉนวน PUR สีม่วง',
      },
      {
        slug: 'profibus-outdoor',
        title: 'Profibus Outdoor',
        code: 'PB-OUT',
        shortDescription: 'สาย Profibus สำหรับภายนอกอาคาร ฉนวน PE ทน UV ความชื้น สภาพอากาศ',
      },
      {
        slug: 'profibus-connector-90',
        title: 'Profibus Connector 90°',
        code: 'PB-CON90',
        shortDescription: 'หัวต่อ Profibus 90 องศา มี Terminating Resistor สำหรับพื้นที่จำกัด',
      },
      {
        slug: 'profibus-connector-90pg',
        title: 'Profibus Connector 90° PG',
        code: 'PB-CON90PG',
        shortDescription: 'หัวต่อ Profibus 90 องศา + Cable Gland รัดสาย ทนแรงสั่นสะเทือน',
      },
      {
        slug: 'profinet-type-a',
        title: 'Profinet Type A',
        code: 'PROFINET',
        shortDescription: 'สาย Profinet 100 Mbps สีเขียว Cat 5e มีชีลด์ สำหรับ Factory Automation',
        image: '/images/products/profinet-type-a.jpg',
      },
      {
        slug: 'profinet-connector-180',
        title: 'Profinet Connector 180°',
        code: 'PN-CON180',
        shortDescription: 'หัวต่อ Profinet RJ45 แบบ 180 องศา ติดตั้งง่าย ไม่ต้องใช้เครื่องมือพิเศษ',
      },
      {
        slug: 'cc-link',
        title: 'CC-Link Cable',
        code: 'CC-LINK',
        shortDescription: 'สาย CC-Link สีฟ้า สำหรับระบบ CC-Link ของ Mitsubishi Factory Automation',
        image: '/images/products/cc-link.jpg',
      },
      {
        slug: 'devicenet-thick',
        title: 'DeviceNet Thick',
        code: 'DN-THICK',
        shortDescription: 'สาย DeviceNet Thick สำหรับ Trunk Line ระยะสูงสุด 500 เมตร ส่งข้อมูล+ไฟ 24V',
        image: '/images/products/devicenet-thick.jpg',
      },
      {
        slug: 'devicenet-thin',
        title: 'DeviceNet Thin',
        code: 'DN-THIN',
        shortDescription: 'สาย DeviceNet Thin สำหรับ Drop Line ระยะ 6 เมตร อ่อนตัว เดินสายง่าย',
      },
      {
        slug: 'eib-bus-knx',
        title: 'EIB Bus / KNX Cable',
        code: 'KNX',
        shortDescription: 'สาย EIB/KNX สีเขียว สำหรับระบบอาคารอัจฉริยะ Smart Building',
        image: '/images/products/eib-bus-knx.jpg',
      },
    ],
  },

  // ─── 8. สายทนความร้อน ทนสารเคมี ─── 
  'resistant-cable': {
    title: 'สายทนความร้อน ทนสารเคมี',
    shortDescription: 'สายไฟทนความร้อนสูง ทนน้ำมัน สารเคมี ฉนวนซิลิโคน PUR PFA สำหรับงานอุตสาหกรรมหนัก',
    products: [
      {
        slug: 'sif',
        title: 'SiF : สายทนความร้อน 180°C',
        code: 'SIF',
        shortDescription: 'สายแกนเดี่ยวฉนวนซิลิโคน ทนความร้อน 180°C ตัวนำทองแดงเคลือบดีบุก 500V',
        image: '/images/products/sif.jpg',
      },
      {
        slug: 'sif-gl',
        title: 'SiF-GL : สายทนความร้อน 200°C (ไฟเบอร์กลาส)',
        code: 'SIF-GL',
        shortDescription: 'สายฉนวนซิลิโคน+ไฟเบอร์กลาส ทนความร้อน 200°C สำหรับเตาอบ เตาหลอม',
      },
      {
        slug: 'siaf-ignition-wire',
        title: 'SIAF : สาย Ignition Wire',
        code: 'SIAF',
        shortDescription: 'สายฉนวนซิลิโคน ตัวนำเคลือบนิกเกิล สำหรับงานจุดระเบิดและอุณหภูมิสูงมาก',
      },
      {
        slug: 'sihf',
        title: 'SiHF : สายหลายคอร์ทนความร้อน 180°C',
        code: 'SIHF',
        shortDescription: 'สายหลายคอร์ฉนวนซิลิโคน ทน 180°C ทนน้ำมัน สำหรับเครื่องจักรความร้อนสูง',
        image: '/images/products/sihf.jpg',
      },
      {
        slug: 'pfa-cable',
        title: 'PFA/PTFE/ETFE/FEP Cable',
        code: 'PFA',
        shortDescription: 'สายฉนวน PFA/PTFE/ETFE/FEP ทนความร้อนสูงสุด 260°C ทนสารเคมีได้ยอดเยี่ยม',
        image: '/images/products/pfa-cable.jpg',
      },
      {
        slug: 'thermocouple-type-k-cable',
        title: 'Thermocouple Type K Cable',
        code: 'TYPE-K',
        shortDescription: 'สาย Thermocouple Type K วัดอุณหภูมิ -200°C ถึง 1,260°C ตัวนำ Chromel-Alumel',
        image: '/images/products/thermocouple-type-k-cable.jpg',
      },
      {
        slug: 'y11y-jz',
        title: 'Y11Y-JZ : สายทนน้ำมัน PUR',
        code: 'Y11Y-JZ',
        shortDescription: 'สายคอนโทรลฉนวน PUR ทนน้ำมัน สารเคมี 500V 80°C ฝังดินได้',
        image: '/images/products/y11y-jz.jpg',
      },
      {
        slug: 'yc11y-jz',
        title: 'YC11Y-JZ : สายทนน้ำมัน PUR มีชีลด์',
        code: 'YC11Y-JZ',
        shortDescription: 'สายคอนโทรลฉนวน PUR มีชีลด์ ทนน้ำมัน สารเคมี 500V 80°C ฝังดินได้',
      },
    ],
  },

  // ─── 9. สายเครน (Crane Cable) — ไม่มีใน nav แต่อยู่ใน CMS ─── 
  'crane-cable': {
    title: 'สายเครน (Crane Cable)',
    shortDescription: 'สายไฟสำหรับเครน Cable Reel Cable Trolley ทนแรงดึง โค้งงอ สภาพอากาศ',
    products: [
      {
        slug: 'pur-hf',
        title: 'PUR-HF : สาย Cable Reel Crane',
        code: 'PUR-HF',
        shortDescription: 'สายไฟ Cable Reel ฉนวน PUR ทนแรงดึง UV 600/1000V 90°C',
        image: '/images/products/pur-hf.jpg',
      },
      {
        slug: 'nsgafou',
        title: 'NSGAFou : สายไฟรับแรงดึง',
        code: 'NSGAFOU',
        shortDescription: 'สายไฟรับแรงดึงฉนวนยาง Cable Reel/Trolley 0.6/1 kV ตามมาตรฐาน VDE 0250',
      },
      {
        slug: 'nshtou',
        title: 'NSHTOU : สาย Cable Reel Crane',
        code: 'NSHTOU',
        shortDescription: 'สายไฟ Cable Reel Crane ฉนวนยาง ทนแรงดึงสูงพิเศษ 0.6/1 kV -40°C ถึง 60°C',
        image: '/images/products/nshtou.jpg',
      },
      {
        slug: 'nsshoeu',
        title: 'NSSHOeu : สายรับแรงดึงพิเศษ',
        code: 'NSSHOEU',
        shortDescription: 'สายรับแรงดึงพิเศษ ฉนวนยาง Neoprene ทนแรงกระแทก สภาพอากาศรุนแรง',
      },
      {
        slug: 'ntscgewoeu',
        title: 'NTSCGEWOEU : สายสำหรับเหมือง',
        code: 'NTSCG',
        shortDescription: 'สายไฟสำหรับเหมือง Cable Reel ทนสภาพแวดล้อมรุนแรงที่สุด -40°C ถึง 60°C',
      },
      {
        slug: 'h07vvh6-f',
        title: 'H07VVH6-F : สายไฟแบน Flat Cable',
        code: 'H07VVH6-F',
        shortDescription: 'สายไฟแบน Flat Cable สำหรับ Crane Cable Trolley ลิฟต์ ไม่บิดตัว 450/750V',
        image: '/images/products/h07vvh6-f.jpg',
      },
      {
        slug: 'ngflgou',
        title: 'NGFLGou : สายไฟแบนฉนวนยาง',
        code: 'NGFLGOU',
        shortDescription: 'สายไฟแบนฉนวนยาง Cable Trolley ทน UV ความชื้น สภาพอากาศภายนอก',
      },
      {
        slug: 'lift-2s',
        title: 'Lift 2S : สายลิฟต์',
        code: 'LIFT-2S',
        shortDescription: 'สายลิฟต์ ยืดหยุ่นสูง รับแรงดึง ทนโค้งงอซ้ำๆ สำหรับลิฟต์ทุกประเภท',
        image: '/images/products/lift-2s.jpg',
      },
    ],
  },
}
