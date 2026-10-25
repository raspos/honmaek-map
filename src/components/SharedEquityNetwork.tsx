import React, { useState, useEffect, useRef, useMemo } from "react";
import cytoscape, { Core, EventObject } from "cytoscape";
import {
  Building2,
  Share2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Coins,
  ArrowRightLeft,
  Factory,
  Layers,
  Search,
  Filter,
  Info,
} from "lucide-react";
import sharedEquityData from "../data/shared_equity.json";
import { CorporateGroup } from "../types";

export interface SharedEquityItem {
  id: string;
  source_group_id: string;
  target_group_id: string;
  source_group_name: string;
  target_group_name: string;
  type: "JOINT_VENTURE" | "SHARE_SWAP" | "EQUITY_STAKE";
  type_label: string;
  joint_entity_name: string;
  equity_ratio: string;
  investment_amount: string;
  established_year: number;
  status: "ACTIVE" | "HISTORICAL";
  purpose: string;
  key_assets: string;
  dart_url: string;
  description: string;
}

interface SharedEquityNetworkProps {
  corporateGroups: CorporateGroup[];
}

export const SharedEquityNetwork: React.FC<SharedEquityNetworkProps> = ({
  corporateGroups,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItem, setActiveItem] = useState<SharedEquityItem | null>(
    (sharedEquityData as SharedEquityItem[])[0] || null
  );

  const equityList = sharedEquityData as SharedEquityItem[];

  // Filtered Items
  const filteredItems = useMemo(() => {
    return equityList.filter((item) => {
      const matchType =
        selectedType === "ALL" || item.type === selectedType;
      const matchSearch =
        !searchQuery.trim() ||
        item.joint_entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source_group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.target_group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [selectedType, searchQuery, equityList]);

  // Cytoscape Interactive Graph Rendering
  useEffect(() => {
    if (!containerRef.current) return;

    // Collect involved group IDs
    const involvedGroupIds = new Set<string>();
    filteredItems.forEach((item) => {
      involvedGroupIds.add(item.source_group_id);
      involvedGroupIds.add(item.target_group_id);
    });

    const elements: any[] = [];

    // Group Nodes
    corporateGroups.forEach((grp) => {
      if (involvedGroupIds.has(grp.id)) {
        elements.push({
          data: {
            id: grp.id,
            label: grp.name,
            sub: grp.assets_trillion ? `${grp.assets_trillion}조원` : "",
            color: "#0f766e", // emerald-teal
            size: Math.min(85, Math.max(55, (grp.assets_trillion || 10) * 0.12 + 50)),
          },
        });
      }
    });

    // Handle extra groups not in corporate_groups.json (e.g. NAVER, KT)
    const extraGroups: { [id: string]: { name: string; color: string } } = {
      GRP_NAVER: { name: "네이버 (NAVER)", color: "#059669" },
      GRP_KT: { name: "KT", color: "#0284c7" },
    };

    Object.entries(extraGroups).forEach(([gid, ginfo]) => {
      if (involvedGroupIds.has(gid)) {
        elements.push({
          data: {
            id: gid,
            label: ginfo.name,
            sub: "플랫폼/통신",
            color: ginfo.color,
            size: 60,
          },
        });
      }
    });

    // Edges
    filteredItems.forEach((item) => {
      const isSwap = item.type === "SHARE_SWAP";
      const isJV = item.type === "JOINT_VENTURE";
      elements.push({
        data: {
          id: item.id,
          source: item.source_group_id,
          target: item.target_group_id,
          label: `${item.joint_entity_name} (${item.equity_ratio.split(":")[0]?.trim() || ""})`,
          edgeType: item.type,
          color: isJV ? "#059669" : isSwap ? "#7c3aed" : "#d97706",
          width: isJV ? 4 : 3,
          style: item.status === "HISTORICAL" ? "dashed" : "solid",
          rawItem: item,
        },
      });
    });

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "text-max-width": "90px",
            color: "#ffffff",
            "font-size": "11px",
            "font-weight": 700,
            "background-color": "data(color)",
            width: "data(size)",
            height: "data(size)",
            "border-width": 3,
            "border-color": "#ffffff",
            "text-outline-color": "data(color)",
            "text-outline-width": 2,
          },
        },
        {
          selector: "edge",
          style: {
            width: "data(width)",
            "line-color": "data(color)",
            "line-style": "data(style)" as any,
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "10px",
            "font-weight": 600,
            color: "#0f172a",
            "text-background-color": "#ffffff",
            "text-background-opacity": 0.9,
            "text-background-padding": "3px",
            "text-background-shape": "roundrectangle",
            "text-border-color": "data(color)",
            "text-border-width": 1,
            "text-border-opacity": 0.5,
          } as any,
        },
        {
          selector: ":selected",
          style: {
            "border-color": "#f59e0b",
            "border-width": 4,
            "line-color": "#f59e0b",
            width: 5,
          },
        },
      ],
      layout: {
        name: "cose",
        animate: false,
        idealEdgeLength: 170,
        nodeOverlap: 40,
        componentSpacing: 100,
        nodeRepulsion: 500000,
        edgeElasticity: 100,
        gravity: 80,
      } as any,
    });

    cy.on("tap", "edge", (evt: EventObject) => {
      const edge = evt.target;
      const raw = edge.data("rawItem");
      if (raw) {
        setActiveItem(raw);
      }
    });

    cy.on("tap", "node", (evt: EventObject) => {
      const node = evt.target;
      const nid = node.id();
      const connected = filteredItems.find(
        (it) => it.source_group_id === nid || it.target_group_id === nid
      );
      if (connected) {
        setActiveItem(connected);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [filteredItems, corporateGroups]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-teal-800/40">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold tracking-wider">
            <Coins className="w-3.5 h-3.5" />
            DART 공시 기반 실질 지분공유 & 합작투자(JV) 네트워크
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            대한민국 대기업집단 간 지분공유 및 전략적 합작 사업망
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            모호한 업무협약(MOU)을 배제하고, 금융감독원 전자공시시스템(DART)에 공시된{" "}
            <strong>50:50 공동출자 합작법인(JV), 수천억원대 자사주 맞교환(Share Swap), 전략적 지분출자</strong> 등
            재벌 그룹들이 수천억~수조원의 자본 지분을 직접 섞어 운명공동체를 형성한 실질적 사업 동맹을 전수 분석합니다.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[11px] text-slate-400 font-bold">검증된 지분 공유 건수</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{equityList.length}건</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[11px] text-slate-400 font-bold">총 투입 자본 규모</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">17조 8,000억원+</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[11px] text-slate-400 font-bold">대표 50:50 합작사</div>
              <div className="text-sm font-black text-white mt-1">보령LNG·HLI그린·조지아JV</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[11px] text-slate-400 font-bold">지분 검증 출처</div>
              <div className="text-sm font-black text-emerald-300 mt-1">DART 100% 공시</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controller: Filter by Type & Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Type Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <span className="text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            유형 필터:
          </span>
          <button
            onClick={() => setSelectedType("ALL")}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedType === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            전체 보기 ({equityList.length})
          </button>
          <button
            onClick={() => setSelectedType("JOINT_VENTURE")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              selectedType === "JOINT_VENTURE"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            공동출자 합작법인 (JV)
          </button>
          <button
            onClick={() => setSelectedType("SHARE_SWAP")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              selectedType === "SHARE_SWAP"
                ? "bg-purple-700 text-white shadow-sm"
                : "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            상호 자사주 맞교환 (Share Swap)
          </button>
          <button
            onClick={() => setSelectedType("EQUITY_STAKE")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              selectedType === "EQUITY_STAKE"
                ? "bg-amber-700 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            전략적 지분 출자
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="합작사, 그룹명, 사업 목적 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Main Graph & Detail Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cytoscape Network Visualizer (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[650px] relative">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                지분 공유 관계망 인터랙티브 그래프
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                합작투자(JV)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
                자사주 스왑
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                지분 출자
              </span>
            </div>
          </div>

          {/* Cytoscape Canvas */}
          <div ref={containerRef} className="flex-1 w-full h-full bg-slate-50/50" />

          {/* Canvas Bottom Instruction Pill */}
          <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-slate-200 text-[11px] text-slate-600 shadow-sm flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            초록색/보라색 연결선을 클릭하면 해당 합작투자의 DART 공시 및 지분 상세가 표시됩니다.
          </div>
        </div>

        {/* Right: Selected Equity Detail Inspector (1 Col) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between h-[650px] overflow-y-auto">
          {activeItem ? (
            <div className="space-y-4">
              <div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                    activeItem.type === "JOINT_VENTURE"
                      ? "bg-emerald-100 text-emerald-800"
                      : activeItem.type === "SHARE_SWAP"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {activeItem.type_label}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1.5">
                  {activeItem.joint_entity_name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  체결/설립: {activeItem.established_year}년 · 상태:{" "}
                  <strong
                    className={
                      activeItem.status === "ACTIVE"
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }
                  >
                    {activeItem.status === "ACTIVE" ? "현재 가동/유지" : "과거 합작 (인수전환)"}
                  </strong>
                </div>
              </div>

              {/* Parties & Ownership Structure */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  지분 공유 주체 및 지분율
                </div>
                <div className="text-sm font-black text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200">
                  {activeItem.equity_ratio}
                </div>
                <div className="flex justify-between text-xs text-slate-600 pt-1">
                  <span>투자 규모:</span>
                  <span className="font-bold text-slate-900">{activeItem.investment_amount}</span>
                </div>
              </div>

              {/* Purpose & Key Assets */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">전략적 설립 목적</div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {activeItem.purpose}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">핵심 자산 및 설비</div>
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {activeItem.key_assets}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">상세 팩트 및 시너지 분석</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* DART Filing Link */}
              <div className="pt-2">
                <a
                  href={activeItem.dart_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>DART 전자공시시스템 원문 보고서 확인</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
              <Share2 className="w-8 h-8 mb-2 stroke-1" />
              왼쪽 네트워크에서 관계선이나 노드를 선택하세요.
            </div>
          )}
        </div>
      </div>

      {/* ALL EQUITY ALLIANCES CARDS CATALOG */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              전체 지분공유 및 합작투자 프로젝트 목록 ({filteredItems.length}건)
            </h3>
            <p className="text-xs text-slate-500">
              카드를 클릭하면 상단 인터랙티브 뷰와 DART 공시 상세가 갱신됩니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-50/50 border-emerald-500 shadow-md ring-1 ring-emerald-500"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        item.type === "JOINT_VENTURE"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.type === "SHARE_SWAP"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.type_label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {item.established_year}년
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      {item.joint_entity_name}
                    </h4>
                    <div className="text-xs font-semibold text-emerald-800 mt-1">
                      {item.equity_ratio}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.purpose}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{item.investment_amount}</span>
                  <a
                    href={item.dart_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
                  >
                    <span>DART 공시</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
