export type Bit = 0 | 1;
export type InputKey = `in1` | `in2` | `in3` | `in4` | `in5` | `in6` | `in7` | `in8`;
export type RelayKey = `r1` | `r2` | `r3` | `r4` | `r5` | `r6` | `r7` | `r8`;
export type Inputs = Record<InputKey, Bit>;
export type Relays = Record<RelayKey, Bit>;


export interface UpdateBitEvent {
  index: number;
  enabled: boolean;
}

export interface SetInputEvent {
  num: number;
  enabled: boolean;
}
