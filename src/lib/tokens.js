// src/lib/tokens.js

// ─── DESIGN TOKENS ───────────────────────────
export const T = {
  pink:    "#E8197D",
  blue:    "#2563EB",
  green:   "#059669",
  red:     "#E8197D",
  ink:     "#0F172A",
  sub:     "#64748B",
  border:  "#E2E8F0",
  surface: "#FFFFFF",
  bg:      "#F8FAFF",
};

// ─── MOCK DATA ────────────────────────────────
export const DATA = {
  user:  { name: "Kacper", level: "Oszczędzający", pts: 340 },
  month: { label: "Marzec 2026", income: 480, expenses: 213, budget: 600 },
  goalM: { name: "Słuchawki Sony WH-1000XM5", current: 185, target: 350, days: 18 },
  goalY: { name: "PlayStation 6",              current: 720, target: 2400, days: 214 },
  dailySavings:   [12,0,8,15,0,10,5,0,18,12,0,9,14,0,11,8,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0],
  monthlySavings: [95, 110, 80, 145, 130, 160, 0, 0, 0, 0, 0, 0],
  tips: [
    "Do słuchawek brakuje Ci jeszcze **165 zł**. Przy obecnym tempie zdążysz na czas.",
    "Wydatki na rozrywkę osiągnęły **87%** limitu miesięcznego.",
    "Ten tydzień był o **23% oszczędniejszy** niż poprzedni — tak trzymaj.",
    "Przy odkładaniu 50 zł miesięcznie masz **655 zł** po roku przy stopie 5%.",
    "Klasa 2B jest **#1 w szkole** w oszczędzaniu energii. Dobra robota!",
    "Saldo marca: **+267 zł**. Jesteś na dobrej drodze do celu rocznego.",
  ],
};

// ─── NAV CONFIG ───────────────────────────────
export const NAV_MAIN = [
  { icon: "/1.webp", label: "Pulpit finansowy"   },
  { icon: "/2.webp", label: "Twoje Cele"         },
  { icon: "/3.webp", label: "Siłownia Finansowa" },
  { icon: "/4.webp", label: "Twoje Budżety"      },
  { icon: null,      label: "Więcej"             },
];

export const SUB_CELE = [
  { icon: "/5.webp", label: "Cel miesięczny", sub: "Bieżący cel do realizacji", isImg: true },
  { icon: "/6.webp", label: "Cele roczne",    sub: "Długoterminowe marzenia",   isImg: true },
];

export const SUB_BUDZETY = [
  { icon: "/7.webp", label: "Budżet Domowy",  sub: "Śledzenie mediów w domu",   isImg: true },
  { icon: "/8.webp", label: "Budżet Szkolny", sub: "IoT + rywalizacja klasowa", isImg: true },
];

export const MORE_ITEMS = [
  { icon: null, label: "Weryfikacja Newsów AI", sub: "Sprawdź wiarygodność informacji" },
  { icon: null, label: "Tabela przychodów",      sub: "Historia i analiza wpływów"      },
  { icon: null, label: "Tabela wydatków",        sub: "Historia i limity kategorii"     },
  { icon: null, label: "Asystent AI",            sub: "Chatbot z kontekstem finansowym" },
  { icon: null, label: "Osiągnięcia",            sub: "Odznaki i postęp"               },
];

// ─── UTILS ───────────────────────────────────
export const pct = (a, b) => Math.min(100, Math.round((a / b) * 100));
export const fmt = (n)    => n.toLocaleString("pl-PL") + "\u00a0zł";

export function bold(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((p, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: T.ink, fontWeight: 700 }}>{p}</strong>
      : <span key={i}>{p}</span>
  );
}

// ─── PRIMITIVE COMPONENTS ────────────────────
export function Bar({ value, max, color }) {
  color = color || T.pink;
  return (
    <div style={{ height: 3, background: T.border, borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        width: `${pct(value, max)}%`, height: "100%",
        background: color, borderRadius: 99,
        transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
      }} />
    </div>
  );
}

export function Rule() {
  return <div style={{ height: 1, background: T.border }} />;
}

export function Label({ children }) {
  return (
    <p style={{
      margin: 0, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: T.sub, fontFamily: "var(--body)",
    }}>
      {children}
    </p>
  );
}

export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.surface, borderRadius: 16,
        border: `1px solid ${T.border}`,
        overflow: "hidden", position: "relative",
        ...(style || {}),
      }}
    >
      {children}
    </div>
  );
}