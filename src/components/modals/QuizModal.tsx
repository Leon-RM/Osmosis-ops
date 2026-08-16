import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '../../types/game';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface QuizModalProps {
  question: QuizQuestion | null;
  onAnswer: (isCorrect: boolean, question: QuizQuestion) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!question) return null;

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    if (selected === question.correctIndex) sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleNext = () => {
    if (selected === null) return;
    const ok = selected === question.correctIndex;
    setSelected(null);
    setSubmitted(false);
    onAnswer(ok, question);
  };

  const CHOICE_LETTERS = ['ก', 'ข', 'ค', 'ง'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="max-w-lg w-full rounded-3xl p-6 space-y-4"
          style={{
            background: 'rgba(255,252,248,0.97)',
            border: '2px solid #2D1B0E',
            boxShadow: '6px 6px 0 #2D1B0E',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '2px dashed rgba(255,107,53,0.2)' }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,200,50,0.15)', border: '2px solid #2D1B0E', boxShadow: '2px 2px 0 #2D1B0E' }}
            >
              <HelpCircle className="w-5 h-5" style={{ color: '#D97706' }} />
            </div>
            <div>
              <span className="font-retro text-[9px] tracking-widest font-bold" style={{ color: '#D97706' }}>
                QUIZ CHALLENGE
              </span>
              <p className="font-display font-bold text-sm leading-tight" style={{ color: '#2D1B0E' }}>
                ทดสอบความรู้การทำงานของหน่วยไต
              </p>
            </div>
          </div>

          {/* Question */}
          <div
            className="p-4 rounded-2xl"
            style={{
              background: 'rgba(255,245,228,0.7)',
              border: '1.5px solid rgba(45,27,14,0.12)',
            }}
          >
            <p className="font-body font-semibold text-sm leading-relaxed" style={{ color: '#2D1B0E' }}>
              {question.question}
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-2">
            {question.choices.map((choice, idx) => {
              let style: React.CSSProperties = {
                background: 'rgba(255,245,228,0.6)',
                border: '1.5px solid rgba(45,27,14,0.1)',
                cursor: submitted ? 'default' : 'pointer',
              };
              if (!submitted && selected === idx) {
                style = { background: 'rgba(255,107,53,0.1)', border: '2px solid #FF6B35', boxShadow: '2px 2px 0 rgba(255,107,53,0.3)', cursor: 'pointer' };
              }
              if (submitted) {
                if (idx === question.correctIndex) {
                  style = { background: 'rgba(40,200,120,0.1)', border: '2px solid #15803D', boxShadow: '2px 2px 0 rgba(40,200,120,0.3)' };
                } else if (idx === selected) {
                  style = { background: 'rgba(255,80,80,0.1)', border: '2px solid #C0392B', boxShadow: '2px 2px 0 rgba(255,80,80,0.3)' };
                } else {
                  style = { background: 'rgba(200,180,160,0.2)', border: '1.5px solid rgba(45,27,14,0.08)', opacity: 0.5 };
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => { if (!submitted) setSelected(idx); }}
                  className="w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all"
                  style={style}
                >
                  <span
                    className="font-retro font-bold text-xs w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: submitted && idx === question.correctIndex ? '#15803D' : submitted && idx === selected ? '#C0392B' : '#FF6B35',
                      color: 'white',
                      border: '1.5px solid #2D1B0E',
                    }}
                  >
                    {CHOICE_LETTERS[idx]}
                  </span>
                  <span className="font-body text-xs flex-1" style={{ color: '#2D1B0E' }}>{choice}</span>
                  {submitted && idx === question.correctIndex && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#15803D' }} />}
                  {submitted && idx === selected && idx !== question.correctIndex && <XCircle className="w-4 h-4 shrink-0" style={{ color: '#C0392B' }} />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-2xl space-y-1.5"
              style={{
                background: selected === question.correctIndex
                  ? 'rgba(40,200,120,0.08)' : 'rgba(255,80,80,0.07)',
                border: `1.5px solid ${selected === question.correctIndex ? 'rgba(40,200,120,0.3)' : 'rgba(255,80,80,0.25)'}`,
              }}
            >
              <p className="font-display font-bold text-xs" style={{ color: selected === question.correctIndex ? '#15803D' : '#C0392B' }}>
                {selected === question.correctIndex ? `✓ ถูกต้อง! (+${question.statReward.hydration}% H₂O, +${question.statReward.sodium}% Na⁺)` : '✗ ยังไม่ถูกต้อง'}
              </p>
              <p className="font-body text-[11px] leading-relaxed" style={{ color: '#5C3317' }}>
                <strong>คำอธิบาย:</strong> {question.explanation}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="w-full py-2.5 rounded-2xl font-display font-bold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0.5"
              style={
                selected === null
                  ? { background: 'rgba(200,180,160,0.3)', color: '#B08060', border: '1.5px solid rgba(45,27,14,0.1)', cursor: 'not-allowed' }
                  : { background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: '2px solid #2D1B0E', boxShadow: '3px 3px 0 #2D1B0E', color: 'white' }
              }
            >
              ยืนยันคำตอบ (Submit)
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-2.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #E05C8B)', border: '2px solid #2D1B0E', boxShadow: '3px 3px 0 #2D1B0E', color: 'white' }}
            >
              ดำเนินการต่อ <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
