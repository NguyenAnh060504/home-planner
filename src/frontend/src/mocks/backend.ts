import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  getRooms: async () => [
    {
      id: BigInt(1),
      name: "Phòng khách",
      items: [
        { id: BigInt(1), name: "Sofa", emoji: "🛋️", color: "#e07b54" },
        { id: BigInt(2), name: "TV", emoji: "📺", color: "#5b8dee" },
        { id: BigInt(3), name: "Đèn", emoji: "💡", color: "#f7c948" },
      ],
      grid: [
        { itemId: BigInt(1), pos: { row: BigInt(0), col: BigInt(0) } },
        { itemId: BigInt(2), pos: { row: BigInt(1), col: BigInt(2) } },
        { itemId: BigInt(3), pos: { row: BigInt(2), col: BigInt(1) } },
      ],
    },
    {
      id: BigInt(2),
      name: "Phòng ngủ",
      items: [
        { id: BigInt(4), name: "Giường", emoji: "🛏️", color: "#a855f7" },
        { id: BigInt(5), name: "Gương", emoji: "🪞", color: "#ec4899" },
      ],
      grid: [
        { itemId: BigInt(4), pos: { row: BigInt(0), col: BigInt(1) } },
        { itemId: BigInt(5), pos: { row: BigInt(1), col: BigInt(0) } },
      ],
    },
    {
      id: BigInt(3),
      name: "Bếp",
      items: [
        { id: BigInt(6), name: "Tủ lạnh", emoji: "🧊", color: "#22d3ee" },
        { id: BigInt(7), name: "Nồi cơm", emoji: "🍚", color: "#4ade80" },
      ],
      grid: [
        { itemId: BigInt(6), pos: { row: BigInt(0), col: BigInt(0) } },
        { itemId: BigInt(7), pos: { row: BigInt(0), col: BigInt(2) } },
      ],
    },
  ],
  createRoom: async (name: string) => ({
    id: BigInt(99),
    name,
    items: [],
    grid: [],
  }),
  deleteRoom: async () => true,
  addItem: async (_roomId, name, emoji, color) => ({
    id: BigInt(Math.floor(Math.random() * 1000)),
    name,
    emoji,
    color: color ?? undefined,
  }),
  placeItem: async () => true,
  moveItem: async () => true,
  removeItem: async () => true,
  removeFromGrid: async () => true,
};
