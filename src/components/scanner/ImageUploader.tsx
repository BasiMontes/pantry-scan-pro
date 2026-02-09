import { Camera, Upload, X } from "lucide-react";
import { useRef } from "react";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploader({ onFileSelect, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Camera icon circle */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center">
          <Camera className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-soft" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Escanear Ticket</h2>
        <p className="text-muted-foreground text-sm">
          Detectaremos tus productos automáticamente con IA.
        </p>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="w-full max-w-xs py-4 px-8 rounded-full bg-foreground text-background font-semibold text-sm tracking-wider uppercase transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
      >
        Hacer foto / Subir
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
