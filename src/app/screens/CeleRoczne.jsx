// src/app/screens/CeleRoczne.jsx
"use client";
import { useState } from "react";
import { T, pct, fmt } from "@/lib/tokens";

const CURRENT_MONTH  = 3;  // marzec = indeks 2 (0-based), numer = 3
const MONTHS_IN_YEAR = 12;
const MONTH_NAMES    = ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"];

// ─── IDEA MODAL ───────────────────────────────
function IdeaModal({ onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
      zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 16px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 400,
        background: T.surface, borderRadius: 20,
        overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px 16px", borderBottom: `1px solid ${T.border}`,
        }}>
          <p style={{ margin: 0, fontSize: 18, fontFamily: "var(--display)", color: T.blue, letterSpacing: "-0.02em" }}>
            Idea ekranu
          </p>
          <button onClick={onClose} style={{
            background: T.bg, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 16, color: T.sub,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
            Cel Roczny
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            Cel roczny uczy <strong>myślenia długoterminowego</strong> — jednej z najtrudniejszych umiejętności w tym wieku. Wykres miesięczny pokazuje jak małe, regularne wpłaty składają się na dużą kwotę.
          </p>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            Miesięczna prognoza rozbija przytłaczający cel na <strong>osiągalne kroki</strong> — uczeń widzi czy idzie zgodnie z planem czy potrzebuje przyspieszyć.
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
            Co znajdziesz na tym ekranie
          </p>
          {[
            "Zdjęcie celu z paskiem rocznego postępu",
            "Suwak miesięcy — minęło / pozostało",
            "Wykres miesięczny — ile odkładałeś każdego miesiąca",
            "Prognoza: ile miesięcznie musisz odkładać aby zdążyć",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, marginTop: 5, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
          <button onClick={onClose} style={{
            marginTop: 20, width: "100%", padding: "14px 0",
            background: T.blue, color: "#fff",
            border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.02em",
          }}>Rozumiem</button>
        </div>
      </div>
    </div>
  );
}

// ─── TIMELINE SLIDER (miesięczny) ─────────────
function TimelineSlider() {
  const passedPct = pct(CURRENT_MONTH, MONTHS_IN_YEAR);
  const remaining = MONTHS_IN_YEAR - CURRENT_MONTH;

  return (
    <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Minęło</p>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 900, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {CURRENT_MONTH} <span style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>mies.</span>
          </p>
        </div>
        <div style={{ textAlign: "center", alignSelf: "center" }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.sub, fontFamily: "var(--body)" }}>2026 · 12 miesięcy</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Pozostało</p>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 900, color: T.blue, fontFamily: "var(--display)", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {remaining} <span style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>mies.</span>
          </p>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ height: 10, background: T.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            width: `${passedPct}%`, height: "100%",
            background: `linear-gradient(90deg, ${T.blue}, #60a5fa)`,
            borderRadius: 99,
            transition: "width 1s cubic-bezier(.22,1,.36,1)",
          }} />
        </div>
        <div style={{
          position: "absolute",
          left: `calc(${passedPct}% - 9px)`,
          top: -4,
          width: 18, height: 18, borderRadius: "50%",
          background: T.blue, border: "3px solid #fff",
          boxShadow: `0 2px 8px ${T.blue}66`,
        }} />
      </div>

      <div style={{ position: "relative", height: 20, marginTop: 4 }}>
        <div style={{ position: "absolute", left: `calc(${passedPct}% - 16px)` }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: T.blue, fontFamily: "var(--body)" }}>teraz</span>
        </div>
      </div>
    </div>
  );
}

