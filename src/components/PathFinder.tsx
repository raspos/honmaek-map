import React, { useState, useRef } from "react";
import { Family, Person, Relation, Source, ShortestPathInfo } from "../types";
import { Search, ArrowRight, ShieldCheck, Download, AlertCircle, Sparkles } from "lucide-react";
import { toPng } from "html-to-image";

interface PathFinderProps {
  families: Family[];
  persons: Person[];
  relations: Relation[];
  sources: Source[];
  shortestPaths: Record<string, Record<string, ShortestPathInfo>>;
}

export const PathFinder: React.FC<PathFinderProps> = ({
  families,
  persons,
  relations,
  sources,
  shortestPaths,
}) => {
  const [sourceFamId, setSourceFamId] = useState<string>("FAM_SAMSUNG");
  const [targetFamId, setTargetFamId] = useState<string>("FAM_HANWHA");
  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const resultRef = useRef<HTMLDivElement>(null);

  const sourceFam = families.find((f) => f.id === sourceFamId) || families[0];
  const targetFam = families.find((f) => f.id === targetFamId) || families[1];

  // Lookup precomputed path
  const pathInfo = shortestPaths[sourceFamId]?.[targetFamId];

  // Build step-by-step detailed chain
  const getDetailedSteps = () => {
    if (!pathInfo || !pathInfo.path_nodes || pathInfo.path_nodes.length < 2) return [];

    const steps = [];
    for (let i = 0; i < pathInfo.path_nodes.length - 1; i++) {
      const u = pathInfo.path_nodes[i];
      const v = pathInfo.path_nodes[i + 1];
      const uFam = families.find((f) => f.id === u);
      const vFam = families.find((f) => f.id === v);

      // Find the inter-family marriage relation connecting u and v
      const rel = relations.find(
        (r) =>
          r.type === "MARRIAGE" &&
          r.is_inter_family &&
          ((r.fam_from === u && r.fam_to === v) || (r.fam_from === v && r.fam_to === u))
      );

      const p1 = rel ? persons.find((p) => p.id === rel.from_id) : null;
      const p2 = rel ? persons.find((p) => p.id === rel.to_id) : null;

      steps.push({
        stepNumber: i + 1,
        fromFam: uFam,
        toFam: vFam,
        relation: rel,
        person1: p1,
        person2: p2,
      });
    }
    return steps;
  };

  const detailedSteps = getDetailedSteps();

  const handleExportPNG = async () => {
    if (!resultRef.current) return;
    try {
      const dataUrl = await toPng(resultRef.current, { backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `혼맥경로_${sourceFam.name}_${targetFam.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-6 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded">
          핵심 기능: 혼맥 경로 탐색기 (Shortest Path Finder)
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          두 기업 가문은 혈연·혼인으로 어떻게 이어져 있을까?
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          실제 데이터베이스에 등록·검증된 혈연 및 혼인 관계만을 기반으로 최단 연결 경로를 탐색합니다. (기업 간 거래나 임원 겸직은 제외)
        </p>
      </div>

      {/* Selectors & Search Controls */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-4">
        {/* Source Family */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">출발 가문 (A)</label>
          <select
            value={sourceFamId}
            onChange={(e) => {
              setSourceFamId(e.target.value);
              setHasSearched(true);
            }}
            className="w-full px-3 py-2 text-xs font-bold bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500 shadow-sm"
          >
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} (창업주: {f.founder})
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-400 mt-4 hidden md:block">
          <ArrowRight className="w-5 h-5 text-rose-500" />
        </div>

        {/* Target Family */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">도착 가문 (B)</label>
          <select
            value={targetFamId}
            onChange={(e) => {
              setTargetFamId(e.target.value);
              setHasSearched(true);
            }}
            className="w-full px-3 py-2 text-xs font-bold bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500 shadow-sm"
          >
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} (창업주: {f.founder})
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col gap-2">
          <button
            onClick={() => setHasSearched(true)}
            className="w-full px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>경로 탐색 실행</span>
          </button>
        </div>
      </div>

      {/* Action / Export Toolbar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="font-semibold text-slate-700">
          가문 간 실질 혼인(사돈) 네트워크 기반 최단 경로 계산
        </span>
        {pathInfo && (
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold bg-slate-100 px-3 py-1 rounded border border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>경로 PNG 저장</span>
          </button>
        )}
      </div>

      {/* Result Display Area */}
      {hasSearched && (
        <div ref={resultRef} className="space-y-4 pt-2">
          {sourceFamId === targetFamId ? (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-600 text-xs">
              출발 가문과 도착 가문이 동일합니다. 서로 다른 두 가문을 선택해주세요.
            </div>
          ) : !pathInfo ? (
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-slate-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900">
                  직접적 또는 간접적 혼맥 연결 경로가 확인되지 않았습니다.
                </strong>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  현재 공식 검증된 데이터베이스 상에서 <strong>{sourceFam.name}</strong>과(와){" "}
                  <strong>{targetFam.name}</strong> 사이의 직계 혈연·혼인 연결고리가 존재하지 않습니다.
                  (확인되지 않은 루머나 사교 관계는 제외 원칙에 따라 경로 계산에 반영하지 않습니다)
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-6 space-y-6">
              {/* Summary Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50/70 rounded-lg border border-rose-200">
                <div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    탐색 결과: 연결 확인
                  </span>
                  <div className="text-base font-black text-slate-900 mt-1">
                    {sourceFam.name} ↔ {targetFam.name} : 최소{" "}
                    <span className="text-rose-600 underline font-black">{pathInfo.steps}단계</span> 혼맥 연결
                  </div>
                </div>
                <div className="text-xs text-slate-600">
                  경유 가문: <strong className="text-slate-900">{pathInfo.path_nodes.length}개</strong>
                </div>
              </div>

              {/* Step-by-Step Visual Pathway */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>단계별 인물 및 혼맥 사슬 (Chain of Marriages)</span>
                </div>

                <div className="relative border-l-2 border-rose-300 ml-4 pl-6 space-y-6">
                  {detailedSteps.map((s, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle Indicator */}
                      <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow">
                        {s.stepNumber}
                      </span>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            {s.fromFam?.name} <span className="text-rose-600">➔</span> {s.toFam?.name}
                          </span>
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded">
                            {s.relation?.label}
                          </span>
                        </div>

                        {/* Person connection */}
                        <div className="text-xs text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                          <strong>{s.person1?.name}</strong> ({s.person1?.role}) ↔{" "}
                          <strong>{s.person2?.name}</strong> ({s.person2?.role})
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">{s.relation?.desc}</p>

                        {/* Sources */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>검증 출처:</span>
                          {s.relation?.source_ids?.map((sid) => {
                            const src = sources.find((src) => src.id === sid);
                            return src ? (
                              <a
                                key={src.id}
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 underline font-semibold hover:text-indigo-800"
                              >
                                {src.publisher}
                              </a>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
