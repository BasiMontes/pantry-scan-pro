import { ScannerPage } from "@/components/scanner/ScannerPage";
import type { ScannedItem } from "@/types/scanner";

const Index = () => {
  const handleAddToPantry = (items: ScannedItem[]) => {
    // This callback is where you'd integrate with your existing Fresco pantry
    console.log("Items to add to pantry:", items);
  };

  return <ScannerPage onAddToPantry={handleAddToPantry} />;
};

export default Index;
