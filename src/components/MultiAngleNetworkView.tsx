import React, { useState } from "react";
import {
  Compass,
  Award,
  Coins,
  GitMerge,
  ArrowRightLeft,
  Network,
  Sparkles,
} from "lucide-react";
import { Family, Person, Relation, CorporateGroup, Source, KPIsAndMetrics } from "../types";
import { PathFinder } from "./PathFinder";
import { NetworkRankings } from "./NetworkRankings";
import { SharedEquityNetwork } from "./SharedEquityNetwork";

interface MultiAngleNetworkViewProps {
  families: Family[];
  persons: Person[];
  relations: Relation[];
  corporateGroups: CorporateGroup[];
  sources: Source[];
  kpis: KPIsAndMetrics;
  shortestPaths: any;
}

export const MultiAngleNetworkView: React.FC<MultiAngleNetworkViewProps> = ({
  families,
  persons,
  relations,
  corporateGroups,
  sources,
  kpis,
  shortestPaths,
}) => {
  const [subAngle, setSubAngle] = useState<"pathfinder" | "centrality" | "equity">("pathfinder");

  return (
    <div className="space-y-6">
      {/* Top Angle Switcher Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                4번 핵심 기능 · 다각도 네트워크 분석
              </span>
              <span className="text-xs text-slate-400 font-medium">
                혼맥 경로 · 중심성 지표 · 기업 지분동맹 3대 다각 분석
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Network className="w-6 h-6 text-emerald-600" />
              <span>대한민국 재벌 네트워크 다각도 분석</span>
            </h2>
            <p className="text-slate-600 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              재벌가 간의 <strong>혼맥 최단 연결 경로(몇 다리 건너 사돈인가)</strong>, 네트워크의 결절점이 되는 <strong>핵심 허브 가문 순위</strong>, 그리고 실질적인 사업 제휴를 증명하는 <strong>기업 간 지분 공유·합작 투자망</strong>을 입체적으로 교차 분석합니다.
            </p>
          </div>

          {/* Sub-Angle Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setSubAngle("pathfinder")}
              className={`px-3 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                subAngle === "pathfinder"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>혼맥 최단경로 탐색</span>
            </button>
            <button
              onClick={() => setSubAngle("centrality")}
              className={`px-3 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                subAngle === "centrality"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>혼맥 중심성·허브 순위</span>
            </button>
            <button
              onClick={() => setSubAngle("equity")}
              className={`px-3 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                subAngle === "equity"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>기업 지분공유·합작망</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Selected Angle */}
      {subAngle === "pathfinder" && (
        <PathFinder
          families={families}
          persons={persons}
          relations={relations}
          sources={sources}
          shortestPaths={shortestPaths}
        />
      )}

      {subAngle === "centrality" && (
        <NetworkRankings kpis={kpis} families={families} />
      )}

      {subAngle === "equity" && (
        <SharedEquityNetwork corporateGroups={corporateGroups} />
      )}
    </div>
  );
};
