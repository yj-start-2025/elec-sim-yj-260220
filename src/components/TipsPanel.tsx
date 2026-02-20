
import React, { useState, useEffect } from 'react';
import { CircuitState, CalculationResult } from '../types';
import { GoogleGenAI } from "@google/genai";

interface TipsPanelProps {
  state: CircuitState;
  calculations: CalculationResult;
}

export const TipsPanel: React.FC<TipsPanelProps> = ({ state, calculations }) => {
  const [aiTip, setAiTip] = useState<string>("기능사 시험 팁을 불러오는 중...");
  
  // Rule of thumb for n identical resistors
  const avgR = state.resistors.length > 0 
    ? state.resistors.reduce((a, b) => a + b.value, 0) / state.resistors.length 
    : 0;
  const n = state.resistors.length;
  const seriesN = avgR * n;
  const parallelN = avgR / n;
  const ratio = n > 0 ? (seriesN / parallelN).toFixed(0) : "0";

  useEffect(() => {
    const fetchAITip = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `현재 ${state.mode === 'series' ? '직렬' : '병렬'} 회로 구성입니다. 저항은 ${n}개이며, 전체 저항은 ${calculations.totalResistance.toFixed(2)}옴입니다. 이 구성을 바탕으로 전기기능사 시험에 자주 나오는 핵심 암기 팁을 한 문장으로 알려주세요. 한국어로 대답하세요.`,
          config: {
            systemInstruction: "당신은 전기기능사 자격증 전문가입니다. 짧고 명확한 수험 팁을 제공하세요.",
          }
        });
        setAiTip(response.text || "합성저항 공식을 명확히 암기하는 것이 합격의 지름길입니다!");
      } catch (err) {
        setAiTip("병렬 회로에서 저항을 추가하면 전체 저항은 항상 감소한다는 것을 잊지 마세요!");
      }
    };

    fetchAITip();
  }, [state.mode, n]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold text-yellow-500 mb-4 flex items-center">
          <span className="mr-2">⚡</span> 기능사 핵심 팁
        </h2>
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-400 mb-1">합성저항 공식</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-mono">
              {state.mode === 'series' 
                ? "R_t = R1 + R2 + ... + Rn (커진다)" 
                : "1/R_t = 1/R1 + 1/R2 + ... (작아진다)"}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold text-green-400 mb-1">전압/전류 배분</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {state.mode === 'series'
                ? "직렬 회로에서는 '전류(I)'가 일정하고, 저항비에 따라 '전압(V)'이 분배됩니다."
                : "병렬 회로에서는 '전압(V)'이 일정하고, 저항의 역수비에 따라 '전류(I)'가 분배됩니다."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div className="bg-indigo-900/40 p-5 rounded-xl border border-indigo-500/30">
          <h3 className="font-bold text-indigo-300 mb-2 flex items-center">
            <span className="mr-2">💡</span> n²배의 법칙 (핵심 암기)
          </h3>
          <p className="text-sm text-slate-200 mb-3">
            동일한 저항 {n}개를 연결했을 때, 직렬과 병렬의 합성저항비는 <strong>n²배</strong> 차이가 납니다.
          </p>
          <div className="bg-slate-900 p-3 rounded font-mono text-center text-yellow-400 text-lg border border-slate-700">
            R<sub>s</sub> / R<sub>p</sub> = {n}² = {ratio}배 차이
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            * 수험생 Tip: 같은 저항 {n}개를 병렬로 연결하면 저항은 1/{n}이 되고, 직렬은 {n}배가 되므로 그 비는 {n}²입니다.
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20 italic text-yellow-200/80 text-sm">
          <strong>AI 수험 가이드:</strong> {aiTip}
        </div>
      </div>
    </div>
  );
};
