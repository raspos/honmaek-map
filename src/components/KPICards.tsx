import React from "react";
import { Users, Building2, HeartHandshake, GitFork, Briefcase, CheckCircle2, Calendar } from "lucide-react";
import { KPIsAndMetrics } from "../types";

interface KPICardsProps {
  kpis: KPIsAndMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: "수록 기업 가문",
      value: `${kpis.families_total_count}개`,
      sub: `검증 가문 ${kpis.families_verified_count}개 (전수 조사)`,
      icon: Building2,
      color: "border-l-amber-500",
      iconColor: "text-amber-600 bg-amber-50"
    },
    {
      title: "전체 수록 인물",
      value: `${kpis.persons_total_count}명`,
      sub: "1~4세대 가계도 및 임원진",
      icon: Users,
      color: "border-l-sky-500",
      iconColor: "text-sky-600 bg-sky-50"
    },
    {
      title: "가문 간 혼맥 연결",
      value: `${kpis.inter_family_marriages_count}건`,
      sub: "재벌 가문 간 실제 통혼",
      icon: HeartHandshake,
      color: "border-l-rose-500",
      iconColor: "text-rose-600 bg-rose-50"
    },
    {
      title: "연결된 기업집단",
      value: `${kpis.corporate_groups_count}개`,
      sub: "공정위 대기업집단 연계",
      icon: Building2,
      color: "border-l-indigo-500",
      iconColor: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "검증된 혼인 관계",
      value: `${kpis.verified_marriages_count}건`,
      sub: "과거·현재 혼인 명확 구분",
      icon: HeartHandshake,
      color: "border-l-purple-500",
      iconColor: "text-purple-600 bg-purple-50"
    },
    {
      title: "계열분리 독립",
      value: "11건",
      sub: "모태 그룹 독립 분할 공시",
      icon: GitFork,
      color: "border-l-amber-500",
      iconColor: "text-amber-600 bg-amber-50"
    },
    {
      title: "관계 검증률",
      value: `${kpis.verification_rate_percent}%`,
      sub: "독립 출처 교차검증 완료",
      icon: CheckCircle2,
      color: "border-l-teal-500",
      iconColor: "text-teal-600 bg-teal-50"
    },
    {
      title: "최신 데이터 기준일",
      value: kpis.last_updated,
      sub: "DART 및 공정위 최신자료",
      icon: Calendar,
      color: "border-l-slate-500",
      iconColor: "text-slate-600 bg-slate-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 my-4">
      {cards.map((c, idx) => {
        const IconComponent = c.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-lg p-3 shadow-sm border border-slate-200 border-l-4 ${c.color} flex flex-col justify-between hover:shadow transition`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">{c.title}</span>
              <div className={`p-1 rounded-md ${c.iconColor}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-base font-black text-slate-900 tracking-tight">{c.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
