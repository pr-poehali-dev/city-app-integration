import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Icon from "@/components/ui/icon";

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

export default function MapSection() {
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
