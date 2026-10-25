import React, { useEffect, useRef, useState } from "react";
import cytoscape, { Core, EventObject } from "cytoscape";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Download, Filter, Info, ExternalLink, ShieldCheck } from "lucide-react";
import { Family, Person, CorporateGroup, Relation, Source } from "../types";

interface NetworkViewProps {
  families: Family[];
  persons: Person[];
  corporateGroups: CorporateGroup[];
  relations: Relation[];
  sources: Source[];
  selectedItem: { type: "family" | "person" | "group"; id: string } | null;
  onSelectItem: (type: "family" | "person" | "group", id: string) => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  families,
  persons,
  corporateGroups,
  relations,
  sources,
  selectedItem,
  onSelectItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // 3 Exploration Levels
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  // Filters
  const [showBlood, setShowBlood] = useState(true);
  const [showMarriage, setShowMarriage] = useState(true);
  const [showSpinoff, setShowSpinoff] = useState(true);
  // Hide isolated/unconnected nodes by default (user request)
  const [hideIsolated, setHideIsolated] = useState(true);
  const [renderedStats, setRenderedStats] = useState({ nodes: 0, edges: 0 });

  // Selected Detail Panel
  const [activeDetail, setActiveDetail] = useState<{
    type: "family" | "person" | "group" | "edge";
    id: string;
    data?: any;
  } | null>(null);

