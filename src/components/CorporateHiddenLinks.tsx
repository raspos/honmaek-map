import React, { useState } from "react";
import { Family, CorporateGroup, Relation, Person, Source } from "../types";
import { Scale, HeartHandshake, GitFork, ArrowRight, ShieldCheck } from "lucide-react";
import shortestPathsData from "../data/shortest_paths.json";

interface CorporateHiddenLinksProps {
  corporateGroups: CorporateGroup[];
  families: Family[];
  relations: Relation[];
  persons?: Person[];
  sources?: Source[];
}

export const CorporateHiddenLinks: React.FC<CorporateHiddenLinksProps> = ({
  corporateGroups,
  families,
  relations,
}) => {
  const [group1Id, setGroup1Id] = useState<string>("GRP_SAMSUNG");
  const [group2Id, setGroup2Id] = useState<string>("GRP_HANWHA");

  const g1 = corporateGroups.find((g) => g.id === group1Id) || corporateGroups[0];
  const g2 = corporateGroups.find((g) => g.id === group2Id) || corporateGroups[1];

  const fam1 = families.find((f) => f.id === g1.family_id);
  const fam2 = families.find((f) => f.id === g2.family_id);

  // 1. Direct Marriage between families
  const marriageRel = (fam1 && fam2 && fam1.id !== fam2.id)
    ? relations.find(
        (r) =>
          r.type === "MARRIAGE" &&
          r.is_inter_family &&
          ((r.fam_from === fam1.id && r.fam_to === fam2.id) || (r.fam_from === fam2.id && r.fam_to === fam1.id))
      )
    : null;

  const sameFamily = fam1?.id === fam2?.id;

  // 2. Spinoff relations
  const spinoffRel = relations.find(
    (r) =>
      r.type === "SPINOFF" &&
      ((r.from_id === g1.id && r.to_id === g2.id) || (r.from_id === g2.id && r.to_id === g1.id))
  );

  // 3. Shortest Path (Indirect Marriage Hubs)
  const shortestPaths: Record<string, Record<string, { steps: number; path_nodes: string[] }>> = shortestPathsData as any;
  const pathInfo = (fam1 && fam2 && fam1.id !== fam2.id)
    ? shortestPaths[fam1.id]?.[fam2.id]
    : null;

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-6 space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded">
          핵심 기능: 기업 가문 혼맥 및 계열분리 비교 (Dynasty Lineage Comparison)
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          가문 혼맥과 계열분리 독립의 입체적 비교
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          두 대기업을 선택하여 오너 가문 간의 직접·간접 혼맥(왼쪽)과 모태-자기업 간 계열분리 역사(오른쪽)를 입체적으로 분석합니다.
        </p>
      </div>

      {/* Corporate Selectors */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">비교 기업집단 1</label>
          <select
            value={group1Id}
            onChange={(e) => setGroup1Id(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            {corporateGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (소속: {families.find((f) => f.id === g.family_id)?.name})
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-400 mt-4 hidden md:block">
          <Scale className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">비교 기업집단 2</label>
          <select
            value={group2Id}
            onChange={(e) => setGroup2Id(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            {corporateGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (소속: {families.find((f) => f.id === g.family_id)?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cross Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${
          sameFamily || spinoffRel
            ? "bg-amber-50 border-amber-200 text-amber-950"
            : marriageRel
            ? "bg-rose-50 border-rose-200 text-rose-950"
            : pathInfo
            ? "bg-purple-50 border-purple-200 text-purple-950"
            : "bg-slate-50 border-slate-200 text-slate-800"
        }`}
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80">
            {sameFamily
              ? "★ 동일 창업주 가문 (모태와 분가)"
              : spinoffRel
              ? "★ 계열분리 독립 기업집단"
              : marriageRel
              ? "★ 직결 혼인 관계 (사돈)"
              : pathInfo
              ? `★ 정·재계 혼맥 허브 경유 (${pathInfo.steps}다리 연결)`
              : "직접적 혈연·혼인 연결 미확인"}
          </span>
          <div className="text-sm font-bold mt-1">
            {g1.name} ↔ {g2.name}
          </div>
        </div>

        <div className="text-xs font-semibold">
          소유 가문: {fam1?.name} ↔ {fam2?.name}
        </div>
      </div>

      {/* Split Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT COLUMN: FAMILY MARRIAGE & BLOOD */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-slate-800">소유 가문 간 혈연·혼인 관계</span>
          </div>

          {sameFamily ? (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">동일 가문 뿌리 ({fam1?.name})</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                두 기업집단은 동일한 창업주 가문의 역사에서 출발하여 분가된 형제/사촌 기업군입니다.
              </p>
            </div>
          ) : marriageRel ? (
            <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs space-y-2">
              <div className="font-bold text-rose-900">{marriageRel.label}</div>
              <p className="text-slate-700 leading-relaxed text-[11px]">{marriageRel.desc}</p>
              <div className="text-[10px] text-slate-500">혼인 시기: {marriageRel.start_year}년</div>
            </div>
          ) : pathInfo ? (
            <div className="p-3 bg-white rounded-lg border border-purple-200 text-xs space-y-2">
              <div className="font-bold text-purple-900">혼맥 허브 경유 간접 연결 ({pathInfo.steps}단계)</div>
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-semibold text-purple-800 bg-purple-50 p-2 rounded">
                {pathInfo.path_nodes.map((nodeId, idx) => {
                  const nodeFam = families.find((f) => f.id === nodeId);
                  return (
                    <React.Fragment key={nodeId}>
                      <span className="bg-white px-2 py-0.5 rounded shadow-xs border border-purple-200">
                        {nodeFam?.name || nodeId}
                      </span>
                      {idx < pathInfo.path_nodes.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-purple-500" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                정·관계 혼맥 허브 및 주요 사돈 가문을 통해 촘촘한 혼맥망으로 연결되어 있습니다.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg border border-slate-200 text-center text-slate-500 text-xs">
              소유 가문 간 직접 또는 3단계 이내의 확인된 혼맥 관계가 없습니다.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CORPORATE SPINOFF & GOVERNANCE */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <GitFork className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-800">모태 기업 승계 및 계열분리 역사</span>
          </div>

          {spinoffRel ? (
            <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-2">
              <div className="font-bold text-amber-900">{spinoffRel.label}</div>
              <p className="text-slate-700 leading-relaxed text-[11px]">{spinoffRel.desc}</p>
              <div className="text-[10px] text-amber-700 font-medium">계열분리 공시/발생: {spinoffRel.start_year}년</div>
            </div>
          ) : sameFamily ? (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">가문 내 형제 독립 경영</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                법인 간 직접적 분할 계약 외에도 가문 승계 과정에서 각 계열사군을 형제·자손들이 독자 경영하고 있습니다.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg border border-slate-200 text-center text-slate-500 text-xs">
              두 기업집단 간 계열분리(스핀오프) 또는 모태 기업 분할 관계가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Disclaimed Caution Alert */}
      <div className="p-3.5 bg-rose-50/80 rounded-lg border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>한국 기업 가문 데이터 분석:</strong> 한국 재벌 가문들은 복잡한 정략결혼 및 정·관계 혼맥 허브(이후락, 노신영, 김동조, 송인상 등)를 경유하여 거미줄처럼 연결되어 있습니다. 본 플랫폼은 공시 및 공식 보도자료에 기반하여 검증된 혼맥과 계열분리 역사만을 객관적으로 시각화합니다.
        </div>
      </div>
    </div>
  );
};
