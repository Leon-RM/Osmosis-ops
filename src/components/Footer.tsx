import React from 'react';
import { Sparkles, GraduationCap, HeartHandshake } from 'lucide-react';

interface Member {
  name: string;
  no: number;
  gender: 'male' | 'female';
}

const MEMBERS: Member[] = [
  { name: 'นาย ณรงค์ฤทธิ์', no: 7, gender: 'male' },
  { name: 'นาย คิรากร', no: 12, gender: 'male' },
  { name: 'นาย จิณณะ', no: 13, gender: 'male' },
  { name: 'นาย ณัฐธีร์', no: 16, gender: 'male' },
  { name: 'นาย ฐิติโชติ', no: 18, gender: 'male' },
  { name: 'นาย รัฐภูมินทร์', no: 19, gender: 'male' },
  { name: 'นาย ณฐกร', no: 22, gender: 'male' },
  { name: 'นาย วงศภัค', no: 23, gender: 'male' },
  { name: 'นางสาว นลาวัลย์', no: 25, gender: 'female' },
  { name: 'นางสาว นันทิชา', no: 35, gender: 'female' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-10 mb-6 px-3 sm:px-6 relative z-10 max-w-5xl mx-auto">
      <div
        className="rounded-3xl p-4 sm:p-6 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.85)',
          border: '2px solid #2D1B0E',
          boxShadow: '4px 4px 0 #2D1B0E',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Footer Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-dashed border-orange-500/25">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-orange-500/15 border-2 border-amber-950 shadow-sm shrink-0">
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-black text-sm sm:text-base text-slate-900">
                  คณะผู้จัดทำโครงงาน (Project Members)
                </span>
                <span className="font-retro text-[9px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold border border-orange-300">
                  Made by ม.5/10
                </span>
              </div>
              <p className="font-body text-[11px] sm:text-xs text-amber-950/80 mt-0.5">
                สื่อการเรียนรู้ชีววิทยา: การรักษาสมดุลน้ำและสารในร่างกาย (ระบบการทำงานของไต & ฮอร์โมน)
              </p>
            </div>
          </div>

          {/* Antigravity Badge */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-rose-500/15 to-purple-500/15 border-2 border-amber-950 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-display font-extrabold text-xs text-slate-900">
              Made with <strong className="text-orange-600">Antigravity</strong>
            </span>
          </div>
        </div>

        {/* Member Grid List (10 Members) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {MEMBERS.map((m) => (
            <div
              key={m.no}
              className="p-2 sm:p-2.5 rounded-2xl flex items-center justify-between gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: m.gender === 'female' ? 'rgba(255,240,245,0.85)' : 'rgba(240,248,255,0.85)',
                border: `1.5px solid ${m.gender === 'female' ? 'rgba(224,92,139,0.3)' : 'rgba(59,130,246,0.3)'}`,
                boxShadow: '2px 2px 0 rgba(45,27,14,0.08)',
              }}
            >
              <div className="min-w-0">
                <p className="font-display font-bold text-[11px] sm:text-xs text-slate-900 truncate">
                  {m.name}
                </p>
                <p className="font-retro text-[9px] text-amber-900/70">
                  ชั้น ม.5/10
                </p>
              </div>
              <span
                className="font-retro text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-xl text-white shadow-sm shrink-0"
                style={{
                  background: m.gender === 'female' ? '#E05C8B' : '#3B82F6',
                  border: '1px solid #2D1B0E',
                }}
              >
                #{m.no}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Sub-Note */}
        <div className="flex items-center justify-between text-[10px] font-body text-amber-950/60 pt-2 border-t border-amber-900/10">
          <span className="flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
            <span>Osmosis Ops • Interactive Biology Board Game</span>
          </span>
          <span className="font-retro">Class 5/10 • Science Project</span>
        </div>
      </div>
    </footer>
  );
};