// ─── MONTHLY CHART ────────────────────────────
function MonthlyChart({ monthlySavings }) {
  const past   = monthlySavings.slice(0, CURRENT_MONTH);
  const maxBar = Math.max(...past.filter(v => v > 0), 1);

  return (
    <div style={{ margin: "12px 16px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 16px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
          2026 · miesiąc po miesiącu
        </p>
        <span style={{
          background: `${T.blue}18`, color: T.blue, borderRadius: 6,
          fontSize: 10, fontWeight: 800, fontFamily: "var(--body)", padding: "3px 8px",
        }}>teraz: Mar</span>
      </div>

      <div style={{ position: "relative", height: 100 }}>
        {[0.25, 0.5, 0.75].map((h, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            bottom: `${h * 100}%`, height: 1,
            background: T.border, zIndex: 0,
          }} />
        ))}

        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: "100%", position: "relative", zIndex: 1 }}>
          {monthlySavings.map((val, i) => {
            const monthNum = i + 1;
            const isCurrent = monthNum === CURRENT_MONTH;
            const isPast    = monthNum < CURRENT_MONTH;
            const isFuture  = monthNum > CURRENT_MONTH;
            const barH      = maxBar > 0 && val > 0 ? Math.max(6, (val / maxBar) * 92) : 3;

            return (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%" }}>
                <div style={{
                  width: "100%", height: barH,
                  background: isCurrent
                    ? `linear-gradient(to top, ${T.blue}, #60a5fa)`
                    : isPast && val > 0
                      ? `linear-gradient(to top, ${T.blue}99, ${T.blue}cc)`
                      : T.border,
                  borderRadius: "3px 3px 0 0",
                  opacity: isFuture ? 0.18 : 1,
                  transition: "height 0.8s cubic-bezier(.22,1,.36,1)",
                  boxShadow: isCurrent ? `0 -3px 10px ${T.blue}55` : "none",
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* x-axis */}
      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
        {MONTH_NAMES.map((name, i) => {
          const isCurrent = i + 1 === CURRENT_MONTH;
          return (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <span style={{
                fontSize: 7, fontFamily: "var(--body)",
                color: isCurrent ? T.blue : T.sub,
                fontWeight: isCurrent ? 800 : 500,
              }}>{name}</span>
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        {[
          { color: T.blue,              label: "Odłożono"  },
          { color: `${T.blue}99`,       label: "Poprzednie"},
          { color: T.border,            label: "Prognoza"  },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            <span style={{ fontSize: 10, color: T.sub, fontFamily: "var(--body)", fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CELE ROCZNE SCREEN ───────────────────────
export default function CeleRoczne({ data }) {
  const [ideaOpen, setIdeaOpen] = useState(false);

  const goal       = data.goalY;
  const remaining  = goal.target - goal.current;
  const monthsLeft = MONTHS_IN_YEAR - CURRENT_MONTH;
  const avgNeeded  = (remaining / monthsLeft).toFixed(0);
  const avgDone    = (goal.current / CURRENT_MONTH).toFixed(0);
  const p          = pct(goal.current, goal.target);

  return (
    <>
      {/* ── HERO — year.webp ── */}
      <div style={{ position: "relative", width: "100%", height: 220, overflow: "hidden" }}>
        <img src="/year.webp" alt={goal.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />

        <div style={{ position: "absolute", bottom: 40, left: 16, right: 16 }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Cel roczny</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: "var(--display)", letterSpacing: "-0.01em", lineHeight: 1.2, maxWidth: "68%" }}>{goal.name}</p>
            <span style={{ fontSize: 30, fontWeight: 900, color: "#fff", fontFamily: "var(--display)", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {p}<span style={{ fontSize: 15 }}>%</span>
            </span>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, background: "rgba(255,255,255,0.2)" }}>
          <div style={{ width: `${p}%`, height: "100%", background: T.blue, transition: "width 1.2s cubic-bezier(.22,1,.36,1)" }} />
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{ display: "flex", margin: "12px 16px 0", borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {[
          { label: "Odłożono",  value: fmt(goal.current), color: T.blue },
          { label: "Pozostało", value: fmt(remaining),     color: T.pink },
          { label: "Cel",       value: fmt(goal.target),   color: T.ink  },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: "12px 8px", background: T.surface, textAlign: "center",
            borderRight: i < 2 ? `1px solid ${T.border}` : "none",
          }}>
            <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: s.color, fontFamily: "var(--display)", letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── AVERAGES ── */}
      <div style={{ display: "flex", gap: 10, margin: "10px 16px 0" }}>
        {[
          { label: "Średnio odkładasz miesięcznie", value: `${avgDone} zł`,   icon: "📈", border: T.green },
          { label: "Musisz odkładać miesięcznie",   value: `${avgNeeded} zł`, icon: "🎯", border: T.blue  },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: T.surface, border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${s.border}`, borderRadius: 12, padding: "12px 14px",
          }}>
            <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)", lineHeight: 1.4 }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.03em" }}>{s.icon} {s.value}</p>
          </div>
        ))}
      </div>

      {/* ── TIMELINE SLIDER ── */}
      <TimelineSlider />

      {/* ── CHART ── */}
      <MonthlyChart monthlySavings={data.monthlySavings} />

      {/* ── PRZYCISK i — na dole ── */}
      <div style={{ margin: "16px 16px 20px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setIdeaOpen(true)}
          className="pulse-btn"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: T.surface, border: `1.5px solid ${T.blue}44`,
            borderRadius: 12, padding: "11px 24px",
            cursor: "pointer", fontFamily: "var(--body)",
            fontWeight: 700, fontSize: 13, color: T.blue,
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: T.blue, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900, fontFamily: "var(--display)",
          }}>i</div>
          Idea tego ekranu
        </button>
      </div>

      {ideaOpen && <IdeaModal onClose={() => setIdeaOpen(false)} />}
    </>
  );
}