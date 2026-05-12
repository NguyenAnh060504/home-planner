/**
 * useBackend.ts — bridges backend React Query hooks into a unified
 * local state that the UI components consume.
 *
 * Layered approach:
 *  1. Load rooms/items from backend via useGetRooms()
 *  2. Optimistic local state layer for instant drag-drop feedback
 *  3. Each mutation fires a backend call + invalidates query cache
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ROOMS_META } from "../types";
import type { Item, Room } from "../types";
import {
  useAddItem,
  useGetRooms,
  useMoveItem,
  usePlaceItem,
  useRemoveFromGrid,
  useRemoveItem,
} from "./useQueries";

function getRoomMetaByIndex(index: number) {
  return ROOMS_META[index % ROOMS_META.length];
}

export function useHomeInventory() {
  const { data: backendRooms, isLoading } = useGetRooms();
  const addItemMut = useAddItem();
  const removeItemMut = useRemoveItem();
  const placeItemMut = usePlaceItem();
  const moveItemMut = useMoveItem();
  const removeFromGridMut = useRemoveFromGrid();

  const [localItems, setLocalItems] = useState<Item[]>([]);
  const undoStackRef = useRef<Item[][]>([]);
  const [undoStackLen, setUndoStackLen] = useState(0);

  useEffect(() => {
    if (!backendRooms) return;
    const items: Item[] = [];
    for (const room of backendRooms) {
      for (const item of room.items) {
        const placed = room.grid.find((p) => p.itemId === item.id);
        items.push({
          id: String(item.id),
          name: item.name,
          emoji: item.emoji,
          roomId: String(room.id),
          gridX: placed ? Number(placed.pos.col) : null,
          gridY: placed ? Number(placed.pos.row) : null,
        });
      }
    }
    setLocalItems(items);
    undoStackRef.current = [];
    setUndoStackLen(0);
  }, [backendRooms]);

  const rooms: Room[] = useMemo(() => {
    if (!backendRooms) {
      return ROOMS_META.map((meta) => ({ ...meta, items: [] }));
    }
    return backendRooms.map((br, index) => {
      const meta = getRoomMetaByIndex(index);
      const roomItems = localItems.filter((i) => i.roomId === String(br.id));
      return { ...meta, id: String(br.id), name: br.name, items: roomItems };
    });
  }, [backendRooms, localItems]);

  const pushUndo = useCallback((snapshot: Item[]) => {
    undoStackRef.current = [...undoStackRef.current.slice(-19), snapshot];
    setUndoStackLen(undoStackRef.current.length);
  }, []);

  const addItem = useCallback(
    async (name: string, emoji: string, roomId: string) => {
      const bRoom = backendRooms?.find((r) => String(r.id) === roomId);
      if (!bRoom) return;
      try {
        await addItemMut.mutateAsync({ roomId: bRoom.id, name, emoji });
        toast.success(`✨ Đã thêm ${emoji} ${name}`);
      } catch {
        toast.error("Không thêm được đồ vật");
      }
    },
    [backendRooms, addItemMut],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      const item = localItems.find((i) => i.id === itemId);
      if (!item) return;
      const bRoom = backendRooms?.find((r) => String(r.id) === item.roomId);
      if (!bRoom) return;
      const bItem = bRoom.items.find((i) => String(i.id) === itemId);
      if (!bItem) return;
      pushUndo([...localItems]);
      setLocalItems((prev) => prev.filter((i) => i.id !== itemId));
      try {
        await removeItemMut.mutateAsync({ roomId: bRoom.id, itemId: bItem.id });
      } catch {
        setLocalItems((prev) => [...prev, item]);
        toast.error("Không xóa được đồ vật");
      }
    },
    [localItems, backendRooms, removeItemMut, pushUndo],
  );

  const placeItem = useCallback(
    async (itemId: string, roomId: string, gridX: number, gridY: number) => {
      const item = localItems.find((i) => i.id === itemId);
      if (!item) return;
      const bRoom = backendRooms?.find((r) => String(r.id) === roomId);
      if (!bRoom) return;
      const bItem = bRoom.items.find((i) => String(i.id) === itemId);
      if (!bItem) return;
      const targetOccupied = localItems.find(
        (i) =>
          i.roomId === roomId &&
          i.gridX === gridX &&
          i.gridY === gridY &&
          i.id !== itemId,
      );
      if (targetOccupied) return;
      pushUndo([...localItems]);
      const isPlaced = item.gridX !== null && item.gridY !== null;
      setLocalItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, roomId, gridX, gridY } : i)),
      );
      try {
        if (isPlaced) {
          await moveItemMut.mutateAsync({
            roomId: bRoom.id,
            fromPos: { row: BigInt(item.gridY!), col: BigInt(item.gridX!) },
            toPos: { row: BigInt(gridY), col: BigInt(gridX) },
          });
        } else {
          await placeItemMut.mutateAsync({
            roomId: bRoom.id,
            itemId: bItem.id,
            pos: { row: BigInt(gridY), col: BigInt(gridX) },
          });
        }
      } catch {
        setLocalItems((prev) => prev.map((i) => (i.id === itemId ? item : i)));
        toast.error("Không di chuyển được đồ vật");
      }
    },
    [localItems, backendRooms, placeItemMut, moveItemMut, pushUndo],
  );

  const removeFromGrid = useCallback(
    async (itemId: string) => {
      const item = localItems.find((i) => i.id === itemId);
      if (!item || item.gridX === null || item.gridY === null) return;
      const bRoom = backendRooms?.find((r) => String(r.id) === item.roomId);
      if (!bRoom) return;
      pushUndo([...localItems]);
      setLocalItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, gridX: null, gridY: null } : i,
        ),
      );
      try {
        await removeFromGridMut.mutateAsync({
          roomId: bRoom.id,
          pos: { row: BigInt(item.gridY), col: BigInt(item.gridX) },
        });
      } catch {
        setLocalItems((prev) => prev.map((i) => (i.id === itemId ? item : i)));
        toast.error("Không xóa khỏi lưới được");
      }
    },
    [localItems, backendRooms, removeFromGridMut, pushUndo],
  );

  const undo = useCallback(() => {
    const stack = undoStackRef.current;
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    undoStackRef.current = stack.slice(0, -1);
    setUndoStackLen(undoStackRef.current.length);
    setLocalItems(prev);
    toast.info("↩️ Đã hoàn tác");
  }, []);

  const resetRoom = useCallback(
    async (roomId: string) => {
      const roomGridItems = localItems.filter(
        (i) => i.roomId === roomId && i.gridX !== null,
      );
      if (roomGridItems.length === 0) return;
      pushUndo([...localItems]);
      setLocalItems((prev) =>
        prev.map((i) =>
          i.roomId === roomId ? { ...i, gridX: null, gridY: null } : i,
        ),
      );
      const bRoom = backendRooms?.find((r) => String(r.id) === roomId);
      if (!bRoom) return;
      try {
        await Promise.all(
          roomGridItems.map((i) =>
            removeFromGridMut.mutateAsync({
              roomId: bRoom.id,
              pos: { row: BigInt(i.gridY!), col: BigInt(i.gridX!) },
            }),
          ),
        );
        toast.success("🧹 Đã dọn sạch phòng");
      } catch {
        toast.error("Có lỗi khi dọn phòng");
      }
    },
    [localItems, backendRooms, removeFromGridMut, pushUndo],
  );

  const canUndo = undoStackLen > 0;

  return {
    rooms,
    items: localItems,
    isLoading,
    addItem,
    removeItem,
    placeItem,
    removeFromGrid,
    undo,
    canUndo,
    resetRoom,
  };
}
