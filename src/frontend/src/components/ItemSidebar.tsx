import { X } from "lucide-react";
import { motion } from "motion/react";
import type { Item, Room } from "../types";

interface Props {
  items: Item[];
  room: Room;
  onRemove: (id: string) => void;
  onDragStart: (item: Item) => void;
}

export function ItemSidebar({ items, room, onRemove, onDragStart }: Props) {
  const roomItems = items.filter((i) => i.roomId === room.id);
  const unplacedItems = roomItems.filter((i) => i.gridX === null);
  const placedItems = roomItems.filter((i) => i.gridX !== null);

  return (
    <div className="flex flex-col gap-3 h-full">
      {unplacedItems.length > 0 && (
        <>
          <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest px-1">
            Chưa xếp ({unplacedItems.length})
          </p>
          <div className="flex flex-col gap-1.5">
            {unplacedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                draggable
                onDragStart={() => onDragStart(item)}
                className="item-card flex items-center gap-2 px-3 py-2 select-none border-2 border-primary/30"
                data-ocid={`inventory.item.${idx + 1}`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="flex-1 text-sm font-bold text-foreground truncate min-w-0">
                  {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-foreground/30 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  aria-label={`Xóa ${item.name}`}
                  data-ocid={`inventory.delete_button.${idx + 1}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {placedItems.length > 0 && (
        <>
          <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest px-1">
            Đã xếp ({placedItems.length})
          </p>
          <div className="flex flex-col gap-1.5">
            {placedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                draggable
                onDragStart={() => onDragStart(item)}
                className="item-card flex items-center gap-2 px-3 py-2 select-none opacity-70"
                data-ocid={`inventory.placed.item.${idx + 1}`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="flex-1 text-sm font-bold text-foreground truncate min-w-0">
                  {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-foreground/30 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  aria-label={`Xóa ${item.name}`}
                  data-ocid={`inventory.delete_placed.${idx + 1}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {roomItems.length === 0 && (
        <div
          data-ocid="inventory.empty_state"
          className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center"
        >
          <span className="text-4xl">🏮</span>
          <p className="text-xs text-foreground/50 font-body">
            Chưa có đồ vật nào.
            <br />
            Hãy thêm vào bên dưới!
          </p>
        </div>
      )}
    </div>
  );
}
