import { X, ScanLine, Loader2 } from "lucide-react";
import type { ScanStatus } from "@/types/scanner";

interface ImagePreviewProps {
  imageUrl: string;
  status: ScanStatus;
  onRemove: () => void;
}

export function ImagePreview({ imageUrl, status, onRemove }: ImagePreviewProps) {
  const isProcessing = status === "uploading" || status === "scanning";

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Image container */}
      <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
        <img
          src={imageUrl}
          alt="Ticket escaneado"
          className="w-full h-auto max-h-80 object-contain bg-secondary/50"
        />

        {/* Scanning overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="relative w-full h-full">
              {/* Scan line animation */}
              <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
            </div>
            <div className="absolute bottom-6 flex items-center gap-2 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">
                {status === "uploading" ? "Subiendo imagen..." : "Analizando ticket..."}
              </span>
            </div>
          </div>
        )}

        {/* Remove button */}
        {!isProcessing && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status label */}
      {status === "done" && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fresco-success bg-fresco-success/10 px-3 py-1 rounded-full">
            <ScanLine className="w-3 h-3" />
            Análisis completado
          </span>
        </div>
      )}
    </div>
  );
}
