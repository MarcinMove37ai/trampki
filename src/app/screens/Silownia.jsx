// src/app/screens/Silownia.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { T, fmt } from "@/lib/tokens";

// ─── MOCK DATA ────────────────────────────────
const DAILY_QUIZ = {
  date: "18 marca 2026",
  questions: [
    {
      id: 1,
      question: "Masz 500 zł i odkładasz 10% miesięcznie. Ile będziesz miał po 12 miesiącach (bez odsetek)?",
      answers: ["560 zł", "600 zł", "650 zł"],
      correct: 1,
      explanation: "10% z 500 zł to 50 zł miesięcznie. 50 × 12 = 600 zł odłożonych + 500 zł startowe = 1100 zł. Ale pytanie dotyczy tylko odłożonych: 12 × 50 = 600 zł.",
    },
    {
      id: 2,
      question: "Inflacja wynosi 5% rocznie. Co to oznacza dla Twoich oszczędności trzymanych w gotówce?",
      answers: [
        "Tracą na wartości — za rok kupisz za nie mniej",
        "Nic się nie zmienia — kwota jest ta sama",
        "Zyskują — więcej pieniędzy w obiegu",
      ],
      correct: 0,
      explanation: "Inflacja to wzrost cen. Jeśli ceny rosną o 5%, a Twoje oszczędności stoją w miejscu, za rok kupisz za nie mniej towarów. Dlatego warto inwestować.",
    },
    {
      id: 3,
      question: "Konto oszczędnościowe oferuje 4% w skali roku. Masz 1000 zł. Ile zarobisz przez rok?",
      answers: ["20 zł", "40 zł", "400 zł"],
      correct: 1,
      explanation: "4% z 1000 zł = 0,04 × 1000 = 40 zł odsetek po roku. To prosty procent — bez kapitalizacji.",
    },
  ],
};

const CLASS_RANKING = [
  { pos: 1,  name: "2A", pts: 1840, streak: 12, isUser: false },
  { pos: 2,  name: "3B", pts: 1720, streak: 9,  isUser: false },
  { pos: 3,  name: "2C", pts: 1610, streak: 7,  isUser: false },
  { pos: 4,  name: "1A", pts: 1430, streak: 5,  isUser: false },
  { pos: 5,  name: "2B", pts: 1390, streak: 11, isUser: true  },
  { pos: 6,  name: "3A", pts: 1210, streak: 3,  isUser: false },
];

const SCHOOL_RANKING = [
  { pos: 1,  name: "Zofia K.",   pts: 2340, streak: 18, avatar: "Z", isUser: false },
  { pos: 2,  name: "Mateusz W.", pts: 2180, streak: 14, avatar: "M", isUser: false },
  { pos: 3,  name: "Ala N.",     pts: 1990, streak: 21, avatar: "A", isUser: false },
  { pos: 4,  name: "Bartek S.",  pts: 1760, streak: 8,  avatar: "B", isUser: false },
  { pos: 5,  name: "Kacper",     pts: 340,  streak: 3,  avatar: "K", isUser: true  },
];

const MEDAL = ["🥇", "🥈", "🥉"];

