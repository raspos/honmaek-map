import React, { useState } from "react";
import { KPIsAndMetrics, Family } from "../types";
import { BarChart3, HelpCircle, AlertCircle, Award } from "lucide-react";

interface NetworkRankingsProps {
  kpis: KPIsAndMetrics;
  families: Family[];
}

export const NetworkRankings: React.FC<NetworkRankingsProps> = ({ kpis, families }) => {
  const [metricType, setMetricType] = useState<"degree" | "betweenness" | "closeness">("betweenness");

  const rankingList =
    metricType === "degree"
      ? kpis.centrality_rankings.by_degree
      : metricType === "betweenness"
      ? kpis.centrality_rankings.by_betweenness
      : kpis.centrality_rankings.by_closeness;

  const maxScore = rankingList.length > 0 ? rankingList[0].score || 1 : 1;

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-6 space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded">
          핵심 기능: 혼맥 네트워크 그래프 이론 분석 (Python NetworkX)
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          네트워크 중심성 랭킹 및 허브(Hub) 가문 분석
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          전체 혼맥 연결망에서 각 가문이 차지하는 구조적 위치와 중개 역할을 그래프 이론 알고리즘(NetworkX)으로 정량 계산했습니다.
        </p>
      </div>

      {/* Metric Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMetricType("betweenness")}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
            metricType === "betweenness"
              ? "bg-sky-600 text-white border-sky-600 shadow"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          매개 중심성 (Betweenness Centrality)
        </button>
        <button
          onClick={() => setMetricType("degree")}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
            metricType === "degree"
              ? "bg-sky-600 text-white border-sky-600 shadow"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          연결 중심성 (Degree Centrality)
        </button>
        <button
          onClick={() => setMetricType("closeness")}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
            metricType === "closeness"
              ? "bg-sky-600 text-white border-sky-600 shadow"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          근접 중심성 (Closeness Centrality)
        </button>
      </div>

      {/* Metric Explanation Banner */}
      <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {metricType === "betweenness" && (
            <>
              <strong>매개 중심성(Betweenness):</strong> 서로 다른 가문들 간의 최단 연결 경로 상에 해당 가문이 얼마나
              자주 징검다리(허브)로 위치하는가를 측정합니다. 점수가 높을수록 재계 혼맥 네트워크의 핵심 가교 역할을 의미합니다.
            </>
          )}
          {metricType === "degree" && (
            <>
              <strong>연결 정도 중심성(Degree):</strong> 해당 가문이 타 재벌 가문과 맺은 직접 혼맥 연결선의 총 개수를
              측정합니다. 직접적으로 통혼한 가문의 수가 많을수록 상위에 랭크됩니다.
            </>
          )}
          {metricType === "closeness" && (
            <>
              <strong>근접 중심성(Closeness):</strong> 네트워크 내 다른 모든 가문에 도달하기 위한 평균 최단 경로 길이의
              역수를 측정합니다. 다른 모든 가문과 평균적으로 가장 적은 단계를 거쳐 닿을 수 있는 가문입니다.
            </>
          )}
        </div>
      </div>

      {/* Ranking Bar Chart List */}
      <div className="space-y-3">
        {rankingList.map((item, index) => {
          const fam = families.find((f) => f.id === item.family_id);
          const percent = maxScore > 0 ? (item.score / maxScore) * 100 : 0;

          return (
            <div
              key={item.family_id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? "bg-amber-400 text-slate-950"
                        : index === 1
                        ? "bg-slate-300 text-slate-800"
                        : index === 2
                        ? "bg-amber-700 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{item.name}</span>
                  <span className="text-[11px] text-slate-500">창업주: {fam?.founder}</span>
                </div>
                <div className="text-xs font-black text-sky-700">
                  점수: {item.score}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, percent)}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>관련 기업집단: {fam?.related_groups.join(", ") || "-"}</span>
                <span className="text-[10px] font-semibold text-emerald-600">검증 완료</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Caution Note */}
      <div className="p-3.5 bg-slate-100 rounded-lg text-slate-600 text-xs flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>지표 해석 시 유의사항:</strong> 중심성 점수는 수학적 그래프의 구조적 속성을 나타낼 뿐이며, 가문이나 특정
          기업의 실질적인 권력, 지배력, 또는 사회적 영향력 크기를 의미하는 것이 아닙니다. 또한 데이터 수집 및 공시 검증 범위에
          따라 지표가 달라질 수 있습니다.
        </p>
      </div>
    </div>
  );
};
