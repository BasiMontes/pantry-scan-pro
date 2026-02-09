import { useState, useCallback } from "react";
import { ArrowLeft, ShoppingBasket, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { ScannedItemCard } from "./ScannedItemCard";
import { scanReceiptImage } from "@/lib/scanner-api";
import type { ScannedItem, ScanStatus } from "@/types/scanner";
import { CATEGORY_EMOJIS } from "@/types/scanner";

interface ScannerPageProps {
  onClose?: () => void;
  onAddToPantry?: (items: ScannedItem[]) => void;
}

export function ScannerPage({ onClose, onAddToPantry }: ScannerPageProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      setItems([]);

      // Create preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setStatus("uploading");

      try {
        setStatus("scanning");
        const result = await scanReceiptImage(file);
        setItems(result.items);
        setConfidence(result.confidence);
        setStatus("done");

        if (result.items.length === 0) {
          setErrorMsg("No se detectaron productos. Intenta con otra imagen.");
        }
      } catch (err: any) {
        setStatus("error");
        const msg = err?.message || "Error al procesar la imagen";
        setErrorMsg(msg);
        toast({
          title: "Error de escaneo",
          description: msg,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleRemoveImage = () => {
    setImageUrl(null);
    setItems([]);
    setStatus("idle");
    setErrorMsg(null);
  };

  const handleUpdateItem = (id: string, updates: Partial<ScannedItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        name: "Nuevo producto",
        quantity: 1,
        unit: "ud",
        category: "Other",
      },
    ]);
  };

  const handleConfirm = () => {
    if (items.length === 0) return;
    onAddToPantry?.(items);
    toast({
      title: "¡Productos añadidos!",
      description: `${items.length} producto${items.length > 1 ? "s" : ""} añadido${items.length > 1 ? "s" : ""} a tu despensa.`,
    });
    handleRemoveImage();
  };

  return (
    <div className="min-h-screen fresco-gradient">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-foreground">
              <path d="M8 8C8 8 4 12 4 16s4 8 4 8M12 6C12 6 8 11 8 16s4 10 4 10M16 4C16 4 12 10 12 16s4 12 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="font-bold text-foreground">Fresco Vision</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Upload / Preview */}
        {!imageUrl ? (
          <div className="py-12">
            <ImageUploader onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <ImagePreview
            imageUrl={imageUrl}
            status={status}
            onRemove={handleRemoveImage}
          />
        )}

        {/* Error state */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">{errorMsg}</p>
              <button
                onClick={handleRemoveImage}
                className="text-xs text-muted-foreground underline mt-1"
              >
                Intentar con otra imagen
              </button>
            </div>
          </div>
        )}

        {/* Scanned items list */}
        {items.length > 0 && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Productos detectados
                </h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {items.length}
                </span>
              </div>
              {confidence > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-fresco-success" />
                  {Math.round(confidence * 100)}% confianza
                </span>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              {items.map((item) => (
                <ScannedItemCard
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdateItem}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Add manual item */}
            <button
              onClick={handleAddItem}
              className="w-full py-3 rounded-xl border border-dashed border-border text-muted-foreground text-sm flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Añadir producto manualmente
            </button>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-full bg-accent text-accent-foreground font-semibold text-sm tracking-wider uppercase transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
            >
              Añadir {items.length} producto{items.length > 1 ? "s" : ""} a la despensa
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
