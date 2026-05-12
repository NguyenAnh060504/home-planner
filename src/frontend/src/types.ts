export interface Item {
  id: string; // stringified bigint from backend
  name: string;
  emoji: string;
  roomId: string; // stringified bigint from backend
  gridX: number | null; // null = in inventory, not placed
  gridY: number | null;
}

export interface Room {
  id: string; // stringified bigint
  name: string;
  emoji: string;
  gradient: string;
  tabColor: string;
  activeTabColor: string;
  items: Item[];
}

export const ROOMS_META: {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  tabColor: string;
  activeTabColor: string;
}[] = [
  {
    id: "0",
    name: "Phòng khách",
    emoji: "🛋️",
    gradient: "room-living",
    tabColor: "bg-orange-200 text-orange-800 border-orange-300",
    activeTabColor: "bg-orange-400 text-white border-orange-500 shadow-lg",
  },
  {
    id: "1",
    name: "Phòng ngủ",
    emoji: "🛏️",
    gradient: "room-bedroom",
    tabColor: "bg-purple-200 text-purple-800 border-purple-300",
    activeTabColor: "bg-purple-500 text-white border-purple-600 shadow-lg",
  },
  {
    id: "2",
    name: "Bếp",
    emoji: "🍳",
    gradient: "room-kitchen",
    tabColor: "bg-green-200 text-green-800 border-green-300",
    activeTabColor: "bg-green-500 text-white border-green-600 shadow-lg",
  },
  {
    id: "3",
    name: "Phòng tắm",
    emoji: "🚿",
    gradient: "room-bathroom",
    tabColor: "bg-teal-200 text-teal-800 border-teal-300",
    activeTabColor: "bg-teal-500 text-white border-teal-600 shadow-lg",
  },
];

// Fallback static rooms before backend loads
export const ROOMS: Room[] = ROOMS_META.map((meta) => ({ ...meta, items: [] }));

export const GRID_COLS = 8;
export const GRID_ROWS = 8;

// Stable CELLS array to avoid index key lint errors
export const CELLS = Array.from({ length: GRID_ROWS }, (_, y) =>
  Array.from({ length: GRID_COLS }, (_, x) => ({
    x,
    y,
    id: `cell-${x}-${y}`,
  })),
).flat();

// Emoji lookup table by keyword
export const EMOJI_MAP: Record<string, string> = {
  // Furniture
  sofa: "🛋️",
  "ghế sofa": "🛋️",
  ghế_sofa: "🛋️",
  ghe: "🪑",
  ghế: "🪑",
  chair: "🪑",
  ban: "🪵",
  bàn: "🪵",
  table: "🪵",
  giuong: "🛏️",
  giường: "🛏️",
  bed: "🛏️",
  tu: "🗄️",
  tủ: "🗄️",
  cabinet: "🗄️",
  wardrobe: "🗄️",
  "tủ quần áo": "🗄️",
  shelf: "📚",
  ke: "📚",
  kệ: "📚",
  // Electronics
  tv: "📺",
  "ti vi": "📺",
  tivi: "📺",
  television: "📺",
  phone: "📱",
  dienthoai: "📱",
  "điện thoại": "📱",
  laptop: "💻",
  maytinh: "💻",
  "máy tính": "💻",
  computer: "💻",
  loa: "🔊",
  speaker: "🔊",
  "loa bluetooth": "🔊",
  // Lighting
  den: "💡",
  đèn: "💡",
  lamp: "💡",
  light: "💡",
  "đèn ngủ": "🕯️",
  candle: "🕯️",
  // Kitchen
  "tủ lạnh": "🧊",
  fridg: "🧊",
  fridge: "🧊",
  lovisung: "🍳",
  "lò vi sóng": "📡",
  microwave: "📡",
  "máy pha cà phê": "☕",
  coffee: "☕",
  kettle: "🫖",
  "ấm đun": "🫖",
  "nồi cơm điện": "🍚",
  rice: "🍚",
  // Bathroom
  "bồn tắm": "🛁",
  bath: "🛁",
  toilet: "🚽",
  "bồn cầu": "🚽",
  mirror: "🪞",
  guong: "🪞",
  gương: "🪞",
  // Decoration
  plant: "🌿",
  cay: "🌿",
  cây: "🌿",
  "cây xanh": "🪴",
  hoa: "🌸",
  flower: "🌸",
  tranh: "🖼️",
  tranh_vi: "🖼️",
  painting: "🖼️",
  picture: "🖼️",
  carpet: "🧶",
  tham: "🧶",
  thảm: "🧶",
  // Storage
  box: "📦",
  hop: "📦",
  hộp: "📦",
  sach: "📚",
  sách: "📚",
  book: "📚",
  // Misc
  clock: "🕐",
  "đồng hồ": "🕐",
  donghobang: "🕐",
  bag: "👜",
  tui: "👜",
  túi: "👜",
  // Extra common items
  xe: "🚗",
  car: "🚗",
  bicycle: "🚲",
  xe_dap: "🚲",
  bong: "⚽",
  bóng: "⚽",
  ball: "⚽",
  toy: "🧸",
  do_choi: "🧸",
  đồ_chơi: "🧸",
  piano: "🎹",
  guitar: "🎸",
  nhac_cu: "🎵",
  quạt: "🌀",
  quat: "🌀",
  fan: "🌀",
  may_giat: "🫧",
  "máy giặt": "🫧",
  washer: "🫧",
  may_hut_bui: "🧹",
  "máy hút bụi": "🧹",
  vacuum: "🧹",
  tool: "🔧",
  key: "🔑",
  khoa: "🔑",
  khóa: "🔑",
};

export function lookupEmoji(name: string): string {
  const lower = name.toLowerCase().trim();
  // Direct match
  if (EMOJI_MAP[lower]) return EMOJI_MAP[lower];
  // Partial match
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      return emoji;
    }
  }
  // Fallback: use deterministic household emoji based on first char
  const fallbacks = ["📦", "🪑", "🪞", "🌿", "💡", "🖼️", "🧸", "⭐", "🏮", "🎀"];
  return fallbacks[Math.abs(lower.charCodeAt(0) % fallbacks.length)];
}
