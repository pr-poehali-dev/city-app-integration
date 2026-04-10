export type Tab = "map" | "taxi" | "delivery" | "profile" | "wallet";

export interface ChatMsg {
  id: number;
  from: string;
  text: string;
  time: string;
}

export const FOOD_PARTNERS = [
  { id: 1, name: "Burger House", emoji: "🍔", time: "25–35 мин", rating: 4.8 },
  { id: 2, name: "Pizza Roma", emoji: "🍕", time: "30–45 мин", rating: 4.7 },
  { id: 3, name: "Sushi Zen", emoji: "🍣", time: "40–55 мин", rating: 4.9 },
  { id: 4, name: "Wok Street", emoji: "🍜", time: "20–30 мин", rating: 4.6 },
];

export const ORDER_HISTORY = [
  { id: 1, type: "taxi", title: "Такси: Центр → Аэропорт", date: "08 апр", amount: "890 ₽" },
  { id: 2, type: "food", title: "Burger House × 3 позиции", date: "07 апр", amount: "1 240 ₽" },
  { id: 3, type: "delivery", title: "ВкусВилл — продукты", date: "05 апр", amount: "2 180 ₽" },
  { id: 4, type: "taxi", title: "Такси: Офис → Дом", date: "04 апр", amount: "430 ₽" },
];

export const PAYMENT_METHODS = [
  { id: 1, number: "•••• 4821", brand: "МИР", color: "from-green-600 to-green-800" },
  { id: 2, number: "•••• 7734", brand: "VISA", color: "from-blue-600 to-purple-700" },
  { id: 3, number: "Кошелёк CityGo", brand: "⚡", balance: "3 450 ₽", color: "from-violet-600 to-pink-600" },
];
