import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { KPICards } from "./components/KPICards";
import { NetworkView } from "./components/NetworkView";
import { CorporateMatcher } from "./components/CorporateMatcher";
import { PanChaebolLineageView } from "./components/PanChaebolLineageView";
import { MultiAngleNetworkView } from "./components/MultiAngleNetworkView";
import { GenealogyTree } from "./components/GenealogyTree";
import { MethodologyView } from "./components/MethodologyView";

import familiesData from "./data/families.json";
import personsData from "./data/persons.json";
import corporateGroupsData from "./data/corporate_groups.json";
import relationsData from "./data/relations.json";
import sourcesData from "./data/sources.json";
import kpisData from "./data/kpis_and_metrics.json";
import shortestPathsData from "./data/shortest_paths.json";

import { Family, Person, CorporateGroup, Relation, Source, KPIsAndMetrics } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("network");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("FAM_HYUNDAI");
  const [selectedItem, setSelectedItem] = useState<{
    type: "family" | "person" | "group";
    id: string;
  } | null>(null);

  const families = familiesData as Family[];
  const persons = personsData as Person[];
  const corporateGroups = corporateGroupsData as CorporateGroup[];
  const relations = relationsData as Relation[];
  const sources = sourcesData as Source[];
  const kpis = {
    ...(kpisData as KPIsAndMetrics),
    persons_total_count: persons.length,
    families_total_count: families.length,
    families_verified_count: families.length,
  };

  const handleSelectItem = (type: "family" | "person" | "group", id: string) => {
    setSelectedItem({ type, id });
    if (type === "family") {
      setSelectedFamilyId(id);
      setActiveTab("genealogy");
    } else if (type === "person") {
      const person = persons.find((p) => p.id === id);
      if (person) {
        setSelectedFamilyId(person.family_id);
        setActiveTab("genealogy");
      }
    } else if (type === "group") {
      setActiveTab("chaebol-spinoff");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        families={families}
        persons={persons}
        corporateGroups={corporateGroups}
        onSelectItem={handleSelectItem}
        lastUpdated={kpis.last_updated}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 py-4 flex-1 space-y-4">
        {/* Dynamic Real-Data KPI Cards */}
        <KPICards kpis={kpis} />

        {/* 1번 기능: 재벌가 혼맥 지도 (NetworkView) */}
        {activeTab === "network" && (
          <section>
            <div className="mb-2">
              <span className="text-[11px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded uppercase tracking-wide">
                1번 핵심 기능 · 재벌가 혼맥 지도
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                대한민국 주요 기업 가문 전체 혼맥 연결망 지도
              </h2>
            </div>
            <NetworkView
              families={families}
              persons={persons}
              corporateGroups={corporateGroups}
              relations={relations}
              sources={sources}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
            />
          </section>
        )}

        {/* 2번 기능: 기업별 혼맥 매칭 (CorporateMatcher) */}
        {activeTab === "corporate-match" && (
          <section>
            <CorporateMatcher
              corporateGroups={corporateGroups}
              families={families}
              persons={persons}
              relations={relations}
              onNavigateToFamily={(fid) => {
                setSelectedFamilyId(fid);
                setActiveTab("genealogy");
              }}
              onNavigateToSpinoff={(fid) => {
                setSelectedFamilyId(fid);
                setActiveTab("chaebol-spinoff");
              }}
              onNavigateToNetwork={(fid) => {
                setSelectedFamilyId(fid);
                setActiveTab("network");
              }}
            />
          </section>
        )}

        {/* 3번 기능: 기업의 분화 계보 (PanChaebolLineageView) */}
        {activeTab === "chaebol-spinoff" && (
          <section>
            <PanChaebolLineageView
              onSelectFamily={(fid) => {
                setSelectedFamilyId(fid);
                setActiveTab("genealogy");
              }}
            />
          </section>
        )}

        {/* 4번 기능: 다각도 네트워크 분석 (MultiAngleNetworkView) */}
        {activeTab === "network-analysis" && (
          <section>
            <MultiAngleNetworkView
              families={families}
              persons={persons}
              relations={relations}
              corporateGroups={corporateGroups}
              sources={sources}
              kpis={kpis}
              shortestPaths={shortestPathsData as any}
            />
          </section>
        )}

        {/* 가문별 상세 가계도 */}
        {activeTab === "genealogy" && (
          <section>
            <GenealogyTree
              families={families}
              persons={persons}
              corporateGroups={corporateGroups}
              relations={relations}
              sources={sources}
              selectedFamilyId={selectedFamilyId}
              onSelectFamily={setSelectedFamilyId}
            />
          </section>
        )}

        {/* 검증 및 방법론 */}
        {activeTab === "methodology" && (
          <section>
            <MethodologyView sources={sources} />
          </section>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-8 px-4 text-xs mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-white font-black text-sm tracking-tight">
              「혼맥의 지도 — 한국 기업 가문 연결망」
            </div>
            <div className="text-slate-500 mt-1">
              데이터저널리즘 인터랙티브 아카이브 · 기준일: {kpis.last_updated}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              공정거래위원회 공시대상기업집단 및 금융감독원 전자공시시스템(DART) 기반 검증
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px]">
            <button onClick={() => setActiveTab("methodology")} className="hover:text-amber-400 transition">
              방법론 & 윤리원칙
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab("methodology")} className="hover:text-amber-400 transition">
              관계 정정 요청
            </button>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Zero-LLM Runtime Architecture (API 비용 0원)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
