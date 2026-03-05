// src/app/screens/BudzetSzkolny.jsx
"use client";
import { useState } from "react";
import { T, fmt } from "@/lib/tokens";

// ─── MOCK DATA ────────────────────────────────
const SENSORS = {
  energia: {
    icon: "⚡", label: "Energia elektryczna", unit: "kWh",
    color: "#F59E0B", colorLight: "#FEF3C7",
    today: 142, yesterday: 168, monthTotal: 2840,
    monthCost: 1278, target: 2600,
    status: "warn", // ok | warn | alert
    rooms: [
      { name: "Sala 1A", val: 18, max: 30, status: "ok"   },
      { name: "Sala 2B", val: 27, max: 30, status: "warn" },
      { name: "Sala 3C", val: 12, max: 30, status: "ok"   },
      { name: "Korytarz",val: 31, max: 30, status: "alert"},
      { name: "Hala",    val: 22, max: 30, status: "ok"   },
      { name: "Biuro",   val: 9,  max: 30, status: "ok"   },
    ],
  },
  woda: {
    icon: "💧", label: "Zużycie wody", unit: "m³",
    color: "#06B6D4", colorLight: "#CFFAFE",
    today: 3.2, yesterday: 4.1, monthTotal: 68.4,
    monthCost: 342, target: 60,
    status: "alert",
    rooms: [
      { name: "WC parter",  val: 28, max: 40, status: "warn"  },
      { name: "WC piętro",  val: 18, max: 40, status: "ok"    },
      { name: "Kuchnia",    val: 42, max: 40, status: "alert" },
      { name: "Siłownia",   val: 11, max: 40, status: "ok"    },
    ],
  },
  powietrze: {
    icon: "🌬️", label: "Jakość powietrza", unit: "CO₂ ppm",
    color: "#059669", colorLight: "#D1FAE5",
    today: 820, yesterday: 940, monthTotal: null,
    monthCost: null, target: 1000,
    status: "ok",
    rooms: [
      { name: "Sala 1A", val: 680,  max: 1000, status: "ok"   },
      { name: "Sala 2B", val: 920,  max: 1000, status: "warn" },
      { name: "Sala 3C", val: 540,  max: 1000, status: "ok"   },
      { name: "Hala",    val: 1080, max: 1000, status: "alert"},
      { name: "Biuro",   val: 490,  max: 1000, status: "ok"   },
    ],
  },
};

