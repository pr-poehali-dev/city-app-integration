import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Tab, ChatMsg } from "@/components/citygo.types";
import MapSection from "@/components/MapSection";
import TaxiSection from "@/components/TaxiSection";
import DeliverySection from "@/components/DeliverySection";
import WalletSection from "@/components/WalletSection";
import ProfileSection from "@/components/ProfileSection";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [taxiFrom, setTaxiFrom] = useState("ул. Ленина, 42");
  const [taxiTo, setTaxiTo] = useState("");
  const [taxiClass, setTaxiClass] = useState<"economy" | "comfort" | "business">("comfort");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
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
          {(["map", "taxi", "delivery", "wallet", "profile"] as Tab[]).map((tab) => {
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
