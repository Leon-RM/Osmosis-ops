import type { QuizQuestion } from '../types/game';

export const RAW_QUIZ_QUESTIONS: QuizQuestion[] = [
  // ----------------------------------------------------
  // SECTION 1: GLOMERULUS & ULTRAFILTRATION
  // ----------------------------------------------------
  {
    id: 'q_glom_1',
    category: 'Glomerulus',
    question: 'โครงสร้างใดของหน่วยไต (Nephron) ทำหน้าที่กรองสารขั้นแรก (Ultrafiltration) โดยอาศัยแรงดันเลือดสูง?',
    choices: [
      'Glomerulus ร่วมกับ Bowman\'s Capsule',
      'Loop of Henle (ห่วงเฮนเล)',
      'Collecting Duct (ท่อรวม)',
      'Ureter (ท่อไต)'
    ],
    correctIndex: 0,
    explanation: 'Glomerulus เป็นกระจุกหลอดเลือดฝอยใน Bowman\'s Capsule ที่มีแรงดันเลือดสูง กรองน้ำ ไอออน และโมเลกุลเล็กเข้าสู่ท่อหน่วยไต',
    statReward: { hydration: 10, sodium: 5 }
  },
  {
    id: 'q_glom_2',
    category: 'Glomerulus',
    question: 'สารใดต่อไปนี้ในภาวะปกติ **ไม่สามารถ** กรองผ่าน Glomerulus เข้าสู่ Bowman\'s capsule ได้?',
    choices: [
      'เม็ดเลือดแดง และโปรตีนขนาดใหญ่ (เช่น Albumin)',
      'กลูโคส (Glucose) และกรดอะมิโน',
      'ยูเรีย และน้ำ',
      'โซเดียมไอออน (Na⁺)'
    ],
    correctIndex: 0,
    explanation: 'เยื่อกรองที่ Glomerulus และเซลล์ Podocyte มีรูพรุนและประจุลบ ป้องกันไม่ให้เม็ดเลือดแดงและโปรตีนขนาดใหญ่รั่วไหลออกมา',
    statReward: { hydration: 5, sodium: 10 }
  },
  {
    id: 'q_glom_3',
    category: 'Glomerulus',
    question: 'หากความดันโลหิตในหลอดเลือด Renal Artery ลดลงอย่างรุนแรง อัตราการกรองของเสียที่ไต (GFR) จะเป็นอย่างไร?',
    choices: [
      'อัตราการกรอง (GFR) จะลดลง',
      'อัตราการกรอง (GFR) จะเพิ่มขึ้นเป็นสองเท่า',
      'ไม่มีการเปลี่ยนแปลงใดๆ',
      'ไตจะหยุดขับถ่ายปัสสาวะถาวรทันที'
    ],
    correctIndex: 0,
    explanation: 'แรงดันการกรองขึ้นอยู่กับแรงดันเลือดใน Glomerulus หากความดันตก อัตราการกรอง (GFR) จะลดลง ไตจะกระตุ้นระบบ RAAS เพื่อกู้ความดัน',
    statReward: { hydration: 10, sodium: 10 }
  },
  {
    id: 'q_glom_4',
    category: 'Glomerulus',
    question: 'เซลล์ชนิดใดที่ห่อหุ้มหลอดเลือดฝอย Glomerulus และมีแขนงคล้ายนิ้วเท้าทำหน้าที่เป็นเยื่อกรองละเอียด?',
    choices: [
      'Podocytes (โพโดไซต์)',
      'Macula Densa (มาคูลาเดนซา)',
      'Juxtaglomerular cells',
      'Intercalated cells'
    ],
    correctIndex: 0,
    explanation: 'Podocytes มี Foot processes ประสานกันเกิดเป็น Filtration slits ขนาด 25-30 nm ทำหน้าที่เป็นด่านกรองโมเลกุลโปรตีน',
    statReward: { hydration: 10, sodium: 5 }
  },

  // ----------------------------------------------------
  // SECTION 2: PROXIMAL CONVOLUTED TUBULE (PCT)
  // ----------------------------------------------------
  {
    id: 'q_pct_1',
    category: 'Proximal Tubule',
    question: 'บริเวณท่อขดส่วนต้น (PCT) มีการดูดกลับสารจำเป็น เช่น กลูโคสและกรดอะมิโน ในปริมาณเท่าใด?',
    choices: [
      'ดูดกลับเกือบ 100% สมบูรณ์',
      'ดูดกลับประมาณ 10%',
      'ไม่มีการดูดกลับเลย แต่ทำหน้าที่ขับออก',
      'ดูดกลับเฉพาะเมื่อร่างกายขาดน้ำตาลเท่านั้น'
    ],
    correctIndex: 0,
    explanation: 'PCT มีโปรตีนขนส่งร่วม (เช่น SGLT) ดูดกลับกลูโคสและกรดอะมิโนเกือบ 100% รวมถึงดูดน้ำและเกลือแร่กลับประมาณ 65%',
    statReward: { hydration: 10, sodium: 10 }
  },
  {
    id: 'q_pct_2',
    category: 'Proximal Tubule',
    question: 'ลักษณะโครงสร้างเด่นของเซลล์บุผิวบริเวณท่อขดส่วนต้น (PCT) ที่ช่วยเพิ่มประสิทธิภาพในการดูดกลับสารคือข้อใด?',
    choices: [
      'มี Microvilli จำนวนมาก (Brush border) และมี Mitochondria สูง',
      'เป็นเซลล์ผนังหนาไม่มีช่องเปิด',
      'มีผนังเป็นไขมันกันน้ำซึมผ่าน',
      'มีซิเลียพัดโบกของเสียออกสู่ท่อปัสสาวะ'
    ],
    correctIndex: 0,
    explanation: 'Microvilli ช่วยเพิ่มพื้นที่ผิวในการดูดกลับสาร และ Mitochondria สร้าง ATP สำหรับ Active Transport ปั๊ม Na⁺ กลับเข้าสู่เลือด',
    statReward: { hydration: 10, sodium: 5 }
  },
  {
    id: 'q_pct_3',
    category: 'Proximal Tubule',
    question: 'หากพบกลูโคสปะปนในน้ำปัสสาวะ (Glucosuria) มักเกิดจากสาเหตุใด?',
    choices: [
      'ระดับกลูโคสในเลือดสูงเกินขีดจำกัดการดูดกลับของท่อไต (Renal threshold)',
      'ต่อมหมวกไตหลั่ง Aldosterone มากเกินไป',
      'ท่อรวม Collecting duct ไม่ยอมดูดน้ำกลับ',
      'เซลล์เม็ดเลือดแดงแตกตัวในหลอดเลือด'
    ],
    correctIndex: 0,
    explanation: 'เมื่อระดับน้ำตาลในเลือดเกิน ~180 mg/dL โปรตีนตัวพา SGLT ที่ PCT จะทำงานเต็มขีดจำกัด (Tm) ทำให้น้ำตาลส่วนเกินหลุดออกมาในปัสสาวะ พบในผู้ป่วยเบาหวาน',
    statReward: { hydration: 10, sodium: 10 }
  },

  // ----------------------------------------------------
  // SECTION 3: LOOP OF HENLE & COUNTERCURRENT
  // ----------------------------------------------------
  {
    id: 'q_henle_1',
    category: 'Loop of Henle',
    question: 'ห่วงเฮนเลขาลง (Descending Limb) มีคุณสมบัติพิเศษในการรักษาสมดุลน้ำอย่างไร?',
    choices: [
      'ยอมให้น้ำซึมผ่านออกโดย Osmosis ได้ดี แต่ไม่ยอมให้โซเดียมผ่าน',
      'ปั๊มโซเดียมออกอย่างรวดเร็ว แต่กันน้ำไม่ให้ออก',
      'ไม่ยอมให้น้ำและเกลือผ่านออกเลย',
      'ดูดกลับสารอาหารพวกโปรตีนและไขมัน'
    ],
    correctIndex: 0,
    explanation: 'Descending Limb มีช่อง Aquaporins จำนวนมาก ยอมให้น้ำแพร่ออกสู่เนื้อเยื่อไตชั้นในที่มีความเข้มข้นสูง ของเหลวในท่อจึงเข้มข้นขึ้น',
    statReward: { hydration: 15, sodium: 0 }
  },
  {
    id: 'q_henle_2',
    category: 'Loop of Henle',
    question: 'ห่วงเฮนเลขาขึ้น (Ascending Limb) มีการลำเลียงสารอย่างไรเพื่อสร้างเกรเดียนต์ความเข้มข้นในเนื้อไตชั้น Medulla?',
    choices: [
      'ปั๊มไอออน Na⁺, K⁺, 2Cl⁻ ออกจากท่อไต แต่ผนังท่อกันน้ำซึมผ่าน',
      'ยอมให้น้ำซึมออกอย่างเดียว',
      'ดูดน้ำตาลกลูโคสกลับเข้ากระแสเลือด',
      'ขับกรดยูริกออกจากร่างกาย'
    ],
    correctIndex: 0,
    explanation: 'Ascending Limb ไม่ยอมให้น้ำผ่าน แต่ใช้โปรตีนปั๊มเกลือ Na⁺-K⁺-2Cl⁻ ออกสู่ Medulla ทำให้ของเหลวในท่อเจือจางลง (Diluting segment)',
    statReward: { hydration: 0, sodium: 15 }
  },
  {
    id: 'q_henle_3',
    category: 'Loop of Henle',
    question: 'กลไกกระแสตรงกันข้าม (Countercurrent Multiplier) ในห่วงเฮนเลมีประโยชน์หลักต่อร่างกายอย่างไร?',
    choices: [
      'สร้างระดับความเข้มข้นสูงในชั้น Medulla เพื่อช่วยในการดูดน้ำกลับที่ท่อรวม',
      'ป้องกันไม่ให้ไตทำงานหนักเกินไป',
      'ทำลายเชื้อแบคทีเรียในน้ำปัสสาวะ',
      'ลดอุณหภูมิของเลือดที่ไหลผ่านไต'
    ],
    correctIndex: 0,
    explanation: 'Countercurrent Multiplier สร้างความเข้มข้นสูงใน Medulla (สูงสุดถึง 1200 mOsm) ช่วยให้ท่อรวมสามารถดูดน้ำกลับได้ดีเมื่อมี ADH',
    statReward: { hydration: 10, sodium: 10 }
  },
  {
    id: 'q_henle_4',
    category: 'Loop of Henle',
    question: 'สัตว์เลี้ยงลูกด้วยนมในทะเลทราย เช่น หนูจิงโจ้ (Kangaroo Rat) มักมีห่วงเฮนเลลักษณะใดเพื่อลดการสูญเสียน้ำ?',
    choices: [
      'มี Loop of Henle ที่ยาวมาก ทอดลึกเข้าไปใน Medulla ชั้นในสุด',
      'ไม่มี Loop of Henle เลย',
      'มี Loop of Henle สั้นและกว้าง',
      'มีเฉพาะส่วน Glomerulus ขนาดใหญ่'
    ],
    correctIndex: 0,
    explanation: 'ห่วงเฮนเลที่ยาวมากช่วยสร้างแรงดันออสโมติกเข้มข้นสูงยิ่งยวดใน Medulla ทำให้สามารถดูดน้ำกลับคืนสู่ร่างกายได้มากที่สุดและขับปัสสาวะเข้มข้นจัด',
    statReward: { hydration: 15, sodium: 10 }
  },

  // ----------------------------------------------------
  // SECTION 4: DISTAL TUBULE & COLLECTING DUCT (HORMONES)
  // ----------------------------------------------------
  {
    id: 'q_hormone_1',
    category: 'Distal Tubule & Collecting Duct',
    question: 'เมื่อร่างกายขาดน้ำ (Dehydration) ฮอร์โมน ADH จะส่งผลอย่างไรต่อท่อรวม (Collecting Duct)?',
    choices: [
      'กระตุ้นการแทรกช่องโปรตีน Aquaporin-2 เพื่อดูดน้ำกลับเข้ากระแสเลือด',
      'ยับยั้งการกรองที่ Glomerulus',
      'ขับน้ำออกทางปัสสาวะมากขึ้นเพื่อระบายความร้อน',
      'สั่งสลายไขมันในร่างกายเพื่อผลิตน้ำ'
    ],
    correctIndex: 0,
    explanation: 'ADH กระตุ้นให้ถุงบรรจุ Aquaporin-2 หลอมรวมกับเยื่อหุ้มเซลล์ท่อรวม น้ำจึงถูกดูดกลับอย่างรวดเร็ว ปัสสาวะมีปริมาณน้อยและเข้มข้น',
    statReward: { hydration: 20, sodium: 0 }
  },
  {
    id: 'q_hormone_2',
    category: 'Distal Tubule & Collecting Duct',
    question: 'ฮอร์โมน Aldosterone หลั่งจากต่อมหมวกไตชั้นนอก มีหน้าที่สำคัญคือข้อใด?',
    choices: [
      'สั่งท่อขดส่วนปลาย (DCT) ดูดกลับโซเดียม (Na⁺) และขับโพแทสเซียม (K⁺) ออก',
      'สั่งย่อยสลายโปรตีนในเลือด',
      'ลดระดับน้ำตาลในกระแสเลือด',
      'กระตุ้นการขับน้ำออกจากไต'
    ],
    correctIndex: 0,
    explanation: 'Aldosterone เพิ่มจำนวน Na⁺/K⁺ ATPase ปั๊มโซเดียมกลับเข้าเลือด ช่วยเพิ่มปริมาตรเลือดและความดันโลหิต',
    statReward: { hydration: 0, sodium: 15 }
  },
  {
    id: 'q_hormone_3',
    category: 'Distal Tubule & Collecting Duct',
    question: 'เมื่อร่างกายมีโซเดียมสูงหรือความดันโลหิตสูงเกินไป หัวใจจะหลั่งฮอร์โมนใดเพื่อกระตุ้นให้ไตขับโซเดียมและน้ำออก?',
    choices: [
      'ANP (Atrial Natriuretic Peptide)',
      'ADH (Vasopressin)',
      'Renin (เรนิน)',
      'Angiotensin II'
    ],
    correctIndex: 0,
    explanation: 'ANP หลั่งจากหัวใจห้องบนเมื่อผนังหัวใจตึงตัวจากความดันสูง มีฤทธิ์ตรงข้ามกับ Aldosterone โดยสั่งให้ไตขับโซเดียมและน้ำออกเพื่อลดความดัน',
    statReward: { hydration: -10, sodium: -15 }
  },
  {
    id: 'q_hormone_4',
    category: 'Distal Tubule & Collecting Duct',
    question: 'ยาขับปัสสาวะ (Diuretic) ส่วนใหญ่ออกฤทธิ์อย่างไรในการลดภาวะบวมน้ำหรือลดความดันโลหิต?',
    choices: [
      'ยับยั้งการดูดกลับโซเดียมและน้ำที่ท่อไต ทำให้ไตขับน้ำออกทางปัสสาวะมากขึ้น',
      'เพิ่มการผลิตเม็ดเลือดแดงในไต',
      'สั่งให้หัวใจเต้นเร็วขึ้น',
      'ทำลายเซลล์ท่อหน่วยไต'
    ],
    correctIndex: 0,
    explanation: 'Diuretic ยับยั้งตัวขนส่งไอออนที่ท่อไต น้ำจึงไม่ถูกดูดกลับและถูกขับออกทางปัสสาวะ ช่วยลดปริมาณน้ำเกินในร่างกาย',
    statReward: { hydration: -15, sodium: -5 }
  },
  {
    id: 'q_hormone_5',
    category: 'Distal Tubule & Collecting Duct',
    question: 'เอนไซม์ Renin (เรนิน) ถูกหลั่งมาจากเซลล์ Juxtaglomerular เมื่อเกิดสภาวะใดในร่างกาย?',
    choices: [
      'เมื่อความดันโลหิตต่ำ หรือปริมาณโซเดียมที่ไหลผ่านไตลดลง',
      'เมื่อดื่มน้ำมากเกินไป',
      'เมื่อระดับน้ำตาลในเลือดสูงผิดปกติ',
      'เมื่อร่างกายมีไข้สูง'
    ],
    correctIndex: 0,
    explanation: 'Renin เปลี่ยน Angiotensinogen ให้เป็น Angiotensin I ก่อนเปลี่ยนเป็น Angiotensin II เพื่อกระตุ้น Aldosterone และหลอดเลือดหดตัวเพิ่มความดัน',
    statReward: { hydration: 5, sodium: 15 }
  },

  // ----------------------------------------------------
  // SECTION 5: CLINICAL & REAL-WORLD SCENARIOS
  // ----------------------------------------------------
  {
    id: 'q_homeo_1',
    category: 'General',
    question: 'เมื่อออกกำลังกายกลางแดดและเสียเหงื่อเป็นจำนวนมาก กลไกใดจะเกิดขึ้นเพื่อรักษาสมดุลน้ำ?',
    choices: [
      'Hypothalamus สั่งหลั่ง ADH เพิ่มขึ้น และกระตุ้นศูนย์กระหายน้ำ (Thirst center)',
      'ไตจะขับปัสสาวะใสและเจือจางปริมาณมาก',
      'หัวใจหลั่ง ANP เพื่อขับน้ำออก',
      'ร่างกายหยุดการทำงานของไตชั่วคราว'
    ],
    correctIndex: 0,
    explanation: 'การเสียเหงื่อทำให้ Osmolarity ในเลือดสูงขึ้น Hypothalamus จึงหลั่ง ADH ดูดน้ำกลับ และทำให้เรารู้สึกกระหายน้ำเพื่อดื่มน้ำชดเชย',
    statReward: { hydration: 15, sodium: 5 }
  },
  {
    id: 'q_homeo_2',
    category: 'General',
    question: 'หากดื่มน้ำเปล่าบริสุทธิ์ในปริมาณมากเกินไปในเวลาอันสั้น (Water Intoxication) ร่างกายจะตอบสนองอย่างไร?',
    choices: [
      'ยับยั้งการหลั่ง ADH ทำให้ไตขับปัสสาวะปริมาณมากและเจือจาง',
      'หลั่ง ADH เพิ่มขึ้นเพื่อกักเก็บน้ำไว้',
      'หลั่ง Aldosterone เพิ่มขึ้นเพื่อดูดน้ำกลับ',
      'ไตจะขับเฉพาะโซเดียมออกโดยไม่ขับน้ำ'
    ],
    correctIndex: 0,
    explanation: 'น้ำในเลือดที่มากเกินไปทำให้ความเข้มข้นเลือดเจือจาง สมองจะยับยั้ง ADH ทำให้ท่อรวมไม่ดูดน้ำกลับ และขับปัสสาวะเจือจางออกมาปริมาณมาก',
    statReward: { hydration: -15, sodium: 0 }
  },
  {
    id: 'q_homeo_3',
    category: 'General',
    question: 'โรคเบาจืด (Diabetes Insipidus) เกิดจากความผิดปกติใดของระบบรักษาสมดุลน้ำในร่างกาย?',
    choices: [
      'ร่างกายขาดฮอร์โมน ADH หรือท่อไตไม่ตอบสนองต่อ ADH ทำให้ปัสสาวะบ่อยและมาก',
      'ร่างกายผลิตอินซูลินไม่ได้ น้ำตาลในเลือดจึงสูง',
      'ไตไม่ยอมกรองของเสียออกจากกระแสเลือด',
      'ต่อมหมวกไตผลิต Aldosterone มากเกินไป'
    ],
    correctIndex: 0,
    explanation: 'เบาจืดเกิดจากการขาด ADH หรือหน่วยไตไม่ตอบสนองต่อ ADH ทำให้ไม่สามารถดูดน้ำกลับได้ ผู้ป่วยจึงปัสสาวะออกวันละ 10-20 ลิตรและกระหายน้ำตลอดเวลา',
    statReward: { hydration: 15, sodium: 5 }
  },
  {
    id: 'q_homeo_4',
    category: 'General',
    question: 'การดื่มเครื่องดื่มที่มีแอลกอฮอล์หรือคาเฟอีน ทำให้ปัสสาวะบ่อยขึ้นเนื่องจากสาเหตุใด?',
    choices: [
      'แอลกอฮอล์และคาเฟอีนมีฤทธิ์ยับยั้งการหลั่งฮอร์โมน ADH จากต่อมใต้สมอง',
      'แอลกอฮอล์เพิ่มการทำงานของ Aldosterone',
      'ไตดูดซึมแอลกอฮอล์เป็นพลังงานแทนน้ำตาล',
      'กระเพาะปัสสาวะหดตัวเร็วขึ้น'
    ],
    correctIndex: 0,
    explanation: 'แอลกอฮอล์ยับยั้งการหลั่ง ADH ทำให้ท่อไตไม่ดูดน้ำกลับ ร่างกายจึงสูญเสียน้ำทางปัสสาวะมากและอาจเกิดอาการขาดน้ำ (Hangover) ในวันรุ่งขึ้น',
    statReward: { hydration: -10, sodium: 5 }
  },
  {
    id: 'q_homeo_5',
    category: 'General',
    question: 'ในคนที่มีสุขภาพปกติ ค่าความดันโลหิตและสมดุลกรด-ด่าง (pH) ถูกควบคุมร่วมกันโดยอวัยวะคู่สำคัญใด?',
    choices: [
      'ไต (Kidneys) และ ปอด (Lungs)',
      'กระเพาะอาหาร และ ตับอ่อน',
      'ม้าม และ ต่อมไทมัส',
      'ลำไส้เล็ก และ ถุงน้ำดี'
    ],
    correctIndex: 0,
    explanation: 'ปอดควบคุมการระบาย CO₂ (กรดระเหยได้) ส่วนไตควบคุมการดูดกลับและสร้าง HCO₃⁻ (ไบคาร์บอเนต) และขับ H⁺ ออก ทั้งคู่ทำงานร่วมกันรักษา pH 7.35-7.45',
    statReward: { hydration: 10, sodium: 10 }
  },
  {
    id: 'q_homeo_6',
    category: 'General',
    question: 'สารใดที่ไตสร้างขึ้นเพื่อกระตุ้นไขกระดูกให้สร้างเม็ดเลือดแดงเพิ่มขึ้นเมื่อร่างกายขาดออกซิเจน?',
    choices: [
      'Erythropoietin (EPO)',
      'Thrombopoietin',
      'Calcitriol (Active Vitamin D)',
      'Glucagon'
    ],
    correctIndex: 0,
    explanation: 'Erythropoietin (EPO) สร้างจากเซลล์ Fibroblast ในไตเพื่อตอบสนองต่อภาวะ Hypoxia กระตุ้นการสร้างเม็ดเลือดแดงในไขกระดูก',
    statReward: { hydration: 10, sodium: 5 }
  }
];

// Helper to shuffle choices and return a dynamically randomized question
export function getRandomizedQuizQuestion(question: QuizQuestion): QuizQuestion {
  const choices = [...question.choices];
  const correctChoiceText = choices[question.correctIndex];

  // Fisher-Yates shuffle choices
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  const newCorrectIndex = choices.indexOf(correctChoiceText);
  const prefixes = ['ก) ', 'ข) ', 'ค) ', 'ง) '];

  return {
    ...question,
    choices: choices.map((c, idx) => `${prefixes[idx]}${c.replace(/^[ก-ง]\)\s*/, '')}`),
    correctIndex: newCorrectIndex
  };
}

export const QUIZ_QUESTIONS = RAW_QUIZ_QUESTIONS;