const MONTHLY = {
  energia:    [3100, 2980, 2840, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  woda:       [72,   65,   68,   0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const MONTH_NAMES    = ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"];
const CURRENT_MONTH  = 3;

const CLASS_ECO = [
  { pos: 1, name: "3A", score: 94, trend: "+3%",  isUser: false },
  { pos: 2, name: "2B", score: 89, trend: "+1%",  isUser: true  },
  { pos: 3, name: "1C", score: 81, trend: "-2%",  isUser: false },
  { pos: 4, name: "2A", score: 76, trend: "+5%",  isUser: false },
  { pos: 5, name: "3B", score: 68, trend: "-4%",  isUser: false },
];

const MEDAL = ["🥇","🥈","🥉"];

// ─── HELPERS ──────────────────────────────────
const STATUS_COLOR = { ok: T.green, warn: "#F59E0B", alert: T.pink };
const STATUS_LABEL = { ok: "Norma",  warn: "Uwaga",   alert: "Przekroczono" };
const STATUS_BG    = { ok: "#ECFDF5", warn: "#FFFBEB", alert: "#FFF0F4" };

function StatusDot({ status, size = 8 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: STATUS_COLOR[status],
      boxShadow: `0 0 0 3px ${STATUS_COLOR[status]}30`,
      flexShrink: 0,
    }} />
  );
}

// ─── SENSOR DETAIL MODAL ──────────────────────
function SensorModal({ sensor, onClose }) {
  const s = SENSORS[sensor];
  const pctToday = Math.min(100, Math.round((s.today / s.target) * 100));

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "0 16px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 400,
        background: T.surface, borderRadius: 20,
        overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        maxHeight: "90dvh", overflowY: "auto",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px 16px", borderBottom: `1px solid ${T.border}`,
        }}>
          <p style={{ margin: 0, fontSize: 18, fontFamily: "var(--display)", color: s.color, letterSpacing: "-0.02em" }}>
            {s.icon} {s.label}
          </p>
          <button onClick={onClose} style={{
            background: T.bg, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 16, color: T.sub,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ padding: "20px 20px 24px" }}>
          {/* today vs yesterday */}
          <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: 16 }}>
            {[
              { label: "Dziś",     value: `${s.today} ${s.unit}`,     color: s.color },
              { label: "Wczoraj",  value: `${s.yesterday} ${s.unit}`, color: T.sub   },
              { label: "Status",   value: STATUS_LABEL[s.status],      color: STATUS_COLOR[s.status] },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, padding: "12px 8px", background: T.surface, textAlign: "center",
                borderRight: i < 2 ? `1px solid ${T.border}` : "none",
              }}>
                <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: item.color, fontFamily: "var(--display)" }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* daily progress bar */}
          {s.target && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.sub, fontFamily: "var(--body)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Dzienny limit
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: STATUS_COLOR[s.status], fontFamily: "var(--body)" }}>
                  {pctToday}% · limit: {s.target} {s.unit}
                </span>
              </div>
              <div style={{ height: 8, background: T.border, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${pctToday}%`, height: "100%", background: STATUS_COLOR[s.status], borderRadius: 99, transition: "width 1s" }} />
              </div>
            </div>
          )}

          {/* rooms */}
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
            Pomieszczenia · live
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {s.rooms.map((r, i) => {
              const pct = Math.min(100, Math.round((r.val / r.max) * 100));
              return (
                <div key={i} style={{
                  background: STATUS_BG[r.status], border: `1px solid ${STATUS_COLOR[r.status]}30`,
                  borderRadius: 10, padding: "10px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <StatusDot status={r.status} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: "var(--body)" }}>{r.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: STATUS_COLOR[r.status], fontFamily: "var(--display)" }}>
                      {r.val} <span style={{ fontSize: 9, fontWeight: 600, color: T.sub }}>/ {r.max} {s.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: 4, background: `${STATUS_COLOR[r.status]}25`, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: STATUS_COLOR[r.status], borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {s.monthCost && (
            <div style={{ marginTop: 16, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Koszt w marcu</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.03em" }}>{fmt(s.monthCost)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Zużycie</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "var(--display)", letterSpacing: "-0.03em" }}>{s.monthTotal} {s.unit}</p>
              </div>
            </div>
          )}

          <button onClick={onClose} style={{
            marginTop: 20, width: "100%", padding: "14px 0",
            background: s.color, color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700, cursor: "pointer",
          }}>Zamknij</button>
        </div>
      </div>
    </div>
  );
}

// ─── IDEA MODAL ───────────────────────────────
function IdeaModal({ onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "0 16px",
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
          <p style={{ margin: 0, fontSize: 18, fontFamily: "var(--display)", color: T.green, letterSpacing: "-0.02em" }}>Idea ekranu</p>
          <button onClick={onClose} style={{
            background: T.bg, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 16, color: T.sub,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Budżet Szkolny · IoT</p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            Szkoła wyposażona w <strong>czujniki IoT</strong> mierzy zużycie energii, wody i jakość powietrza w czasie rzeczywistym. Uczniowie nie tylko słyszą o ekologii — <strong>widzą jej efekty w liczbach</strong>.
          </p>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            Rywalizacja klasowa o <strong>Eco Score</strong> aktywuje odpowiedzialność zbiorową — wyłączone światło, zamknięte okno, krótszy prysznic w szatni mają mierzalny wpływ.
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>Co znajdziesz na tym ekranie</p>
          {[
            "Live dashboard czujników — energia, woda, CO₂",
            "Status każdego pomieszczenia w czasie rzeczywistym",
            "Koszty miesięczne i roczny wykres trendów",
            "Ranking klas według Eco Score — kto oszczędza najbardziej",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, marginTop: 5, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
          <button onClick={onClose} style={{
            marginTop: 20, width: "100%", padding: "14px 0",
            background: T.green, color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700, cursor: "pointer",
          }}>Rozumiem</button>
        </div>
      </div>
    </div>
  );
}

// ─── SENSOR CARD ──────────────────────────────
function SensorCard({ sensorKey, onClick }) {
  const s = SENSORS[sensorKey];
  const change = s.today < s.yesterday;
  const changePct = Math.abs(Math.round(((s.today - s.yesterday) / s.yesterday) * 100));

  return (
    <div onClick={onClick} style={{
      flex: 1, background: T.surface, border: `1px solid ${T.border}`,
      borderTop: `3px solid ${s.color}`,
      borderRadius: 14, padding: "14px 14px 12px",
      cursor: "pointer", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 12, right: 12 }}>
        <StatusDot status={s.status} size={7} />
      </div>

      <p style={{ margin: "0 0 6px", fontSize: 18 }}>{s.icon}</p>
      <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)", lineHeight: 1.3 }}>
        {s.label.split(" ").slice(0, 2).join(" ")}
      </p>
      <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {s.today}
        <span style={{ fontSize: 9, fontWeight: 600, color: T.sub, marginLeft: 3 }}>{s.unit}</span>
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: change ? T.green : T.pink, fontFamily: "var(--body)" }}>
          {change ? "▼" : "▲"} {changePct}%
        </span>
        <span style={{ fontSize: 9, color: T.sub, fontFamily: "var(--body)", fontWeight: 500 }}>vs wczoraj</span>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 9, fontWeight: 700, color: STATUS_COLOR[s.status], fontFamily: "var(--body)" }}>
        {STATUS_LABEL[s.status]}  · szczegóły →
      </p>
    </div>
  );
}

// ─── MONTHLY CHART ────────────────────────────
function MonthlyChart({ data, color, unit }) {
  const max = Math.max(...data.filter(v => v > 0), 1);
  return (
    <div style={{ position: "relative", height: 70 }}>
      {[0.5].map((h, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: `${h * 100}%`, height: 1, background: T.border, zIndex: 0 }} />
      ))}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: "100%", position: "relative", zIndex: 1 }}>
        {data.map((val, i) => {
          const isCurrent = i + 1 === CURRENT_MONTH;
          const isPast    = i + 1 < CURRENT_MONTH;
          const barH      = val > 0 ? Math.max(5, (val / max) * 62) : 3;
          return (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%" }}>
              <div style={{
                width: "100%", height: barH,
                background: isCurrent ? color : isPast && val > 0 ? `${color}70` : T.border,
                borderRadius: "3px 3px 0 0",
                opacity: i + 1 > CURRENT_MONTH ? 0.2 : 1,
                boxShadow: isCurrent ? `0 -2px 8px ${color}44` : "none",
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
        {MONTH_NAMES.map((name, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 6.5, fontFamily: "var(--body)", color: i + 1 === CURRENT_MONTH ? color : T.sub, fontWeight: i + 1 === CURRENT_MONTH ? 800 : 500 }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ECO RANKING ─────────────────────────────
function EcoRanking() {
  return (
    <div style={{ margin: "0 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
          Eco Score · ranking klas
        </p>
        <span style={{ background: `${T.green}15`, color: T.green, fontSize: 10, fontWeight: 800, fontFamily: "var(--body)", padding: "3px 8px", borderRadius: 6 }}>
          Marzec 2026
        </span>
      </div>
      {CLASS_ECO.map((row, i) => {
        const barW = row.score;
        return (
          <div key={i} style={{
            padding: "11px 16px",
            borderBottom: i < CLASS_ECO.length - 1 ? `1px solid ${T.border}` : "none",
            background: row.isUser ? `${T.green}08` : "transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 24, textAlign: "center", flexShrink: 0 }}>
                {row.pos <= 3
                  ? <span style={{ fontSize: 15 }}>{MEDAL[row.pos - 1]}</span>
                  : <span style={{ fontSize: 12, fontWeight: 800, color: T.sub, fontFamily: "var(--display)" }}>{row.pos}</span>
                }
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: row.isUser ? T.green : T.bg,
                border: `1.5px solid ${row.isUser ? T.green : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: row.isUser ? "#fff" : T.ink,
                fontFamily: "var(--display)",
              }}>{row.name}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: row.isUser ? 800 : 600, color: row.isUser ? T.green : T.ink, fontFamily: "var(--body)" }}>
                    Klasa {row.name}
                  </p>
                  {row.isUser && <span style={{ fontSize: 9, background: T.green, color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>TY</span>}
                </div>
                <p style={{ margin: 0, fontSize: 10, color: row.trend.startsWith("+") ? T.green : T.pink, fontFamily: "var(--body)", fontWeight: 700 }}>
                  {row.trend} w stosunku do ub. miesiąca
                </p>
              </div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: row.isUser ? T.green : T.ink, fontFamily: "var(--display)", letterSpacing: "-0.02em" }}>
                {row.score}
                <span style={{ fontSize: 9, fontWeight: 600, color: T.sub, marginLeft: 2 }}>pkt</span>
              </p>
            </div>
            <div style={{ marginLeft: 68, height: 4, background: T.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${barW}%`, height: "100%", background: row.isUser ? T.green : `${T.green}60`, borderRadius: 99, transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── BUDŻET SZKOLNY SCREEN ───────────────────
export default function BudzetSzkolny() {
  const [sensorModal, setSensorModal] = useState(null);
  const [ideaOpen,    setIdeaOpen]    = useState(false);

  const totalCost = (SENSORS.energia.monthCost || 0) + (SENSORS.woda.monthCost || 0);

  return (
    <>
      <div style={{ padding: "16px 0 20px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── LIVE IOT HEADER ── */}
        <div style={{ margin: "0 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, boxShadow: `0 0 0 3px ${T.green}30` }} />
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.green, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
                  Live · IoT Szkoła
                </p>
              </div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                Budżet Szkolny
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
                Koszty · Marzec
              </p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.03em" }}>
                {fmt(totalCost)}
              </p>
            </div>
          </div>

          {/* alert strip */}
          {(SENSORS.energia.status !== "ok" || SENSORS.woda.status !== "ok") && (
            <div style={{
              background: "#FFF0F4", border: `1px solid ${T.pink}30`,
              borderRadius: 10, padding: "8px 12px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: 11, color: T.pink, fontFamily: "var(--body)", fontWeight: 700, lineHeight: 1.4 }}>
                Wykryto przekroczenia norm. Sprawdź szczegóły czujników.
              </p>
            </div>
          )}
        </div>

        {/* ── SENSOR TILES ── */}
        <div style={{ display: "flex", gap: 10, margin: "0 16px" }}>
          {["energia", "woda", "powietrze"].map(key => (
            <SensorCard key={key} sensorKey={key} onClick={() => setSensorModal(key)} />
          ))}
        </div>

        {/* ── COST TRENDS ── */}
        <div style={{ margin: "0 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 0", borderBottom: "none" }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
              Trendy kosztów 2026
            </p>
          </div>

          {[
            { label: "Energia elektryczna", icon: "⚡", color: "#F59E0B", data: MONTHLY.energia, unit: "kWh" },
            { label: "Zużycie wody",        icon: "💧", color: "#06B6D4", data: MONTHLY.woda,    unit: "m³"  },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "14px 16px",
              borderTop: i > 0 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.ink, fontFamily: "var(--body)" }}>{item.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, color: item.color, fontFamily: "var(--body)" }}>
                  {item.data[CURRENT_MONTH - 1]} {item.unit}
                </span>
              </div>
              <MonthlyChart data={item.data} color={item.color} unit={item.unit} />
            </div>
          ))}
        </div>

        {/* ── ECO RANKING ── */}
        <EcoRanking />

        {/* ── TIP ── */}
        <div style={{ margin: "0 16px", background: `${T.green}08`, border: `1px solid ${T.green}25`, borderRadius: 14, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 800, color: T.green, fontFamily: "var(--body)" }}>Porada dnia</p>
            <p style={{ margin: 0, fontSize: 12, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.6 }}>
              Klasa 2B może zaoszczędzić ok. <strong>340 zł rocznie</strong> wyłączając projektory po lekcjach. Sprawdź czy Twoja sala ma wyłączone urządzenia.
            </p>
          </div>
        </div>

        {/* ── PRZYCISK i ── */}
        <div style={{ margin: "2px 16px 20px", display: "flex", justifyContent: "center" }}>
          <button onClick={() => setIdeaOpen(true)} className="pulse-btn" style={{
            display: "flex", alignItems: "center", gap: 10,
            background: T.surface, border: `1.5px solid ${T.green}44`,
            borderRadius: 12, padding: "11px 24px",
            cursor: "pointer", fontFamily: "var(--body)",
            fontWeight: 700, fontSize: 13, color: T.green,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: T.green, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 900, fontFamily: "var(--display)",
            }}>i</div>
            Idea tego ekranu
          </button>
        </div>

      </div>

      {sensorModal && <SensorModal sensor={sensorModal} onClose={() => setSensorModal(null)} />}
      {ideaOpen    && <IdeaModal onClose={() => setIdeaOpen(false)} />}
    </>
  );
}