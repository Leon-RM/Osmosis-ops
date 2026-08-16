import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, HelpCircle, Droplet, Percent, Sparkles, BookOpen, Target, Pill, Heart } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'sections' | 'hormones' | 'scoring'>('rules');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-overlay overflow-y-auto cursor-pointer"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 24 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-4 sm:p-6 space-y-4 cursor-default"
          style={{
            background: 'rgba(255,252,248,0.98)',
            border: '2px solid #2D1B0E',
            boxShadow: '6px 6px 0 #2D1B0E',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-orange-500/25">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/15 border-2 border-amber-950 shadow-sm"
              >
                <HelpCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                  คู่มือและวิธีเล่น OSMOSIS OPS (How to Play)
                </h2>
                <p className="font-retro text-[9px] sm:text-[10px] tracking-widest text-amber-800">
                  KIDNEY OSMOREGULATION RULEBOOK
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-100 border border-rose-300 text-rose-600 transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Winning Condition Banner */}
          <div
            className="p-3.5 sm:p-4 rounded-2xl flex items-start gap-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-950 shadow-sm"
          >
            <Trophy className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-display font-bold text-xs sm:text-sm mb-0.5 text-slate-900">
                เป้าหมายหลักในการชนะเกม (Winning Goal):
              </p>
              <p className="font-body text-xs leading-relaxed text-amber-950/90">
                ผู้เล่นที่เดินทางไปถึง <strong>Urinary Bladder (ช่อง #40)</strong> โดยรักษาระดับ{' '}
                <strong className="text-blue-600">💧 น้ำ (Hydration)</strong> และ{' '}
                <strong className="text-orange-600">🧂 โซเดียม (Sodium)</strong> ให้อยู่ใน{' '}
                <strong className="text-emerald-700">Homeostasis Zone (40% – 60%)</strong> หรือใกล้เคียง 50% ที่สุด จะได้รับคะแนนสูงสุดและชนะเลิศ!
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-amber-900/10 border border-amber-900/15">
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-1.5 px-2 rounded-xl font-display font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. ขั้นตอนการเล่น</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`py-1.5 px-2 rounded-xl font-display font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'sections'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-white/50'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>2. โซนหน่วยไต 5 ตอน</span>
            </button>

            <button
              onClick={() => setActiveTab('hormones')}
              className={`py-1.5 px-2 rounded-xl font-display font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'hormones'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. การ์ดฮอร์โมน 4 แบบ</span>
            </button>

            <button
              onClick={() => setActiveTab('scoring')}
              className={`py-1.5 px-2 rounded-xl font-display font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'scoring'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-white/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>4. การคิดคะแนน</span>
            </button>
          </div>

          {/* TAB 1: RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-2.5">
              {[
                {
                  phase: 'Phase 1: Global Event (สุ่มสภาพแวดล้อม)',
                  color: '#FF6B35',
                  body: 'เมื่อเริ่มต้นรอบใหม่ จะมีสภาพแวดล้อมสุ่มขึ้น เช่น อากาศร้อนเสียเหงื่อ (-10 น้ำ) หรือ ทานอาหารเค็มจัด (+15 โซเดียม) ส่งผลต่อทุกคนพร้อมกัน'
                },
                {
                  phase: 'Phase 2: Roll & Move (ทอยลูกเต๋าเดินตามท่อไต)',
                  color: '#E05C8B',
                  body: 'กดทอยลูกเต๋า (1–6 แต้ม) หมากจะเคลื่อนที่ไปตามเส้นทางท่อไต 40 ช่อง'
                },
                {
                  phase: 'Phase 3: Station Action & Quiz (รับผลกระทบ & ตอบคำถาม)',
                  color: '#F97316',
                  body: 'เกิดผลตามช่อง เช่น ห่วงเฮนเลขาลงระบายน้ำออก (-10 น้ำ), ขาขึ้นปั๊มเกลือออก (-10 โซเดียม), หรือตอบคำถาม Quiz เพื่อรับการ์ดปรับสมดุล'
                },
                {
                  phase: 'Phase 4: Osmoregulation Cards (ใช้ฮอร์โมนปรับสมดุล)',
                  color: '#10B981',
                  body: 'ใช้การ์ด ADH, Diuretic, Aldosterone หรือ ANP เพื่อดึงค่าน้ำและเกลือให้อยู่ในโซนเขียว (40%–60%) ก่อนกดจบตา'
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-amber-500/5 border border-amber-900/15"
                >
                  <div
                    className="w-6 h-6 rounded-xl flex items-center justify-center font-retro font-bold text-xs shrink-0 text-white shadow-sm"
                    style={{ background: item.color }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 mb-0.5">
                      {item.phase}
                    </h4>
                    <p className="font-body text-xs leading-relaxed text-amber-950/80">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: 5 SECTIONS */}
          {activeTab === 'sections' && (
            <div className="space-y-2">
              {[
                {
                  section: 'Section 1 (ช่อง 1–5): Glomerulus & Bowman\'s Capsule',
                  badge: 'จุดกรองสาร',
                  color: '#EF4444',
                  desc: 'การกรองละเอียด (Ultrafiltration) พลาสม่าถูกดันผ่านหลอดเลือดฝอยเข้าสู่ท่อไต เริ่มต้นการเดินทาง'
                },
                {
                  section: 'Section 2 (ช่อง 6–15): Proximal Convoluted Tubule (PCT)',
                  badge: 'ดูดกลับ 65%',
                  color: '#F97316',
                  desc: 'ท่อขดส่วนต้นดูดกลับกลูโคส, กรดอะมิโน 100%, น้ำและโซเดียม 65% เป็นโซนรับทรัพยากรและการ์ดสะสม'
                },
                {
                  section: 'Section 3 (ช่อง 16–25): Loop of Henle (ห่วงเฮนเล)',
                  badge: 'ปรับความเข้มข้น',
                  color: '#EAB308',
                  desc: 'ขากลับลง (Descending) ยอมให้น้ำออก (-10 H₂O) / ขากลับขึ้น (Ascending) ปั๊มเกลือออก (-10 Na⁺)'
                },
                {
                  section: 'Section 4 (ช่อง 26–35): Distal Tubule & Collecting Duct',
                  badge: 'ศูนย์ควบคุมฮอร์โมน',
                  color: '#10B981',
                  desc: 'ท่อขดส่วนปลายและท่อรวม เป็นจุดออกฤทธิ์ของ ADH (ดูดน้ำ) และ Aldosterone (ดูดเกลือ) ขั้นสุดท้าย'
                },
                {
                  section: 'Section 5 (ช่อง 36–40): Urinary Bladder (กระเพาะปัสสาวะ)',
                  badge: 'เส้นชัย',
                  color: '#3B82F6',
                  desc: 'กักเก็บและขับปัสสาวะ ผู้เล่นที่ถึงช่อง 40 จะจบเกมและตัดสินคะแนนความใกล้เคียง 50%'
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border bg-white/80"
                  style={{ borderColor: `${s.color}66` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {s.section}
                    </span>
                    <span className="font-retro text-[8px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ml-1"
                      style={{ background: s.color }}>
                      {s.badge}
                    </span>
                  </div>
                  <p className="font-body text-xs text-amber-950/80 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: 4 HORMONES / ITEMS */}
          {activeTab === 'hormones' && (
            <div className="space-y-2.5">
              {/* 1. ADH */}
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="flex items-center gap-2 font-display font-bold text-xs sm:text-sm text-blue-900">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  <span>💧 ADH (Antidiuretic Hormone / วาโซเพรสซิน) — เพิ่มน้ำ +20%</span>
                </div>
                <p className="font-body text-xs text-blue-950/85 leading-relaxed">
                  • <strong>หน้าที่:</strong> สั่งท่อรวมให้แทรกช่อง Aquaporin ดึงน้ำกลับเข้ากระแสเลือด ปัสสาวะจะเข้มข้นขึ้น<br />
                  • <strong>เมื่อไหร่ควรใช้:</strong> เมื่อค่าน้ำ <strong>&lt; 40% (ขาดน้ำ/กระหายน้ำ)</strong>
                </p>
              </div>

              {/* 2. Diuretic */}
              <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1">
                <div className="flex items-center gap-2 font-display font-bold text-xs sm:text-sm text-cyan-900">
                  <Pill className="w-4 h-4 text-cyan-600" />
                  <span>💊 Diuretic (ยาขับปัสสาวะ / ขับน้ำส่วนเกิน) — ลดน้ำ -15%</span>
                </div>
                <p className="font-body text-xs text-cyan-950/85 leading-relaxed">
                  • <strong>หน้าที่:</strong> ยับยั้งการดูดน้ำกลับ ขับน้ำออกทางปัสสาวะอย่างรวดเร็ว<br />
                  • <strong>เมื่อไหร่ควรใช้:</strong> เมื่อค่าน้ำ <strong>&gt; 60% (ดื่มน้ำมากเกินไป/ภาวะบวมน้ำ)</strong>
                </p>
              </div>

              {/* 3. Aldosterone */}
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
                <div className="flex items-center gap-2 font-display font-bold text-xs sm:text-sm text-orange-900">
                  <Percent className="w-4 h-4 text-orange-600" />
                  <span>🧂 Aldosterone (อัลโดสเตอโรน) — เพิ่มโซเดียม +15%</span>
                </div>
                <p className="font-body text-xs text-orange-950/85 leading-relaxed">
                  • <strong>หน้าที่:</strong> สั่งท่อขดส่วนปลายปั๊มเกลือ Na⁺ กลับเข้าเลือด เพื่อเพิ่มความดันโลหิต<br />
                  • <strong>เมื่อไหร่ควรใช้:</strong> เมื่อค่าโซเดียม <strong>&lt; 40% (เกลือแร่ต่ำ/ความดันตก)</strong>
                </p>
              </div>

              {/* 4. ANP */}
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="flex items-center gap-2 font-display font-bold text-xs sm:text-sm text-rose-900">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>🫀 ANP (Atrial Natriuretic Peptide) — ลดโซเดียม -15%</span>
                </div>
                <p className="font-body text-xs text-rose-950/85 leading-relaxed">
                  • <strong>หน้าที่:</strong> หลั่งจากหัวใจห้องบน สั่งไตขับเกลือ Na⁺ ออกทางปัสสาวะเพื่อลดความดันโลหิต<br />
                  • <strong>เมื่อไหร่ควรใช้:</strong> เมื่อค่าโซเดียม <strong>&gt; 60% (เกลือเกิน/ทานเค็มจัด)</strong>
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SCORING */}
          {activeTab === 'scoring' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-amber-900/15 space-y-2">
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">
                  สูตรการคำนวณคะแนน Homeostasis Score (เต็ม 100 คะแนน):
                </h4>
                <div className="p-2.5 rounded-xl bg-amber-50 font-retro text-xs text-amber-900 border border-amber-200 text-center font-bold">
                  Score = 100 - (|Hydration - 50| + |Sodium - 50|)
                </div>
                <ul className="font-body text-xs text-amber-950/85 space-y-1 list-disc list-inside">
                  <li>หากค่าน้ำ 50% และโซเดียม 50% พอดีเป๊ะ จะได้คะแนนเต็ม <strong>100 คะแนน</strong></li>
                  <li>หากค่าน้ำ 45% และโซเดียม 55% จะได้คะแนน: 100 - (5 + 5) = <strong>90 คะแนน</strong></li>
                </ul>
              </div>
            </div>
          )}

          {/* Close Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-display font-extrabold text-sm sm:text-base text-white shadow-md transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #E05C8B)',
              border: '2px solid #2D1B0E',
              boxShadow: '3px 3px 0 #2D1B0E',
            }}
          >
            เข้าใจแล้ว! พร้อมลุยเส้นทางหน่วยไต 🔬
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