  // Export PNG handler
  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const png64 = cyRef.current.png({ full: true, scale: 2, bg: "#ffffff" });
    const link = document.createElement("a");
    link.download = `혼맥의지도_네트워크_레벨${level}.png`;
    link.href = png64;
    link.click();
  };

  // Re-build graph when level or filters change
  useEffect(() => {
    if (!containerRef.current) return;

    const elements: any[] = [];

    if (level === 1) {
      // LEVEL 1: FAMILIES & INTER-CHAEBOL MARRIAGE
      const activeEdges: any[] = [];
      if (showMarriage) {
        relations.forEach((r) => {
          if (r.type === "MARRIAGE" && r.is_inter_family && r.fam_from && r.fam_to) {
            activeEdges.push({
              data: {
                id: r.id,
                source: r.fam_from,
                target: r.fam_to,
                label: r.label,
                edgeType: "MARRIAGE",
                color: "#e11d48", // rose red
                width: 3.5,
                style: r.end_year ? "dashed" : "solid",
                rawRelation: r,
              },
            });
          }
        });
      }

      // Collect IDs of families that have at least one connection edge
      const connectedFamIds = new Set(
        activeEdges.flatMap((e) => [e.data.source, e.data.target])
      );

      families.forEach((f) => {
        // If hideIsolated is true, exclude families with zero connections
        if (hideIsolated && !connectedFamIds.has(f.id)) {
          return;
        }

        const isPoliticalHub =
          f.id.startsWith("FAM_LHO") ||
          f.id.startsWith("FAM_KIM_DONG") ||
          f.id.startsWith("FAM_SONG_IN") ||
          f.id.startsWith("FAM_PRESIDENT");

        elements.push({
          data: {
            id: f.id,
            label: f.name,
            sub: `창업: ${f.founder}`,
            type: "family",
            status: f.verification_status,
            color: isPoliticalHub
              ? "#7c3aed" // Vibrant Purple for Political Hubs
              : f.verification_status === "VERIFIED"
              ? "#1e293b"
              : "#64748b",
            size: isPoliticalHub ? 66 : f.related_groups.length > 2 ? 62 : 48,
          },
        });
      });

      elements.push(...activeEdges);
    } else if (level === 2) {
      // LEVEL 2: PERSONS, BLOOD & MARRIAGES
      const activeEdges: any[] = [];
      relations.forEach((r) => {
        if (r.type === "BLOOD" && showBlood) {
          activeEdges.push({
            data: {
              id: r.id,
              source: r.from_id,
              target: r.to_id,
              label: r.label,
              edgeType: "BLOOD",
              color: "#3b82f6", // blue
              width: 2,
              style: "solid",
              rawRelation: r,
            },
          });
        } else if (r.type === "MARRIAGE" && showMarriage) {
          activeEdges.push({
            data: {
              id: r.id,
              source: r.from_id,
              target: r.to_id,
              label: r.label,
              edgeType: "MARRIAGE",
              color: "#e11d48", // rose
              width: 3,
              style: r.end_year ? "dashed" : "solid",
              rawRelation: r,
            },
          });
        }
      });

      const connectedPersonIds = new Set(
        activeEdges.flatMap((e) => [e.data.source, e.data.target])
      );

      persons.forEach((p) => {
        // Exclude isolated persons without any blood or marriage link if hideIsolated is true
        if (hideIsolated && !connectedPersonIds.has(p.id)) {
          return;
        }

        const fam = families.find((f) => f.id === p.family_id);
        elements.push({
          data: {
            id: p.id,
            label: `${p.name}\n(${p.gen}세대)`,
            sub: p.role,
            type: "person",
            famName: fam ? fam.name : "",
            color: p.gen === 1 ? "#0f172a" : p.gen === 2 ? "#0369a1" : "#0d9488",
            size: p.role.includes("창업주") || p.role.includes("회장") ? 55 : 42,
          },
        });
      });

      elements.push(...activeEdges);
    } else if (level === 3) {
      // LEVEL 3: CORPORATE GROUPS & SPINOFF TIES
      const activeEdges: any[] = [];
      relations.forEach((r) => {
        if (r.type === "SPINOFF" && showSpinoff) {
          activeEdges.push({
            data: {
              id: r.id,
              source: r.from_id,
              target: r.to_id,
              label: r.label,
              edgeType: "SPINOFF",
              color: "#f59e0b", // amber
              width: 3,
              style: "dashed",
              rawRelation: r,
            },
          });
        }
      });

      const connectedGroupIds = new Set(
        activeEdges.flatMap((e) => [e.data.source, e.data.target])
      );

      corporateGroups.forEach((g) => {
        // Exclude isolated corporate groups with no spinoff or business links
        if (hideIsolated && !connectedGroupIds.has(g.id)) {
          return;
        }

        elements.push({
          data: {
            id: g.id,
            label: g.name,
            sub: g.assets_trillion ? `${g.assets_trillion}조원` : "",
            type: "group",
            color: "#4f46e5", // indigo
            size: Math.min(80, Math.max(45, (g.assets_trillion || 10) * 0.15 + 40)),
          },
        });
      });

      elements.push(...activeEdges);
    }

    // Update rendered count state for UI banner
    const nNodes = elements.filter((e) => !e.data.source).length;
    const nEdges = elements.filter((e) => e.data.source).length;
    setRenderedStats({ nodes: nNodes, edges: nEdges });

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
            "border-width": 2,
            "border-color": "#ffffff",
            "text-outline-color": "data(color)",
            "text-outline-width": 1.5,
            "transition-property": "background-color, border-color, width, height",
            "transition-duration": 0.2,
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 4,
            "border-color": "#f59e0b",
            "background-color": "#0f172a",
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
            "font-size": "9px",
            "text-rotation": "autorotate",
            "text-background-opacity": 0.85,
            "text-background-color": "#ffffff",
            "text-background-padding": "2px",
            "text-border-opacity": 0.3,
            "text-border-width": 0.5,
            "text-border-color": "#94a3b8",
            color: "#334155",
            "target-arrow-shape": level === 3 ? "triangle" : "none",
            "target-arrow-color": "data(color)",
          },
        },
        {
          selector: "edge:selected",
          style: {
            width: 5,
            "line-color": "#f59e0b",
          },
        },
      ],
      layout: {
        name: "cose",
        idealEdgeLength: level === 1 ? 160 : 120,
        nodeOverlap: 30,
        refresh: 20,
        fit: true,
        padding: 40,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
      } as any,
    });

    cy.on("tap", "node", (evt: EventObject) => {
      const node = evt.target;
      const nodeData = node.data();
      if (nodeData.type === "family") {
        const fam = families.find((f) => f.id === nodeData.id);
        setActiveDetail({ type: "family", id: nodeData.id, data: fam });
        onSelectItem("family", nodeData.id);
      } else if (nodeData.type === "person") {
        const per = persons.find((p) => p.id === nodeData.id);
        setActiveDetail({ type: "person", id: nodeData.id, data: per });
        onSelectItem("person", nodeData.id);
      } else if (nodeData.type === "group") {
        const grp = corporateGroups.find((g) => g.id === nodeData.id);
        setActiveDetail({ type: "group", id: nodeData.id, data: grp });
        onSelectItem("group", nodeData.id);
      }
    });

    cy.on("tap", "edge", (evt: EventObject) => {
      const edge = evt.target;
      const edgeData = edge.data();
      setActiveDetail({
        type: "edge",
        id: edgeData.id,
        data: edgeData.rawRelation,
      });
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [level, showBlood, showMarriage, showSpinoff, hideIsolated, families, persons, corporateGroups, relations]);

  // Center on node if selected from outside (e.g. search)
  useEffect(() => {
    if (selectedItem && cyRef.current) {
      const node = cyRef.current.$id(selectedItem.id);
      if (node.length > 0) {
        node.select();
        cyRef.current.animate({
          center: { eles: node },
          zoom: 1.4,
          duration: 500,
        });
      }
    }
  }, [selectedItem]);

  return (
    <div className="relative bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col h-[750px]">
      {/* Top Controller Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Level Switcher (3-Stage Explore) */}
        <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setLevel(1)}
            className={`px-3 py-1 rounded-md transition ${
              level === 1 ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            1단계. 기업 가문 네트워크
          </button>
          <button
            onClick={() => setLevel(2)}
            className={`px-3 py-1 rounded-md transition ${
              level === 2 ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            2단계. 인물 혼맥 네트워크
          </button>
          <button
            onClick={() => setLevel(3)}
            className={`px-3 py-1 rounded-md transition ${
              level === 3 ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            3단계. 모태기업 계열분리 계통도
          </button>
        </div>

        {/* Relation Type Filters */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> 필터:
          </span>
          {level === 2 && (
            <label className="flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-blue-800">
              <input
                type="checkbox"
                checked={showBlood}
                onChange={(e) => setShowBlood(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded"
              />
              혈연 (TYPE A)
            </label>
          )}
          {(level === 1 || level === 2) && (
            <label className="flex items-center gap-1 cursor-pointer bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-rose-800">
              <input
                type="checkbox"
                checked={showMarriage}
                onChange={(e) => setShowMarriage(e.target.checked)}
                className="w-3 h-3 text-rose-600 rounded"
              />
              혼인 (TYPE B)
            </label>
          )}
          {level === 3 && (
            <label className="flex items-center gap-1 cursor-pointer bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-800">
              <input
                type="checkbox"
                checked={showSpinoff}
                onChange={(e) => setShowSpinoff(e.target.checked)}
                className="w-3 h-3 text-amber-600 rounded"
              />
              계열분리·스핀오프 (TYPE C)
            </label>
          )}

          {/* User Request: Hide isolated nodes without links */}
          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded border border-slate-300 text-slate-800 font-semibold transition select-none">
            <input
              type="checkbox"
              checked={hideIsolated}
              onChange={(e) => setHideIsolated(e.target.checked)}
              className="w-3.5 h-3.5 text-indigo-600 rounded cursor-pointer accent-indigo-600"
            />
            연결된 노드만 표시 (고립 기업 제외)
          </label>

          <span className="text-[11px] text-slate-500 font-medium hidden lg:inline-block bg-white px-2 py-0.5 rounded border border-slate-200">
            화면: <strong className="text-slate-800">{renderedStats.nodes}</strong>개 노드 · <strong className="text-slate-800">{renderedStats.edges}</strong>개 연결
          </span>
        </div>

        {/* Graph Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.25)}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="확대"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="축소"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => cyRef.current?.fit(undefined, 40)}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="화면 맞춤"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => cyRef.current?.reset()}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="배치 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition"
            title="고화질 PNG 이미지 저장"
          >
            <Download className="w-3.5 h-3.5" />
            <span>이미지 저장</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Slide-over Drawer */}
      <div className="relative flex-1 w-full h-full bg-slate-50/40">
        <div ref={containerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-lg border border-slate-200 shadow-md text-xs space-y-1">
          <div className="font-bold text-slate-700 text-[11px] mb-1">범례 (선 종류)</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-rose-600 inline-block"></span>
            <span className="text-slate-600">실선: 현재 혼인 / 출자</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-rose-500 inline-block"></span>
            <span className="text-slate-600">점선: 과거 혼인(이혼·사별) / 계열분리</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-blue-500 inline-block"></span>
            <span className="text-slate-600">파란선: 직계 혈연(부모자녀·형제)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-emerald-500 inline-block"></span>
            <span className="text-slate-600">초록선: 실증 사업계약 / 합작투자</span>
          </div>
        </div>

        {/* Slide-over Right Information Panel */}
        {activeDetail && (
          <div className="absolute top-0 right-0 w-84 sm:w-96 h-full bg-white border-l border-slate-200 shadow-2xl p-5 overflow-y-auto z-20 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                {activeDetail.type === "family"
                  ? "기업 가문 정보"
                  : activeDetail.type === "person"
                  ? "인물 상세 프로필"
                  : activeDetail.type === "group"
                  ? "기업집단 정보"
                  : "연결 관계 세부 팩트"}
              </span>
              <button
                onClick={() => setActiveDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* FAMILY DETAIL */}
            {activeDetail.type === "family" && activeDetail.data && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeDetail.data.name}</h3>
                  <div className="text-slate-500 mt-0.5">창업주: {activeDetail.data.founder} (창립: {activeDetail.data.founding_year}년)</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">가문 및 그룹 역사</div>
                  <p className="text-slate-600 leading-relaxed">{activeDetail.data.history_summary}</p>
                </div>

                {activeDetail.data.related_groups.length > 0 && (
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">관련 기업집단</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDetail.data.related_groups.map((g: string, i: number) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded border border-indigo-200">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeDetail.data.major_spinoffs.length > 0 && (
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">주요 계열분리 이력</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {activeDetail.data.major_spinoffs.map((sp: string, i: number) => (
                        <li key={i}>{sp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeDetail.data.key_figures.length > 0 && (
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">주요 경영 인물</div>
                    <div className="flex flex-wrap gap-1">
                      {activeDetail.data.key_figures.map((kf: string, i: number) => (
                        <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {kf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PERSON DETAIL */}
            {activeDetail.type === "person" && activeDetail.data && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeDetail.data.name}</h3>
                  <div className="text-slate-500 mt-0.5">
                    {activeDetail.data.role} · {activeDetail.data.gen}세대
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">생년월일:</span>
                    <span className="font-medium text-slate-800">
                      {activeDetail.data.birth}년 ~ {activeDetail.data.death ? `${activeDetail.data.death}년` : "현재"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">소속 기업:</span>
                    <span className="font-medium text-slate-800">{activeDetail.data.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">경영 참여 여부:</span>
                    <span className={`font-semibold ${activeDetail.data.active ? "text-emerald-600" : "text-slate-400"}`}>
                      {activeDetail.data.active ? "현역 경영 참여" : "비참여 / 사별"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* GROUP DETAIL */}
            {activeDetail.type === "group" && activeDetail.data && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeDetail.data.name}</h3>
                  <div className="text-slate-500 mt-0.5">설립연도: {activeDetail.data.founding_year}년</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  {activeDetail.data.assets_trillion && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">공정위 자산총액:</span>
                      <span className="font-black text-indigo-700">{activeDetail.data.assets_trillion}조원</span>
                    </div>
                  )}
                  {activeDetail.data.ftc_rank && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">대기업집단 순위:</span>
                      <span className="font-semibold text-slate-800">재계 {activeDetail.data.ftc_rank}위</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-semibold text-slate-700 mb-1">대표 계열사</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDetail.data.key_companies.map((kc: string, i: number) => (
                      <span key={i} className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                        {kc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EDGE RELATION DETAIL */}
            {activeDetail.type === "edge" && activeDetail.data && (
              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {activeDetail.data.type}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{activeDetail.data.label}</h3>
                  <div className="text-slate-500 mt-0.5">
                    체결/발생: {activeDetail.data.start_year || "-"}년 {activeDetail.data.end_year ? `~ ${activeDetail.data.end_year}년 (종료)` : ""}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">상세 팩트 및 근거</div>
                  <p className="text-slate-600 leading-relaxed">{activeDetail.data.desc || "해당 관계에 대한 검증 보고서가 보관되어 있습니다."}</p>
                </div>

                {/* Primary Sources Links */}
                <div>
                  <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>독립 출처 검증 내역</span>
                  </div>
                  <div className="space-y-2">
                    {activeDetail.data.source_ids?.map((sid: string) => {
                      const src = sources.find((s) => s.id === sid);
                      if (!src) return null;
                      return (
                        <a
                          key={src.id}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-2 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-[11px] transition"
                        >
                          <div className="flex items-center justify-between text-slate-500 font-medium text-[10px]">
                            <span>{src.publisher} ({src.date})</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                          <div className="font-semibold text-slate-800 mt-0.5">{src.title}</div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
