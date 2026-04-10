import { useState, useEffect } from "react";
import React from "react";
import Icon from "@/components/ui/icon";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Tab = "map" | "taxi" | "delivery" | "profile" | "wallet";



const FOOD_PARTNERS = [
  { id: 1, name: "Burger House", emoji: "🍔", time: "25–35 мин", rating: 4.8 },
  { id: 2, name: "Pizza Roma", emoji: "🍕", time: "30–45 мин", rating: 4.7 },
  { id: 3, name: "Sushi Zen", emoji: "🍣", time: "40–55 мин", rating: 4.9 },
  { id: 4, name: "Wok Street", emoji: "🍜", time: "20–30 мин", rating: 4.6 },
];

const ORDER_HISTORY = [
  { id: 1, type: "taxi", title: "Такси: Центр → Аэропорт", date: "08 апр", amount: "890 ₽" },
  { id: 2, type: "food", title: "Burger House × 3 позиции", date: "07 апр", amount: "1 240 ₽" },
  { id: 3, type: "delivery", title: "ВкусВилл — продукты", date: "05 апр", amount: "2 180 ₽" },
  { id: 4, type: "taxi", title: "Такси: Офис → Дом", date: "04 апр", amount: "430 ₽" },
];

const PAYMENT_METHODS = [
  { id: 1, number: "•••• 4821", brand: "МИР", color: "from-green-600 to-green-800" },
  { id: 2, number: "•••• 7734", brand: "VISA", color: "from-blue-600 to-purple-700" },
  { id: 3, number: "Кошелёк CityGo", brand: "⚡", balance: "3 450 ₽", color: "from-violet-600 to-pink-600" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [taxiFrom, setTaxiFrom] = useState("ул. Ленина, 42");
  const [taxiTo, setTaxiTo] = useState("");
  const [taxiClass, setTaxiClass] = useState<"economy" | "comfort" | "business">("comfort");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: "support", text: "Привет! Я Алиса, помогу с любым вопросом 😊", time: "12:30" },
  ]);

  const taxiPrices = { economy: 320, comfort: 490, business: 890 };
  const taxiTime = { economy: "8–12", comfort: "5–8", business: "3–5" };

  function handleSendMessage() {
    if (!chatMessage.trim()) return;
    const newMsgs = [
      ...chatMessages,
      { id: Date.now(), from: "user", text: chatMessage, time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) },
    ];
    setChatMessages(newMsgs);
    setChatMessage("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "support", text: "Спасибо за обращение! Обрабатываю ваш запрос...", time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center glow-purple">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "Oswald, sans-serif" }}>CG</span>
            </div>
            <span className="gradient-text font-bold text-lg" style={{ fontFamily: "Oswald, sans-serif" }}>CityGo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass-card rounded-full px-3 py-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Москва</span>
            </div>
            <button className="w-9 h-9 glass-card rounded-xl flex items-center justify-center">
              <Icon name="Bell" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pb-24">
        {activeTab === "map" && <MapSection />}
        {activeTab === "taxi" && (
          <TaxiSection
            taxiFrom={taxiFrom} setTaxiFrom={setTaxiFrom}
            taxiTo={taxiTo} setTaxiTo={setTaxiTo}
            taxiClass={taxiClass} setTaxiClass={setTaxiClass}
            taxiPrices={taxiPrices} taxiTime={taxiTime}
            orderPlaced={orderPlaced} setOrderPlaced={setOrderPlaced}
          />
        )}
        {activeTab === "delivery" && (
          <DeliverySection cartItems={cartItems} setCartItems={setCartItems} />
        )}
        {activeTab === "wallet" && <WalletSection />}
        {activeTab === "profile" && (
          <ProfileSection
            chatMessage={chatMessage} setChatMessage={setChatMessage}
            chatMessages={chatMessages} onSend={handleSendMessage}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-2">
          {(["map","taxi","delivery","wallet","profile"] as Tab[]).map((tab) => {
            const meta: Record<Tab, { icon: string; label: string }> = {
              map: { icon: "Map", label: "Карта" },
              taxi: { icon: "Car", label: "Такси" },
              delivery: { icon: "ShoppingBag", label: "Доставка" },
              wallet: { icon: "Wallet", label: "Кошелёк" },
              profile: { icon: "User", label: "Профиль" },
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab ? "tab-active scale-105" : "text-muted-foreground"
                }`}
              >
                <Icon name={meta[tab].icon} size={20} />
                <span className="text-[10px] font-medium">{meta[tab].label}</span>
                {tab === "delivery" && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* ── Координаты Поронайска ── */
const PORONAYSK = { lat: 49.2236, lng: 143.1069 };

const PORONAYSK_TRANSPORT: Array<{ id: number; lat: number; lng: number; type: string; line: string }> = [
  { id: 1, lat: 49.228, lng: 143.100, type: "bus", line: "А1" },
  { id: 2, lat: 49.220, lng: 143.112, type: "bus", line: "А3" },
  { id: 3, lat: 49.215, lng: 143.098, type: "bus", line: "А5" },
  { id: 4, lat: 49.232, lng: 143.115, type: "taxi", line: "🚖" },
  { id: 5, lat: 49.218, lng: 143.105, type: "taxi", line: "🚖" },
];

function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      color:white;
      width:34px;height:34px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;
      box-shadow:0 0 12px ${color}99;
      border:2px solid rgba(255,255,255,0.3);
      font-family:'Golos Text',sans-serif;
    ">${label}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function makeCenterIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:linear-gradient(135deg,#9333ea,#ec4899);
      width:42px;height:42px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 24px #9333ea88;
      border:3px solid rgba(255,255,255,0.4);
    ">📍</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
}

function MapLayer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

/* ── MAP ── */
function MapSection() {
  const [filter, setFilter] = useState("all");
  const filters = [
    { id: "all", label: "Всё" },
    { id: "bus", label: "🚌 Автобус" },
    { id: "taxi", label: "🚖 Такси" },
  ];

  const visible = PORONAYSK_TRANSPORT.filter(
    (d) => filter === "all" || d.type === filter
  );

  return (
    <div className="animate-fade-in">
      <div className="px-4 pt-4 pb-2">
        <div className="glass-card rounded-2xl flex items-center gap-3 px-4 py-3 border border-primary/20">
          <Icon name="Search" size={18} className="text-primary" />
          <input className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground outline-none" placeholder="Поронайск — найти место..." />
          <Icon name="Mic" size={16} className="text-muted-foreground" />
        </div>
      </div>

      <div className="flex gap-2 px-4 py-2 overflow-x-auto">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`flex-none px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.id ? "tab-active" : "glass-card text-muted-foreground"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Leaflet Map */}
      <div className="mx-4 rounded-3xl overflow-hidden relative z-0" style={{ height: "52vh" }}>
        <MapContainer
          center={[PORONAYSK.lat, PORONAYSK.lng]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          attributionControl={false}
        >
          <MapLayer />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Центральный маркер — Поронайск */}
          <Marker
            position={[PORONAYSK.lat, PORONAYSK.lng]}
            icon={makeCenterIcon()}
          >
            <Popup>
              <div style={{ fontFamily: "Golos Text,sans-serif", fontSize: 13, fontWeight: 600 }}>
                📍 Поронайск<br />
                <span style={{ fontWeight: 400, color: "#888" }}>Сахалинская область</span>
              </div>
            </Popup>
          </Marker>

          {/* Транспорт */}
          {visible.map((dot) => (
            <Marker
              key={dot.id}
              position={[dot.lat, dot.lng]}
              icon={makeIcon(
                dot.type === "bus" ? "#3b82f6" : "#facc15",
                dot.line
              )}
            >
              <Popup>
                <div style={{ fontFamily: "Golos Text,sans-serif", fontSize: 13 }}>
                  {dot.type === "bus" ? "🚌 Автобус" : "🚖 Такси"} · маршрут {dot.line}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Overlay badge */}
        <div className="absolute top-3 left-3 glass-card rounded-xl px-3 py-2 z-[1000]">
          <div className="text-xs text-muted-foreground">Онлайн</div>
          <div className="text-sm font-bold text-cyan-400">{visible.length} ТС</div>
        </div>
      </div>

      <div className="px-4 pt-3 grid grid-cols-3 gap-3">
        {[
          { icon: "Navigation", label: "Маршрут", color: "from-violet-600 to-purple-700" },
          { icon: "Clock", label: "Расписание", color: "from-blue-600 to-cyan-600" },
          { icon: "Star", label: "Избранное", color: "from-pink-600 to-rose-600" },
        ].map((a) => (
          <button key={a.label} className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary/40 transition-all active:scale-95">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center`}>
              <Icon name={a.icon} size={18} className="text-white" />
            </div>
            <span className="text-xs text-muted-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── TAXI ── */
interface TaxiProps {
  taxiFrom: string; setTaxiFrom: (v: string) => void;
  taxiTo: string; setTaxiTo: (v: string) => void;
  taxiClass: "economy" | "comfort" | "business"; setTaxiClass: (v: "economy" | "comfort" | "business") => void;
  taxiPrices: Record<string, number>; taxiTime: Record<string, string>;
  orderPlaced: boolean; setOrderPlaced: (v: boolean) => void;
}
function TaxiSection({ taxiFrom, setTaxiFrom, taxiTo, setTaxiTo, taxiClass, setTaxiClass, taxiPrices, taxiTime, orderPlaced, setOrderPlaced }: TaxiProps) {
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

/* ── DELIVERY ── */
interface DeliveryProps { cartItems: number[]; setCartItems: React.Dispatch<React.SetStateAction<number[]>>; }
function DeliverySection({ cartItems, setCartItems }: DeliveryProps) {
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

/* ── WALLET ── */
function WalletSection() {
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

/* ── PROFILE ── */
interface ChatMsg { id: number; from: string; text: string; time: string; }
interface ProfileProps {
  chatMessage: string; setChatMessage: (v: string) => void;
  chatMessages: ChatMsg[]; onSend: () => void;
}
function ProfileSection({ chatMessage, setChatMessage, chatMessages, onSend }: ProfileProps) {
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

      <button className="w-full glass-card rounded-2xl py-3.5 text-sm text-destructive font-medium flex items-center justify-center gap-2">
        <Icon name="LogOut" size={16} />Выйти из аккаунта
      </button>
    </div>
  );
}