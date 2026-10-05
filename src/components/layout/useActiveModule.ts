import { useLocation } from "react-router-dom";
import {
  modules,
  type ModuleCategory,
  type ModuleDef,
} from "../../modules/registry";

/// Derive the active module and its category from the current route.
export function useActiveModule(): {
  activeModule: ModuleDef | undefined;
  activeCategory: ModuleCategory | undefined;
} {
  const { pathname } = useLocation();
  const activeModule = modules.find((m) => pathname === m.path);
  return { activeModule, activeCategory: activeModule?.category };
}
