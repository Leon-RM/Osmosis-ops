import type { BoardTile } from '../types/game';

export const BASE_BOARD_TILES: BoardTile[] = [
  // SECTION 1: Glomerulus (Tiles 1-5) - RED / START ZONE
  {
    tileId: 1,
    section: 'Glomerulus',
    sectionColor: '#ef4444',
    name: 'Glomerular Capsule Start',
    description: 'จุดปล่อยตัวสารพลาสม่าผ่านกลุ่มหลอดเลือดฝอย Glomerulus เข้าสู่ Bowman\'s Capsule',
    effect: 'เริ่มต้นการเดินทางด้วยสมดุลน้ำ 50% และโซเดียม 50%',
    effectType: 'start',
    icon: 'Activity',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 2,
    section: 'Glomerulus',
    sectionColor: '#ef4444',
    name: 'High Blood Pressure Filter',
    description: 'ความดันเลือดในหลอดเลือดฝอยไตสูงขึ้น เร่งการกรองสารโมเลกุลเล็ก',
    effect: 'สูญเสียน้ำออกจากท่อกรอง (-5 Hydration)',
    effectType: 'resource',
    icon: 'Flame',
    statChange: { hydration: -5, sodium: 0 }
  },
  {
    tileId: 3,
    section: 'Glomerulus',
    sectionColor: '#ef4444',
    name: 'Ultrafiltration Zone',
    description: 'การกรองละเอียด (Ultrafiltration) แยกสารอาหาร น้ำ และเกลือออกจากเม็ดเลือด',
    effect: 'ตอบคำถามชีววิทยาชิงโบนัสปรับสมดุล',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 4,
    section: 'Glomerulus',
    sectionColor: '#ef4444',
    name: 'Bowman\'s Secretion',
    description: 'ของเหลวที่ผ่านการกรอง (Filtrate) เคลื่อนตัวเข้าสู่ทางเดินท่อไตส่วนต้น',
    effect: 'รับการ์ดฮอร์โมนสุ่ม 1 ใบ (ADH หรือ Aldosterone)',
    effectType: 'hormone',
    icon: 'Gift',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 5,
    section: 'Glomerulus',
    sectionColor: '#ef4444',
    name: 'Glomerular Exit Gate',
    description: 'ด่านตรวจสุดท้ายก่อนเข้าสู่ท่อขดส่วนต้น เตรียมพร้อมดูดสารกลับ',
    effect: 'รักษาความชุ่มชื้น (+5 Hydration)',
    effectType: 'resource',
    icon: 'ShieldCheck',
    statChange: { hydration: 5, sodium: 0 }
  },

  // SECTION 2: Proximal Tubule (Tiles 6-15) - ORANGE / REABSORPTION ZONE
  {
    tileId: 6,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Proximal Convoluted Entrance',
    description: 'ท่อขดส่วนต้น (PCT) เป็นจุดดูดกลับสารจำเป็นมากที่สุดถึง 65% ของร่างกาย',
    effect: 'ดูดกลับสารอาหารและน้ำ (+5 Hydration, +5 Sodium)',
    effectType: 'resource',
    icon: 'RefreshCw',
    statChange: { hydration: 5, sodium: 5 }
  },
  {
    tileId: 7,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Glucose & Na+ Active Transport',
    description: 'ปั๊มสารอาหาร กลูโคส และไอออนโซเดียมกลับเข้าสู่กระแสเลือดโดยใช้พลังงาน ATP',
    effect: 'รับการ์ดฮอร์โมน 1 ใบ',
    effectType: 'hormone',
    icon: 'Zap',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 8,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Proximal Quiz Challenge',
    description: 'ท้าประลองความรู้เรื่องการดูดกลับสารที่ Proximal Convoluted Tubule',
    effect: 'ตอบคำถามถูกต้องรับโบนัสค่าสมดุล',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 9,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Osmotic Gradient Shift',
    description: 'น้ำเคลื่อนที่ตามโซเดียมออกมาด้วยกระบวนการ Osmosis อย่างต่อเนื่อง',
    effect: 'ดูดกลับน้ำและเกลือ (+10 Hydration, +5 Sodium)',
    effectType: 'resource',
    icon: 'TrendingUp',
    statChange: { hydration: 10, sodium: 5 }
  },
  {
    tileId: 10,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'H+ Secretion Point',
    description: 'หลั่งไฮโดรเจนไอออน (H+) ออกสู่ปัสสาวะเพื่อรักษาระดับ pH กรด-ด่างในเลือด',
    effect: 'รับการ์ดฮอร์โมน 1 ใบ',
    effectType: 'hormone',
    icon: 'Layers',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 11,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Amino Acid Reabsorption',
    description: 'กรดอะมิโนที่เป็นประโยชน์ทั้งหมด 100% ถูกดูดกลับเข้าสู่กระแสเลือดอย่างสมบูรณ์',
    effect: 'เพิ่มพลังสมดุลเกลือแร่ (+10 Sodium)',
    effectType: 'resource',
    icon: 'Award',
    statChange: { hydration: 0, sodium: 10 }
  },
  {
    tileId: 12,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Microvilli Speed Track',
    description: 'ผิวเซลล์บุผนังท่อไตมี Microvilli ช่วยเพิ่มพื้นที่ผิวในการดูดซึมสารได้อย่างรวดเร็ว',
    effect: 'ตอบคำถามวิทยาศาสตร์ชิงคะแนน',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 13,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Bicarbonate Buffer Recovery',
    description: 'การดูดกลับไบคาร์บอเนต (HCO3-) เพื่อช่วยปรับสมดุลกรดด่างและของเหลว',
    effect: 'เติมความชุ่มชื้น (+10 Hydration)',
    effectType: 'resource',
    icon: 'Droplet',
    statChange: { hydration: 10, sodium: 0 }
  },
  {
    tileId: 14,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'Peritubular Capillary Exchange',
    description: 'หลอดเลือดฝอยรอบท่อไตดูดซึมของเหลวกลับเข้าสู่ระบบไหลเวียนโลหิตส่วนกลาง',
    effect: 'รับการ์ดฮอร์โมนสุ่ม 1 ใบ',
    effectType: 'hormone',
    icon: 'Compass',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 15,
    section: 'Proximal Tubule',
    sectionColor: '#f97316',
    name: 'PCT Canyon Exit',
    description: 'สิ้นสุดท่อขดส่วนต้น เตรียมทิ้งดิ่งลงสู่ห่วงเฮนเลในชั้นไตชั้นใน (Renal Medulla)',
    effect: 'ปรับสมดุลก่อนลงหุบเขา (+5 Hydration, +5 Sodium)',
    effectType: 'resource',
    icon: 'ArrowDownRight',
    statChange: { hydration: 5, sodium: 5 }
  },

  // SECTION 3: Loop of Henle (Tiles 16-25) - YELLOW / COUNTERCURRENT ZONE
  {
    tileId: 16,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Descending Limb Entrance',
    description: 'ขาลงของห่วงเฮนเล ยอมให้น้ำออสโมซิสออกได้ดีมาก แต่ไม่ยอมให้เกลือผ่าน',
    effect: 'สูญเสียน้ำออกจากท่อ (-10 Hydration)',
    effectType: 'henle_even',
    icon: 'Droplet',
    statChange: { hydration: -10, sodium: 0 }
  },
  {
    tileId: 17,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Hypertonic Medulla Zone',
    description: 'เนื้อเยื่อ Medulla มีความเค็มเข้มข้นสูงมาก ดึงโมเลกุลน้ำและเกลือออกจากของเหลว',
    effect: 'สูญเสียโซเดียม (-10 Sodium)',
    effectType: 'henle_odd',
    icon: 'Percent',
    statChange: { hydration: 0, sodium: -10 }
  },
  {
    tileId: 18,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Aquaporin Channel Cascade',
    description: 'ท่อน้ำ Aquaporin ในขาลงระบายน้ำออกอย่างรวดเร็วเพื่อสร้างความเข้มข้นสูงสุด',
    effect: 'สูญเสียน้ำออกจากท่อ (-10 Hydration)',
    effectType: 'henle_even',
    icon: 'Droplet',
    statChange: { hydration: -10, sodium: 0 }
  },
  {
    tileId: 19,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Hairpin Loop Bend Quiz',
    description: 'จุดโค้งตัวยู (Hairpin Turn) ลึกที่สุดในเนื้อไตชั้นใน ของเหลวเข้มข้นถึง 1,200 mOsm!',
    effect: 'ตอบคำถามทบทวน Countercurrent Multiplier',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 20,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Ascending Limb Entrance',
    description: 'ขาขึ้นของห่วงเฮนเล ทึบต่อน้ำ (น้ำออกไม่ได้) แต่ปั๊มเกลือโซเดียมออกอย่างหนัก',
    effect: 'สูญเสียน้ำ (-10 Hydration)',
    effectType: 'henle_even',
    icon: 'Droplet',
    statChange: { hydration: -10, sodium: 0 }
  },
  {
    tileId: 21,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Thin Ascending Na+ Diffusion',
    description: 'ส่วนบางของขาขึ้น ยอมให้โซเดียมแพร่ออกตามความแตกต่างความเข้มข้น',
    effect: 'สูญเสียโซเดียม (-10 Sodium)',
    effectType: 'henle_odd',
    icon: 'Percent',
    statChange: { hydration: 0, sodium: -10 }
  },
  {
    tileId: 22,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Thick Ascending Na-K-2Cl Pump',
    description: 'ปั๊มร่วม Na-K-2Cl ขับเกลือโซเดียมและคลอไรด์ออกสู่เนื้อเยื่อไตอย่างรวดเร็ว',
    effect: 'สูญเสียน้ำ (-10 Hydration)',
    effectType: 'henle_even',
    icon: 'Droplet',
    statChange: { hydration: -10, sodium: 0 }
  },
  {
    tileId: 23,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Countercurrent Multiplier Peak',
    description: 'กลไกกระแสตรงกันข้ามช่วยรักษาเกลือในเนื้อไต ทำให้ร่างกายกักเก็บน้ำได้ยามจำเป็น',
    effect: 'สูญเสียโซเดียม (-10 Sodium)',
    effectType: 'henle_odd',
    icon: 'Percent',
    statChange: { hydration: 0, sodium: -10 }
  },
  {
    tileId: 24,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Henle Exit Checkpoint',
    description: 'จุดสิ้นสุดห่วงเฮนเล ของเหลวเริ่มเจือจางลงและเข้าสู่ท่อขดส่วนปลาย',
    effect: 'ตอบคำถามชีววิทยาเพื่อรับการ์ดฮอร์โมนเพิ่มเติม',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 25,
    section: 'Loop of Henle',
    sectionColor: '#eab308',
    name: 'Macula Densa Sensor Hub',
    description: 'กลุ่มเซลล์ Macula Densa ตรวจวัดระดับความเค็มโซเดียมเพื่อสั่งการต่อมหมวกไต',
    effect: 'สูญเสียโซเดียม (-10 Sodium)',
    effectType: 'henle_odd',
    icon: 'Percent',
    statChange: { hydration: 0, sodium: -10 }
  },

  // SECTION 4: Distal Tubule & Collecting Duct (Tiles 26-35) - GREEN / HORMONE ZONE
  {
    tileId: 26,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Distal Convoluted Tubule Entrance',
    description: 'ท่อขดส่วนปลาย (DCT) เป็นจุดออกฤทธิ์หลักของฮอร์โมน Aldosterone จากต่อมหมวกไต',
    effect: 'รับการ์ดฮอร์โมนฟรี 1 ใบ',
    effectType: 'hormone',
    icon: 'Sparkles',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 27,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Aldosterone Reabsorption Zone',
    description: 'Aldosterone กระตุ้นเซลล์ท่อไตให้ดูดโซเดียมกลับ และขับโพแทสเซียมออก',
    effect: 'รับการ์ดฮอร์โมน หรือเพิ่มสมดุลโซเดียม',
    effectType: 'hormone',
    icon: 'Zap',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 28,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Hormone Regulation Quiz',
    description: 'ทดสอบความรู้เกี่ยวกับการทำงานร่วมกันของฮอร์โมน ADH และ Aldosterone',
    effect: 'ตอบคำถามรับโบนัสปรับสมดุลทันที',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 29,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Collecting Duct Junction',
    description: 'ท่อรวม (Collecting Duct) จุดรับของเหลวจากหลายหน่วยไต ออกฤทธิ์โดยฮอร์โมน ADH',
    effect: 'รับการ์ดฮอร์โมนฟรี 1 ใบ',
    effectType: 'hormone',
    icon: 'ShieldCheck',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 30,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Aquaporin-2 Insertion Site',
    description: 'ADH สั่งให้แทรกช่อง Aquaporin-2 ที่ผนังท่อรวม ดึงน้ำกลับเข้าสู่ร่างกายอย่างมหาศาล',
    effect: 'เปิดโอกาสใช้การ์ดปรับสมดุลน้ำ',
    effectType: 'hormone',
    icon: 'Droplet',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 31,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'RAAS Axis Trigger',
    description: 'วงจร Renin-Angiotensin-Aldosterone System ควบคุมความดันโลหิตและเกลือแร่',
    effect: 'รับการ์ดฮอร์โมน 1 ใบ',
    effectType: 'hormone',
    icon: 'Sun',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 32,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Urea Recycling Chamber',
    description: 'สารยูเรียถูกหมุนเวียนบางส่วนเพื่อช่วยพยุงความดันออสโมติกในเนื้อเยื่อไตชั้นใน',
    effect: 'ตอบคำถามทบทวนบทเรียนส่งท้าย',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 33,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Final Osmotic Balancing',
    description: 'การปรับสมดุลน้ำขั้นสุดท้ายตามระดับฮอร์โมนในกระแสเลือดก่อนปล่อยลงกรวยไต',
    effect: 'เพิ่มความชุ่มชื้น (+10 Hydration)',
    effectType: 'resource',
    icon: 'Droplet',
    statChange: { hydration: 10, sodium: 0 }
  },
  {
    tileId: 34,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Collecting Duct Exit Terminal',
    description: 'น้ำปัสสาวะผ่านการปรับแต่งสมบูรณ์แบบ ได้ปัสสาวะที่มีความเข้มข้นพอเหมาะกับร่างกาย',
    effect: 'รับการ์ดฮอร์โมนสำรอง 1 ใบ',
    effectType: 'hormone',
    icon: 'Award',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 35,
    section: 'Distal Tubule & Collecting Duct',
    sectionColor: '#10b981',
    name: 'Renal Pelvis Gateway',
    description: 'กรวยไต (Renal Pelvis) รวบรวมน้ำปัสสาวะทั้งหมดเตรียมลำเลียงเข้าสู่ท่อไต (Ureter)',
    effect: 'ปรับสมดุลครั้งสุดท้ายก่อนเข้าสู่โซนกระเพาะปัสสาวะ',
    effectType: 'resource',
    icon: 'ArrowRightCircle',
    statChange: { hydration: 2, sodium: 2 }
  },

  // SECTION 5: Bladder (Tiles 36-40) - BLUE / FINISH ZONE
  {
    tileId: 36,
    section: 'Bladder',
    sectionColor: '#0284c7',
    name: 'Ureter Expressway',
    description: 'ท่อไต (Ureter) ลำเลียงน้ำปัสสาวะด้วยคลื่นการบีบตัว Peristalsis สู่กระเพาะปัสสาวะ',
    effect: 'ทรงตัวในโซนสมดุลเตรียมชิงชัย',
    effectType: 'resource',
    icon: 'Compass',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 37,
    section: 'Bladder',
    sectionColor: '#0284c7',
    name: 'Bladder Storage Vault',
    description: 'กระเพาะปัสสาวะ (Urinary Bladder) กักเก็บน้ำปัสสาวะเพื่อเตรียมการขับถ่าย',
    effect: 'ตอบคำถามท้าทายความรอบรู้ชีววิทยา',
    effectType: 'quiz',
    icon: 'HelpCircle',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 38,
    section: 'Bladder',
    sectionColor: '#0284c7',
    name: 'Detrusor Wall Stretch',
    description: 'กล้ามเนื้อผนังกระเพาะปัสสาวะยืดขยายตัวอย่างปลอดภัย ส่งสัญญาณประสาทไปที่สมอง',
    effect: 'โบนัสประคองสมดุล (+5 Hydration, +5 Sodium)',
    effectType: 'resource',
    icon: 'Zap',
    statChange: { hydration: 5, sodium: 5 }
  },
  {
    tileId: 39,
    section: 'Bladder',
    sectionColor: '#0284c7',
    name: 'Internal Sphincter Gate',
    description: 'หูรูดกระเพาะปัสสาวะเปิดออกเพื่อพร้อมขับของเสียออกจากร่างกาย',
    effect: 'ก้าวสุดท้ายก่อนถึงเส้นชัย!',
    effectType: 'resource',
    icon: 'ShieldCheck',
    statChange: { hydration: 0, sodium: 0 }
  },
  {
    tileId: 40,
    section: 'Bladder',
    sectionColor: '#3b82f6',
    name: 'Excretion Finish Line',
    description: 'ขับถ่ายปัสสาวะออกจากร่างกาย! สิ้นสุดการเดินทางของระบบไตและระบบขับถ่าย',
    effect: 'เส้นชัย! คำนวณคะแนน Homeostasis Score (ความใกล้เคียงเป้าหมาย 50%)',
    effectType: 'bladder',
    icon: 'Trophy',
    statChange: { hydration: 0, sodium: 0 }
  }
];

