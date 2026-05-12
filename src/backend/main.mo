import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import InventoryTypes "types/inventory";
import InventoryMixin "mixins/inventory-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let userRooms = Map.empty<Principal, List.List<InventoryTypes.RoomInternal>>();

  include InventoryMixin(userRooms);
}
