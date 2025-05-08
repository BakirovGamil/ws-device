import type { Bit, Inputs, Relays } from "@/types.ts";
import { INPUTS_RELAYS_COUNT } from "@/defaults.ts";

export function createEmptyInputsRelays(type: "inputs"): Inputs;
export function createEmptyInputsRelays(type: "relays"): Relays;
export function createEmptyInputsRelays(type: "inputs" | "relays"): Inputs | Relays {
  const result: Record<string, Bit> = {};
  const keyPrefix = type === "inputs" ? "in" : "r";

  for (let i = 0; i < INPUTS_RELAYS_COUNT; i++) {
    const key = `${keyPrefix}${i + 1}`;
    result[key] = 0;
  }

  return result as Inputs | Relays;
}

export function toBits(value: Inputs | Relays): Bit[] {
  const result: Bit[] = [];
  const isInput = "in1" in value;
  const keyPrefix = isInput ? "in" : "r";

  for (let i = 0; i < INPUTS_RELAYS_COUNT; i++) {
    const key = `${keyPrefix}${i + 1}`;
    const bit = value[key as never] as Bit;
    result.push(bit);
  }

  return result;
}
