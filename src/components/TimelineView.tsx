import React, { useState } from "react";
import { TimelineEvent } from "../types";
import { Calendar, GitBranch, HeartHandshake, Briefcase, Sparkles } from "lucide-react";

interface TimelineViewProps {
  timelineEvents: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timelineEvents }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Filter events up to selectedYear
  const visibleEvents = timelineEvents.filter((e) => e.year <= selectedYear);

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-6 space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
          핵심 기능: 시간의 흐름 (Historical Chaebol Timeline 1950~2026)
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          연도별 재계 혼맥 및 계열분리 역사의 변천사
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          연도 슬라이더를 조작하여 1950년대 전후 복구기부터 2026년 현재까지 한국 기업 가문의 역사적 이정표를 시간 순으로 추적합니다.
        </p>
      </div>

      {/* Year Slider Control */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            기준 연도 선택:
          </span>
          <span className="text-lg font-black text-amber-600 bg-white px-3 py-0.5 rounded-full border border-amber-300 shadow-sm">
            {selectedYear}년까지의 역사
          </span>
        </div>

        <input
          type="range"
          min={1950}
          max={2026}
          step={1}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
          <span>1950년 (창업 태동기)</span>
          <span>1980년대 (중화학 도약)</span>
          <span>2000년대 (계열분리 가속)</span>
          <span>2026년 (현재)</span>
        </div>
      </div>

      {/* Filter Stats */}
      <div className="text-xs text-slate-500">
        선택한 연도까지 확인된 역사적 사건: <strong className="text-slate-900">{visibleEvents.length}건</strong>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-2 border-amber-400/60 ml-3 space-y-6">
        {visibleEvents.map((evt, idx) => {
          const isMarriage = evt.type === "MARRIAGE";
          const isSpinoff = evt.type === "SPINOFF";

          return (
            <div key={idx} className="relative">
              {/* Timeline Dot */}
              <span
                className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow ${
                  isMarriage ? "bg-rose-500" : "bg-amber-500"
                }`}
              >
                {isMarriage ? (
                  <HeartHandshake className="w-3 h-3" />
                ) : (
                  <GitBranch className="w-3 h-3" />
                )}
              </span>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {evt.year}년
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isMarriage
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isMarriage ? "혼인 동맹" : "계열분리 독립"}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    {evt.groups.map((g, i) => (
                      <span key={i} className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{evt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
