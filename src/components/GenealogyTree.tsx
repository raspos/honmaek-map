import React, { useState, useMemo } from "react";
import { Family, Person, Relation, CorporateGroup, Source } from "../types";
import {
  Users,
  HeartHandshake,
  GitBranch,
  ExternalLink,
  Search,
  ListTree,
  LayoutGrid,
  Crown,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Building2,
  UserCheck,
} from "lucide-react";
import structuredData from "../data/structured_genealogies.json";

interface TreeNode {
  id: string;
  name: string;
  birthDeath?: string;
  role: string;
  company?: string;
  generation: number;
  orderLabel?: string;
  spouses?: {
    name: string;
    birthDeath?: string;
    familyOrigin?: string;
  }[];
  interMarriage?: {
    partnerName: string;
    partnerFamily: string;
    desc: string;
  };
  children?: TreeNode[];
}

interface GenealogyTreeProps {
  families: Family[];
  persons: Person[];
  corporateGroups: CorporateGroup[];
  relations: Relation[];
  sources: Source[];
  selectedFamilyId: string;
  onSelectFamily: (id: string) => void;
}

// Visual Interactive Tree Node Component
const VisualTreeNodeComponent: React.FC<{
  node: TreeNode;
  searchQuery: string;
  depth?: number;
}> = ({ node, searchQuery, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const hasChildren = node.children && node.children.length > 0;
  const isMatch =
    searchQuery.trim().length > 0 &&
    (node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.company && node.company.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="relative pl-6 my-2">
      {/* Vertical Branch Guide Line */}
      {depth > 0 && (
        <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-slate-200" />
      )}
      {/* Horizontal connector */}
      {depth > 0 && (
        <div className="absolute left-1 top-6 w-4 h-0.5 bg-slate-300" />
      )}

      {/* Person Node Card */}
      <div
        className={`inline-block min-w-[280px] max-w-[420px] p-3.5 rounded-xl border transition-all shadow-sm ${
          isMatch
            ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400 shadow-md"
            : node.generation === 1
            ? "bg-slate-900 text-white border-slate-800"
            : node.generation === 2
            ? "bg-white border-slate-300 hover:border-slate-400"
            : "bg-slate-50/90 border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {node.orderLabel && (
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  node.generation === 1
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {node.orderLabel}
              </span>
            )}
            <span
              className={`text-sm font-black tracking-tight ${
                node.generation === 1 ? "text-white" : "text-slate-900"
              }`}
            >
              {node.name}
            </span>
            {node.generation === 1 && (
              <Crown className="w-3.5 h-3.5 text-amber-400 inline" />
            )}
          </div>

          {node.birthDeath && (
            <span
              className={`text-[11px] font-medium ${
                node.generation === 1 ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {node.birthDeath}
            </span>
          )}
        </div>

        {/* Role & Company */}
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-xs font-bold ${
              node.generation === 1 ? "text-amber-300" : "text-indigo-800"
            }`}
          >
            {node.role}
          </span>
          {node.company && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                node.generation === 1
                  ? "bg-slate-800 text-slate-300"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }`}
            >
              {node.company}
            </span>
          )}
        </div>

        {/* Spouses List */}
        {node.spouses && node.spouses.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {node.spouses.map((sp, idx) => (
              <div
                key={idx}
                className="text-[11px] bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded font-medium flex items-center gap-1"
              >
                <span className="text-slate-400 font-bold">妻</span>
                <span>{sp.name}</span>
                {sp.birthDeath && (
                  <span className="text-slate-400 text-[10px]">({sp.birthDeath})</span>
                )}
                {sp.familyOrigin && (
                  <span className="text-[10px] text-slate-500">· {sp.familyOrigin}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Inter-Chaebol Marriage Callout Pill */}
        {node.interMarriage && (
          <div className="mt-2 pt-2 border-t border-rose-100 bg-rose-50/70 p-2 rounded-lg text-xs space-y-0.5 border border-rose-200">
            <div className="flex items-center justify-between text-rose-900 font-black text-[11px]">
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-rose-600" />
                타 재벌 혼맥: {node.interMarriage.partnerName}
              </span>
              <span className="bg-rose-200 text-rose-900 text-[10px] px-1.5 py-0.2 rounded font-bold">
                {node.interMarriage.partnerFamily}
              </span>
            </div>
            <p className="text-[10px] text-rose-700 leading-tight">
              {node.interMarriage.desc}
            </p>
          </div>
        )}

        {/* Children Collapse Toggle */}
        {hasChildren && (
          <div className="mt-2 pt-1 flex justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-3 h-3" />
                  <span>자녀 {node.children!.length}남매 접기</span>
                </>
              ) : (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span>자녀 {node.children!.length}남매 펼치기</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Recursive Children Branches */}
      {hasChildren && isExpanded && (
        <div className="space-y-2 mt-1">
          {node.children!.map((child) => (
            <VisualTreeNodeComponent
              key={child.id}
              node={child}
              searchQuery={searchQuery}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({
  families,
  persons,
  corporateGroups,
  relations,
  sources,
  selectedFamilyId,
  onSelectFamily,
}) => {
  const [viewMode, setViewMode] = useState<"tree" | "cards">("tree");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentFamily =
    families.find((f) => f.id === selectedFamilyId) || families[0];

  // Structured family tree
  const structuredFamily = (structuredData as Record<string, any>)[currentFamily.id];

  // All persons belonging to this family
  const familyPersons = useMemo(() => {
    return persons.filter((p) => p.family_id === currentFamily.id);
  }, [persons, currentFamily.id]);

  // Filter persons by search query for Cards View
  const filteredFamilyPersons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return familyPersons;
    return familyPersons.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.company && p.company.toLowerCase().includes(q)) ||
        (p.main_title && p.main_title.toLowerCase().includes(q))
    );
  }, [familyPersons, searchQuery]);

  // Group by generation for Cards View
  const gen1 = filteredFamilyPersons.filter((p) => p.gen === 1);
  const gen2 = filteredFamilyPersons.filter((p) => p.gen === 2);
  const gen3 = filteredFamilyPersons.filter((p) => p.gen === 3);
  const gen4 = filteredFamilyPersons.filter((p) => p.gen === 4);

  // Inter-chaebol marriages involving this family
  const interMarriages = relations.filter(
    (r) =>
      r.type === "MARRIAGE" &&
      r.is_inter_family &&
      (r.fam_from === currentFamily.id || r.fam_to === currentFamily.id)
  );

  // Compute Tree Root: either from structuredData or dynamic fallback from persons
  const treeRoot = useMemo<TreeNode | null>(() => {
    if (structuredFamily && structuredFamily.root) {
      return structuredFamily.root;
    }
    if (familyPersons.length === 0) return null;

    const g1List = familyPersons.filter((p) => p.gen === 1);
    const g2List = familyPersons.filter((p) => p.gen === 2);
    const g3List = familyPersons.filter((p) => p.gen === 3);
    const g4List = familyPersons.filter((p) => p.gen === 4);

    const rootPerson = g1List.find((p) => p.is_founder) || g1List[0] || familyPersons[0];

    const buildNode = (p: Person, gen: number, order?: string): TreeNode => {
      const im = relations.find(
        (r) =>
          r.type === "MARRIAGE" &&
          r.is_inter_family &&
          (r.from_id === p.id || r.to_id === p.id)
      );
      const otherPersonId = im
        ? im.from_id === p.id
          ? im.to_id
          : im.from_id
        : null;
      const otherPerson = otherPersonId
        ? persons.find((x) => x.id === otherPersonId)
        : null;
      const otherFam = im
        ? families.find(
            (f) =>
              f.id === (im.fam_from === currentFamily.id ? im.fam_to : im.fam_from)
          )
        : null;

      return {
        id: p.id,
        name: p.name,
        birthDeath: p.birth ? `${p.birth} ~ ${p.death || ""}` : undefined,
        role: p.role || (gen === 1 ? "창업 세대" : `${gen}세대`),
        company: p.company || p.main_title,
        generation: gen,
        orderLabel: order || (p.is_founder ? "창업주" : `${gen}세대`),
        interMarriage:
          im && otherFam
            ? {
                partnerName: otherPerson?.name || "배우자",
                partnerFamily: otherFam.name,
                desc: im.desc || `${currentFamily.name} - ${otherFam.name} 간 정재계 혼맥`,
              }
            : undefined,
        children: [],
      };
    };

    const root = buildNode(rootPerson, 1, "선대/창업주");
    // Other G1 persons if any
    const otherG1 = g1List.filter((p) => p.id !== rootPerson.id);

    root.children = [
      ...otherG1.map((p, idx) => buildNode(p, 1, `동업/형제 ${idx + 1}`)),
      ...g2List.map((p, idx) => {
        const g2Node = buildNode(p, 2, `${idx + 1}남/녀`);
        g2Node.children = g3List.map((g3p, g3idx) => {
          const g3Node = buildNode(g3p, 3, `${g3idx + 1}남/녀`);
          g3Node.children = g4List.map((g4p, g4idx) =>
            buildNode(g4p, 4, `${g4idx + 1}남/녀`)
          );
          return g3Node;
        });
        return g2Node;
      }),
    ];

    return root;
  }, [
    structuredFamily,
    familyPersons,
    relations,
    persons,
    families,
    currentFamily.id,
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Top Selector & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-2.5 py-0.5 rounded-full">
              시각적 인터랙티브 가계도
            </span>
            <span className="text-xs text-slate-400 font-medium">
              3~4세대 혈족·혼맥 계통 차트
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {currentFamily.name}
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-300">
              창업주: {currentFamily.founder} ({currentFamily.founding_year}년)
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
              타 대기업 통혼 {interMarriages.length}건
            </span>
          </div>
          <p className="text-slate-600 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
            {currentFamily.history_summary}
          </p>
        </div>

        {/* Family Select Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-xs font-bold text-slate-500">가문 전환:</label>
          <select
            value={currentFamily.id}
            onChange={(e) => {
              onSelectFamily(e.target.value);
              setSearchQuery("");
            }}
            className="px-3.5 py-2.5 text-xs font-black bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 shadow-sm"
          >
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} (창업주: {f.founder})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Bar: View Switcher (Visual Tree vs Generational Cards) & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-lg text-xs font-bold">
          <button
            onClick={() => setViewMode("tree")}
            className={`px-3.5 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              viewMode === "tree"
                ? "bg-white text-slate-900 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <span>시각적 계통 수형도 (Visual Tree)</span>
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3.5 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              viewMode === "cards"
                ? "bg-white text-slate-900 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-emerald-600" />
            <span>세대별 스윔레인 뷰 (1~4세대)</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {familyPersons.length}명
            </span>
          </button>
        </div>

        {/* Search in Current Family */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`${currentFamily.name} 인물 검색 (예: 회장, 이름)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 shadow-inner"
          />
        </div>
      </div>

      {/* VIEW MODE 1: VISUAL INTERACTIVE TREE CHART */}
      {viewMode === "tree" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold text-slate-700">
              {currentFamily.name} 항렬·직계 자녀 계통 수형도
            </span>
            <span className="text-slate-400">
              노드를 클릭하여 자녀 브랜치를 접거나 펼칠 수 있습니다.
            </span>
          </div>

          <div className="bg-slate-50/60 p-6 md:p-8 rounded-2xl border border-slate-200 overflow-x-auto shadow-inner">
            {treeRoot ? (
              <VisualTreeNodeComponent
                node={treeRoot}
                searchQuery={searchQuery}
              />
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                가문 구성원 데이터를 불러오는 중입니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: GENERATIONAL CARDS SWIMLANE */}
      {viewMode === "cards" && (
        <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>세대별 가계 인물 카드 뷰 (총 {familyPersons.length}명 수록)</span>
            </h3>
          </div>

          {[
            { gen: 1, label: "1세대 (창업 세대)", list: gen1 },
            { gen: 2, label: "2세대 (선대회장 및 형제 세대)", list: gen2 },
            { gen: 3, label: "3세대 (현 회장단 및 총수 세대)", list: gen3 },
            { gen: 4, label: "4세대 (차세대 경영 세대)", list: gen4 },
          ].map((gSection) => {
            if (gSection.list.length === 0) return null;
            return (
              <div key={gSection.gen} className="relative pl-6 border-l-2 border-slate-300">
                <span className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-black flex items-center justify-center shadow">
                  {gSection.gen}
                </span>
                <div className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span>{gSection.label}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                    {gSection.list.length}명
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {gSection.list.map((p) => {
                    const isLeader =
                      p.role === "회장" || p.role === "부회장" || p.is_founder;
                    return (
                      <div
                        key={p.id}
                        className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                          isLeader
                            ? "bg-white border-slate-300 shadow-sm hover:border-amber-400 hover:shadow-md"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                                <span>{p.name}</span>
                                {p.is_founder && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500 inline" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {p.birth ? `${p.birth}년` : ""} ~{" "}
                                {p.death ? `${p.death}년` : "현재"}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-black ${
                                isLeader
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {p.role}
                            </span>
                          </div>

                          {p.company && (
                            <div className="text-xs text-indigo-700 font-bold">
                              {p.company}
                            </div>
                          )}
                          {p.main_title && p.main_title !== p.role && (
                            <div className="text-xs text-slate-700 font-medium">
                              {p.main_title}
                            </div>
                          )}

                          {p.bio && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {p.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inter-Chaebol Marriage Connections List */}
      {interMarriages.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-black text-slate-900">
              {currentFamily.name} 중심 타 재벌 가문과의 직접 혼맥 결절점 ({interMarriages.length}건)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interMarriages.map((m) => {
              const otherFamId = m.fam_from === currentFamily.id ? m.fam_to : m.fam_from;
              const otherFam = families.find((f) => f.id === otherFamId);
              return (
                <div
                  key={m.id}
                  className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 text-xs flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-black text-slate-900">
                      <span>{m.label}</span>
                      {otherFam && (
                        <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded font-bold">
                          {otherFam.name}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                  {m.start_year && (
                    <div className="text-[10px] text-slate-400 font-medium">
                      혼인 시기: {m.start_year}년 {m.end_year ? `~ ${m.end_year}년 (이혼/사별)` : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
