
export type CircuitMode = 'series' | 'parallel';

export interface Resistor {
  id: string;
  value: number; // Resistance in Ohms (Ω)
}

export interface CircuitState {
  voltage: number;
  resistors: Resistor[];
  mode: CircuitMode;
}

export interface CalculationResult {
  totalResistance: number;
  totalCurrent: number;
  branchCurrents: number[];
  voltageDrops: number[];
}
