import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CELLS, GRID_COLS } from "../types";
import type { Item, Room } from "../types";

interface CellProps {
  x: number;
  y: number;
  item: Item | undefined;
  isOver: boolean;
  onDrop: (gridX: number, gridY: number) => void;
  onDragOver: (gridX: number, gridY: number) => void;
  onDragLeave: () => void;
  onDragStartItem: (item: Item) => void;
  onRemoveItem: (id: string) => void;
}

function GridCell({
  x,
  y,
  item,
  isOver,
  onDrop,
  onDragOver,
  onDragLeave,
  onDragStartItem,
  onRemoveItem,
}: CellProps) {
  return (
    <div
      className={`drop-zone aspect-square rounded-lg flex items-center justify-center relative transition-all duration-150 ${
        isOver && !item
          ? "drag-over"
          : "bg-white/20 hover:bg-white/30 border border-white/10"
      } ${item ? "bg-white/60 shadow-sm" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(x, y);
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(x, y);
      }}
      data-ocid={`room.cell.${y * GRID_COLS + x + 1}`}
    >
      <AnimatePresence>
        {item && (
          <motion.div
            key={item.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            draggable
            onDragStart={() => onDragStartItem(item)}
            className="w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing group relative p-0.5"
            title={item.name}
          >
            <span className="text-2xl sm:text-3xl leading-none select-none">
              {item.emoji}
            </span>
            <span className="text-[9px] font-bold text-foreground/80 mt-0.5 truncate max-w-full px-0.5 leading-tight text-center">
              {item.name}
            </span>
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              aria-label={`Xóa ${item.name} khỏi lưới`}
              data-ocid="room.delete_button"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {isOver && !item && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xl pointer-events-none"
        >
          ✨
        </motion.div>
      )}
    </div>
  );
}

interface Props {
  items: Item[];
  room: Room;
  dragOverCell: { x: number; y: number } | null;
  onDrop: (gridX: number, gridY: number) => void;
  onDragOver: (gridX: number, gridY: number) => void;
  onDragLeave: () => void;
  onDragStartItem: (item: Item) => void;
  onRemoveItem: (id: string) => void;
}

export function RoomGrid({
  items,
  room,
  dragOverCell,
  onDrop,
  onDragOver,
  onDragLeave,
  onDragStartItem,
  onRemoveItem,
}: Props) {
  const getItem = (x: number, y: number) =>
    items.find((i) => i.roomId === room.id && i.gridX === x && i.gridY === y);

  return (
    <div
      className={`${room.gradient} rounded-3xl p-3 shadow-xl`}
      data-ocid="room.grid"
    >
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
      >
        {CELLS.map(({ x, y, id }) => (
          <GridCell
            key={id}
            x={x}
            y={y}
            item={getItem(x, y)}
            isOver={!!(dragOverCell?.x === x && dragOverCell?.y === y)}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragStartItem={onDragStartItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
}
