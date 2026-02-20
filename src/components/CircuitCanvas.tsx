
import React, { useMemo } from 'react';
import { CircuitState, CalculationResult, Resistor } from '../types';

interface CircuitCanvasProps {
  state: CircuitState;
  calculations: CalculationResult;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ state, calculations }) => {
  const { mode, resistors } = state;

  const renderResistorIcon = (x: number, y: number, label: string, value: number, current: number) => (
    <g key={label + x + y} transform={`translate(${x}, ${y})`}>
      {/* Resistor body (Zigzag) */}
      <path
        d="M -20 0 L -15 0 L -12 -8 L -6 8 L 0 -8 L 6 8 L 12 -8 L 15 0 L 20 0"
        fill="none"
        stroke="#eab308"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text y="-25" textAnchor="middle" className="text-[10px] fill-slate-300 font-bold">{label}</text>
      <text y="25" textAnchor="middle" className="text-[10px] fill-yellow-400">{value}Ω</text>
      <text y="40" textAnchor="middle" className="text-[10px] fill-green-400 font-mono">{current.toFixed(2)}A</text>
    </g>
  );

  const renderParticles = () => {
    if (mode === 'series') {
      const speed = Math.min(10, calculations.totalCurrent * 2);
      if (speed <= 0) return null;
      
      // Rectangular path for series circuit
      const pathD = "M 50 150 L 750 150 L 750 350 L 50 350 Z";
      
      return (
        <g>
          {[...Array(15)].map((_, i) => (
            <circle key={i} r="3" fill="#4ade80">
              <animateMotion
                path={pathD}
                dur={`${10 / speed}s`}
                repeatCount="indefinite"
                begin={`${i * (10 / speed / 15)}s`}
              />
            </circle>
          ))}
        </g>
      );
    } else {
      // Parallel circuit branches
      return resistors.map((r, idx) => {
        const current = calculations.branchCurrents[idx];
        const speed = Math.min(10, current * 2);
        if (speed <= 0) return null;

        const startX = 200 + idx * (400 / (resistors.length || 1));
        const pathD = `M ${startX} 150 L ${startX} 350`;
        
        return (
          <g key={`p-${r.id}`}>
            {[...Array(5)].map((_, i) => (
              <circle key={i} r="2.5" fill="#4ade80">
                <animateMotion
                  path={pathD}
                  dur={`${2 / speed}s`}
                  repeatCount="indefinite"
                  begin={`${i * (2 / speed / 5)}s`}
                />
              </circle>
            ))}
          </g>
        );
      });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden circuit-grid">
      <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-lg">
        {/* Main Wires */}
        {mode === 'series' ? (
          <g>
            <rect x="50" y="150" width="700" height="200" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
            <rect x="350" y="340" width="100" height="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="4" />
            <text x="400" y="355" textAnchor="middle" className="text-xs fill-blue-400 font-bold">{state.voltage}V Battery</text>
            
            {resistors.map((r, i) => {
              const xPos = 150 + i * (500 / (resistors.length || 1));
              return renderResistorIcon(xPos, 150, `R${i + 1}`, r.value, calculations.totalCurrent);
            })}
          </g>
        ) : (
          <g>
            {/* Top/Bottom Bus Rails */}
            <line x1="150" y1="150" x2="650" y2="150" stroke="#334155" strokeWidth="3" />
            <line x1="150" y1="350" x2="650" y2="350" stroke="#334155" strokeWidth="3" />
            
            {/* Battery Connection */}
            <path d="M 150 150 L 100 150 L 100 350 L 150 350" fill="none" stroke="#334155" strokeWidth="2" />
            <rect x="60" y="240" width="80" height="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="4" transform="rotate(-90, 100, 250)" />
            <text x="85" y="255" textAnchor="middle" className="text-xs fill-blue-400 font-bold" transform="rotate(-90, 100, 250)">{state.voltage}V</text>

            {resistors.map((r, i) => {
              const xPos = 200 + i * (400 / (resistors.length || 1));
              return (
                <g key={r.id}>
                  <line x1={xPos} y1="150" x2={xPos} y2="230" stroke="#334155" strokeWidth="2" />
                  <line x1={xPos} y1="270" x2={xPos} y2="350" stroke="#334155" strokeWidth="2" />
                  {renderResistorIcon(xPos, 250, `R${i + 1}`, r.value, calculations.branchCurrents[i])}
                </g>
              );
            })}
          </g>
        )}
        
        {renderParticles()}
      </svg>
    </div>
  );
};