// ─── QUIZ MODAL ───────────────────────────────
function QuizModal({ onClose }) {
  const [step,      setStep]      = useState("intro"); // intro | q1 | q2 | q3 | result
  const [answers,   setAnswers]   = useState({});      // { qIndex: answerIndex }
  const [selected,  setSelected]  = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [elapsed,   setElapsed]   = useState(0);
  const [qStart,    setQStart]    = useState(null);
  const [qTimes,    setQTimes]    = useState([]);
  const timerRef = useRef(null);

  const qIndex   = ["q1","q2","q3"].indexOf(step);
  const question = qIndex >= 0 ? DAILY_QUIZ.questions[qIndex] : null;
  const total    = DAILY_QUIZ.questions.length;

  // global timer
  useEffect(() => {
    if (step === "intro" || step === "result") return;
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [step]);

  // record time per question
  useEffect(() => {
    if (qIndex >= 0) setQStart(Date.now());
  }, [step]);

  const startQuiz = () => { setElapsed(0); setStep("q1"); };

  const confirmAnswer = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const nextStep = () => {
    const spent = Math.round((Date.now() - qStart) / 1000);
    setQTimes(t => [...t, spent]);
    setAnswers(a => ({ ...a, [qIndex]: selected }));
    setSelected(null);
    setRevealed(false);
    const next = ["q1","q2","q3","result"][qIndex + 1];
    setStep(next);
  };

  // score calculation
  const correctCount = Object.entries(answers).filter(
    ([qi, ai]) => DAILY_QUIZ.questions[parseInt(qi)].correct === ai
  ).length;
  const basePoints  = correctCount * 30;
  const timeBonus   = Math.max(0, 60 - elapsed) * 2;
  const totalPoints = basePoints + timeBonus;

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  // ── INTRO ──
  if (step === "intro") return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Dzienne wyzwanie" accent={T.pink} onClose={onClose} />
      <div style={{ padding: "20px 20px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🏋️</div>
          <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
            {DAILY_QUIZ.date}
          </p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.02em" }}>
            3 pytania · mierzony czas
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { icon: "🎯", label: "Za poprawną odpowiedź", pts: "+30 pkt" },
            { icon: "⚡", label: "Bonus za szybkość",      pts: "+2 pkt/s" },
          ].map((r, i) => (
            <div key={i} style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
              <p style={{ margin: "0 0 3px", fontSize: 9, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.3 }}>{r.label}</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: T.pink, fontFamily: "var(--display)" }}>{r.pts}</p>
            </div>
          ))}
        </div>

        <button onClick={startQuiz} style={{
          width: "100%", padding: "14px 0",
          background: T.pink,
          color: "#fff", border: "none", borderRadius: 12,
          fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.02em",
        }}>Zaczynamy →</button>
      </div>
    </Overlay>
  );

  // ── QUESTION ──
  if (question) return (
    <Overlay onClose={null}>
      <div style={{ padding: "18px 20px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 28, height: 5, borderRadius: 99,
              background: i < qIndex ? T.green : i === qIndex ? T.pink : T.border,
              transition: "background .3s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 10px" }}>
          <span style={{ fontSize: 12 }}>⏱</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: elapsed > 60 ? T.pink : T.ink, fontFamily: "var(--display)" }}>
            {formatTime(elapsed)}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 20px 24px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
          Pytanie {qIndex + 1} z {total}
        </p>
        <p style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: T.ink, fontFamily: "var(--display)", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
          {question.question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
          {question.answers.map((ans, i) => {
            const isSelected = selected === i;
            const isCorrect  = question.correct === i;
            const isWrong    = revealed && isSelected && !isCorrect;
            const showGreen  = revealed && isCorrect;

            let bg     = T.bg;
            let border = T.border;
            let color  = T.ink;

            if (showGreen)       { bg = "#ECFDF5"; border = T.green;  color = T.green; }
            else if (isWrong)    { bg = "#FFF0F4"; border = T.pink;   color = T.pink;  }
            else if (isSelected) { bg = `${T.blue}10`; border = T.blue; color = T.blue; }

            return (
              <button key={i} onClick={() => !revealed && setSelected(i)} style={{
                width: "100%", background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: 12, padding: "13px 16px",
                display: "flex", alignItems: "center", gap: 12,
                cursor: revealed ? "default" : "pointer",
                textAlign: "left", transition: "all .15s",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: showGreen ? T.green : isWrong ? T.pink : isSelected ? T.blue : T.border,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, fontFamily: "var(--body)",
                  transition: "background .15s",
                }}>
                  {showGreen ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + i)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: "var(--body)", lineHeight: 1.4 }}>{ans}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div style={{
            background: `${T.green}10`, border: `1px solid ${T.green}44`,
            borderRadius: 12, padding: "12px 14px", marginBottom: 16,
          }}>
            <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, color: T.green, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Wyjaśnienie</p>
            <p style={{ margin: 0, fontSize: 12, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.6 }}>
              {question.explanation}
            </p>
          </div>
        )}

        {!revealed ? (
          <button onClick={confirmAnswer} disabled={selected === null} style={{
            width: "100%", padding: "14px 0",
            background: selected !== null ? T.pink : T.border,
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
            cursor: selected !== null ? "pointer" : "default",
            transition: "background .2s",
          }}>Zatwierdź odpowiedź</button>
        ) : (
          <button onClick={nextStep} style={{
            width: "100%", padding: "14px 0",
            background: T.green, color: "#fff",
            border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
            cursor: "pointer",
          }}>
            {qIndex < total - 1 ? "Następne pytanie →" : "Zobacz wynik 🏆"}
          </button>
        )}
      </div>
    </Overlay>
  );

  // ── RESULT ──
  if (step === "result") {
    const pct = Math.round((correctCount / total) * 100);
    const grade = correctCount === 3 ? { emoji: "🔥", label: "Idealnie!", color: T.green }
                : correctCount === 2 ? { emoji: "👍", label: "Dobrze!", color: T.blue }
                : { emoji: "💪", label: "Ćwicz dalej!", color: T.pink };

    return (
      <Overlay onClose={onClose}>
        <ModalHeader title="Wynik wyzwania" accent={grade.color} onClose={onClose} />
        <div style={{ padding: "20px 20px 28px" }}>

          {/* big score */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{grade.emoji}</div>
            <p style={{ margin: "0 0 2px", fontSize: 36, fontWeight: 900, color: grade.color, fontFamily: "var(--display)", letterSpacing: "-0.04em" }}>
              {totalPoints} pkt
            </p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.sub, fontFamily: "var(--body)" }}>{grade.label}</p>
          </div>

          {/* breakdown */}
          <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: 16 }}>
            {[
              { label: "Poprawne",  value: `${correctCount}/${total}`, color: T.green },
              { label: "Czas",      value: formatTime(elapsed),        color: T.blue  },
              { label: "Bonus",     value: `+${timeBonus} pkt`,        color: T.pink  },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: "12px 8px", background: T.surface, textAlign: "center",
                borderRight: i < 2 ? `1px solid ${T.border}` : "none",
              }}>
                <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: s.color, fontFamily: "var(--display)" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* per-question summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {DAILY_QUIZ.questions.map((q, i) => {
              const isOk = answers[i] === q.correct;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: T.bg, borderRadius: 10, padding: "10px 14px",
                  border: `1px solid ${T.border}`,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: isOk ? T.green : T.pink,
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800,
                  }}>{isOk ? "✓" : "✗"}</div>
                  <p style={{ margin: 0, fontSize: 11, color: T.ink, fontFamily: "var(--body)", fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
                    {q.question.slice(0, 60)}…
                  </p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isOk ? T.green : T.pink, fontFamily: "var(--body)", flexShrink: 0 }}>
                    {isOk ? "+30 pkt" : "0 pkt"}
                  </span>
                </div>
              );
            })}
          </div>

          <button onClick={onClose} style={{
            width: "100%", padding: "14px 0",
            background: grade.color, color: "#fff",
            border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.02em",
          }}>Zamknij</button>
        </div>
      </Overlay>
    );
  }

  return null;
}