// Random integer generator helper
function randomBetween(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

// Procedural Dynamic Board Generator
export function generateDynamicBoard(): BoardTile[] {
  return BASE_BOARD_TILES.map((base): BoardTile => {
    // Keep Tile 1 and Tile 40 intact
    if (base.tileId === 1 || base.tileId === 40) {
      return {
        ...base,
        statChange: {
          hydration: base.statChange?.hydration ?? 0,
          sodium: base.statChange?.sodium ?? 0
        }
      };
    }

    const statChange = {
      hydration: base.statChange?.hydration ?? 0,
      sodium: base.statChange?.sodium ?? 0
    };
    let effectText = base.effect;

    // Section 1: Glomerulus (2-5)
    if (base.section === 'Glomerulus') {
      if (base.effectType === 'resource') {
        const hChange = randomBetween(-8, 5, 2);
        const sChange = randomBetween(-5, 5, 2);
        statChange.hydration = hChange;
        statChange.sodium = sChange;
        effectText = `${hChange >= 0 ? '+' : ''}${hChange} 💧 Hydration, ${sChange >= 0 ? '+' : ''}${sChange} 🧂 Sodium`;
      }
    }

    // Section 2: Proximal Tubule (6-15) - High Reabsorption variations
    else if (base.section === 'Proximal Tubule') {
      if (base.effectType === 'resource') {
        const hChange = randomBetween(4, 14, 2);
        const sChange = randomBetween(4, 14, 2);
        statChange.hydration = hChange;
        statChange.sodium = sChange;
        effectText = `ดูดกลับสารจำเป็น: +${hChange} 💧 น้ำ, +${sChange} 🧂 โซเดียม`;
      }
    }

    // Section 3: Loop of Henle (16-25) - Dynamic Countercurrent Multiplier
    else if (base.section === 'Loop of Henle') {
      if (base.effectType === 'henle_even') {
        // Even tiles: descending water drain
        const hDrain = randomBetween(-16, -6, 2);
        statChange.hydration = hDrain;
        statChange.sodium = 0;
        effectText = `ออสโมซิสระบายน้ำออก: ${hDrain} 💧 Hydration`;
      } else if (base.effectType === 'henle_odd') {
        // Odd tiles: ascending salt pumping drain
        const sDrain = randomBetween(-16, -6, 2);
        statChange.hydration = 0;
        statChange.sodium = sDrain;
        effectText = `ปั๊มเกลือออกสู่เนื้อไต: ${sDrain} 🧂 Sodium`;
      }
    }

    // Section 4: Distal Tubule & Collecting Duct (26-35)
    else if (base.section === 'Distal Tubule & Collecting Duct') {
      if (base.effectType === 'resource') {
        const hChange = randomBetween(-6, 12, 2);
        const sChange = randomBetween(-6, 12, 2);
        statChange.hydration = hChange;
        statChange.sodium = sChange;
        effectText = `ปรับจูนสมดุลขั้นสุดท้าย: ${hChange >= 0 ? '+' : ''}${hChange} 💧, ${sChange >= 0 ? '+' : ''}${sChange} 🧂`;
      }
    }

    // Section 5: Bladder (36-39)
    else if (base.section === 'Bladder') {
      if (base.effectType === 'resource') {
        const hChange = randomBetween(-4, 6, 2);
        const sChange = randomBetween(-4, 6, 2);
        statChange.hydration = hChange;
        statChange.sodium = sChange;
        effectText = `ประคองสมดุลก่อนขับถ่าย: ${hChange >= 0 ? '+' : ''}${hChange} 💧, ${sChange >= 0 ? '+' : ''}${sChange} 🧂`;
      }
    }

    return {
      ...base,
      statChange,
      effect: effectText
    };
  });
}

export const BOARD_TILES = BASE_BOARD_TILES;
