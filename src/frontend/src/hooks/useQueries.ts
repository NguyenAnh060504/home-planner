import { createActor } from "@/backend";
import type { GridPos, ItemId, RoomId } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { GridPos, ItemId, RoomId };

export function useGetRooms() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRooms();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAddItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      name,
      emoji,
    }: {
      roomId: RoomId;
      name: string;
      emoji: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addItem(roomId, name, emoji, null);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useRemoveItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      itemId,
    }: { roomId: RoomId; itemId: ItemId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeItem(roomId, itemId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function usePlaceItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      itemId,
      pos,
    }: {
      roomId: RoomId;
      itemId: ItemId;
      pos: GridPos;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.placeItem(roomId, itemId, pos);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useMoveItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      fromPos,
      toPos,
    }: {
      roomId: RoomId;
      fromPos: GridPos;
      toPos: GridPos;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.moveItem(roomId, fromPos, toPos);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useRemoveFromGrid() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ roomId, pos }: { roomId: RoomId; pos: GridPos }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeFromGrid(roomId, pos);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}
