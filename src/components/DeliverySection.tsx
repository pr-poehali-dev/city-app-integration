import React from "react";
import Icon from "@/components/ui/icon";
import { FOOD_PARTNERS } from "@/components/citygo.types";

interface DeliveryProps {
  cartItems: number[];
  setCartItems: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function DeliverySection({ cartItems, setCartItems }: DeliveryProps) {
  function toggle(id: number) {
    setCartItems((prev: number[]) => prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id]);
  }

  return (
    <div className="px-4 pt-4 animate-fade-in">
      <div className="relative rounded-3xl overflow-hidden mb-4 p-5" style={{ background: "linear-gradient(135deg, hsl(263 85% 35%), hsl(320 80% 30%))" }}>
        <div className="absolute top-0 right-0 text-8xl opacity-20 -mt-2">🛵</div>
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Oswald" }}>Доставка</h2>
        <p className="text-white/70 text-sm">Еда и товары за 30–60 минут</p>
        <div className="flex gap-2 mt-3">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">⚡ Быстро</span>
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">📍 По городу</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FOOD_PARTNERS.map((p, i) => (
          <div key={p.id} className="glass-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="text-4xl mb-2">{p.emoji}</div>
            <div className="font-semibold text-sm mb-1">{p.name}</div>
            <div className="text-xs text-muted-foreground mb-2">{p.time}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyan-400">★ {p.rating}</span>
              <button onClick={() => toggle(p.id)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${cartItems.includes(p.id) ? "gradient-primary text-white" : "glass-card text-muted-foreground"}`}>
                <Icon name={cartItems.includes(p.id) ? "Check" : "Plus"} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40 animate-fade-in">
          <button className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-base glow-purple flex items-center justify-between px-6" style={{ fontFamily: "Oswald" }}>
            <span className="bg-white/20 text-white text-sm px-2.5 py-0.5 rounded-full">{cartItems.length}</span>
            <span>Оформить заказ</span>
            <span>{cartItems.length * 490} ₽</span>
          </button>
        </div>
      )}
    </div>
  );
}
