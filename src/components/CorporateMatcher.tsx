import React, { useState, useMemo } from "react";
import {
  Building2,
  Users,
  Search,
  HeartHandshake,
  GitBranch,
  ShieldCheck,
  Share2,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Coins,
  Sparkles,
} from "lucide-react";
import { Family, Person, CorporateGroup, Relation } from "../types";
import sharedEquityData from "../data/shared_equity.json";

interface CorporateMatcherProps {
  corporateGroups: CorporateGroup[];
  families: Family[];
  persons: Person[];
  relations: Relation[];
  onNavigateToFamily: (familyId: string) => void;
  onNavigateToSpinoff: (familyId: string) => void;
  onNavigateToNetwork: (familyId: string) => void;
}

export const CorporateMatcher: React.FC<CorporateMatcherProps> = ({
  corporateGroups,
  families,
  persons,
  relations,
  onNavigateToFamily,
  onNavigateToSpinoff,
  onNavigateToNetwork,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("GRP_SAMSUNG");

  // Flatten all searchable companies (group names + key_companies)
  const allCompanyItems = useMemo(() => {
    const list: {
      companyName: string;
      group: CorporateGroup;
      isFlagship: boolean;
    }[] = [];

    corporateGroups.forEach((g) => {
      list.push({ companyName: g.name, group: g, isFlagship: true });
      (g.key_companies || []).forEach((c) => {
        if (c !== g.name) {
          list.push({ companyName: c, group: g, isFlagship: false });
        }
      });
    });
    return list;
  }, [corporateGroups]);

  // Filtered dropdown matches
  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allCompanyItems
      .filter((item) => item.companyName.toLowerCase().includes(q))
      .slice(0, 10);
  }, [searchQuery, allCompanyItems]);

  const selectedGroup = useMemo(() => {
    return (
      corporateGroups.find((g) => g.id === selectedGroupId) || corporateGroups[0]
    );
  }, [corporateGroups, selectedGroupId]);

  const matchedFamily = useMemo(() => {
    if (!selectedGroup) return null;
    return families.find((f) => f.id === selectedGroup.family_id) || null;
  }, [families, selectedGroup]);

  // Find all inter-chaebol marriages involving this family
  const inLawMarriages = useMemo(() => {
    if (!matchedFamily) return [];
    return relations.filter(
      (r) =>
        r.type === "MARRIAGE" &&
        r.is_inter_family &&
        (r.fam_from === matchedFamily.id || r.fam_to === matchedFamily.id)
    );
  }, [relations, matchedFamily]);

  // Map in-law families and their associated corporate groups
  const connectedCorporateInLaws = useMemo(() => {
    if (!matchedFamily) return [];
    const results: {
      marriage: Relation;
      partnerFamily: Family;
      partnerGroups: CorporateGroup[];
    }[] = [];

    inLawMarriages.forEach((m) => {
      const partnerFamId =
        m.fam_from === matchedFamily.id ? m.fam_to : m.fam_from;
      const partnerFam = families.find((f) => f.id === partnerFamId);
      if (partnerFam) {
        const partnerGrps = corporateGroups.filter(
          (g) => g.family_id === partnerFam.id
        );
        results.push({
          marriage: m,
          partnerFamily: partnerFam,
          partnerGroups: partnerGrps,
        });
      }
    });

    return results;
  }, [matchedFamily, inLawMarriages, families, corporateGroups]);

  // Find shared equity / JVs involving this corporate group
  const groupJVs = useMemo(() => {
    if (!selectedGroup) return [];
    return (sharedEquityData as any[]).filter((jv) => {
      const parties = jv.parties || [];
      return parties.some(
        (p: any) =>
          p.group_id === selectedGroup.id ||
          (p.company &&
            selectedGroup.key_companies &&
            selectedGroup.key_companies.includes(p.company))
      );
    });
  }, [selectedGroup]);

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                2번 핵심 기능 · 기업별 매칭
              </span>
              <span className="text-xs text-slate-400 font-medium">
                기업/계열사 기반 혼맥 및 혈통 가문 매칭 시스템
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <span>기업으로 찾는 혼맥·사돈 네트워크 매칭</span>
            </h2>
            <p className="text-slate-600 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              알고 싶은 기업(예: 삼성전자, 현대차, 대한항공, CJ, 아워홈, 삼표, 고려아연 등)을 검색하거나 선택하면, 해당 기업의 소속 가문, 총수, 모태 뿌리와 함께 <strong>혼맥(사돈)으로 연결된 다른 대기업군</strong> 및 <strong>지분 제휴 파트너</strong>를 즉시 확인할 수 있습니다.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="기업명 검색 (예: 기아, CJ제일제당, 아워홈)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 shadow-inner font-bold"
            />

            {/* Dropdown Suggestions */}
            {searchMatches.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                {searchMatches.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedGroupId(m.group.id);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-indigo-50 flex items-center justify-between border-b border-slate-100 last:border-b-0"
                  >
                    <div>
                      <span className="font-black text-slate-900">
                        {m.companyName}
                      </span>
                      {!m.isFlagship && (
                        <span className="text-[10px] text-slate-400 ml-1.5">
                          ({m.group.name}그룹 소속)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                      선택
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Fast Select Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-xs">
          <span className="font-bold text-slate-400 text-[11px] mr-1">
            주요 기업 바로가기:
          </span>
          {[
            { id: "GRP_SAMSUNG", name: "삼성전자" },
            { id: "GRP_HYUNDAI_MOTOR", name: "현대자동차" },
            { id: "GRP_SK", name: "SK하이닉스" },
            { id: "GRP_LG", name: "LG화학" },
            { id: "GRP_HANWHA", name: "한화(아워홈)" },
            { id: "GRP_CJ", name: "CJ" },
            { id: "GRP_SHINSEGAE", name: "신세계(이마트)" },
            { id: "GRP_HANJIN", name: "대한항공" },
            { id: "GRP_GS", name: "GS칼텍스" },
            { id: "GRP_HD_HYUNDAI", name: "HD현대" },
            { id: "GRP_MERITZ", name: "메리츠금융" },
            { id: "GRP_SAMPYO", name: "삼표" },
            { id: "GRP_DAESANG", name: "대상" },
            { id: "GRP_YOUNGPOONG", name: "고려아연" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedGroupId(item.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                selectedGroupId === item.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Selected Group Profile & Matching Results */}
      {selectedGroup && matchedFamily && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Group & Family DNA Dossier */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    대기업집단 프로필
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {selectedGroup.name}그룹
                  </h3>
                  <div className="text-xs text-indigo-700 font-bold mt-0.5">
                    소속 가문: {matchedFamily.name}
                  </div>
                </div>
                {selectedGroup.ftc_rank && (
                  <div className="text-right">
                    <span className="text-xs font-black bg-amber-100 text-amber-950 px-2 py-0.5 rounded">
                      공정위 {selectedGroup.ftc_rank}위
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      자산 약 {selectedGroup.assets_trillion}조원
                    </div>
                  </div>
                )}
              </div>

              {/* Group Attributes */}
              <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">창업주:</span>
                  <span className="font-black text-slate-800">
                    {matchedFamily.founder} ({matchedFamily.founding_year}년)
                  </span>
                </div>
                {selectedGroup.leader && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">현재 총수/리더:</span>
                    <span className="font-black text-indigo-900">
                      {selectedGroup.leader}
                    </span>
                  </div>
                )}
                {selectedGroup.industry && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">주력 업종:</span>
                    <span className="font-medium text-slate-700">
                      {selectedGroup.industry}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">가문 본관/연고:</span>
                  <span className="font-medium text-slate-700">
                    {matchedFamily.origin_region}
                  </span>
                </div>
              </div>

              {/* Key Subsidiaries Tags */}
              {selectedGroup.key_companies &&
                selectedGroup.key_companies.length > 0 && (
                  <div>
                    <span className="text-[11px] font-black text-slate-700 block mb-1.5">
                      주요 계열사 ({selectedGroup.key_companies.length}개):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedGroup.key_companies.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium border border-slate-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Buttons to Other Views */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => onNavigateToFamily(matchedFamily.id)}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{matchedFamily.name} 상세 가계도 보기</span>
                </button>
                <button
                  onClick={() => onNavigateToSpinoff(matchedFamily.id)}
                  className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-indigo-200"
                >
                  <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                  <span>범가문 계열 분가도 확인</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (2 cols): Connected In-Law Chaebols & Joint Ventures */}
          <div className="lg:col-span-2 space-y-6">
            {/* Box 1: Connected In-Law Chaebol Groups (혼맥으로 연결된 기업군) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base font-black text-slate-900">
                    혼맥(사돈)으로 연결된 상대 대기업군 ({connectedCorporateInLaws.length}건)
                  </h3>
                </div>
                <span className="text-[11px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold">
                  실제 통혼 기준
                </span>
              </div>

              {connectedCorporateInLaws.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  등록된 타 재벌 통혼 데이터가 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {connectedCorporateInLaws.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">
                            {item.marriage.label}
                          </span>
                          <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-1.5 py-0.2 rounded">
                            {item.partnerFamily.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.marriage.desc}
                        </p>
                      </div>

                      {/* Associated Groups for this In-law */}
                      {item.partnerGroups.length > 0 && (
                        <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-slate-500 font-bold">
                              연결 그룹:
                            </span>
                            {item.partnerGroups.map((pg) => (
                              <button
                                key={pg.id}
                                onClick={() => setSelectedGroupId(pg.id)}
                                className="text-[10px] bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 px-1.5 py-0.2 rounded font-black transition"
                              >
                                {pg.name} →
                              </button>
                            ))}
                          </div>
                          {item.marriage.start_year && (
                            <span className="text-[10px] text-slate-400">
                              {item.marriage.start_year}년
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Box 2: DART-verified Shared Equity & Joint Ventures */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-black text-slate-900">
                    지분 공유 및 합작 투자 파트너 ({groupJVs.length}건)
                  </h3>
                </div>
                <span className="text-[11px] bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-bold">
                  DART 공시 검증
                </span>
              </div>

              {groupJVs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  현재 등록된 주요 합작 투자/지분 동맹 내역이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {groupJVs.map((jv) => (
                    <div
                      key={jv.id}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-black text-slate-900">
                            {jv.venture_name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            설립/계약 연도: {jv.established_year}년 · {jv.business_scope}
                          </div>
                        </div>
                        <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                          {jv.venture_type}
                        </span>
                      </div>

                      {/* Parties Ratio */}
                      <div className="flex items-center gap-2 flex-wrap text-xs font-bold pt-1">
                        {jv.parties.map((p: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white px-2.5 py-1 rounded-lg border border-amber-300 text-slate-800 flex items-center gap-1.5"
                          >
                            <span>{p.company}</span>
                            <span className="text-amber-700 font-black">
                              {p.stake_percent}%
                            </span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                        {jv.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
