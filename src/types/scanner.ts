export interface ScannedItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface ScanResult {
  items: ScannedItem[];
  confidence: number;
  rawText?: string;
}

export type ScanStatus = "idle" | "uploading" | "scanning" | "done" | "error";

export const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Pantry",
  "Beverages",
  "Frozen",
  "Other",
] as const;

export const UNITS = ["ud", "kg", "g", "L", "ml", "docena", "pack"] as const;

export const CATEGORY_EMOJIS: Record<string, string> = {
  Vegetables: "🥬",
  Fruits: "🍎",
  "Dairy & Eggs": "🧀",
  "Meat & Seafood": "🥩",
  Bakery: "🍞",
  Pantry: "🫙",
  Beverages: "🥤",
  Frozen: "🧊",
  Other: "📦",
};
