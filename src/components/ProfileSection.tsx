import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ORDER_HISTORY, ChatMsg } from "@/components/citygo.types";

interface ProfileProps {
  chatMessage: string;
  setChatMessage: (v: string) => void;
  chatMessages: ChatMsg[];
  onSend: () => void;
  onLogout: () => void;
}

export default function ProfileSection({ chatMessage, setChatMessage, chatMessages, onSend, onLogout }: ProfileProps) {
  const [view, setView] = useState<"profile" | "history" | "chat">("profile");

  if (view === "history") return (
    <div className="px-4 pt-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setView("profile")} className="w-9 h-9 glass-card rounded-xl flex items-center justify-center">
          <Icon name="ArrowLeft" size={18} />
        </button>
        <h2 className="text-xl font-bold" style={{ fontFamily: "Oswald" }}>История заказов</h2>
      </div>
      <div className="space-y-3">
        {ORDER_HISTORY.map((order, i) => (
          <div key={order.id} className="glass-card rounded-2xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl">
                {{ taxi: "🚖", food: "🍔", delivery: "📦" }[order.type] || "💳"}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{order.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{order.date}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{order.amount}</div>
                <div className="text-xs text-cyan-400">✓ Выполнен</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === "chat") return (
    <div className="flex flex-col animate-fade-in" style={{ height: "calc(100vh - 160px)" }}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={() => setView("profile")} className="w-9 h-9 glass-card rounded-xl flex items-center justify-center">
          <Icon name="ArrowLeft" size={18} />
        </button>
        <div>
          <h2 className="font-bold" style={{ fontFamily: "Oswald" }}>Поддержка</h2>
          <p className="text-xs text-cyan-400">● Онлайн</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {chatMessages.map((msg: ChatMsg) => (
          <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.from === "user" ? "gradient-primary text-white rounded-br-md" : "glass-card rounded-bl-md"}`}>
              {msg.text}
              <div className="text-[10px] opacity-60 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-2">
        <div className="glass-card rounded-2xl flex items-center gap-2 px-3 py-2 border border-border/50">
          <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Напишите сообщение..." />
          <button onClick={onSend} className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-none">
            <Icon name="Send" size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 pt-4 animate-fade-in">
      <div className="glass-card rounded-3xl p-5 mb-4 border border-primary/20 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full gradient-primary opacity-20 blur-2xl" />
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl glow-purple">😎</div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "Oswald" }}>Александр И.</h2>
            <p className="text-muted-foreground text-sm">+7 (999) 123-45-67</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-cyan-400 text-xs">★ 4.9</span>
              <span className="text-muted-foreground text-xs">· 128 поездок</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{ label: "Поездки", value: "128" }, { label: "Заказы", value: "45" }, { label: "Сэкономлено", value: "2 400 ₽" }].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-2.5 text-center">
              <div className="font-bold gradient-text" style={{ fontFamily: "Oswald" }}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mb-4">
        {[
          { icon: "Clock", label: "История заказов", action: () => setView("history") },
          { icon: "Settings", label: "Настройки", action: () => {} },
          { icon: "Bell", label: "Уведомления", action: () => {} },
          { icon: "MessageCircle", label: "Чат с поддержкой", action: () => setView("chat") },
          { icon: "Gift", label: "Промокоды и бонусы", action: () => {} },
        ].map((item, i) => (
          <button key={item.label} onClick={item.action}
            className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-all ${i !== 4 ? "border-b border-border/30" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                <Icon name={item.icon} size={16} className="text-primary" />
              </div>
              <span className="text-sm">{item.label}</span>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full glass-card rounded-2xl py-3.5 text-sm text-destructive font-medium flex items-center justify-center gap-2 hover:border-destructive/30 transition-all active:scale-[0.98]"
      >
        <Icon name="LogOut" size={16} />Выйти из аккаунта
      </button>
    </div>
  );
}