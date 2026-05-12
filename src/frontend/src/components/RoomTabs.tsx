import { motion } from "motion/react";
import type { Item, Room } from "../types";

interface Props {
  rooms: Room[];
  activeRoomIdx: number;
  items: Item[];
  onSelect: (idx: number) => void;
}

export function RoomTabs({ rooms, activeRoomIdx, items, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {rooms.map((room, idx) => {
        const isActive = idx === activeRoomIdx;
        const count = items.filter((i) => i.roomId === room.id).length;
        return (
          <motion.button
            key={room.id}
            type="button"
            onClick={() => onSelect(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm border-2 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              isActive ? room.activeTabColor : room.tabColor
            }`}
            data-ocid={`room.tab.${room.id}`}
          >
            <span className="text-lg">{room.emoji}</span>
            {room.name}
            {count > 0 && (
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-extrabold leading-none ${
                  isActive
                    ? "bg-white/30 text-white"
                    : "bg-black/10 text-current"
                }`}
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
