// src/app/screens/BudzetDomowy.jsx
"use client";
import { useState } from "react";
import { T, fmt } from "@/lib/tokens";

// ─── MOCK DATA ────────────────────────────────
const KATEGORIE = [
  { id: "czynsz",      label: "Czynsz",      icon: "🏠", color: T.blue  },
  { id: "prad",        label: "Prąd",        icon: "⚡", color: "#F59E0B" },
  { id: "gaz",         label: "Gaz",         icon: "🔥", color: "#EF4444" },
  { id: "woda",        label: "Woda",        icon: "💧", color: "#06B6D4" },
  { id: "internet",    label: "Internet",    icon: "📡", color: T.green  },
  { id: "telewizja",   label: "Telewizja",   icon: "📺", color: T.pink   },
  { id: "telefon",     label: "Telefon",     icon: "📱", color: "#8B5CF6" },
  { id: "inne",        label: "Inne",        icon: "📋", color: T.sub    },
];

const INIT_BILLS = [
  { id: 1, kat: "czynsz",    kwota: 1200, miesiac: "Marzec",  dzien: "01.03" },
  { id: 2, kat: "prad",      kwota: 187,  miesiac: "Marzec",  dzien: "05.03" },
  { id: 3, kat: "internet",  kwota: 79,   miesiac: "Marzec",  dzien: "10.03" },
  { id: 4, kat: "woda",      kwota: 94,   miesiac: "Marzec",  dzien: "12.03" },
  { id: 5, kat: "czynsz",    kwota: 1200, miesiac: "Luty",    dzien: "01.02" },
  { id: 6, kat: "prad",      kwota: 214,  miesiac: "Luty",    dzien: "05.02" },
  { id: 7, kat: "internet",  kwota: 79,   miesiac: "Luty",    dzien: "10.02" },
  { id: 8, kat: "gaz",       kwota: 156,  miesiac: "Luty",    dzien: "14.02" },
];

const MONTHLY_TOTALS = [1820, 1690, 1560, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const MONTH_NAMES    = ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"];
const CURRENT_MONTH  = 3; // marzec

// ─── HELPERS ──────────────────────────────────
function getKat(id) { return KATEGORIE.find(k => k.id === id) || KATEGORIE[7]; }

// ─── ADD BILL MODAL ───────────────────────────
function AddBillModal({ onClose, onAdd }) {
  const [kat,    setKat]    = useState(null);
  const [kwota,  setKwota]  = useState("");
  const [miesiac, setMiesiac] = useState("Marzec");

  const miesiace = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
                    "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];

  const canSave = kat && kwota && parseFloat(kwota) > 0;

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
        {/* header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px 16px", borderBottom: `1px solid ${T.border}`,
        }}>
          <p style={{ margin: 0, fontSize: 18, fontFamily: "var(--display)", color: T.blue, letterSpacing: "-0.02em" }}>
            Dodaj rachunek
          </p>
          <button onClick={onClose} style={{
            background: T.bg, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 16, color: T.sub,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ padding: "20px 20px 24px" }}>
          {/* kwota */}
          <div style={{ position: "relative", marginBottom: 22 }}>
            <input
              type="number" placeholder="0" value={kwota}
              onChange={e => setKwota(e.target.value)} autoFocus
              style={{
                width: "100%", fontSize: 42, fontFamily: "var(--display)",
                color: T.blue, border: "none", borderBottom: `2px solid ${T.blue}`,
                outline: "none", background: "none",
                padding: "6px 44px 6px 0", letterSpacing: "-0.04em",
                boxSizing: "border-box",
              }}
            />
            <span style={{ position: "absolute", right: 4, bottom: 12, fontSize: 16, color: T.sub, fontFamily: "var(--body)", fontWeight: 600 }}>zł</span>
          </div>

          {/* kategoria */}
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, fontFamily: "var(--body)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Rodzaj kosztu
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 20 }}>
            {KATEGORIE.map(k => {
              const active = kat === k.id;
              return (
                <button key={k.id} onClick={() => setKat(k.id)} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  background: active ? `${k.color}12` : T.bg,
                  border: `1.5px solid ${active ? k.color : T.border}`,
                  borderRadius: 10, padding: "10px 12px",
                  cursor: "pointer", transition: "all .15s", textAlign: "left",
                }}>
                  <span style={{ fontSize: 18 }}>{k.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active ? k.color : T.ink, fontFamily: "var(--body)" }}>{k.label}</span>
                </button>
              );
            })}
          </div>

          {/* miesiąc */}
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, fontFamily: "var(--body)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Miesiąc
          </p>
          <div style={{ display: "flex", overflowX: "auto", gap: 7, marginBottom: 24, paddingBottom: 4 }}>
            {miesiace.map(m => (
              <button key={m} onClick={() => setMiesiac(m)} style={{
                flexShrink: 0, padding: "6px 12px",
                background: miesiac === m ? T.blue : T.bg,
                color: miesiac === m ? "#fff" : T.ink,
                border: `1.5px solid ${miesiac === m ? T.blue : T.border}`,
                borderRadius: 8, fontSize: 11, fontFamily: "var(--body)", fontWeight: 700,
                cursor: "pointer", transition: "all .15s",
              }}>{m.slice(0, 3)}</button>
            ))}
          </div>

          <button
            onClick={() => { if (canSave) { onAdd({ kat, kwota: parseFloat(kwota), miesiac }); onClose(); }}}
            style={{
              width: "100%", padding: "14px 0",
              background: canSave ? T.blue : T.border,
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
              cursor: canSave ? "pointer" : "default", letterSpacing: "0.02em",
              transition: "background .2s",
            }}
          >Zapisz rachunek</button>
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
            Budżet Domowy
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            Nastolatek po raz pierwszy widzi <strong>ile naprawdę kosztuje utrzymanie domu</strong>. Abstrakcja „rodzice płacą rachunki" zamienia się w konkretne liczby.
          </p>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            Uczeń zaczyna rozumieć związek między codziennymi nawykami a kosztami — i że <strong>oszczędność jest mierzalna</strong>.
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
            Co znajdziesz na tym ekranie
          </p>
          {[
            "Dodawanie rachunków według kategorii",
            "Podsumowanie kosztów bieżącego miesiąca",
            "Wykres miesięczny — roczny przegląd wydatków domowych",
            "Podział kosztów według kategorii z ikonami",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, marginTop: 5, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
          <button onClick={onClose} style={{
            marginTop: 20, width: "100%", padding: "14px 0",
            background: T.blue, color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700, cursor: "pointer",
          }}>Rozumiem</button>
        </div>
      </div>
    </div>
  );
}

