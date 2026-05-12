// Migration from Magic Garden to Home Inventory Manager
// Drops old gardenRef and plantTypes stable state from the garden game.
import Map "mo:core/Map";
module {
  // Old types defined inline (from .old/src/backend/main.mo)
  type OldPlantType = { cost : Nat; name : Text; reward : Nat };
  type OldPlot = {
    growthPoints : Nat;
    growthStage : Nat;
    lastFertilized : Int;
    lastWatered : Int;
    plantType : ?OldPlantType;
  };
  type OldPlayerState = {
    coins : Nat;
    plots : [OldPlot];
    seedInventory : Map.Map<Text, Nat>;
  };

  // OldActor matches the old stable signature exactly
  public type OldActor = {
    gardenRef : Map.Map<Principal, OldPlayerState>;
    plantTypes : [OldPlantType];
  };

  // NewActor is empty — all new state is freshly initialized
  public type NewActor = {};

  public func run(_old : OldActor) : NewActor {
    {};
  };
};
