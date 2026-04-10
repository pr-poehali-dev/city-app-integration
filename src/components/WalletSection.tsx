import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ORDER_HISTORY, PAYMENT_METHODS } from "@/components/citygo.types";

export default function WalletSection() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="px-4 pt-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Oswald" }}>Кошелёк</h2>
          <p className="text-muted-foreground text-sm">Оплата и управление</p>
        </div>
        <button className="glass-card rounded-xl p-2.5"><Icon name="Plus" size={20} className="text-primary" /></button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
        {PAYMENT_METHODS.map((card, i) => (
          <div key={card.id} onClick={() => setActiveCard(i)}
            className={`flex-none w-64 h-36 rounded-3xl p-5 cursor-pointer transition-all bg-gradient-to-br ${card.color} ${activeCard === i ? "scale-105 shadow-2xl" : "opacity-80"}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/80 text-xs font-medium">{card.brand}</span>
              <Icon name="Wifi" size={12} className="text-white/80" />
            </div>
            <div className="text-white font-bold text-lg" style={{ fontFamily: "Oswald" }}>{card.number}</div>
            {card.balance && <div className="text-white/90 text-2xl font-black mt-1" style={{ fontFamily: "Oswald" }}>{card.balance}</div>}
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="text-sm font-semibold mb-3">Платёжные системы</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "ЮKassa", color: "from-blue-600 to-blue-800", emoji: "💳" },
            { name: "СБП", color: "from-green-600 to-emerald-700", emoji: "⚡" },
            { name: "CloudPay", color: "from-purple-600 to-violet-800", emoji: "☁️" },
          ].map((ps) => (
            <div key={ps.name} className={`rounded-xl p-3 bg-gradient-to-br ${ps.color} text-center`}>
              <div className="text-xl mb-1">{ps.emoji}</div>
              <div className="text-white text-xs font-bold">{ps.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="text-sm font-semibold mb-3">Последние операции</div>
        {ORDER_HISTORY.slice(0, 3).map((op) => (
          <div key={op.id} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-base">
                {{ taxi: "🚖", food: "🍔", delivery: "📦" }[op.type] || "💳"}
              </div>
              <div>
                <div className="text-sm font-medium">{op.title}</div>
                <div className="text-xs text-muted-foreground">{op.date}</div>
              </div>
            </div>
            <span className="text-sm font-bold text-pink-400">−{op.amount}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="gradient-primary text-white rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2">
          <Icon name="Plus" size={18} />Пополнить
        </button>
        <button className="glass-card rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2">
          <Icon name="ArrowUpRight" size={18} className="text-primary" />Вывести
        </button>
      </div>
    </div>
  );
}