// ─── MONTHLY CHART ────────────────────────────
function MonthlyChart({ totals }) {
  const max = Math.max(...totals.filter(v => v > 0), 1);
  return (
    <div style={{ margin: "0 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 16px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
          Koszty 2026 · miesiąc po miesiącu
        </p>
        <span style={{ background: `${T.blue}18`, color: T.blue, borderRadius: 6, fontSize: 10, fontWeight: 800, fontFamily: "var(--body)", padding: "3px 8px" }}>
          teraz: Mar
        </span>
      </div>

      <div style={{ position: "relative", height: 90 }}>
        {[0.25, 0.5, 0.75].map((h, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: `${h * 100}%`, height: 1, background: T.border, zIndex: 0 }} />
        ))}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: "100%", position: "relative", zIndex: 1 }}>
          {totals.map((val, i) => {
            const isCurrent = i + 1 === CURRENT_MONTH;
            const isPast    = i + 1 < CURRENT_MONTH;
            const isFuture  = i + 1 > CURRENT_MONTH;
            const barH      = val > 0 ? Math.max(6, (val / max) * 82) : 3;
            return (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%", position: "relative" }}>
                <div style={{
                  width: "100%", height: barH,
                  background: isCurrent ? T.blue : isPast && val > 0 ? `${T.blue}88` : T.border,
                  borderRadius: "3px 3px 0 0",
                  opacity: isFuture ? 0.2 : 1,
                  transition: "height 0.8s cubic-bezier(.22,1,.36,1)",
                  boxShadow: isCurrent ? `0 -3px 10px ${T.blue}44` : "none",
                }} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
        {MONTH_NAMES.map((name, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 7, fontFamily: "var(--body)", color: i + 1 === CURRENT_MONTH ? T.blue : T.sub, fontWeight: i + 1 === CURRENT_MONTH ? 800 : 500 }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUDŻET DOMOWY SCREEN ─────────────────────
export default function BudzetDomowy() {
  const [bills,      setBills]      = useState(INIT_BILLS);
  const [addOpen,    setAddOpen]    = useState(false);
  const [ideaOpen,   setIdeaOpen]   = useState(false);

  const biezacy = bills.filter(b => b.miesiac === "Marzec");
  const sumaBiezaca = biezacy.reduce((s, b) => s + b.kwota, 0);

  // podsumowanie wg kategorii w bieżącym miesiącu
  const byKat = KATEGORIE.map(k => ({
    ...k,
    suma: biezacy.filter(b => b.kat === k.id).reduce((s, b) => s + b.kwota, 0),
  })).filter(k => k.suma > 0).sort((a, b) => b.suma - a.suma);

  const handleAdd = ({ kat, kwota, miesiac }) => {
    setBills(prev => [...prev, {
      id: Date.now(), kat, kwota, miesiac,
      dzien: `${String(new Date().getDate()).padStart(2,"0")}.${String(new Date().getMonth()+1).padStart(2,"0")}`,
    }]);
  };

  return (
    <>
      <div style={{ padding: "16px 0 20px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── HEADER CARD ── */}
        <div style={{ margin: "0 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 14px" }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
              Marzec 2026
            </p>
            <p style={{ margin: "0 0 2px", fontSize: 36, fontWeight: 900, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {fmt(sumaBiezaca)}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 500 }}>
              łączne koszty domowe
            </p>
          </div>

          <div style={{ height: 1, background: T.border }} />

          {/* category breakdown */}
          <div style={{ padding: "14px 20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {byKat.map((k, i) => {
              const pctW = Math.round((k.suma / sumaBiezaca) * 100);
              return (
                <div key={k.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 16 }}>{k.icon}</span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: "var(--body)" }}>{k.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.sub, fontFamily: "var(--body)" }}>{pctW}%</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: k.color, fontFamily: "var(--display)", letterSpacing: "-0.02em", minWidth: 70, textAlign: "right" }}>
                      {fmt(k.suma)}
                    </span>
                  </div>
                  <div style={{ height: 3, background: T.border, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pctW}%`, height: "100%", background: k.color, borderRadius: 99, transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: T.border }} />

          {/* add button */}
          <div style={{ padding: "12px 20px" }}>
            <button onClick={() => setAddOpen(true)} style={{
              width: "100%", padding: "13px 0",
              background: `${T.blue}10`, color: T.blue,
              border: `1.5px solid ${T.blue}44`, borderRadius: 12,
              fontSize: 14, fontFamily: "var(--body)", fontWeight: 700,
              cursor: "pointer",
            }}>
              + Dodaj rachunek
            </button>
          </div>
        </div>

        {/* ── OSTATNIE RACHUNKI ── */}
        <div style={{ margin: "0 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
              Ostatnie rachunki
            </p>
            <span style={{ fontSize: 10, color: T.sub, fontFamily: "var(--body)", fontWeight: 600 }}>{bills.length} wpisów</span>
          </div>
          {bills.slice(0, 6).map((b, i) => {
            const k = getKat(b.kat);
            return (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                borderBottom: i < Math.min(bills.length, 6) - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${k.color}12`, border: `1px solid ${k.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                }}>{k.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.ink, fontFamily: "var(--body)" }}>{k.label}</p>
                  <p style={{ margin: 0, fontSize: 10, color: T.sub, fontFamily: "var(--body)", fontWeight: 500 }}>{b.miesiac} · {b.dzien}</p>
                </div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: "var(--display)", letterSpacing: "-0.02em" }}>
                  {fmt(b.kwota)}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── WYKRES ROCZNY ── */}
        <MonthlyChart totals={MONTHLY_TOTALS} />

        {/* ── PRZYCISK i ── */}
        <div style={{ margin: "2px 16px 20px", display: "flex", justifyContent: "center" }}>
          <button onClick={() => setIdeaOpen(true)} className="pulse-btn" style={{
            display: "flex", alignItems: "center", gap: 10,
            background: T.surface, border: `1.5px solid ${T.blue}44`,
            borderRadius: 12, padding: "11px 24px",
            cursor: "pointer", fontFamily: "var(--body)",
            fontWeight: 700, fontSize: 13, color: T.blue,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: T.blue, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 900, fontFamily: "var(--display)",
            }}>i</div>
            Idea tego ekranu
          </button>
        </div>

      </div>

      {addOpen  && <AddBillModal  onClose={() => setAddOpen(false)}  onAdd={handleAdd} />}
      {ideaOpen && <IdeaModal     onClose={() => setIdeaOpen(false)} />}
    </>
  );
}