// ─── SHARED MODAL WRAPPERS ────────────────────
function Overlay({ children, onClose }) {
  return (
    <div
      onClick={onClose || undefined}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2000, padding: "0 16px",
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 400,
        background: T.surface, borderRadius: 20,
        overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        maxHeight: "90dvh", overflowY: "auto",
      }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, accent, onClose }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 20px 16px", borderBottom: `1px solid ${T.border}`,
    }}>
      <p style={{ margin: 0, fontSize: 18, fontFamily: "var(--display)", color: accent, letterSpacing: "-0.02em" }}>
        {title}
      </p>
      <button onClick={onClose} style={{
        background: T.bg, border: "none", borderRadius: 8,
        width: 30, height: 30, cursor: "pointer", fontSize: 16, color: T.sub,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>✕</button>
    </div>
  );
}

// ─── RANKING TABLE ────────────────────────────
function RankingTable({ title, rows, type }) {
  const isClass = type === "class";
  return (
    <div style={{ margin: "0 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
          {title}
        </p>
        <span style={{ fontSize: 10, color: T.sub, fontFamily: "var(--body)", fontWeight: 600 }}>
          {isClass ? "klasa" : "uczeń"} · punkty · streak
        </span>
      </div>

      {rows.map((row, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "11px 16px",
          borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none",
          background: row.isUser ? `${T.pink}08` : "transparent",
        }}>
          {/* position */}
          <div style={{ width: 24, textAlign: "center", flexShrink: 0 }}>
            {row.pos <= 3
              ? <span style={{ fontSize: 16 }}>{MEDAL[row.pos - 1]}</span>
              : <span style={{ fontSize: 12, fontWeight: 800, color: T.sub, fontFamily: "var(--display)" }}>{row.pos}</span>
            }
          </div>

          {/* avatar / class badge */}
          {isClass ? (
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: row.isUser ? T.pink : T.bg,
              border: `1.5px solid ${row.isUser ? T.pink : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: row.isUser ? "#fff" : T.ink,
              fontFamily: "var(--display)",
            }}>{row.name}</div>
          ) : (
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: row.isUser ? T.pink : T.bg,
              border: `1.5px solid ${row.isUser ? T.pink : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: row.isUser ? "#fff" : T.ink,
              fontFamily: "var(--display)",
            }}>{row.avatar}</div>
          )}

          {/* name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 13, fontWeight: row.isUser ? 800 : 600,
              color: row.isUser ? T.pink : T.ink,
              fontFamily: "var(--body)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {isClass ? `Klasa ${row.name}` : row.name}
              {row.isUser && <span style={{ fontSize: 9, background: T.pink, color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>TY</span>}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: T.sub, fontFamily: "var(--body)", fontWeight: 500 }}>
              🔥 {row.streak} dni z rzędu
            </p>
          </div>

          {/* points */}
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.02em", flexShrink: 0 }}>
            {row.pts.toLocaleString("pl-PL")}
            <span style={{ fontSize: 9, fontWeight: 600, color: T.sub, marginLeft: 2 }}>pkt</span>
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── MY POSITIONS BANNER ─────────────────────
function MyPositions() {
  const myClass  = CLASS_RANKING.find(r => r.isUser);
  const mySchool = SCHOOL_RANKING.find(r => r.isUser);

  return (
    <div style={{ display: "flex", gap: 10, margin: "0 16px" }}>
      {[
        { label: "Pozycja w klasie",  pos: myClass?.pos,  total: CLASS_RANKING.length,  color: T.blue },
        { label: "Pozycja w szkole",  pos: mySchool?.pos, total: SCHOOL_RANKING.length, color: T.pink },
      ].map((b, i) => (
        <div key={i} style={{
          flex: 1, background: T.surface,
          border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${b.color}`,
          borderRadius: 12, padding: "12px 14px",
        }}>
          <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)", lineHeight: 1.4 }}>
            {b.label}
          </p>
          <p style={{ margin: 0, fontFamily: "var(--display)", letterSpacing: "-0.03em" }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: b.color }}>#{b.pos}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.sub, marginLeft: 4 }}>z {b.total}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── SILOWNIA SCREEN ──────────────────────────
export default function Silownia() {
  const [quizOpen,  setQuizOpen]  = useState(false);
  const [ideaOpen,  setIdeaOpen]  = useState(false);

  return (
    <>
      <div style={{ padding: "16px 0 20px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── HERO BANNER ── */}
        <div style={{
          margin: "0 16px",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 18, padding: "20px 20px 18px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: 16, top: 14, fontSize: 44, opacity: 0.08, lineHeight: 1, userSelect: "none" }}>🏋️</div>
          <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
            Siłownia Finansowa
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Codzienne wyzwanie<br />czeka na Ciebie 💪
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { icon: "🔥", label: "Streak", value: "3 dni",    color: T.pink },
              { icon: "🏅", label: "Punkty",  value: "340 pkt", color: T.blue },
              { icon: "📅", label: "Dziś",    value: "18 mar",  color: T.green },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "8px 6px", textAlign: "center",
              }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{s.icon}</div>
                <p style={{ margin: "0 0 1px", fontSize: 8, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: s.color, fontFamily: "var(--display)", fontWeight: 800 }}>{s.value}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setQuizOpen(true)}
            style={{
              width: "100%", padding: "14px 0",
              background: T.pink,
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.01em",
            }}
          >
            Podejmij dzienne wyzwanie →
          </button>
        </div>

        {/* ── MOJA POZYCJA ── */}
        <MyPositions />

        {/* ── RANKING KLASOWY ── */}
        <RankingTable title="Ranking klasowy" rows={CLASS_RANKING} type="class" />

        {/* ── RANKING SZKOLNY ── */}
        <RankingTable title="Ranking szkolny" rows={SCHOOL_RANKING} type="school" />

        {/* ── PRZYCISK i ── */}
        <div style={{ margin: "2px 16px 20px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setIdeaOpen(true)}
            className="pulse-btn"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: T.surface, border: `1.5px solid ${T.pink}44`,
              borderRadius: 12, padding: "11px 24px",
              cursor: "pointer", fontFamily: "var(--body)",
              fontWeight: 700, fontSize: 13, color: T.pink,
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: T.pink, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 900, fontFamily: "var(--display)",
            }}>i</div>
            Idea tego ekranu
          </button>
        </div>

      </div>

      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}

      {/* ── IDEA MODAL ── */}
      {ideaOpen && (
        <Overlay onClose={() => setIdeaOpen(false)}>
          <ModalHeader title="Idea ekranu" accent={T.pink} onClose={() => setIdeaOpen(false)} />
          <div style={{ padding: "20px 20px 24px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
              Siłownia Finansowa
            </p>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
              Codzienny rytuał edukacyjny budowany na mechanice Duolingo. Uczeń nie uczy się finansów przez nudny wykład — dostaje <strong>konkretną, krótką porcję wiedzy</strong> powiązaną z jego życiem.
            </p>
            <p style={{ margin: "0 0 18px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
              Streak jest kluczowym motywatorem — przerwanie serii boli bardziej niż sama chęć zdobycia wiedzy. <strong>Rywalizacja klasowa</strong> uruchamia dodatkową motywację grupową.
            </p>
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
              Co znajdziesz na tym ekranie
            </p>
            {[
              "Dzienne wyzwanie — 3 pytania, mierzony czas",
              "Punkty za poprawność i szybkość odpowiedzi",
              "Ranking klasowy — rywalizacja w grupie",
              "Ranking szkolny — Twoja pozycja wśród wszystkich",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.pink, marginTop: 5, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.5 }}>{t}</p>
              </div>
            ))}
            <button onClick={() => setIdeaOpen(false)} style={{
              marginTop: 20, width: "100%", padding: "14px 0",
              background: T.pink, color: "#fff",
              border: "none", borderRadius: 12,
              fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.02em",
            }}>Rozumiem</button>
          </div>
        </Overlay>
      )}
    </>
  );
}