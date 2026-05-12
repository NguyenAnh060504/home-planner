import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GridPos {
    col: bigint;
    row: bigint;
}
export type RoomId = bigint;
export interface Room {
    id: RoomId;
    grid: Array<PlacedItem>;
    name: string;
    items: Array<Item>;
}
export interface Item {
    id: ItemId;
    name: string;
    color?: string;
    emoji: string;
}
export interface PlacedItem {
    pos: GridPos;
    itemId: ItemId;
}
export type ItemId = bigint;
export interface backendInterface {
    addItem(roomId: RoomId, name: string, emoji: string, color: string | null): Promise<Item | null>;
    createRoom(name: string): Promise<Room>;
    deleteRoom(roomId: RoomId): Promise<boolean>;
    getRooms(): Promise<Array<Room>>;
    moveItem(roomId: RoomId, fromPos: GridPos, toPos: GridPos): Promise<boolean>;
    placeItem(roomId: RoomId, itemId: ItemId, pos: GridPos): Promise<boolean>;
    removeFromGrid(roomId: RoomId, pos: GridPos): Promise<boolean>;
    removeItem(roomId: RoomId, itemId: ItemId): Promise<boolean>;
}
