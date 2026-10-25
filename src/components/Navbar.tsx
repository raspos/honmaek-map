import React, { useState } from "react";
import { Search, Share2, ShieldCheck, Calendar, BookOpen, Layers } from "lucide-react";
import { Family, Person, CorporateGroup } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  families: Family[];
  persons: Person[];
  corporateGroups: CorporateGroup[];
  onSelectItem: (type: "family" | "person" | "group", id: string) => void;
  lastUpdated: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  families,
  persons,
  corporateGroups,
  onSelectItem,
  lastUpdated
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredFamilies = searchTerm.trim()
    ? families.filter(f => f.name.includes(searchTerm) || f.founder.includes(searchTerm)).slice(0, 4)
    : [];
  const filteredPersons = searchTerm.trim()
    ? persons.filter(p => p.name.includes(searchTerm) || p.company.includes(searchTerm)).slice(0, 5)
    : [];
  const filteredGroups = searchTerm.trim()
    ? corporateGroups.filter(g => g.name.includes(searchTerm)).slice(0, 4)
    : [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { id: "network", label: "1. 재벌가 혼맥 지도" },
    { id: "corporate-match", label: "2. 기업별 혼맥 매칭" },
    { id: "chaebol-spinoff", label: "3. 기업의 분화 계보" },
    { id: "network-analysis", label: "4. 다각도 네트워크 분석" },
    { id: "genealogy", label: "가문별 상세 가계도" },
    { id: "methodology", label: "검증·방법론" },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
              Data Journalism
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% 검증 데이터 (DART·공정위)
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
              <Calendar className="w-3 h-3" />
              기준일: {lastUpdated}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
            <span>혼맥의 지도</span>
            <span className="text-slate-400 font-normal text-sm md:text-base hidden sm:inline">
              — 대한민국 기업 가문 연결망
            </span>
          </h1>
        </div>

        {/* Global Search & Share */}
        <div className="flex items-center gap-2 w-full md:w-auto relative">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="인물, 가문, 기업 검색 (예: 이재용, 범현대가, 삼표)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpenSearch(true);
              }}
              onFocus={() => setIsOpenSearch(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 placeholder-slate-400"
            />

            {/* Autocomplete Dropdown */}
            {isOpenSearch && searchTerm.trim() && (
              <div 
                className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto text-xs"
                onMouseLeave={() => setIsOpenSearch(false)}
              >
                {filteredFamilies.length === 0 && filteredPersons.length === 0 && filteredGroups.length === 0 && (
                  <div className="p-3 text-slate-400 text-center">검색 결과가 없습니다.</div>
                )}

                {filteredFamilies.length > 0 && (
                  <div className="p-2 border-b border-slate-800">
                    <div className="text-[10px] font-bold text-amber-400 px-2 py-1">기업 가문</div>
                    {filteredFamilies.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectItem("family", f.id);
                          setIsOpenSearch(false);
                          setSearchTerm("");
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-slate-800 rounded flex items-center justify-between text-slate-200"
                      >
                        <span className="font-semibold">{f.name}</span>
                        <span className="text-[10px] text-slate-400">창업주: {f.founder}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredPersons.length > 0 && (
                  <div className="p-2 border-b border-slate-800">
                    <div className="text-[10px] font-bold text-sky-400 px-2 py-1">주요 인물</div>
                    {filteredPersons.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectItem("person", p.id);
                          setIsOpenSearch(false);
                          setSearchTerm("");
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-slate-800 rounded flex items-center justify-between text-slate-200"
                      >
                        <span className="font-semibold">{p.name} ({p.gen}세대)</span>
                        <span className="text-[10px] text-slate-400">{p.role}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredGroups.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-emerald-400 px-2 py-1">기업집단</div>
                    {filteredGroups.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          onSelectItem("group", g.id);
                          setIsOpenSearch(false);
                          setSearchTerm("");
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-slate-800 rounded flex items-center justify-between text-slate-200"
                      >
                        <span className="font-semibold">{g.name}</span>
                        <span className="text-[10px] text-slate-400">자산: {g.assets_trillion}조원</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg border border-slate-700 transition"
            title="현재 화면 링크 복사"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copied ? "복사완료!" : "공유"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-slate-950/80 border-t border-slate-800/80 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};
