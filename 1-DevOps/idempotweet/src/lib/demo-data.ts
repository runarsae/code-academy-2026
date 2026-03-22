import type { Idem } from "@/types/idem";
import { generateDemoIdems } from "./generate-demo-data";

/**
 * Demo idems data - 200 idems sorted newest first (per FR-007, FR-011).
 * Generated deterministically using seed 42 for reproducible testing.
 */
export const demoIdems: Idem[] = generateDemoIdems(200, 42);
