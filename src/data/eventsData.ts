import type { GlobalEvent } from '../types/game';

export const GLOBAL_EVENTS: GlobalEvent[] = [
  {
    id: 'e1',
    title: 'Hot Weather Outbreak',
    titleTh: '☀️ อากาศร้อนจัด เหงื่อออกมาก',
    description: 'Extreme heat causes heavy sweating and rapid fluid loss.',
    descriptionTh: 'สภาพอากาศร้อนจัด ร่างกายสูญเสียน้ำทางเหงื่ออย่างรวดเร็ว ผู้เล่นทุกคนสูญเสียน้ำ -10 Hydration',
    hydrationChange: -10,
    sodiumChange: 0,
    icon: 'Sun'
  },
  {
    id: 'e2',
    title: 'Salty Papaya Salad Meal',
    titleTh: '🌶️ ทานส้มตำปลาร้ารสเค็มจัด',
    description: 'High sodium intake elevates plasma osmolality.',
    descriptionTh: 'ทานอาหารรสเค็มจัด ได้รับปริมาณโซเดียมเข้าสู่กระแสเลือดเพิ่มขึ้น ผู้เล่นทุกคน +15 Sodium',
    hydrationChange: 0,
    sodiumChange: 15,
    icon: 'Utensils'
  },
  {
    id: 'e3',
    title: 'Heavy Drinking Challenge',
    titleTh: '💧 ดื่มน้ำเปล่าปริมาณมาก',
    description: 'Drinking excess water lowers blood concentration.',
    descriptionTh: 'ดื่มน้ำสะอาดปริมาณมาก ช่วยเพิ่มระดับน้ำในพลาสม่า ผู้เล่นทุกคน +15 Hydration',
    hydrationChange: 15,
    sodiumChange: 0,
    icon: 'Droplet'
  },
  {
    id: 'e4',
    title: 'Marathon Run',
    titleTh: '🏃 วิ่งมาราธอนกลางแจ้ง',
    description: 'Strenuous exercise depletes both water and electrolytes.',
    descriptionTh: 'การออกกำลังกายอย่างหนัก สูญเสียทั้งน้ำและโซเดียม ผู้เล่นทุกคน -15 Hydration และ -10 Sodium',
    hydrationChange: -15,
    sodiumChange: -10,
    icon: 'Zap'
  },
  {
    id: 'e5',
    title: 'Strict Low-Salt Diet',
    titleTh: '🥗 ทานอาหารคลีนงดเค็ม',
    description: 'Low sodium intake drops plasma salt levels.',
    descriptionTh: 'รับประทานอาหารไม่ใส่เกลือ ระดับโซเดียมในร่างกายลดลง ผู้เล่นทุกคน -10 Sodium',
    hydrationChange: 0,
    sodiumChange: -10,
    icon: 'Feather'
  },
  {
    id: 'e6',
    title: 'Cool Rainy Breeze',
    titleTh: '🌧️ อากาศเย็นสบาย สายฝนโปรยปราย',
    description: 'Pleasant weather stabilizes fluid equilibrium.',
    descriptionTh: 'สภาพอากาศเย็นสบาย ลดอัตราการสูญเสียน้ำ ผู้เล่นทุกคน +5 Hydration',
    hydrationChange: 5,
    sodiumChange: 0,
    icon: 'CloudRain'
  }
];
