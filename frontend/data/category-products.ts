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
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
      },
      {
        slug: 'olflex-classic-110',
        title: 'Olflex Classic 110 : สายคอนโทรล',
        code: 'OLFLEX-110',
        shortDescription: 'สายคอนโทรลพรีเมี่ยมจาก LAPP ตัวนำทองแดงฝอยละเอียด ฉนวน PVC 300/500V มาตรฐาน VDE',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/Olflex-Classic-110.jpg',
      },
      {
        slug: 'jz-500',
        title: 'JZ 500 Volt : สายคอนโทรล',
        code: 'JZ-500',
        shortDescription: 'สายคอนโทรล 500V ตัวนำทองแดงฝอย ฉนวน PVC คุณภาพสูง เหมาะสำหรับงานอุตสาหกรรมทั่วไป',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/JZ-500.jpg',
      },
      {
        slug: 'opvc-jz',
        title: 'OPVC-JZ : สายคอนโทรล',
        code: 'OPVC-JZ',
        shortDescription: 'สายคอนโทรล OPVC ราคาคุ้มค่า ตัวนำทองแดงฝอย ฉนวน PVC 300/500V',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/OPVC-JZ.jpg',
      },
      {
        slug: 'flex-jz',
        title: 'Flex-JZ : สายคอนโทรล',
        code: 'FLEX-JZ',
        shortDescription: 'สายคอนโทรลอ่อนตัวนุ่ม ตัวนำทองแดงฝอยละเอียดพิเศษ เดินสายง่ายในพื้นที่แคบ',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
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
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
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
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ-1KV-1.jpg',
      },
      {
        slug: 'control-cable',
        title: 'Control Cable : สายคอนโทรล (ภาพรวม)',
        code: 'CTRL',
        shortDescription: 'รวมข้อมูลสายคอนโทรลทุกรุ่น วิธีเลือก คุณสมบัติเปรียบเทียบ สำหรับงานอุตสาหกรรม',
        image: '/images/products/control-cable-overview.jpg',
      },
      {
        slug: 'liyy-tp',
        title: 'LiYY(TP) : สายคู่บิดเกลียว ไม่มีชีลด์',
        code: 'LIYY-TP',
        shortDescription: 'สายคู่บิดเกลียว ไม่มีชีลด์ สำหรับสัญญาณ 4-20mA และสัญญาณดิจิตอลทั่วไป',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/LiYYTP.jpg',
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
        image: 'https://nyxcable.com/wp-content/uploads/2019/11/LiYCY.jpg',
      },
      {
        slug: 'liycy-jz',
        title: 'LiYCY-JZ : สายชีลด์ + สายดิน',
        code: 'LIYCY-JZ',
        shortDescription: 'สายชีลด์มาตรฐานยุโรป พร้อมสายดินเขียว-เหลือง ป้องกัน EMI 300/500V',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/LiYCY.jpg',
      },
      {
        slug: 'olflex-classic-115-cy',
        title: 'Olflex Classic 115 CY : สายชีลด์',
        code: 'CY-115',
        shortDescription: 'สายชีลด์พรีเมี่ยมจาก LAPP มีชีลด์ทองแดงเคลือบดีบุกถัก ป้องกัน EMI/RFI',
        image: 'https://nyxcable.com/wp-content/uploads/2017/01/Olflex-Classic-115-CY-1.jpg',
      },
      {
        slug: 'cvv-s',
        title: 'CVV-S : สายคอนโทรลมีชีลด์',
        code: 'CVV-S',
        shortDescription: 'สายคอนโทรลมาตรฐาน JIS มีชีลด์ป้องกัน EMI 600V ใช้งานแพร่หลายในประเทศไทย',
        image: 'https://nyxcable.com/wp-content/uploads/2019/11/LiYCY.jpg',
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
        slug: 'rs485-rs422',
        title: 'Twisted Pair : สายคู่บิดเกลียว มีชีลด์ สำหรับสัญญาณ RS485 Cable',
        code: 'TP',
        shortDescription: 'สายคู่บิดเกลียว มีชีลด์ Twisted Pair สำหรับ ใช้กับสัญญาณ RS422 Cable, RS485',
        image: 'https://nyxcable.com/wp-content/uploads/2017/01/twisted-pair-cable.jpg',
      },
      {
        slug: 'rs485-rs422-sttp',
        title: 'ST-TP : สายคู่บิดเกลียว สำหรับ RS485, RS422 โดยเฉพาะ',
        code: 'ST-TP',
        shortDescription: 'สาย RS485/RS422 คู่บิดเกลียว ตัวนำทองแดงเคลือบดีบุก ทนความชื้น สำหรับสัญญาณ 4-20mA',
        image: 'https://nyxcable.com/wp-content/uploads/2017/01/twisted-pair-cable.jpg',
      },
      {
        slug: 'rs485-rs422-belden',
        title: 'NYX CABLE จำหน่ายสาย Belden ครบวงจรสำหรับงานอุตสาหกรรม',
        code: 'BELDEN',
        shortDescription: 'สาย RS485/RS422 Belden คุณภาพระดับโลก ชีลด์หลายชั้น ความเสถียรสูงสุด',
        image: 'https://nyxcable.com/wp-content/uploads/2017/01/twisted-pair-cable.jpg',
      },
      {
        slug: 'rs485-rs422-hosiwell',
        title: 'สาย RS485 Cable สายคู่บิดเกลียว มีชีลด์ สำหรับสัญญาณ RS485 โดยเฉพาะ : Hosiwell (โฮซิเวล)',
        code: 'HOSIWELL',
        shortDescription: 'สาย RS485 Cable สายคู่บิดเกลียว มีชีลด์ สำหรับสัญญาณ RS485, RS422',
        image: 'https://nyxcable.com/wp-content/uploads/2017/01/twisted-pair-cable.jpg',
      },
      {
        slug: 'rs485-rs422-liycy-tp',
        title: 'LiYCY(TP) : สายคู่บิดเกลียว มีชีลด์',
        code: 'LIYCY-TP',
        shortDescription: 'สายคู่บิดเกลียวมีชีลด์ทองแดงถัก ป้องกัน EMI ดีเยี่ยม อ่อนตัวสูง',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/LiYYTP.jpg',
      },
    ],
  },

  // ─── 4. สายไฟฉนวนยาง / กันน้ำ ─── 
  'water-resistant-cable': {
    title: 'สายไฟฉนวนทำจากยาง / กันน้ำ',
    shortDescription: 'สายไฟฉนวนยาง กันน้ำ ทนสภาพอากาศ สำหรับปั๊มน้ำ เครื่องจักรกลางแจ้ง งานก่อสร้าง',
    products: [
      {
        slug: 'h07rn-f',
        title: 'H07RN-F : สายไฟกันน้ำ',
        code: 'H07RN-F',
        shortDescription: 'สายไฟฉนวนยาง กันน้ำ EPR+Neoprene 450/750V สำหรับปั๊มน้ำ เครื่องจักรกลางแจ้ง',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/H07RN-F.jpg',
      },
      {
        slug: 'welding-cable-h01n2d',
        title: 'สายเชื่อม (Welding Cable)',
        code: 'WELD',
        shortDescription: 'สายเชื่อมไฟฟ้า ตัวนำทองแดงฝอยละเอียดมากพิเศษ ฉนวนยาง EPR ทนความร้อนจากการเชื่อม',
        image: '/images/products/welding-cable.jpg',
      },
      {
        slug: 'nsshou',
        title: 'NSSHÖu : สายไฟสำหรับงานเหมือง',
        code: 'NSSHOEU',
        shortDescription: 'สายรับแรงดึงพิเศษ ฉนวนยาง Neoprene ทนแรงกระแทก สภาพอากาศรุนแรง',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/NSHTOU.jpg',
      },
      {
        slug: 'lift-1s',
        title: 'Lift-1S : สายสลิงเดี่ยว Crane Pendant',
        code: 'LIFT-1S',
        shortDescription: 'สายไฟสลิงเดี่ยวสำหรับ Crane Pendant cable Lift Cable ฉนวนยาง รับแรงดึง',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/Lift-2s.jpg',
      },
      {
        slug: 'lift-2s',
        title: 'Lift-2S : สายสลิงคู่ Crane Pendant',
        code: 'LIFT-2S',
        shortDescription: 'สายไฟสลิงคู่สำหรับ Crane Pendant cable Lift Cable ยืดหยุ่นสูง รับแรงดึง',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/Lift-2s.jpg',
      },
      {
        slug: 'nsgafou',
        title: 'NSGAFou : สายไฟทนการขีดข่วนและน้ำมัน',
        code: 'NSGAFOU',
        shortDescription: 'สายไฟรับแรงดึงฉนวนยาง Cable Reel/Trolley 1.8/3 kV ตามมาตรฐาน VDE',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/NSGAFoeu.jpg',
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
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/H05V-K.jpg',
      },
      {
        slug: 'h07v-k',
        title: 'H07V-K : สาย Wiring ตู้คอนโทรล MDB (750V)',
        code: 'H07V-K',
        shortDescription: 'สาย Wiring 750V ขนาด 1.5-240 mm² สำหรับเดินภายในตู้ MDB คุณภาพยุโรป',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/H07V-K.jpg',
      },
    ],
  },

  // ─── 6. High-Flex Motion Cables ─── 
  'high-flex-cable': {
    title: 'สายเคเบิลสำหรับงานเคลื่อนที่',
    shortDescription: 'สายไฟสำหรับรางกระดูกงู (Drag Chain) Cable Reel เครน หุ่นยนต์ และเครื่องจักรที่เคลื่อนที่',
    products: [
      // --- Crane / Cable Reel ---
      {
        slug: 'nshtou',
        title: 'NSHTOU : สาย Cable Reel Crane',
        code: 'NSHTOU',
        shortDescription: 'สายไฟ Cable Reel Crane ฉนวนยาง ทนแรงดึงสูงพิเศษ 0.6/1 kV -40°C ถึง 60°C',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/NSHTOU.jpg',
      },
      {
        slug: 'pur-hf',
        title: 'PUR-HF : สาย Cable Reel 100%',
        code: 'PUR-HF',
        shortDescription: 'สายไฟ Cable Reel ฉนวน PUR ทนแรงดึง UV 600/1000V 90°C',
        image: 'https://nyxcable.com/wp-content/uploads/2022/11/PUR-HF.jpg',
      },
      {
        slug: 'h07vvh6-f',
        title: 'H07VVH6-F : สายไฟแบน Flat Cable',
        code: 'H07VVH6-F',
        shortDescription: 'สายไฟแบน Flat Cable สำหรับ Crane Cable Trolley ลิฟต์ ไม่บิดตัว 450/750V',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PVC-Flat-Cable.jpg',
      },
      {
        slug: 'ngflgou',
        title: 'NGFLGou : สายไฟแบนฉนวนยาง',
        code: 'NGFLGOU',
        shortDescription: 'สายไฟแบนฉนวนยาง Cable Trolley ทน UV ความชื้น สภาพอากาศภายนอก',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/NGFLGOU.jpg',
      },
      // --- Drag Chain / Motion ---
      {
        slug: 'multiflex-y',
        title: 'Multiflex Y : สายรางกระดูกงู',
        code: 'MF-Y',
        shortDescription: 'สายไฟรางกระดูกงูมาตรฐาน ฉนวน PVC ทนโค้งงอซ้ำๆ ใช้แทน FD CLASSIC 810 ได้',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
      },
      {
        slug: 'multiflex-p',
        title: 'Multiflex P : สายรางกระดูกงู PUR',
        code: 'MF-P',
        shortDescription: 'สายรางกระดูกงู ฉนวน PUR ทนน้ำมัน สารเคมี แรงขูดขีด สำหรับ Drag Chain',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
      },
      {
        slug: 'multiflex-cy',
        title: 'Multiflex CY : สายชีลด์รางกระดูกงู',
        code: 'MF-CY',
        shortDescription: 'สายชีลด์สำหรับรางกระดูกงู (Drag Chain) มีชีลด์กัน EMI ทนโค้งงอซ้ำๆ',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
      },
      {
        slug: 'multiflex-cp',
        title: 'Multiflex CP : สายรางกระดูกงูมีชีลด์ ทนน้ำมัน',
        code: 'MF-CP',
        shortDescription: 'สายรางกระดูกงูมีชีลด์ ฉนวน PUR ทนน้ำมัน/สารเคมี อนุกรมแม่เหล็กต่ำ',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
      },
      // --- Special ---
      {
        slug: 'ntscgewoeu',
        title: 'NTSCGEWOEU : สาย Cable Reel เหมือง',
        code: 'NTSCG',
        shortDescription: 'สายไฟสำหรับเหมือง Cable Reel ทนสภาพแวดล้อมรุนแรงที่สุด -40°C ถึง 60°C',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/NTSCGEWOEU.jpg',
      },
      {
        slug: 'robot-cable',
        title: 'Robot Welding Cable : สายหุ่นยนต์เชื่อม',
        code: 'ROBOT',
        shortDescription: 'สายไฟสำหรับหุ่นยนต์เชื่อม ทนแรงบิดซ้ำๆ ตัวนำฝอยละเอียดพิเศษ ทนความร้อนจากการเชื่อม',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/TORSIONRobot-Cable.jpg',
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
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFIBUS-Cable-1.jpg',
      },
      {
        slug: 'profibus-drag-chain',
        title: 'Profibus Drag Chain',
        code: 'PB-DC',
        shortDescription: 'สาย Profibus สำหรับรางกระดูกงู ตัวนำฝอยละเอียดพิเศษ ฉนวน PUR สีม่วง',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFIBUS-Cable-1.jpg',
      },
      {
        slug: 'profibus-outdoor',
        title: 'Profibus Outdoor',
        code: 'PB-OUT',
        shortDescription: 'สาย Profibus สำหรับภายนอกอาคาร ฉนวน PE ทน UV ความชื้น สภาพอากาศ',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFIBUS-Cable-1.jpg',
      },
      {
        slug: 'profibus-connector-90',
        title: 'Profibus Connector 90°',
        code: 'PB-CON90',
        shortDescription: 'หัวต่อ Profibus 90 องศา มี Terminating Resistor สำหรับพื้นที่จำกัด',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFIBUS-Cable-1.jpg',
      },
      {
        slug: 'profibus-connector-90pg',
        title: 'Profibus Connector 90° PG',
        code: 'PB-CON90PG',
        shortDescription: 'หัวต่อ Profibus 90 องศา + Cable Gland รัดสาย ทนแรงสั่นสะเทือน',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFIBUS-Cable-1.jpg',
      },
      {
        slug: 'profinet-type-a',
        title: 'Profinet Type A',
        code: 'PROFINET',
        shortDescription: 'สาย Profinet 100 Mbps สีเขียว Cat 5e มีชีลด์ สำหรับ Factory Automation',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFINET-Cable.jpg',
      },
      {
        slug: 'profinet-type-b',
        title: 'Profinet Type B',
        code: 'PN-TYPE-B',
        shortDescription: 'สาย Profinet Type B สำหรับ Industrial Ethernet ความเร็ว 100 Mbps',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFINET-Cable.jpg',
      },
      {
        slug: 'profinet-type-c',
        title: 'Profinet Type C',
        code: 'PN-TYPE-C',
        shortDescription: 'สาย Profinet Type C สำหรับ Industrial Ethernet ความเร็ว 100 Mbps',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFINET-Cable.jpg',
      },
      {
        slug: 'profinet-connector-180',
        title: 'Profinet Connector 180°',
        code: 'PN-CON180',
        shortDescription: 'หัวต่อ Profinet RJ45 แบบ 180 องศา ติดตั้งง่าย ไม่ต้องใช้เครื่องมือพิเศษ',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/PROFINET-Cable.jpg',
      },
      {
        slug: 'cc-link',
        title: 'CC-Link Cable',
        code: 'CC-LINK',
        shortDescription: 'สาย CC-Link สีฟ้า สำหรับระบบ CC-Link ของ Mitsubishi Factory Automation',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/CC-Link.jpg',
      },
      {
        slug: 'devicenet-thick',
        title: 'DeviceNet Thick',
        code: 'DN-THICK',
        shortDescription: 'สาย DeviceNet Thick สำหรับ Trunk Line ระยะสูงสุด 500 เมตร ส่งข้อมูล+ไฟ 24V',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/Device-Net-Thick.jpg',
      },
      {
        slug: 'devicenet-thin',
        title: 'DeviceNet Thin',
        code: 'DN-THIN',
        shortDescription: 'สาย DeviceNet Thin สำหรับ Drop Line ระยะ 6 เมตร อ่อนตัว เดินสายง่าย',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/Device-Net-Thick.jpg',
      },
      {
        slug: 'eib-bus-knx',
        title: 'EIB Bus / KNX Cable',
        code: 'KNX',
        shortDescription: 'สาย EIB/KNX สีเขียว สำหรับระบบอาคารอัจฉริยะ Smart Building',
        image: 'https://nyxcable.com/wp-content/uploads/2022/11/EIB-Bus.jpg',
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
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/SiF.jpg',
      },
      {
        slug: 'sif-gl',
        title: 'SiF-GL : สายทนความร้อน 200°C (ไฟเบอร์กลาส)',
        code: 'SIF-GL',
        shortDescription: 'สายฉนวนซิลิโคน+ไฟเบอร์กลาส ทนความร้อน 200°C สำหรับเตาอบ เตาหลอม',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/SiF.jpg',
      },
      {
        slug: 'siaf-ignition-wire',
        title: 'SIAF : สาย Ignition Wire',
        code: 'SIAF',
        shortDescription: 'สายฉนวนซิลิโคน ตัวนำเคลือบนิกเกิล สำหรับงานจุดระเบิดและอุณหภูมิสูงมาก',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/SiF.jpg',
      },
      {
        slug: 'sihf',
        title: 'SiHF : สายหลายคอร์ทนความร้อน 180°C',
        code: 'SIHF',
        shortDescription: 'สายหลายคอร์ฉนวนซิลิโคน ทน 180°C ทนน้ำมัน สำหรับเครื่องจักรความร้อนสูง',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/SiHF-SiHFC.jpg',
      },
      {
        slug: 'pfa-cable',
        title: 'PFA Cable : สายทนความร้อน 260°C',
        code: 'PFA',
        shortDescription: 'สายฉนวน PFA ทนความร้อนสูงสุด 260°C ทนสารเคมีได้ยอดเยี่ยม',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/260C-SC-MC.jpg',
      },
      {
        slug: 'ptfe-cable',
        title: 'PTFE Cable : สายทนความร้อน 260°C',
        code: 'PTFE',
        shortDescription: 'สายฉนวน PTFE (Teflon) ทนความร้อนสูง 260°C ทนสารเคมีทุกชนิด',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/260C-SC-MC.jpg',
      },
      {
        slug: 'etfe-cable',
        title: 'ETFE Cable : สายทนความร้อน 200°C',
        code: 'ETFE',
        shortDescription: 'สายฉนวน ETFE ทนความร้อน 200°C ทนสารเคมี แรงกระแทก รังสี',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/260C-SC-MC.jpg',
      },
      {
        slug: 'fep-cable',
        title: 'FEP Cable : สายทนความร้อน 200°C',
        code: 'FEP',
        shortDescription: 'สายฉนวน FEP ทนความร้อน 200°C ใสโปร่งใส ทนสารเคมี สำหรับงานอาหารและยา',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/260C-SC-MC.jpg',
      },
      {
        slug: 'thermocouple-type-k-cable',
        title: 'Thermocouple Type K Cable',
        code: 'TYPE-K',
        shortDescription: 'สาย Thermocouple Type K วัดอุณหภูมิ -200°C ถึง 1,260°C ตัวนำ Chromel-Alumel',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/Therm-Type-K.jpg',
      },
      {
        slug: 'y11y-jz',
        title: 'Y11Y-JZ : สายทนน้ำมัน PUR',
        code: 'Y11Y-JZ',
        shortDescription: 'สายคอนโทรลฉนวน PUR ทนน้ำมัน สารเคมี 500V 80°C ฝังดินได้',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
      },
      {
        slug: 'yc11y-jz',
        title: 'YC11Y-JZ : สายทนน้ำมัน PUR มีชีลด์',
        code: 'YC11Y-JZ',
        shortDescription: 'สายคอนโทรลฉนวน PUR มีชีลด์ ทนน้ำมัน สารเคมี 500V 80°C ฝังดินได้',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/YC11Y-JZ.jpg',
      },
      {
        slug: 'h07rn-f',
        title: 'H07RN-F : สายไฟกันน้ำ (ทนสารเคมี)',
        code: 'H07RN-F',
        shortDescription: 'สายไฟฉนวนยาง กันน้ำ ทนน้ำมัน สารเคมี แรงกระแทก EPR+Neoprene 450/750V',
        image: 'https://nyxcable.com/wp-content/uploads/2019/04/H07RN-F.jpg',
      },
    ],
  },
}
