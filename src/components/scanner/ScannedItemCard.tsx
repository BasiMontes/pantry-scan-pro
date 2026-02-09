import { Trash2, Plus, Minus } from "lucide-react";
import type { ScannedItem } from "@/types/scanner";
import { CATEGORIES, UNITS, CATEGORY_EMOJIS } from "@/types/scanner";

interface ScannedItemCardProps {
  item: ScannedItem;
  onUpdate: (id: string, updates: Partial<ScannedItem>) => void;
  onRemove: (id: string) => void;
}

export function ScannedItemCard({ item, onUpdate, onRemove }: ScannedItemCardProps) {
  return (
    <div className="fresco-card p-4 flex items-center gap-3 group">
      {/* Category emoji */}
      <span className="text-2xl flex-shrink-0">
        {CATEGORY_EMOJIS[item.category] || "📦"}
      </span>

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <input
          value={item.name}
          onChange={(e) => onUpdate(item.id, { name: e.target.value })}
          className="w-full bg-transparent text-foreground font-semibold text-sm border-none outline-none focus:ring-1 focus:ring-primary/30 rounded px-1 -ml-1"
        />
        <select
          value={item.category}
          onChange={(e) => onUpdate(item.id, { category: e.target.value })}
          className="text-xs text-muted-foreground bg-transparent border-none outline-none cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-card text-foreground">
              {CATEGORY_EMOJIS[cat]} {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() =>
            onUpdate(item.id, { quantity: Math.max(0.1, item.quantity - 1) })
          }
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>

        <input
          type="number"
          value={item.quantity}
          onChange={(e) =>
            onUpdate(item.id, { quantity: parseFloat(e.target.value) || 0 })
          }
          className="w-14 text-center bg-transparent text-foreground font-bold text-sm border-none outline-none"
          step="0.1"
          min="0"
        />

        <button
          onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Unit selector */}
      <select
        value={item.unit}
        onChange={(e) => onUpdate(item.id, { unit: e.target.value })}
        className="text-xs text-muted-foreground bg-transparent border border-border rounded-md px-2 py-1 outline-none focus:border-primary/50 flex-shrink-0"
      >
        {UNITS.map((u) => (
          <option key={u} value={u} className="bg-card text-foreground">
            {u}
          </option>
        ))}
      </select>

      {/* Delete */}
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
