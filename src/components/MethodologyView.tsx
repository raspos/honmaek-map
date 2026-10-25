import React, { useState } from "react";
import { ShieldCheck, Database, Scale, HelpCircle, FileText, Send, Check } from "lucide-react";
import { Source } from "../types";

interface MethodologyViewProps {
  sources: Source[];
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ sources }) => {
  const [reportSuccess, setReportSuccess] = useState(false);
  const [formData, setFormData] = useState({
    targetName: "",
    relationType: "혼맥(결혼/이혼)",
    content: "",
    sourceUrl: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setFormData({
        targetName: "",
        relationType: "혼맥(결혼/이혼)",
        content: "",
        sourceUrl: "",
        email: "",
      });
    }, 4000);
  };

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-6 space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">
          데이터 거버넌스 및 저널리즘 윤리 기준
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          데이터 수집·검증 방법론 및 출처 공개
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          「혼맥의 지도」는 임의의 추측이나 미검증 루머를 배제하고, 공적 공시 및 독립 교차검증된 사실만을 기록합니다.
        </p>
      </div>

      {/* 5-Level Verification Pipeline */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>5단계 데이터 검증 생애주기 (Data Lifecycle)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-600 block mb-1">1. SEED</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              나무위키 기업 가문 틀 및 아티클에서 후보 가문과 인물 관계 발굴
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <span className="font-bold text-amber-700 block mb-1">2. REVIEW</span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              DART 공시, 공정위 보고서 등 1차 공적 기록 대조 및 팩트체크 착수
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300">
            <span className="font-bold text-emerald-700 block mb-1">3. VERIFIED</span>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              독립된 2개 이상의 공적/언론 출처로 검증 확정 (대시보드 공개 기준)
            </p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
            <span className="font-bold text-rose-700 block mb-1">4. DISPUTED</span>
            <p className="text-rose-800 text-[11px] leading-relaxed">
              자료 간 내용 불일치 또는 법적 분쟁 시 공개 보류 및 관리자 재검토
            </p>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-300">
            <span className="font-bold text-slate-500 block mb-1">5. REJECTED</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              단순 루머, 오기, 사생활 침해 소지 데이터 영구 폐기
            </p>
          </div>
        </div>
      </div>

      {/* Hierarchy of Sources */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>자료 출처 우선순위 (Source Hierarchy)</span>
        </h3>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
              1
            </span>
            <strong className="text-slate-800">금융감독원 전자공시시스템(DART):</strong>
            <span className="text-slate-600">사업보고서, 최대주주 및 특수관계인 현황, 타법인 출자, 주요 계약 체결 공시</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
              2
            </span>
            <strong className="text-slate-800">공정거래위원회 기업집단포털:</strong>
            <span className="text-slate-600">대규모기업집단 지정결과, 계열회사 변동, 친족독립경영(계열분리) 인정 현황</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
              3
            </span>
            <strong className="text-slate-800">기업 공식 보도자료 및 법원 확정 판결문:</strong>
            <span className="text-slate-600">경영권 승계, 주주총회 결의, 재산분할 및 혼인관계 법적 확정 사실</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
              4
            </span>
            <strong className="text-slate-800">주요 경제지 및 제도권 언론 보도:</strong>
            <span className="text-slate-600">매일경제, 한국경제, 조선일보, 연합뉴스 등 정론 매체의 탐사보도 팩트</span>
          </div>
        </div>
      </div>

      {/* Definitions of Relation Types */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-amber-600" />
          <span>핵심 관계 유형 정의 원칙</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <strong className="text-rose-600 block mb-1">혼맥 관계 (TYPE B)의 엄격한 정의:</strong>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              실제 법적 혼인 또는 공인된 부부 관계를 통해서만 계산합니다. 같은 뿌리에서 분가했거나 단순한 사업 파트너라는 이유로
              혼맥 관계로 간주하지 않으며, 이혼·사별 등 과거 혼인은 현재 혼인과 명확히 분리하여 점선으로 표시합니다.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <strong className="text-emerald-600 block mb-1">사업 관계 (TYPE E)의 엄격한 정의:</strong>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              혼맥이 존재한다는 정황만으로 사업상 특혜나 거래 관계를 추정하지 않습니다. 실제 공시된 수주 계약, 합작법인(JV) 설립,
              M&A 및 지분 매각 등 객관적 증거가 확인된 경우에만 연결선으로 수록합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Relationship Correction Request Form */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-800" />
          <h3 className="text-sm font-bold text-slate-900">독자 및 연구자 관계 정정 요청 접수</h3>
        </div>
        <p className="text-xs text-slate-600">
          잘못 기재된 정보나 최근 발생한 혼인·계열분리·지분 변동 공시 자료가 있다면 근거 출처와 함께 정정을 요청해주세요.
          편집 검증팀에서 독립적인 사실 확인 후 데이터베이스에 반영합니다.
        </p>

        {reportSuccess ? (
          <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2 border border-emerald-300">
            <Check className="w-4 h-4" />
            <span>정정 요청이 성공적으로 접수되었습니다. 검증 후 반영 결과를 알려드립니다.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">대상 인물 / 기업 / 가문명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 현대자동차, 정의선 회장"
                  value={formData.targetName}
                  onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">관계 유형</label>
                <select
                  value={formData.relationType}
                  onChange={(e) => setFormData({ ...formData, relationType: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-slate-800"
                >
                  <option>혼맥(결혼/이혼)</option>
                  <option>혈연(부모자녀/형제)</option>
                  <option>기업 계열분리</option>
                  <option>사업 거래 / 합작투자</option>
                  <option>기타 직책/프로필 정정</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">정정 요청 상세 내용</label>
              <textarea
                required
                rows={3}
                placeholder="사실과 다른 부분과 정확한 사실 관계를 기술해주세요."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">증빙 근거 URL (DART 공시 / 기사 링크)</label>
                <input
                  type="url"
                  required
                  placeholder="https://dart.fss.or.kr/..."
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">회신받을 이메일 주소 (선택)</label>
                <input
                  type="email"
                  placeholder="analyst@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>정정 검토 요청서 제출</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
