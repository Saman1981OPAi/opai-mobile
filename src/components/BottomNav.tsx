import { BottomNavigation } from "@/components/ui/BottomNavigation";
import type { AppModule, ModuleId } from "@/types/navigation";

type BottomNavProps = {
  activeModule: ModuleId;
  modules: AppModule[];
  onSelectModule: (module: ModuleId) => void;
};

export function BottomNav({ activeModule, onSelectModule }: BottomNavProps) {
  return <BottomNavigation activeModule={activeModule} onSelectModule={onSelectModule} />;
}
