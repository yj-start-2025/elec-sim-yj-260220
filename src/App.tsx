
import React, { useState, useMemo, useEffect } from 'react';
import { CircuitCanvas } from './components/CircuitCanvas';
import { ControlPanel } from './components/ControlPanel';
import { TipsPanel } from './components/TipsPanel';
import { CircuitState, Resistor, CalculationResult, CircuitMode } from './types';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [state, setState] = useState<CircuitState>({
    voltage: 12,
    resistors: [
      { id: '1', value: 10 },
      { id: '2', value: 20 }
    ],
    mode: 'series'
  });

  const calculations = useMemo((): CalculationResult => {
    const { resistors, voltage, mode } = state;
    if (resistors.length === 0) return { totalResistance: 0, totalCurrent: 0, branchCurrents: [], voltageDrops: [] };

    if (mode === 'series') {
      const totalResistance = resistors.reduce((acc, r) => acc + r.value, 0);
      const totalCurrent = voltage / totalResistance;
      const voltageDrops = resistors.map(r => totalCurrent * r.value);
      return {
        totalResistance,
        totalCurrent,
        branchCurrents: resistors.map(() => totalCurrent),
        voltageDrops
      };
    } else {
      const inverseTotal = resistors.reduce((acc, r) => acc + (1 / r.value), 0);
      const totalResistance = 1 / inverseTotal;
      const totalCurrent = voltage / totalResistance;
      const branchCurrents = resistors.map(r => voltage / r.value);
      return {
        totalResistance,
        totalCurrent,
        branchCurrents,
        voltageDrops: resistors.map(() => voltage)
      };
    }
  }, [state]);

  const addResistor = () => {
    const newResistor: Resistor = {
      id: Math.random().toString(36).substr(2, 9),
      value: 10
    };
    setState(prev => ({ ...prev, resistors: [...prev.resistors, newResistor] }));
  };

  const removeResistor = (id: string) => {
    setState(prev => ({ ...prev, resistors: prev.resistors.filter(r => r.id !== id) }));
  };

  const updateResistorValue = (id: string, value: number) => {
    setState(prev => ({
      ...prev,
      resistors: prev.resistors.map(r => r.id === id ? { ...r, value } : r)
    }));
  };

  const setMode = (mode: CircuitMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const setVoltage = (voltage: number) => {
    setState(prev => ({ ...prev, voltage }));
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">전기기능사 회로 시뮬레이터</h1>
          <p className="text-slate-400 mt-1">직렬/병렬 회로의 합성저항과 전류 분포 시각화</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setMode('series')}
            className={`px-6 py-2 rounded-md transition-all ${state.mode === 'series' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            직렬 회로
          </button>
          <button
            onClick={() => setMode('parallel')}
            className={`px-6 py-2 rounded-md transition-all ${state.mode === 'parallel' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            병렬 회로
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden relative shadow-2xl min-h-[400px]">
          <div className="absolute top-4 left-4 z-10 space-y-1">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></span>
              <span>전압 (V): <strong className="text-white">{state.voltage}V</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
              <span>합성저항 (R<sub>t</sub>): <strong className="text-white">{calculations.totalResistance.toFixed(2)}Ω</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span>전체전류 (I<sub>t</sub>): <strong className="text-white">{calculations.totalCurrent.toFixed(2)}A</strong></span>
            </div>
          </div>
          <CircuitCanvas state={state} calculations={calculations} />
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl overflow-y-auto max-h-[600px]">
          <ControlPanel
            state={state}
            onAdd={addResistor}
            onRemove={removeResistor}
            onUpdate={updateResistorValue}
            onVoltageChange={setVoltage}
          />
        </div>
      </main>

      <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl">
        <TipsPanel state={state} calculations={calculations} />
      </section>

      <footer className="text-center text-slate-500 text-sm py-4">
        &copy; 2024 전기기능사 학습 시스템 - Senior Engineering Education
      </footer>
    </div>
  );
};

export default App;
