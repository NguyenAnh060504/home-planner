import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { lookupEmoji } from "../types";

interface Props {
  roomId: string;
  onAdd: (name: string, emoji: string, roomId: string) => void;
}

export function AddItemForm({ roomId, onAdd }: Props) {
  const [name, setName] = useState("");
  const [previewEmoji, setPreviewEmoji] = useState("");

  function handleChange(val: string) {
    setName(val);
    if (val.trim().length >= 2) {
      setPreviewEmoji(lookupEmoji(val));
    } else {
      setPreviewEmoji("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const emoji = lookupEmoji(trimmed);
    onAdd(trimmed, emoji, roomId);
    setName("");
    setPreviewEmoji("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="relative">
        <AnimatePresence>
          {previewEmoji && (
            <motion.div
              key={previewEmoji}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
            >
              {previewEmoji}
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type="text"
          value={name}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Nhập tên đồ vật..."
          className="w-full rounded-xl border-2 border-border bg-background text-foreground placeholder:text-foreground/40 text-sm font-body py-2.5 px-3 outline-none focus:border-primary transition-colors"
          style={{ paddingLeft: previewEmoji ? "2.75rem" : "0.75rem" }}
          data-ocid="inventory.input"
          autoComplete="off"
        />
      </div>

      {/* Emoji hint strip */}
      {name.trim().length >= 1 && name.trim().length < 2 && (
        <p className="text-xs text-foreground/40 text-center">
          Tiếp tục nhập để tìm biểu tượng...
        </p>
      )}
      {previewEmoji && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/20 rounded-xl py-2"
        >
          <span className="text-3xl">{previewEmoji}</span>
          <div>
            <p className="text-xs font-bold text-foreground/70">
              Biểu tượng tìm thấy!
            </p>
            <p className="text-[11px] text-foreground/50">{name.trim()}</p>
          </div>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={!name.trim()}
        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        data-ocid="inventory.add_button"
      >
        <Sparkles className="w-4 h-4" />
        Thêm vào phòng
      </button>
    </form>
  );
}
