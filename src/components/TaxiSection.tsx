import Icon from "@/components/ui/icon";

interface TaxiProps {
  taxiFrom: string; setTaxiFrom: (v: string) => void;
  taxiTo: string; setTaxiTo: (v: string) => void;
  taxiClass: "economy" | "comfort" | "business"; setTaxiClass: (v: "economy" | "comfort" | "business") => void;
  taxiPrices: Record<string, number>; taxiTime: Record<string, string>;
  orderPlaced: boolean; setOrderPlaced: (v: boolean) => void;
}

export default function TaxiSection({ taxiFrom, setTaxiFrom, taxiTo, setTaxiTo, taxiClass, setTaxiClass, taxiPrices, taxiTime, orderPlaced, setOrderPlaced }: TaxiProps) {
  if (orderPlaced) {
    return (
      <div className="px-4 pt-6 animate-fade-in">
        <div className="glass-card rounded-3xl p-6 border border-primary/30 glow-purple text-center mb-4">
          <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center mb-4 animate-pulse-glow">
            <Icon name="Car" size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "Oswald" }}>Водитель едет!</h2>
          <p className="text-muted-foreground text-sm mb-4">Алексей К. · Toyota Camry · <span className="text-cyan-400 font-bold">А 123 МО</span></p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text" style={{ fontFamily: "Oswald" }}>4 мин</div>
              <div className="text-xs text-muted-foreground">до вас</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400" style={{ fontFamily: "Oswald" }}>4.9 ★</div>
              <div className="text-xs text-muted-foreground">рейтинг</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 glass-card rounded-xl py-3 flex items-center justify-center gap-2">
            <Icon name="MessageCircle" size={18} className="text-primary" />
            <span className="text-sm">Написать</span>
          </button>
          <button className="flex-1 glass-card rounded-xl py-3 flex items-center justify-center gap-2">
            <Icon name="Phone" size={18} className="text-cyan-400" />
            <span className="text-sm">Позвонить</span>
          </button>
          <button onClick={() => setOrderPlaced(false)} className="flex-1 glass-card rounded-xl py-3 flex items-center justify-center gap-2">
            <Icon name="X" size={18} className="text-destructive" />
            <span className="text-sm">Отменить</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "Oswald" }}>Заказать такси</h2>
      <p className="text-muted-foreground text-sm mb-4">Быстро и безопасно</p>

      <div className="glass-card rounded-2xl p-4 mb-4 border border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 flex-none" />
          <input value={taxiFrom} onChange={(e) => setTaxiFrom(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" placeholder="Откуда" />
        </div>
        <div className="ml-1.5 w-px h-4 bg-border my-1" />
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full border-2 border-primary flex-none" />
          <input value={taxiTo} onChange={(e) => setTaxiTo(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" placeholder="Куда едем?" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-3">Тариф</p>
        <div className="grid grid-cols-3 gap-2">
          {(["economy", "comfort", "business"] as const).map((cls) => (
            <button key={cls} onClick={() => setTaxiClass(cls)}
              className={`rounded-2xl p-3 text-center transition-all duration-300 ${taxiClass === cls ? "gradient-primary text-white glow-purple" : "glass-card"}`}>
              <div className="text-xl mb-1">{{ economy: "🚗", comfort: "🚙", business: "🏎" }[cls]}</div>
              <div className="text-xs font-semibold">{{ economy: "Эконом", comfort: "Комфорт", business: "Бизнес" }[cls]}</div>
              <div className={`text-lg font-bold mt-1 ${taxiClass === cls ? "text-white" : "gradient-text"}`} style={{ fontFamily: "Oswald" }}>{taxiPrices[cls]} ₽</div>
              <div className="text-xs opacity-70">{taxiTime[cls]} мин</div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Icon name="Wallet" size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Кошелёк CityGo</div>
            <div className="text-xs text-muted-foreground">3 450 ₽</div>
          </div>
        </div>
        <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
      </div>

      <button onClick={() => taxiTo && setOrderPlaced(true)}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${taxiTo ? "gradient-primary text-white glow-purple hover:scale-[1.02] active:scale-[0.98]" : "glass-card text-muted-foreground"}`}
        style={{ fontFamily: "Oswald" }}>
        {taxiTo ? `Заказать за ${taxiPrices[taxiClass]} ₽` : "Укажите адрес назначения"}
      </button>
    </div>
  );
}
