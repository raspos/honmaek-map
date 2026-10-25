import React, { useState } from "react";
import { CorporateGroup, CrossMatrix as CrossMatrixType } from "../types";
import { Grid, Info, ShieldCheck, HeartHandshake, GitFork, ArrowRight } from "lucide-react";

interface CrossMatrixProps {
  corporateGroups: CorporateGroup[];
  crossMatrix: CrossMatrixType;
}

export const CrossMatrix: React.FC<CrossMatrixProps> = ({ corporateGroups, crossMatrix }) => {
  const chaebolKeys = Object.keys(crossMatrix);
  const [selectedCell, setSelectedCell] = useState<{
    g1: string;
    g2: string;
    data: any;
  } | null>(null);

  const getGroupName = (id: string) => {
    return corporateGroups.find((g) => g.id === id)?.name || id;
  };

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-6 space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded">
          핵심 기능: 대한민국 14대 재벌 혼맥 연계 매트릭스 (Dynasty Marriage Matrix)
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          한국 주요 대기업 가문 간의 직·간접 통혼망 전수 분석
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          삼성·현대·SK·LG·한화·롯데 등 국내 14대 대기업 가문의 상호 관계를 교차 검증하여, 직접 사돈 관계(직접혼), 한 뿌리 모태/계열분리, 그리고 정·재계 혼맥 허브(이후락·노신영·김동조 등)를 경유한 간접 연결을 한눈에 식별합니다.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
        <span className="font-bold text-slate-700">매트릭스 범례:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-rose-500"></span>
          <span className="text-slate-800 font-semibold">직접 혼인 (사돈)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-purple-600"></span>
          <span className="text-slate-800 font-semibold">간접 혼맥 (2~3단계 허브 경유)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
          <span className="text-slate-800 font-semibold">모태 가문 / 계열분리</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-200"></span>
          <span className="text-slate-500">확인된 연결 없음</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border border-slate-200 text-left font-bold text-slate-600 sticky left-0 bg-slate-100 z-10 w-28">
                기업집단
              </th>
              {chaebolKeys.map((k) => (
                <th key={k} className="p-2 border border-slate-200 text-center font-bold text-slate-700 min-w-16">
                  {getGroupName(k).replace("그룹", "")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chaebolKeys.map((rowKey) => (
              <tr key={rowKey} className="hover:bg-slate-50">
                <td className="p-2 border border-slate-200 font-bold text-slate-800 sticky left-0 bg-white z-10 whitespace-nowrap">
                  {getGroupName(rowKey)}
                </td>
                {chaebolKeys.map((colKey) => {
                  const cell = crossMatrix[rowKey]?.[colKey];
                  if (!cell) return <td key={colKey} className="p-2 border border-slate-200"></td>;

                  let bgClass = "bg-slate-50 hover:bg-slate-100";
                  let text = "-";

                  if (cell.category === "SELF") {
                    bgClass = "bg-slate-300 text-slate-400 cursor-not-allowed";
                    text = "•";
                  } else if (cell.category === "DIRECT_MARRIAGE" || cell.category === "MARRIAGE_ONLY" || cell.category === "BOTH") {
                    bgClass = "bg-rose-500 text-white font-black hover:bg-rose-600 cursor-pointer";
                    text = "직접혼";
                  } else if (cell.category === "SPINOFF_OR_ANCESTOR") {
                    bgClass = "bg-amber-500 text-white font-bold hover:bg-amber-600 cursor-pointer";
                    text = "분가";
                  } else if (cell.category === "INDIRECT_MARRIAGE") {
                    bgClass = "bg-purple-600 text-white font-bold hover:bg-purple-700 cursor-pointer";
                    text = "간접혼";
                  }

                  return (
                    <td
                      key={colKey}
                      onClick={() => {
                        if (cell.category !== "SELF") {
                          setSelectedCell({ g1: rowKey, g2: colKey, data: cell });
                        }
                      }}
                      className={`p-2 border border-slate-200 text-center transition ${bgClass}`}
                      title={`${getGroupName(rowKey)} ↔ ${getGroupName(colKey)}: ${cell.description}`}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Evidence Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                가문 간 혼맥 및 계열분리 세부 정보
              </span>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {getGroupName(selectedCell.g1)} ↔ {getGroupName(selectedCell.g2)}
              </h3>
              <div className="text-xs text-slate-500 mt-1">
                관계 분류:{" "}
                <strong className="text-rose-700 font-bold">
                  {selectedCell.data.category === "DIRECT_MARRIAGE" || selectedCell.data.category === "MARRIAGE_ONLY" || selectedCell.data.category === "BOTH"
                    ? "직접 혼인 관계 (통혼 사돈)"
                    : selectedCell.data.category === "SPINOFF_OR_ANCESTOR"
                    ? "모태 가문 / 계열분리 독립"
                    : selectedCell.data.category === "INDIRECT_MARRIAGE"
                    ? "정·재계 허브를 통한 간접 혼맥 연결"
                    : "확인된 직접적 혼맥 없음"}
                </strong>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              {selectedCell.data.description}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCell(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
