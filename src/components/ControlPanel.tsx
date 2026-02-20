
import React from 'react';
import { CircuitState, Resistor } from '../types';

interface ControlPanelProps {
  state: CircuitState;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, value: number) => void;
  onVoltageChange: (v: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onAdd, onRemove, onUpdate, onVoltageChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-lg font-bold text-white mb-4">전원 및 소자 제어</h2>
        <div className="space-y-2">
          <label className="text-sm text-slate-400 block">공급 전압 (V)</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="100"
              value={state.voltage}
              onChange={(e) => onVoltageChange(Number(e.target.value))}
              className="flex-grow accent-blue-500"
            />
            <span className="text-blue-400 font-mono w-10 text-right">{state.voltage}V</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-slate-300">저항 리스트 ({state.resistors.length})</h3>
          <button
            onClick={onAdd}
            disabled={state.resistors.length >= 6}
            className="text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-3 py-1 rounded-full font-bold transition-colors disabled:opacity-50"
          >
            + 저항 추가
          </button>
        </div>

        <div className="space-y-3">
          {state.resistors.map((r, idx) => (
            <div key={r.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">R<sub>{idx + 1}</sub></span>
                <button
                  onClick={() => onRemove(r.id)}
                  className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={r.value}
                  onChange={(e) => onUpdate(r.id, Number(e.target.value))}
                  className="flex-grow accent-yellow-500"
                />
                <span className="text-yellow-400 font-mono w-12 text-right">{r.value}Ω</span>
              </div>
            </div>
          ))}
          {state.resistors.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm italic">
              회로에 저항 소자가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
