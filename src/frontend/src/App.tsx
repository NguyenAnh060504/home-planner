import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home, RotateCcw, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { AddItemForm } from "./components/AddItemForm";
import { ItemSidebar } from "./components/ItemSidebar";
import { RoomGrid } from "./components/RoomGrid";
import { RoomTabs } from "./components/RoomTabs";
import { useHomeInventory } from "./hooks/useBackend";
import type { Item } from "./types";

const queryClient = new QueryClient();

function AppInner() {
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [dragOverCell, setDragOverCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const draggingItemRef = useRef<Item | null>(null);

  const {
    rooms,
    items,
    isLoading,
    addItem,
    removeItem,
    placeItem,
    removeFromGrid,
    undo,
    canUndo,
    resetRoom,
  } = useHomeInventory();

  const activeRoom = rooms[activeRoomIdx] ?? rooms[0];

  const handleAddItem = useCallback(
    (name: string, emoji: string, roomId: string) => {
      addItem(name, emoji, roomId);
    },
    [addItem],
  );

  const handleDrop = useCallback(
    (gridX: number, gridY: number) => {
      if (!draggingItemRef.current || !activeRoom) return;
      placeItem(draggingItemRef.current.id, activeRoom.id, gridX, gridY);
      draggingItemRef.current = null;
      setDragOverCell(null);
    },
    [placeItem, activeRoom],
  );

  const totalItems = items.length;
  const roomItems = activeRoom
    ? items.filter((i) => i.roomId === activeRoom.id)
    : [];
  const placedCount = roomItems.filter((i) => i.gridX !== null).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-foreground leading-tight">
                Quản Lý Đồ Nhà
              </h1>
              <p className="text-xs text-foreground/50 font-body">
                Kéo thả đồ vật vào căn phòng của bạn 🏮
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo */}
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-sm font-bold text-foreground/70 hover:text-foreground hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Hoàn tác"
              data-ocid="app.undo_button"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hoàn tác</span>
            </button>

            {/* Reset room */}
            <button
              type="button"
              onClick={() => activeRoom && resetRoom(activeRoom.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-sm font-bold text-foreground/70 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Dọn sạch phòng"
              data-ocid="app.reset_button"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Dọn phòng</span>
            </button>

            {/* Stats */}
            <div className="bg-muted/60 rounded-xl px-3 py-1.5 text-center border border-border ml-2">
              <div className="text-lg font-extrabold text-primary leading-none">
                {totalItems}
              </div>
              <div className="text-[10px] text-foreground/50 font-body">
                Đồ vật
              </div>
            </div>
            <div className="bg-muted/60 rounded-xl px-3 py-1.5 text-center border border-border">
              <div className="text-lg font-extrabold text-foreground leading-none">
                {rooms.length}
              </div>
              <div className="text-[10px] text-foreground/50 font-body">
                Phòng
              </div>
            </div>
          </div>
        </div>

        {/* Room tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <RoomTabs
            rooms={rooms}
            activeRoomIdx={activeRoomIdx}
            items={items}
            onSelect={setActiveRoomIdx}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4"
            data-ocid="app.loading_state"
          >
            <div className="text-5xl animate-spin">⚙️</div>
            <p className="font-bold text-foreground/60">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeRoom && (
              <motion.div
                key={activeRoom.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col lg:flex-row gap-5"
              >
                {/* Left sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
                  <div className="bg-card rounded-3xl border-2 border-border shadow-md p-4">
                    <h2 className="font-display font-extrabold text-base text-foreground mb-3 flex items-center gap-2">
                      <span className="text-xl">{activeRoom.emoji}</span>
                      {activeRoom.name}
                      <span className="ml-auto text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-bold">
                        {placedCount}/{roomItems.length}
                      </span>
                    </h2>
                    <AddItemForm roomId={activeRoom.id} onAdd={handleAddItem} />
                  </div>

                  <div className="bg-card rounded-3xl border-2 border-border shadow-md p-4 flex-1 min-h-0">
                    <ItemSidebar
                      items={items}
                      room={activeRoom}
                      onRemove={removeItem}
                      onDragStart={(item) => {
                        draggingItemRef.current = item;
                      }}
                    />
                  </div>
                </aside>

                {/* Room grid */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display font-extrabold text-lg text-foreground">
                      {activeRoom.emoji} {activeRoom.name}
                    </h2>
                    <p className="text-xs text-foreground/50">
                      Kéo thả đồ vật vào ô trống 🎯
                    </p>
                  </div>
                  <RoomGrid
                    items={items}
                    room={activeRoom}
                    dragOverCell={dragOverCell}
                    onDrop={handleDrop}
                    onDragOver={(x, y) => setDragOverCell({ x, y })}
                    onDragLeave={() => setDragOverCell(null)}
                    onDragStartItem={(item) => {
                      draggingItemRef.current = item;
                    }}
                    onRemoveItem={removeFromGrid}
                  />
                  <p className="text-center text-xs text-foreground/40 mt-3 font-body">
                    ⭐ Nhập tên đồ vật — biểu tượng sẽ tự động xuất hiện! Cầm
                    kéo vào ô để xếp.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 text-center mt-auto">
        <p className="text-xs text-foreground/40 font-body">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
