import React, { useEffect, useRef, useState } from "react";
import cytoscape, { Core, EventObject } from "cytoscape";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Download, Filter, Info, ExternalLink, ShieldCheck, Heart } from "lucide-react";
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
  relations,
  sources,
  selectedItem,
  onSelectItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Filters
  const [showMarriage, setShowMarriage] = useState(true);
  // Hide isolated/unconnected families by default (shows connected marriage core)
  const [hideIsolated, setHideIsolated] = useState(true);
  const [renderedStats, setRenderedStats] = useState({ nodes: 0, edges: 0 });

  // Selected Detail Panel
  const [activeDetail, setActiveDetail] = useState<{
    type: "family" | "edge";
    id: string;
    data?: any;
  } | null>(null);

  // Export PNG handler
  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const png64 = cyRef.current.png({ full: true, scale: 2, bg: "#ffffff" });
    const link = document.createElement("a");
    link.download = `혼맥의지도_재벌가문_혼맥망.png`;
    link.href = png64;
    link.click();
  };

  // Re-build graph when filters change
  useEffect(() => {
    if (!containerRef.current) return;

    const elements: any[] = [];
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

    // Safety guard: ensure both source and target exist before adding edges
    const existingNodeIds = new Set(elements.map((e) => e.data.id));
    const safeEdges = activeEdges.filter(
      (e) => existingNodeIds.has(e.data.source) && existingNodeIds.has(e.data.target)
    );
    elements.push(...safeEdges);

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
            "text-background-opacity": 0.88,
            "text-background-color": "#ffffff",
            "text-background-padding": "2px",
            "text-border-opacity": 0.3,
            "text-border-width": 0.5,
            "text-border-color": "#94a3b8",
            color: "#334155",
            "target-arrow-shape": "none",
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
        idealEdgeLength: 160,
        nodeOverlap: 25,
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
  }, [showMarriage, hideIsolated, families, relations]);

  // Center on node if selected from outside
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

  // Find marriages involving active family
  const activeFamilyMarriages = React.useMemo(() => {
    if (!activeDetail || activeDetail.type !== "family") return [];
    return relations.filter(
      (r) =>
        r.type === "MARRIAGE" &&
        r.is_inter_family &&
        (r.fam_from === activeDetail.id || r.fam_to === activeDetail.id)
    );
  }, [activeDetail, relations]);

  return (
    <div className="relative bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col h-[750px]">
      {/* Top Controller Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Title badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            재벌가 혼맥 연결망 지도
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (노드를 클릭하면 우측 상세 패널에서 통혼 가문과 내력을 확인하실 수 있습니다)
          </span>
        </div>

        {/* Relation Type Filters & Stats */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> 필터:
          </span>

          <label className="flex items-center gap-1 cursor-pointer bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-rose-800 font-medium">
            <input
              type="checkbox"
              checked={showMarriage}
              onChange={(e) => setShowMarriage(e.target.checked)}
              className="w-3 h-3 text-rose-600 rounded"
            />
            재벌간 혼맥선 표시
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded border border-slate-300 text-slate-800 font-semibold transition select-none">
            <input
              type="checkbox"
              checked={hideIsolated}
              onChange={(e) => setHideIsolated(e.target.checked)}
              className="w-3.5 h-3.5 text-indigo-600 rounded cursor-pointer accent-indigo-600"
            />
            혼맥 연결 가문만 표시 (고립 가문 제외)
          </label>

          <span className="text-[11px] text-slate-500 font-medium hidden lg:inline-block bg-white px-2 py-0.5 rounded border border-slate-200">
            화면: <strong className="text-slate-800">{renderedStats.nodes}</strong>개 가문 · <strong className="text-rose-600 font-bold">{renderedStats.edges}</strong>개 혼맥
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
            title="위치 초기화"
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
          <div className="font-bold text-slate-700 text-[11px] mb-1">범례 (혼맥 지도)</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-rose-600 inline-block"></span>
            <span className="text-slate-600">실선: 재벌가 간 혼맥 (통혼)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-rose-500 inline-block"></span>
            <span className="text-slate-600">점선: 이혼·파혼 통혼</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
            <span className="text-slate-600">보라색 노드: 정관계 통혼 허브 가문</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block"></span>
            <span className="text-slate-600">남색 노드: 주요 대기업 재벌 가문</span>
          </div>
        </div>

        {/* Slide-over Right Information Panel */}
        {activeDetail && (
          <div className="absolute top-0 right-0 w-84 sm:w-96 h-full bg-white border-l border-slate-200 shadow-2xl p-5 overflow-y-auto z-20 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                {activeDetail.type === "family" ? "가문 상세 프로필" : "혼맥 상세 정보"}
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

                {/* Connected Inter-Marriage Partners */}
                <div>
                  <div className="font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>연결된 타 재벌 혼맥 ({activeFamilyMarriages.length}건)</span>
                  </div>
                  {activeFamilyMarriages.length > 0 ? (
                    <div className="space-y-1.5">
                      {activeFamilyMarriages.map((m) => {
                        const otherFamId = m.fam_from === activeDetail.id ? m.fam_to : m.fam_from;
                        const otherFam = families.find((f) => f.id === otherFamId);
                        return (
                          <div
                            key={m.id}
                            className="p-2 bg-rose-50/70 border border-rose-100 rounded-lg text-slate-800 hover:bg-rose-100/70 transition"
                          >
                            <div className="font-bold text-rose-950 flex items-center justify-between">
                              <span>↔ {otherFam?.name || "타 가문"}</span>
                              {m.start_year && (
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {m.start_year}년{m.end_year ? ` ~ ${m.end_year}년` : ""}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-1 leading-snug">
                              {m.desc ? m.desc.replace(/\[[^\]]*\]/g, "").replace(/#/g, "").trim() : m.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-slate-400 italic">등록된 직계 타 재벌 혼맥이 없습니다.</div>
                  )}
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
              </div>
            )}

            {/* EDGE (MARRIAGE) DETAIL */}
            {activeDetail.type === "edge" && activeDetail.data && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-base font-black text-rose-950">{activeDetail.data.label}</h3>
                  <div className="text-slate-500 mt-0.5">
                    혼인연도: {activeDetail.data.start_year ? `${activeDetail.data.start_year}년` : "연도 미상"}
                    {activeDetail.data.end_year ? ` ~ ${activeDetail.data.end_year}년 (이혼)` : ""}
                  </div>
                </div>

                <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <div className="font-semibold text-rose-900 mb-1">혼맥 상세 내역</div>
                  <p className="text-slate-700 leading-relaxed">
                    {activeDetail.data.desc
                      ? activeDetail.data.desc.replace(/\[[^\]]*\]/g, "").replace(/#/g, "").trim()
                      : activeDetail.data.label}
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">관계 유형:</span>
                    <span className="font-bold text-slate-800">재벌가 간 통혼 (INTER-CHAEBOL)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">검증 상태:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> 공시 및 언론 검증
                    </span>
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
