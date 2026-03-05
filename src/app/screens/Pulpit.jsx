// src/app/screens/Pulpit.jsx
"use client";
import { useState, useEffect } from "react";
import { T, pct, fmt, bold, Bar, Rule, Label, Card } from "@/lib/tokens";

// ─── MONTH CARD ───────────────────────────────
function MonthCard({ m }) {
  const balance = m.income - m.expenses;
  const ratio   = pct(m.expenses, m.budget);
  const warn    = ratio >= 90;

  return (
    <Card>
      <div style={{ padding: "18px 20px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Label>{m.label}</Label>
          <span style={{ fontSize: 10, fontWeight: 700, color: warn ? T.red : T.green, fontFamily: "var(--body)" }}>
            {warn ? "⚠ Uwaga na budżet" : "✓ W budżecie"}
          </span>
        </div>
        <p style={{ margin: "10px 0 2px", fontSize: 36, letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "var(--display)", color: T.ink }}>
          {fmt(balance)}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 500 }}>do dyspozycji</p>
      </div>

      <Rule />

      <div style={{ display: "flex" }}>
        {[
          { label: "Przychody", value: m.income,   color: T.green },
          { label: "Wydatki",   value: m.expenses, color: T.red   },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 20px", borderRight: i === 0 ? `1px solid ${T.border}` : "none" }}>
            <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--body)" }}>
              {item.label}
            </p>
            <p style={{ margin: 0, fontSize: 20, fontFamily: "var(--display)", color: item.color, letterSpacing: "-0.02em" }}>
              {fmt(item.value)}
            </p>
          </div>
        ))}
      </div>

      <Rule />

      <div style={{ padding: "12px 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: T.sub, fontFamily: "var(--body)", fontWeight: 600 }}>Budżet miesięczny</span>
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "var(--body)", color: warn ? T.red : T.ink }}>
            {ratio}% · {fmt(m.budget)}
          </span>
        </div>
        <Bar value={m.expenses} max={m.budget} color={warn ? T.red : T.blue} />
      </div>
    </Card>
  );
}

// ─── ACTION BUTTONS ───────────────────────────
function Actions({ onIncome, onExpense }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {[
        { label: "+ Przychód", color: T.green, bg: "#ECFDF5", fn: onIncome  },
        { label: "− Wydatek",  color: T.pink,  bg: "#FFF0F7", fn: onExpense },
      ].map((b, i) => (
        <button key={i} onClick={b.fn}
          onPointerDown={e  => e.currentTarget.style.transform = "scale(0.97)"}
          onPointerUp={e    => e.currentTarget.style.transform = "scale(1)"}
          onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}
          style={{
            flex: 1, background: b.bg, color: b.color,
            border: `1.5px solid ${b.color}44`, borderRadius: 12,
            padding: "13px 0", fontSize: 14,
            fontFamily: "var(--body)", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.01em",
            transition: "transform 0.1s",
          }}
        >{b.label}</button>
      ))}
    </div>
  );
}

// ─── GOAL CARD (summary, on dashboard) ────────
function GoalCard({ goal, type, onClick }) {
  const p     = pct(goal.current, goal.target);
  const color = type === "monthly" ? T.pink : T.blue;
  const lbl   = type === "monthly" ? "Cel miesięczny" : "Cel roczny";
  const img   = type === "monthly" ? "/month.webp" : "/year.webp";

  return (
    <Card style={{ borderLeft: `4px solid ${color}`, cursor: "pointer" }} onClick={onClick}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.28, zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${color}06 0%, rgba(255,255,255,0.45) 70%)`, zIndex: 1 }} />

      <div style={{ padding: "18px 20px 20px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <Label>{lbl}</Label>
            <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.3, fontFamily: "var(--display)", color: T.ink, letterSpacing: "-0.01em" }}>
              {goal.name}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 28, fontFamily: "var(--display)", color, letterSpacing: "-0.04em" }}>{p}</span>
            <span style={{ fontSize: 14, fontFamily: "var(--display)", color }}>%</span>
          </div>
        </div>

        <Bar value={goal.current} max={goal.target} color={color} />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "baseline" }}>
          <span style={{ fontSize: 13, fontFamily: "var(--body)", fontWeight: 700, color: T.ink }}>
            {fmt(goal.current)}<span style={{ fontWeight: 500, color: T.sub }}> / {fmt(goal.target)}</span>
          </span>
          <span style={{ fontSize: 12, color: T.sub, fontFamily: "var(--body)", fontWeight: 500 }}>{goal.days} dni</span>
        </div>

        <div style={{ marginTop: 12, padding: "9px 12px", background: "rgba(255,255,255,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13 }}>💡</span>
          <p style={{ margin: 0, fontSize: 11, color: T.sub, fontFamily: "var(--body)", fontWeight: 600, lineHeight: 1.5 }}>
            Brakuje {fmt(goal.target - goal.current)}. Przy obecnym tempie zdążysz na czas.
          </p>
        </div>
      </div>
    </Card>
  );
}

// ─── ASSISTANT ────────────────────────────────
function Assistant({ tips }) {
  const [idx,  setIdx]  = useState(new Date().getDay() % tips.length);
  const [fade, setFade] = useState(true);

  const next = () => {
    setFade(false);
    setTimeout(() => { setIdx(i => (i + 1) % tips.length); setFade(true); }, 200);
  };

  return (
    <Card>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Label>Trampkowy Asystent</Label>
          <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: T.sub, fontSize: 16, lineHeight: 1, padding: 0 }}>↻</button>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, fontFamily: "var(--body)", fontWeight: 500, color: T.sub, opacity: fade ? 1 : 0, transition: "opacity 0.2s ease", minHeight: 48 }}>
          {bold(tips[idx])}
        </p>
        <div style={{ display: "flex", gap: 5, marginTop: 14 }}>
          {tips.map((_, i) => (
            <div key={i} style={{ height: 3, borderRadius: 99, width: i === idx ? 20 : 6, background: i === idx ? T.pink : T.border, transition: "width .3s ease" }} />
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── PULPIT SCREEN ────────────────────────────
export default function Pulpit({ data, openModal, navigate }) {
  const [show, setShow] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

  const anim = (i) => ({
    opacity:   show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(18px)",
    transition: `opacity .5s ease ${i * 65}ms, transform .5s cubic-bezier(.22,1,.36,1) ${i * 65}ms`,
  });

  return (
    <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={anim(0)}><MonthCard m={data.month} /></div>
      <div style={anim(1)}><Actions onIncome={() => openModal("income")} onExpense={() => openModal("expense")} /></div>
      <div style={anim(2)}><GoalCard goal={data.goalM} type="monthly" onClick={() => navigate("cel-miesiac")} /></div>
      <div style={anim(3)}><GoalCard goal={data.goalY} type="yearly"  onClick={() => navigate("cele-roczne")} /></div>
      <div style={anim(4)}><Assistant tips={data.tips} /></div>
    </div>
  );
}