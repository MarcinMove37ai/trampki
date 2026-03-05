// src/components/AppLayout.jsx
"use client";
import { useState, useEffect } from "react";
import { T, DATA, NAV_MAIN, SUB_CELE, SUB_BUDZETY, MORE_ITEMS } from "@/lib/tokens";
import Pulpit from "@/app/screens/Pulpit";
import CelMiesieczny from "@/app/screens/CelMiesieczny";
import CeleRoczne from "@/app/screens/CeleRoczne";
import Silownia from "@/app/screens/Silownia";
import BudzetDomowy from "@/app/screens/BudzetDomowy";
import BudzetSzkolny from "@/app/screens/BudzetSzkolny";

// ─── GLOBAL STYLES ────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  :root {
    --display: 'Nunito', sans-serif;
    --body:    'Plus Jakarta Sans', sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F8FAFF; }
  ::-webkit-scrollbar { display: none; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-6px); }
    80%     { transform: translateX(6px); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(232,25,125,0.5); }
    70%  { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(232,25,125,0); }
    100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(232,25,125,0); }
  }
  .pulse-btn { animation: pulse-ring 2s infinite; }
`;

// ─── SCREEN REGISTRY ─────────────────────────
// Dodaj tu każdy nowy ekran
const SCREENS = {
  "pulpit":         (props) => <Pulpit {...props} />,
  "cel-miesiac":    (props) => <CelMiesieczny {...props} />,
  "cele-roczne":    (props) => <CeleRoczne {...props} />,
  "silownia":       (props) => <Silownia {...props} />,
  "budzet-domowy":  (props) => <BudzetDomowy {...props} />,
  "budzet-szkolny": (props) => <BudzetSzkolny {...props} />,
};

// ─── SESSION HELPERS (10 min) ─────────────────
const SESSION_KEY = "trampki_unlocked";
const SESSION_TTL = 10 * 60 * 1000;

const checkSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw);
    return Date.now() - ts < SESSION_TTL;
  } catch { return false; }
};

const saveSession = () => {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() })); } catch {}
};

// ─── PASSWORD GATE ────────────────────────────
function PasswordGate({ onUnlock }) {
  const [val,   setVal]   = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (val.toLowerCase() === "liki") {
      saveSession();
      onUnlock();
    } else {
      setError(true); setShake(true); setVal("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: T.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "0 32px",
    }}>
      <img src="/logo.webp" alt="Trampki na Giełdzie"
        style={{ height: 44, objectFit: "contain", marginBottom: 40 }} />

      <div style={{
        width: "100%", maxWidth: 340,
        background: T.surface, borderRadius: 20,
        border: `1px solid ${T.border}`,
        padding: "28px 24px 24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
        animation: shake ? "shake 0.45s ease" : "none",
      }}>
        <p style={{ margin: "0 0 4px", fontSize: 20, fontFamily: "var(--display)", color: T.ink, letterSpacing: "-0.02em" }}>
          Witaj!
        </p>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: T.sub, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.5 }}>
          Podaj hasło aby uzyskać dostęp.
        </p>
        <input
          type="password" placeholder="Hasło dostępu"
          value={val}
          onChange={e => { setVal(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          autoFocus
          style={{
            width: "100%", padding: "12px 14px",
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 600,
            color: T.ink, background: error ? "#FFF0F4" : T.bg,
            border: `1.5px solid ${error ? T.pink : T.border}`,
            borderRadius: 12, outline: "none",
            boxSizing: "border-box", letterSpacing: "0.1em",
            marginBottom: error ? 6 : 16, display: "block",
            transition: "border-color 0.2s, background 0.2s",
          }}
        />
        {error && (
          <p style={{ margin: "0 0 14px", fontSize: 11, color: T.pink, fontFamily: "var(--body)", fontWeight: 700 }}>
            Nieprawidłowe hasło. Spróbuj ponownie.
          </p>
        )}
        <button onClick={attempt} style={{
          width: "100%", padding: "13px 0",
          background: `linear-gradient(90deg, ${T.blue}, ${T.pink})`,
          color: "#fff", border: "none", borderRadius: 12,
          fontSize: 14, fontFamily: "var(--body)", fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.03em",
        }}>
          Wejdź →
        </button>
      </div>

      <p style={{ marginTop: 28, fontSize: 11, color: T.sub, fontFamily: "var(--body)", fontWeight: 500, textAlign: "center" }}>
        Trampki na Giełdzie · Wersja demo
      </p>
    </div>
  );
}

// ─── TOP BAR ──────────────────────────────────
function TopBar({ user }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px",
      borderBottom: `1px solid ${T.border}`,
      background: T.surface,
    }}>
      <img src="/logo.webp" alt="Trampki na Giełdzie"
        style={{ height: 32, width: "auto", objectFit: "contain" }} />

      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: T.bg, border: `1px solid ${T.border}`,
        borderRadius: 99, padding: "5px 12px 5px 7px",
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.blue}, ${T.pink})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: "var(--body)",
        }}>
          {user.name[0]}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: T.ink, fontFamily: "var(--body)" }}>{user.name}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: T.blue, fontFamily: "var(--body)" }}>{user.pts} pkt</span>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────
function BottomNav({ active, onChange, onSheet }) {
  return (
    <nav style={{
      borderTop: `1px solid ${T.border}`,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(16px)",
      display: "flex", height: 60, flexShrink: 0,
    }}>
      {NAV_MAIN.map((n, i) => {
        const on = active === i;
        return (
          <button key={i} onClick={() => {
            onChange(i);
            if (i === 1) onSheet("cele");
            else if (i === 3) onSheet("budzety");
            else if (i === 4) onSheet("more");
          }} style={{
            flex: 1, background: "none", border: "none",
            cursor: "pointer", height: 60, padding: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 3,
          }}>
            {n.icon
              ? <img src={n.icon} alt={n.label} style={{ width: 30, height: 30, objectFit: "contain" }} />
              : <span style={{ fontSize: 20, color: on ? T.pink : T.sub, lineHeight: 1 }}>···</span>
            }
            <span style={{
              fontSize: 8, fontWeight: 700, textAlign: "center",
              color: on ? T.pink : T.sub,
              fontFamily: "var(--body)", letterSpacing: "0.02em",
              lineHeight: 1.2, maxWidth: 64, display: "block", minHeight: 18,
            }}>{n.label}</span>
            <div style={{ height: 2, width: 14, borderRadius: 99, background: on ? T.pink : "transparent" }} />
          </button>
        );
      })}
    </nav>
  );
}

// ─── SHEET ────────────────────────────────────
function Sheet({ title, items, onClose, onSelect }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.38)", backdropFilter: "blur(6px)",
      zIndex: 500, display: "flex", alignItems: "flex-end",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 430, margin: "0 auto",
        background: T.surface, borderRadius: "20px 20px 0 0",
        paddingBottom: 80, boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
      }}>
        <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: T.border }} />
        </div>
        <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: T.sub, fontFamily: "var(--body)" }}>{title}</p>
          <button onClick={onClose} style={{
            background: T.bg, border: "none", borderRadius: 8,
            width: 28, height: 28, cursor: "pointer", fontSize: 14, color: T.sub,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        {items.map((item, i) => (
          <button key={i} onClick={() => { onClose(); onSelect(item.label); }} style={{
            width: "100%", background: "none", border: "none",
            borderTop: `1px solid ${T.border}`, padding: "13px 20px",
            display: "flex", alignItems: "center", gap: 14,
            cursor: "pointer", textAlign: "left",
          }}>
            {item.icon !== null && (
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, overflow: "hidden",
              }}>
                {item.isImg
                  ? <img src={item.icon} alt={item.label} style={{ width: 42, height: 42, objectFit: "contain" }} />
                  : item.icon}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: "var(--body)" }}>{item.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: T.sub, fontFamily: "var(--body)", fontWeight: 500 }}>{item.sub}</p>
            </div>
            <span style={{ color: T.border, fontSize: 18, lineHeight: 1 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MODAL (dodawanie transakcji) ─────────────
const CATS_IN  = ["Kieszonkowe", "Prezent", "Zarobki", "Sprzedaż", "Inne"];
const CATS_OUT = ["Jedzenie", "Rozrywka", "Ubrania", "Transport", "Szkoła", "Inne"];

function Modal({ type, onClose }) {
  const isIn   = type === "income";
  const accent = isIn ? T.green : T.red;
  const cats   = isIn ? CATS_IN : CATS_OUT;
  const [amount, setAmount] = useState("");
  const [cat, setCat]       = useState("");

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
          <p style={{ margin: 0, fontSize: 18, fontFamily: "var(--display)", color: accent, letterSpacing: "-0.02em" }}>
            {isIn ? "Dodaj przychód" : "Dodaj wydatek"}
          </p>
          <button onClick={onClose} style={{
            background: T.bg, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 16, color: T.sub,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
          <div style={{ position: "relative", marginBottom: 22 }}>
            <input
              type="number" placeholder="0" value={amount}
              onChange={e => setAmount(e.target.value)} autoFocus
              style={{
                width: "100%", fontSize: 42, fontFamily: "var(--display)",
                color: accent, border: "none", borderBottom: `2px solid ${accent}`,
                outline: "none", background: "none",
                padding: "6px 44px 6px 0", letterSpacing: "-0.04em",
                boxSizing: "border-box",
              }}
            />
            <span style={{ position: "absolute", right: 4, bottom: 12, fontSize: 16, color: T.sub, fontFamily: "var(--body)", fontWeight: 600 }}>zł</span>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, fontFamily: "var(--body)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Kategoria</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 28 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                background: cat === c ? accent : T.bg,
                color: cat === c ? "#fff" : T.ink,
                border: `1.5px solid ${cat === c ? accent : T.border}`,
                borderRadius: 8, padding: "6px 14px", fontSize: 12,
                fontFamily: "var(--body)", fontWeight: 600,
                cursor: "pointer", transition: "all .15s",
              }}>{c}</button>
            ))}
          </div>
          <button onClick={onClose} style={{
            width: "100%", padding: "14px 0",
            background: accent, color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.02em",
          }}>Zapisz</button>
        </div>
      </div>
    </div>
  );
}

// ─── MORE IDEAS DATA ──────────────────────────
const MORE_IDEAS = {
  "Weryfikacja Newsów AI": {
    accent: "#8B5CF6",
    subtitle: "Weryfikacja Newsów AI",
    bullets: [
      "Uczeń wkleja lub wpisuje zasłyszaną wiadomość finansową",
      "AI ocenia wiarygodność i wskazuje źródła weryfikacji",
      "Rozróżnianie faktów od clickbaitu i dezinformacji",
      "Budowanie krytycznego myślenia w erze fake newsów",
    ],
    body1: "W dobie mediów społecznościowych nastolatki są bombardowane nieprawdziwymi informacjami finansowymi — od fałszywych porad inwestycyjnych po sensacyjne nagłówki o kryptowalutach.",
    body2: "Moduł AI uczy weryfikacji źródeł i analizy wiarygodności — kompetencji kluczowej w XXI wieku.",
  },
  "Tabela przychodów": {
    accent: T.green,
    subtitle: "Tabela przychodów",
    bullets: [
      "Pełna historia wszystkich wpisanych przychodów",
      "Filtrowanie i sortowanie po kategorii i dacie",
      "Wykresy struktury przychodów — skąd pochodzi kieszonkowe",
      "Trendy miesięczne — czy przychody rosną czy maleją",
    ],
    body1: "Sama kwota salda to za mało — uczeń musi rozumieć skąd biorą się jego pieniądze i jak wiele zależy od regularności.",
    body2: "Tabela przychodów uczy analizy własnych finansów i dostrzegania wzorców w czasie.",
  },
  "Tabela wydatków": {
    accent: T.pink,
    subtitle: "Tabela wydatków",
    bullets: [
      "Historia wszystkich wydatków z podziałem na kategorie",
      "Limity kategorii — ile maksymalnie mogę wydać na rozrywkę",
      "Powiadomienie o zbliżaniu się do limitu",
      "Porównanie miesięczne — czy wydaję więcej niż miesiąc temu",
    ],
    body1: "Świadomość wydatków to pierwszy krok do ich kontroli. Uczeń często nie wie, że wydaje 80 zł miesięcznie na przekąski.",
    body2: "Limity kategorii wprowadzają pojęcie budżetowania — kluczowej umiejętności dorosłego życia.",
  },
  "Asystent AI": {
    accent: T.blue,
    subtitle: "Asystent AI",
    bullets: [
      "Chatbot z pełnym kontekstem finansów ucznia",
      "Odpowiedzi na pytania: czy stać mnie na X, kiedy osiągnę cel",
      "Proste wyjaśnienia pojęć finansowych — ETF, inflacja, procent składany",
      "Personalizowane porady oparte na historii transakcji",
    ],
    body1: "Asystent zna dane ucznia — wie ile ma oszczędności, jakie ma cele i jak wydaje. Dzięki temu jego porady są konkretne, nie ogólne.",
    body2: "Uczeń może zapytać wprost: 'Czy zdążę na PS6 do Świąt?' i dostanie kalkulację opartą na jego realnych danych.",
  },
  "Osiągnięcia": {
    accent: "#F59E0B",
    subtitle: "Osiągnięcia",
    bullets: [
      "Odznaki za kamienie milowe — pierwsza stówa, tydzień bez impulsów",
      "Streak — ile dni z rzędu korzystasz z aplikacji",
      "Poziomy — od Początkującego Oszczędzającego do Mistrza Finansów",
      "Ukryte odznaki za wyjątkowe zachowania",
    ],
    body1: "Gamifikacja finansów sprawia, że oszczędzanie staje się grą. Odznaki i poziomy dają poczucie postępu nawet gdy cel jest daleko.",
    body2: "Ukryte odznaki tworzą efekt zaskoczenia — uczeń odkrywa nagrody, których nie spodziewał się zdobyć.",
  },
};

// ─── MORE IDEA MODAL ──────────────────────────
function MoreIdeaModal({ label, onClose }) {
  const idea = MORE_IDEAS[label];
  if (!idea) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 3000, padding: "0 16px",
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
          <p style={{ margin: 0, fontSize: 18, fontFamily: "var(--display)", color: idea.accent, letterSpacing: "-0.02em" }}>
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
            {idea.subtitle}
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            {idea.body1}
          </p>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: T.ink, fontFamily: "var(--body)", fontWeight: 500, lineHeight: 1.7 }}>
            {idea.body2}
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
            Co znajdziesz na tym ekranie
          </p>
          {idea.bullets.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: idea.accent, marginTop: 5, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
          <div style={{
            marginTop: 18, background: T.bg, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>🚧</span>
            <p style={{ margin: 0, fontSize: 11, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.5 }}>
              Ten ekran jest planowany w kolejnej iteracji projektu.
            </p>
          </div>
          <button onClick={onClose} style={{
            marginTop: 16, width: "100%", padding: "14px 0",
            background: idea.accent, color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontFamily: "var(--body)", fontWeight: 700, cursor: "pointer",
          }}>Rozumiem</button>
        </div>
      </div>
    </div>
  );
}
export default function AppLayout() {
  const [unlocked,  setUnlocked]  = useState(() => checkSession());
  const [tab,       setTab]       = useState(0);
  const [sheet,     setSheet]     = useState(null);
  const [modal,     setModal]     = useState(null);
  const [screen,    setScreen]    = useState("pulpit");
  const [moreIdea,  setMoreIdea]  = useState(null);

  const navigate = (screenId) => { setSheet(null); setScreen(screenId); };

  const handleSheetSelect = (label) => {
    if (label === "Cel miesięczny") navigate("cel-miesiac");
    if (label === "Cele roczne")    navigate("cele-roczne");
    if (label === "Budżet Domowy")  navigate("budzet-domowy");
    if (label === "Budżet Szkolny") navigate("budzet-szkolny");
    // Pozycje z "Więcej" — otwórz modal z ideą ekranu
    if (MORE_IDEAS[label]) { setSheet(null); setMoreIdea(label); }
  };

  const screenProps = {
    navigate,
    openModal: setModal,
    data: DATA,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {!unlocked && <PasswordGate onUnlock={() => setUnlocked(true)} />}

      {unlocked && (
        <div style={{
          maxWidth: 430, minWidth: 360, margin: "0 auto",
          height: "100dvh", background: T.bg,
          fontFamily: "var(--body)",
          display: "flex", flexDirection: "column",
        }}>
          {/* PERSISTENT HEADER */}
          <TopBar user={DATA.user} />

          {/* SCROLLABLE SCREEN CONTENT */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {SCREENS[screen] ? SCREENS[screen](screenProps) : SCREENS["pulpit"](screenProps)}
          </div>

          {/* PERSISTENT BOTTOM NAV */}
          <BottomNav
            active={tab}
            onChange={(i) => {
              setTab(i);
              if (i === 0) setScreen("pulpit");
              if (i === 2) setScreen("silownia");
            }}
            onSheet={setSheet}
          />

          {/* SHEETS */}
          {sheet === "cele" && (
            <Sheet title="Twoje Cele" items={SUB_CELE}
              onClose={() => setSheet(null)} onSelect={handleSheetSelect} />
          )}
          {sheet === "budzety" && (
            <Sheet title="Twoje Budżety" items={SUB_BUDZETY}
              onClose={() => setSheet(null)} onSelect={handleSheetSelect} />
          )}
          {sheet === "more" && (
            <Sheet title="Więcej" items={MORE_ITEMS}
              onClose={() => { setSheet(null); setTab(0); }} onSelect={handleSheetSelect} />
          )}

          {/* MODALS */}
          {modal && <Modal type={modal} onClose={() => setModal(null)} />}
          {moreIdea && <MoreIdeaModal label={moreIdea} onClose={() => setMoreIdea(null)} />}
        </div>
      )}
    </>
  );
}