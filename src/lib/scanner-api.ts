import { supabase } from "@/integrations/supabase/client";
import type { ScannedItem } from "@/types/scanner";

export async function scanReceiptImage(
  file: File
): Promise<{ items: ScannedItem[]; confidence: number; rawText?: string }> {
  const base64 = await fileToBase64(file);

  const { data, error } = await supabase.functions.invoke("scan-receipt", {
    body: { imageBase64: base64, mimeType: file.type },
  });

  if (error) {
    throw new Error(error.message || "Error al escanear el ticket");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  // Add unique IDs to items
  const items: ScannedItem[] = (data.items || []).map(
    (item: Omit<ScannedItem, "id">, i: number) => ({
      ...item,
      id: `scan-${Date.now()}-${i}`,
    })
  );

  return { items, confidence: data.confidence || 0, rawText: data.rawText };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
