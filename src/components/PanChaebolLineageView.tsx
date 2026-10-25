import React, { useState, useMemo } from "react";
import {
  Building2,
  GitBranch,
  Crown,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Family, Source } from "../types";

interface SpinoffGroup {
  id: string;
  name: string;
  subName?: string;
  founderOrLeader: string;
  lineageRelation: string;
  separationYear?: number;
  ftcRank?: number;
  assetsTrillion?: number;
  keySubsidiaries: string[];
  description: string;
  highlightMarriages?: {
    label: string;
    partnerFamily: string;
    footnoteId?: string;
    footnoteUrl?: string;
  }[];
  color: string;
}

interface PanChaebolData {
  id: string;
  name: string;
  badge: string;
  founder: string;
  foundingYear: number;
  originCompany: string;
  summary: string;
  accentColor: string;
  sources: { title: string; url: string; publisher: string }[];
  groups: SpinoffGroup[];
}

export const PAN_CHAEBOLS: PanChaebolData[] = [
  {
    id: "FAM_HYUNDAI",
    name: "범현대가 (汎現代家)",
    badge: "현대·현대차·HD현대·HDC·KCC·HL·현대백화점",
    founder: "아산(峨山) 정주영 (1915~2001)",
    foundingYear: 1946,
    originCompany: "현대자동차공업사 (1946) · 현대건설 (1947)",
    summary:
      "정주영 창업주가 세운 현대그룹에서 출발하여 2000년 계열분리 이후 자동차, 조선, 건설, 중화학, 유통 등 한국 제조업의 중추를 담당하는 초대형 독립 기업집단군으로 분화했습니다.",
    accentColor: "from-blue-600 to-cyan-700",
    sources: [
      {
        title: "범현대가 가계도 및 계열분리사",
        url: "https://namu.wiki/w/%EB%B2%94%ED%98%84%EB%8C%80%EA%B0%80#s-2",
        publisher: "계보 검증 아카이브",
      },
      {
        title: "공정거래위원회 공시대상기업집단 지정결과",
        url: "https://www.ftc.go.kr",
        publisher: "공정거래위원회",
      },
    ],
    groups: [
      {
        id: "GRP_HYUNDAI_MOTOR",
        name: "현대자동차그룹",
        subName: "차남 정몽구 계열 (정의선 회장 체제)",
        founderOrLeader: "정몽구 명예회장 → 정의선 회장",
        lineageRelation: "정주영 창업주의 차남 계열 (3세 경영)",
        separationYear: 2000,
        ftcRank: 3,
        assetsTrillion: 280.0,
        keySubsidiaries: ["현대자동차", "기아", "현대모비스", "현대제철", "현대건설", "현대글로비스", "현대오토에버"],
        description:
          "2000년 현대그룹 계열분리 이후 글로벌 완성차 3위 및 스마트 모빌리티 그룹으로 도약했습니다. 삼표그룹 정도원 회장 장녀 정지선과 정의선 회장의 혼인으로 삼표-현대차 혼맥을 형성했습니다.",
        color: "bg-blue-900 text-white",
        highlightMarriages: [
          {
            label: "정의선 회장 ↔ 삼표 정도원 장녀 정지선",
            partnerFamily: "삼표그룹",
            footnoteId: "각주 66",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-66",
          },
          {
            label: "정진희(정의선 장녀) ↔ 대우 김우중 조카손자 김지호",
            partnerFamily: "대우그룹",
            footnoteId: "각주 67",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-67",
          },
        ],
      },
      {
        id: "GRP_HD_HYUNDAI",
        name: "HD현대 (옛 현대중공업그룹)",
        subName: "6남 정몽준 계열 (정기선 수석부회장)",
        founderOrLeader: "정몽준 아산재단 이사장 → 정기선 수석부회장",
        lineageRelation: "정주영 창업주의 6남 계열 (3세 경영)",
        separationYear: 2002,
        ftcRank: 8,
        assetsTrillion: 84.8,
        keySubsidiaries: ["HD한국조선해양", "HD현대중공업", "HD현대오일뱅크", "HD현대일렉트릭", "HD현대사이트솔루션"],
        description:
          "세계 1위 조선 지주사인 HD한국조선해양과 정유, 전력기기, 건설기계 3대 축을 보유한 중화학 거대 기업집단입니다. 2002년 현대그룹에서 공식 계열분리되었습니다.",
        color: "bg-teal-800 text-white",
      },
      {
        id: "GRP_HDC",
        name: "HDC그룹 (아이파크)",
        subName: "넷째동생 '포니 정' 정세영 계열 (정몽규 회장)",
        founderOrLeader: "정세영 전 현대차 회장 → 정몽규 회장",
        lineageRelation: "정주영 창업주의 넷째동생(포니 정) 직계",
        separationYear: 1999,
        ftcRank: 28,
        assetsTrillion: 16.5,
        keySubsidiaries: ["HDC현대산업개발", "HDC아이파크몰", "HDC현대EP", "HDC랩스", "통영에코파워"],
        description:
          "한국 자동차 산업의 선구자였던 포니 정(정세영)이 1999년 현대자동차 경영권을 조카 정몽구에게 넘겨주고 대신 현대산업개발을 맡아 독립했습니다. 대표 주거 브랜드 '아이파크(IPARK)'와 유통 복합쇼핑몰을 운영합니다.",
        color: "bg-red-800 text-white",
      },
      {
        id: "GRP_KCC",
        name: "KCC그룹",
        subName: "막내동생 정상영 계열 (정몽진·정몽익·정몽열)",
        founderOrLeader: "정상영 명예회장 → 정몽진 회장, 정몽익 KCC글라스 회장",
        lineageRelation: "정주영 창업주의 막내동생 직계",
        separationYear: 1958,
        ftcRank: 32,
        assetsTrillion: 14.1,
        keySubsidiaries: ["KCC", "KCC글라스", "KCC건설", "모멘티브(실리콘)"],
        description:
          "1958년 금강스레트공업으로 출발하여 독자적으로 세계적 건축자재·실리콘·도료 그룹으로 성장했습니다. 노신영 전 국무총리 가문 및 주요 기업 가문과 혼맥을 맺고 있습니다.",
        color: "bg-indigo-900 text-white",
      },
      {
        id: "GRP_HL",
        name: "HL그룹 (옛 한라그룹)",
        subName: "첫째동생 정인영 계열 (정몽원 회장)",
        founderOrLeader: "정인영 명예회장 → 정몽원 회장",
        lineageRelation: "정주영 창업주의 첫째동생 직계",
        separationYear: 1962,
        ftcRank: 44,
        assetsTrillion: 9.8,
        keySubsidiaries: ["HL만도", "HL디앤아이한라", "HL클레무브", "HL홀딩스"],
        description:
          "1962년 현대양행으로 출범하여 독자적인 중공업 및 세계적 자동차 부품/자율주행 솔루션(HL만도, HL클레무브) 전문 그룹으로 도약했습니다.",
        color: "bg-sky-800 text-white",
      },
      {
        id: "GRP_HYUNDAI_DEPT",
        name: "현대백화점그룹",
        subName: "3남 정몽근 계열 (정지선 회장 체제)",
        founderOrLeader: "정몽근 명예회장 → 정지선 회장, 정교선 부회장",
        lineageRelation: "정주영 창업주의 3남 계열 (3세 경영)",
        separationYear: 1999,
        ftcRank: 23,
        assetsTrillion: 21.4,
        keySubsidiaries: ["현대백화점", "현대홈쇼핑", "현대그린푸드", "한섬", "현대리바트", "지누스"],
        description:
          "1999년 현대그룹에서 유통 부문을 분가하여 현대백화점, 패션(한섬), 가구(리바트, 지누스), 식품(현대그린푸드)을 아우르는 종합 라이프스타일 지주회사 체제를 완성했습니다.",
        color: "bg-emerald-900 text-white",
      },
      {
        id: "GRP_HYUNDAI_ORIGIN",
        name: "현대그룹 (모태)",
        subName: "5남 정몽헌 계열 (현정은 회장 체제)",
        founderOrLeader: "정몽헌 회장 → 현정은 회장",
        lineageRelation: "정주영 창업주의 5남 계열",
        separationYear: 1947,
        ftcRank: 55,
        assetsTrillion: 6.2,
        keySubsidiaries: ["현대엘리베이터", "현대무벡스", "현대아산"],
        description:
          "정주영의 적통 계승자였던 고 정몽헌 회장 사후 부인 현정은 회장이 이끌고 있으며, 국내 1위 승강기 기업 현대엘리베이터와 물류자동화 현대무벡스를 중심으로 사업을 전개하고 있습니다.",
        color: "bg-slate-800 text-white",
      },
    ],
  },
  {
    id: "FAM_SAMSUNG",
    name: "범삼성가 (汎三星家)",
    badge: "삼성·CJ·신세계·한솔",
    founder: "호암(湖巖) 이병철 (1910~1987)",
    foundingYear: 1938,
    originCompany: "삼성상회 (1938, 대구 수동)",
    summary:
      "이병철 창업주가 세운 삼성상회에서 출발하여 삼성전자 중심의 삼성그룹뿐 아니라 장남(CJ), 장녀(한솔), 막내딸(신세계) 등 경주 이씨 직계 혈족 중심의 거대 독립 기업집단군으로 분가했습니다.",
    accentColor: "from-blue-700 to-indigo-900",
    sources: [
      {
        title: "범삼성가 가계도",
        url: "https://namu.wiki/w/%EB%B2%94%EC%82%BC%EC%84%B1%EA%B0%80#s-2",
        publisher: "계보 검증 아카이브",
      },
      {
        title: "공정거래위원회 공시대상기업집단 지정결과",
        url: "https://www.ftc.go.kr",
        publisher: "공정거래위원회",
      },
    ],
    groups: [
      {
        id: "GRP_SAMSUNG_CORE",
        name: "삼성그룹",
        subName: "3남 이건희 계열 (이재용 회장 체제)",
        founderOrLeader: "이건희 선대회장 → 이재용 회장",
        lineageRelation: "이병철 창업주의 3남 이건희 회장 직계",
        separationYear: 1938,
        ftcRank: 1,
        assetsTrillion: 560.0,
        keySubsidiaries: ["삼성전자", "삼성물산", "삼성생명", "삼성바이오로직스", "삼성SDI", "삼성SDS", "삼성중공업"],
        description:
          "대한민국 자산 총액 및 시가총액 압도적 1위의 대기업집단. 글로벌 메모리반도체·스마트폰·바이오시밀러 1위 기업으로 도약했습니다.",
        color: "bg-blue-900 text-white",
        highlightMarriages: [
          {
            label: "이재용 회장 ↔ 대상그룹 임세령 부회장 (전 배우자)",
            partnerFamily: "대상그룹",
            footnoteId: "각주 16",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-16",
          },
          {
            label: "이서현 이사장 ↔ 동아일보 김재열 삼성글로벌리서치 사장",
            partnerFamily: "동아일보가",
          },
        ],
      },
      {
        id: "GRP_CJ",
        name: "CJ그룹",
        subName: "장남 이맹희 계열 (이재현 회장 체제)",
        founderOrLeader: "이맹희 명예회장 · 손복남 고문 → 이재현 회장, 이미경 부회장",
        lineageRelation: "이병철 창업주의 장남 계열 (맏손자)",
        separationYear: 1993,
        ftcRank: 13,
        assetsTrillion: 40.5,
        keySubsidiaries: ["CJ제일제당", "CJ대한통운", "CJ ENM", "CJ올리브영", "CJ CGV"],
        description:
          "1993년 모태기업인 제일제당이 삼성그룹에서 계열분리되어 식품, 물류, 바이오, 엔터테인먼트/미디어의 글로벌 문화콘텐츠 그룹으로 성장했습니다.",
        color: "bg-amber-800 text-white",
      },
      {
        id: "GRP_SHINSEGAE",
        name: "신세계그룹",
        subName: "5녀 이명희 계열 (정용진 회장 · 정유경 회장)",
        founderOrLeader: "이명희 총괄회장 → 정용진 회장, 정유경 총괄사장",
        lineageRelation: "이병철 창업주의 막내딸(5녀) 직계",
        separationYear: 1997,
        ftcRank: 11,
        assetsTrillion: 63.5,
        keySubsidiaries: ["신세계백화점", "이마트", "SCK컴퍼니(스타벅스코리아)", "신세계인터내셔날", "조선호텔앤리조트", "SSG닷컴"],
        description:
          "1997년 삼성그룹에서 신세계백화점이 독립한 뒤, 이마트의 국내 할인점 석권과 스타벅스코리아 흡수 등을 통해 국내 최대 유통 공룡으로 도약했습니다.",
        color: "bg-rose-900 text-white",
      },
      {
        id: "GRP_HANSOL",
        name: "한솔그룹",
        subName: "장녀 이인희 계열 (조동길 회장 체제)",
        founderOrLeader: "이인희 고문 → 조동길 회장",
        lineageRelation: "이병철 창업주의 장녀 직계 (외손)",
        separationYear: 1991,
        ftcRank: 48,
        assetsTrillion: 8.5,
        keySubsidiaries: ["한솔제지", "한솔케미칼", "한솔테크닉스", "한솔PNS", "한솔로지스틱스"],
        description:
          "1991년 삼성그룹의 전주제지가 분가하여 제지, 제지특수원료, 반도체 전자재료(한솔케미칼)를 아우르는 친환경 소재 전문 그룹으로 자리잡았습니다.",
        color: "bg-emerald-900 text-white",
      },
      
    ],
  },
  {
    id: "FAM_LG",
    name: "범LG가 (汎LG家)",
    badge: "LG·GS·LS·LX·LIG·LF·아워홈·희성",
    founder: "연암(蓮庵) 구인회 (1907~1969)",
    foundingYear: 1947,
    originCompany: "락희화학공업사 (1947, 럭키) · 금성사 (1958)",
    summary:
      "구인회 창업주와 허만정 공동창업주의 '구·허 동업'에서 출발하여 57년간 무분쟁 동업을 유지한 후 GS, LS, LX, LIG, LF, 아워홈 등으로 대한민국에서 가장 모범적인 계열분리를 이뤄냈습니다.",
    accentColor: "from-rose-700 to-red-900",
    sources: [
      {
        title: "범LG가 가계도 및 분가 역사",
        url: "https://namu.wiki/w/%EB%B2%94LG%EA%B0%80#s-2",
        publisher: "계보 검증 아카이브",
      },
      {
        title: "공정거래위원회 공시대상기업집단 지정결과",
        url: "https://www.ftc.go.kr",
        publisher: "공정거래위원회",
      },
    ],
    groups: [
      {
        id: "GRP_LG_CORE",
        name: "LG그룹",
        subName: "구자경 → 구본무 → 구광모 회장 (장자승계 원칙)",
        founderOrLeader: "구인회 창업주 → 구자경 명예회장 → 구본무 선대회장 → 구광모 회장",
        lineageRelation: "구인회 창업주의 장남 계열 (적통 장자)",
        separationYear: 1947,
        ftcRank: 4,
        assetsTrillion: 175.0,
        keySubsidiaries: ["LG전자", "LG화학", "LG에너지솔루션", "LG생활건강", "LG디스플레이", "LG유플러스", "LG CNS"],
        description:
          "글로벌 2차전지 1위권 LG에너지솔루션과 프리미엄 가전의 LG전자, 첨단소재 LG화학을 축으로 하는 대한민국 대표 테크·화학 그룹입니다.",
        color: "bg-rose-900 text-white",
      },
      {
        id: "GRP_GS_CORE",
        name: "GS그룹 (허씨 일가 분가)",
        subName: "허만정 후손 (허창수 명예회장 → 허태수 회장)",
        founderOrLeader: "허준구 LG 부회장 아들 허창수 → 허태수 회장",
        lineageRelation: "LG 공동창업주 허만정 일가의 독립 (동업 57년 만에 분리)",
        separationYear: 2004,
        ftcRank: 9,
        assetsTrillion: 80.8,
        keySubsidiaries: ["GS칼텍스", "GS리테일", "GS건설", "GS에너지", "GS EPS", "GS글로벌"],
        description:
          "2004년 LG그룹과 분할하여 정유(GS칼텍스), 유통(GS리테일), 건설(GS건설)을 아우르는 에너지·유통 거대 기업집단으로 자리를 확립했습니다.",
        color: "bg-orange-800 text-white",
      },
      {
        id: "GRP_LS",
        name: "LS그룹",
        subName: "구태회·구평회·구두회 3태 형제 계열 (구자은 회장)",
        founderOrLeader: "구태회·구평회·구두회 → 구자홍 → 구자열 → 구자은 회장",
        lineageRelation: "구인회 창업주의 셋째·넷째·다섯째 동생 3태 연합 분가",
        separationYear: 2003,
        ftcRank: 16,
        assetsTrillion: 30.5,
        keySubsidiaries: ["LS전선", "LS일렉트릭", "LS MnM(구 제련)", "LS엠트론", "E1", "예스코홀딩스"],
        description:
          "2003년 LG전선과 LG-니꼬동제련, LG산전이 계열분리되어 세계적 해저케이블, 스마트그리드, 동제련 소재 전문 그룹으로 도약했습니다. 사촌 간 공동경영 승계 전통을 유지합니다.",
        color: "bg-blue-800 text-white",
        highlightMarriages: [
          {
            label: "구연승(구자명 장녀) ↔ 삼표 정대현 사장",
            partnerFamily: "삼표그룹",
            footnoteId: "각주 69",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-69",
          },
          {
            label: "구동휘(구자열 장남) ↔ 두산 박지원 부회장 장녀 박상민",
            partnerFamily: "두산그룹",
          },
        ],
      },
      {
        id: "GRP_LX",
        name: "LX그룹",
        subName: "구본무 동생 구본준 회장 분가",
        founderOrLeader: "구본준 회장",
        lineageRelation: "구자경 명예회장의 3남 (구본무의 동생)",
        separationYear: 2021,
        ftcRank: 42,
        assetsTrillion: 11.2,
        keySubsidiaries: ["LX세미콘", "LX인터내셔널", "LX하우시스", "LX판토스", "LX MMA"],
        description:
          "구광모 회장의 LG그룹 승계에 따라 숙부 구본준 회장이 상사, 반도체(LX세미콘), 건축자재(LX하우시스), 물류(LX판토스)를 이끌고 2021년 신설 분가했습니다.",
        color: "bg-red-950 text-white",
      },
      {
        id: "GRP_LIG",
        name: "LIG그룹",
        subName: "구인회 첫째동생 구철회 계열 (구본상 회장)",
        founderOrLeader: "구철회 창업고문 → 구자원 회장 → 구본상 회장",
        lineageRelation: "구인회 창업주의 첫째동생 직계",
        separationYear: 1999,
        ftcRank: 52,
        assetsTrillion: 7.2,
        keySubsidiaries: ["LIG넥스원", "LIG정밀기술", "이노와이어리스", "LIG시스템"],
        description:
          "1999년 LG화재가 계열분리된 후 금융 부문(현 KB손해보험)을 매각하고 대한민국 대표 유도무기·방산 체계업체인 LIG넥스원을 주축으로 방산 그룹으로 재편되었습니다.",
        color: "bg-slate-800 text-white",
      },
      {
        id: "GRP_LF",
        name: "LF그룹",
        subName: "구자경 차남 구본걸 회장 분가",
        founderOrLeader: "구본걸 회장",
        lineageRelation: "구자경 명예회장의 차남 직계",
        separationYear: 2006,
        ftcRank: 65,
        assetsTrillion: 4.8,
        keySubsidiaries: ["LF(옛 LG패션)", "LF푸드", "트라이씨클", "코람코자산신탁"],
        description:
          "2006년 LG패션으로 계열분리한 후 닥스, 헤지스 등 대표 패션 브랜드뿐만 아니라 식품(LF푸드)과 부동산금융(코람코자산신탁)으로 사업을 다각화했습니다.",
        color: "bg-zinc-800 text-white",
      },
      {
        id: "GRP_OURHOME",
        name: "아워홈 (한화 피인수 편입)",
        subName: "구자학 창업 → 한화호텔앤드리조트에 지분 58.6% 매각 (2024~2025)",
        founderOrLeader: "구자학 창업회장 일가 → 한화그룹(김동선 부사장)에 매각",
        lineageRelation: "구인회 3남 구자학 창업 가문 (최근 한화그룹에 피인수 편입)",
        separationYear: 2000,
        ftcRank: 80,
        assetsTrillion: 2.8,
        keySubsidiaries: ["아워홈", "캘리스코 (한화그룹 계열사)"],
        description:
          "2000년 LG유통 FS사업부에서 분가하여 국내 2위 단체급식·식자재 기업으로 성장했으나, 오너가 2세 '남매의 난' 분쟁 끝에 구본성 전 부회장과 구미현 회장의 지분 58.62%가 한화그룹(한화호텔앤드리조트 특수목적법인 우리집에프앤비, 김동선 부사장 주도)에 약 8,695억원에 매각되어 한화 계열사로 최종 편입되었습니다.",
        color: "bg-orange-950 text-white",
        highlightMarriages: [
          {
            label: "구조앤(구본성 장녀) ↔ 차병원 차광렬 장남 차원태 사장",
            partnerFamily: "차병원",
            footnoteId: "각주 89",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-89",
          },
        ],
      },
    ],
  },
  {
    id: "FAM_GS",
    name: "범GS가 (汎GS家)",
    badge: "GS·삼양통상·승산·알토·코스모·센트럴모터스",
    founder: "효주(曉州) 허만정 (1897~1952)",
    foundingYear: 2004,
    originCompany: "백산상회 (1919 독립운동자금) · 락희화학 동업 (1947)",
    summary:
      "LG 공동창업주 허만정 선생의 8형제 일가에서 파생되어, GS그룹 본가뿐만 아니라 삼양통상(허정구), 승산(허완구), 알토(허승효), 코스모(허경수) 등 막강한 독립 계열사군을 형성하고 있습니다.",
    accentColor: "from-amber-600 to-yellow-800",
    sources: [
      {
        title: "범GS가 가계도 및 하위 가문",
        url: "https://namu.wiki/w/%EB%B2%94GS%EA%B0%80#s-2",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_GS_MAIN",
        name: "GS그룹 (본가)",
        subName: "허만정 3남 허준구 직계 (허창수 명예회장 → 허태수 회장)",
        founderOrLeader: "허창수 명예회장 · 허태수 회장",
        lineageRelation: "허만정 3남 허준구(전 LG 부회장) 계열",
        separationYear: 2004,
        ftcRank: 9,
        assetsTrillion: 80.8,
        keySubsidiaries: ["GS칼텍스", "GS에너지", "GS리테일", "GS건설", "GS EPS"],
        description: "에너지와 편의점·슈퍼·홈쇼핑 유통, 인프라 건설을 주력으로 하는 재계 9위 대기업집단입니다.",
        color: "bg-amber-900 text-white",
        highlightMarriages: [
          {
            label: "고 허지영(허동수 GS칼텍스 명예회장 딸) ↔ 아세아제지 이인범 회장",
            partnerFamily: "아세아그룹",
            footnoteId: "각주 84",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-84",
          },
          {
            label: "허정윤(허남각 삼양통상 회장 장녀) ↔ 삼표 정대호 부사장",
            partnerFamily: "삼표그룹",
            footnoteId: "각주 60",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-60",
          },
        ],
      },
      {
        id: "GRP_SAMYANG_TONGSANG",
        name: "삼양통상",
        subName: "허만정 장남 허정구 계열 (허남각 회장)",
        founderOrLeader: "허정구 초대회장 → 허남각 회장, 허동수 GS칼텍스 명예회장, 허광수 회장",
        lineageRelation: "허만정 창업주의 장남(허정구 전 삼양통상 회장) 일가",
        separationYear: 1957,
        keySubsidiaries: ["삼양통상", "삼양인터내셔날"],
        description: "나이키 피혁 원자재 공급 및 수입차 유통(삼양인터내셔날)을 주도하는 범GS가의 장손 가문 기업입니다.",
        color: "bg-yellow-950 text-white",
      },
      {
        id: "GRP_SEUNGSAN",
        name: "승산그룹",
        subName: "허만정 5남 허완구 계열 (허용수 GS에너지 사장)",
        founderOrLeader: "허완구 회장 → 허용수 사장",
        lineageRelation: "허만정 창업주의 5남 일가",
        separationYear: 1969,
        keySubsidiaries: ["승산", "승산레저"],
        description: "물류, 리조트(강릉 씨마크호텔 운영), 레저 사업을 전문으로 영위하는 독립 그룹입니다.",
        color: "bg-stone-800 text-white",
      },
      {
        id: "GRP_ALTO",
        name: "알토그룹",
        subName: "허만정 7남 허승효 계열 (허윤수 부사장)",
        founderOrLeader: "허승효 회장 → 허윤수 부사장",
        lineageRelation: "허만정 창업주의 7남 일가",
        separationYear: 1984,
        keySubsidiaries: ["알토", "알토조명"],
        description: "국내 최고급 건축 조명 및 인테리어 엔지니어링 기업입니다. 세아그룹 이은성과 차남 허윤수가 혼인했습니다.",
        color: "bg-slate-800 text-white",
        highlightMarriages: [
          {
            label: "허윤수(허승효 차남) ↔ 세아그룹 이은성",
            partnerFamily: "세아그룹",
            footnoteId: "각주 4",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-4",
          },
        ],
      },
      {
        id: "GRP_COSMO",
        name: "코스모그룹",
        subName: "허신구(허만정 4남) 장남 허경수 계열",
        founderOrLeader: "허경수 회장",
        lineageRelation: "허만정 창업주의 4남 허신구(전 GS리테일 명예회장) 장남 일가",
        separationYear: 1987,
        keySubsidiaries: ["코스모화학", "코스모신소재", "코스모촉매"],
        description: "2차전지 양극재와 이산화티타늄 등 첨단 기초 화학소재를 생산하는 독립 중견그룹입니다.",
        color: "bg-cyan-950 text-white",
      },
    ],
  },
  {
    id: "FAM_HANWHA",
    name: "범한화가 (汎韓火家)",
    badge: "한화·빙그레·천경해운·한익스프레스",
    founder: "현암(玄岩) 김종희 (1922~1981)",
    foundingYear: 1952,
    originCompany: "한국화약 (1952, 인천공장)",
    summary:
      "김종희 창업주가 세운 한국화약에서 출발하여 장남 김승연 회장의 방산·화학·금융 중심 한화그룹과 차남 김호연 회장의 유가공 식품 전문 빙그레로 아름답게 분가했습니다.",
    accentColor: "from-orange-600 to-red-800",
    sources: [
      {
        title: "범한화가 가계도 및 분가",
        url: "https://namu.wiki/w/%EB%B2%94%ED%95%9C%ED%99%94%EA%B0%80#s-2",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_HANWHA_MAIN",
        name: "한화그룹 (본가)",
        subName: "장남 김승연 회장 계열 (김동관·김동원·김동선)",
        founderOrLeader: "김승연 회장 → 김동관 부회장, 김동원 사장, 김동선 부사장",
        lineageRelation: "김종희 창업주의 장남 직계",
        separationYear: 1952,
        ftcRank: 7,
        assetsTrillion: 112.5,
        keySubsidiaries: ["한화에어로스페이스", "한화오션(구 대우조선해양)", "아워홈(지분 58.6% 인수 편입)", "한화솔루션", "한화생명", "한화갤러리아"],
        description:
          "방위산업, 항공우주, 태양광 신재생에너지, 석유화학, 금융을 아우르는 재계 7위 대기업집단입니다. 최근 대우조선해양(한화오션) 인수에 이어 범LG가 단체급식 대기업 아워홈(지분 58.62%, 8,695억원)까지 전격 인수하며 푸드테크와 식음료(F&B)로 영토를 확장했습니다.",
        color: "bg-orange-900 text-white",
        highlightMarriages: [
          {
            label: "김승연 회장 ↔ 서영민 (서정화 전 내무부장관 딸)",
            partnerFamily: "정관계 서씨",
          },
          {
            label: "김영혜(김종희 장녀) ↔ 이동훈 전 제일화재 회장 (이후락 전 중앙정보부장 차남)",
            partnerFamily: "이후락가",
          },
        ],
      },
      {
        id: "GRP_BINGGRAE",
        name: "빙그레",
        subName: "차남 김호연 회장 계열 (백범 김구 손녀사위)",
        founderOrLeader: "김호연 회장 (김구 선생 손녀 김미의 남편)",
        lineageRelation: "김종희 창업주의 차남 직계",
        separationYear: 1998,
        keySubsidiaries: ["빙그레", "해태아이스크림"],
        description:
          "바나나맛우유, 요플레, 투게더, 메로나 등 국민 유제품 및 빙과류를 생산하는 전문 식음료 기업입니다. 1998년 한화그룹에서 완전 독립했습니다.",
        color: "bg-yellow-800 text-white",
      },
      {
        id: "GRP_HANEXPRESS",
        name: "한익스프레스",
        subName: "김종희 장녀 김영혜 차남 이석환 대표",
        founderOrLeader: "이석환 대표이사",
        lineageRelation: "김종희 창업주의 외손자 (이후락 전 중정부장 친손자)",
        separationYear: 1997,
        keySubsidiaries: ["한익스프레스"],
        description: "화물운송 및 특수화물 물류 전문 상장사로 김승연 회장의 외조카 이석환 대표가 이끌고 있습니다.",
        color: "bg-stone-800 text-white",
      },
    ],
  },
  {
    id: "FAM_LOTTE",
    name: "범롯데가 (汎롯데家)",
    badge: "롯데·농심·푸르밀·산사스·롯데관광",
    founder: "총괄회장 신격호 (1921~2020)",
    foundingYear: 1948,
    originCompany: "일본 롯데 (1948) · 롯데제과 (1967, 한국)",
    summary:
      "신격호 총괄회장이 한·일 양국에 걸쳐 세운 롯데그룹에서 출발하여 셋째동생 신춘호 회장의 농심, 넷째동생 신준호 회장의 푸르밀(옛 롯데우유), 둘째동생 신선호 회장의 산사스 등으로 분화했습니다.",
    accentColor: "from-red-600 to-rose-800",
    sources: [
      {
        title: "범롯데가 가계도",
        url: "https://namu.wiki/w/%EB%B2%94%EB%A1%AF%EB%8D%B0%EA%B0%80#s-2",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_LOTTE_MAIN",
        name: "롯데그룹 (본가)",
        subName: "차남 신동빈 회장 체제 (식품·유통·화학·호텔)",
        founderOrLeader: "신격호 총괄회장 → 신동빈 회장",
        lineageRelation: "신격호 창업주의 차남 직계",
        separationYear: 1967,
        ftcRank: 6,
        assetsTrillion: 129.5,
        keySubsidiaries: ["롯데지주", "롯데쇼핑", "롯데케미칼", "롯데웰푸드", "롯데칠성음료", "호텔롯데", "롯데건설", "롯데물산"],
        description:
          "국내 최대 백화점·마트 유통망과 대규모 석유화학 콤플렉스(롯데케미칼), 123층 롯데월드타워를 보유한 재계 6위 복합 기업집단입니다.",
        color: "bg-red-900 text-white",
        highlightMarriages: [
          {
            label: "신선호 산사스 회장 장녀 신유나 ↔ 태광그룹 이호진 전 회장",
            partnerFamily: "태광그룹",
            footnoteId: "각주 50",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-50",
          },
        ],
      },
      {
        id: "GRP_NONGSHIM",
        name: "농심그룹",
        subName: "신격호 셋째동생 신춘호 계열 (신동원 회장)",
        founderOrLeader: "신춘호 회장 → 신동원 회장",
        lineageRelation: "신격호 총괄회장의 셋째동생 직계",
        separationYear: 1965,
        ftcRank: 50,
        assetsTrillion: 5.8,
        keySubsidiaries: ["농심", "율촌화학", "메가마트", "농심홀딩스"],
        description:
          "1965년 롯데공업으로 창업해 라면 사업에 진출한 뒤 신라면, 안성탕면, 짜파게티, 새우깡 등을 탄생시키며 세계적인 K-라면 1위 기업으로 독립 성장했습니다.",
        color: "bg-amber-900 text-white",
        highlightMarriages: [
          {
            label: "신윤경(신춘호 막내딸) ↔ 아모레퍼시픽 서경배 회장",
            partnerFamily: "아모레퍼시픽",
          },
        ],
      },
      {
        id: "GRP_PURMIL",
        name: "푸르밀 (옛 롯데우유)",
        subName: "신격호 넷째동생 신준호 계열",
        founderOrLeader: "신준호 회장",
        lineageRelation: "신격호 총괄회장의 넷째동생 직계",
        separationYear: 2007,
        keySubsidiaries: ["푸르밀"],
        description: "1978년 롯데유업으로 설립된 후 2007년 롯데그룹에서 완전 계열분리된 유가공 전문 기업입니다.",
        color: "bg-sky-950 text-white",
      },
      {
        id: "GRP_LOTTE_TOUR",
        name: "롯데관광개발 / 동화면세점",
        subName: "신격호 여동생 신정희 대표 · 남편 김기병 회장",
        founderOrLeader: "김기병 롯데관광개발 회장 · 신정희 대표",
        lineageRelation: "신격호 총괄회장의 여동생 부부 직계",
        separationYear: 1972,
        keySubsidiaries: ["롯데관광개발", "동화면세점", "제주 드림타워 복합리조트"],
        description:
          "롯데 브랜드를 공유하는 독자 여행·카지노 복합리조트 개발 기업입니다. 삼천리그룹 이만득 3녀 이은희와 차남 김한준이 혼인했습니다.",
        color: "bg-teal-950 text-white",
        highlightMarriages: [
          {
            label: "김한준(김기병 차남) ↔ 삼천리그룹 이만득 회장 3녀 이은희",
            partnerFamily: "삼천리그룹",
            footnoteId: "각주 36",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-36",
          },
        ],
      },
    ],
  },
  {
    id: "FAM_HYOSUNG",
    name: "범효성가 (汎曉星家)",
    badge: "효성·HS효성·한국앤컴퍼니(한국타이어)·동성",
    founder: "만우(晩愚) 조홍제 (1906~1984)",
    foundingYear: 1962,
    originCompany: "삼성물산공동창업 (1948) · 효성물산 (1962)",
    summary:
      "이병철과 함께 삼성물산을 공동 창업했다가 결별한 조홍제 창업주가 세운 기업군으로 장남(효성), 차남(한국타이어), 삼남(동성/삼동원)으로 분가했습니다. 2024년 장남 효성에서 HS효성이 추가 분가했습니다.",
    accentColor: "from-blue-800 to-indigo-950",
    sources: [
      {
        title: "범효성가 가계도 및 분할",
        url: "https://namu.wiki/w/%EB%B2%94%ED%9A%A8%EC%84%B1%EA%B0%80",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_HYOSUNG_MAIN",
        name: "효성그룹 (장남 계열)",
        subName: "조석래 명예회장 → 장남 조현준 회장",
        founderOrLeader: "조석래 명예회장 → 조현준 회장",
        lineageRelation: "조홍제 창업주의 장남 직계",
        separationYear: 1962,
        ftcRank: 33,
        assetsTrillion: 15.6,
        keySubsidiaries: ["효성", "효성중공업", "효성화학", "효성T&C", "효성ITX"],
        description: "전력설비(효성중공업), 스판덱스(효성티앤씨), 화학을 주력으로 하는 중공업·섬유 첨단소재 그룹입니다.",
        color: "bg-blue-950 text-white",
        highlightMarriages: [
          {
            label: "조현준 회장 ↔ 이미경 (이희상 전 동아원 회장 3녀, 전두환 3남 전재만과 동서)",
            partnerFamily: "동아원·전두환가",
          },
        ],
      },
      {
        id: "GRP_HS_HYOSUNG",
        name: "HS효성그룹 (3남 계열 신설)",
        subName: "조석래 명예회장 3남 조현상 부회장 분가",
        founderOrLeader: "조현상 부회장",
        lineageRelation: "조석래 명예회장의 3남 독자 분가 (2024년 분할)",
        separationYear: 2024,
        keySubsidiaries: ["HS효성", "HS효성첨단소재", "HS효성인포메이션시스템", "HS효성토요타"],
        description: "타이어코드 세계 1위 HS효성첨단소재와 IT·모빌리티 사업을 이끌고 2024년 신설 독립 지주사로 출범했습니다.",
        color: "bg-teal-950 text-white",
      },
      {
        id: "GRP_HANKOOK_TIRE",
        name: "한국앤컴퍼니그룹 (차남 계열)",
        subName: "조홍제 차남 조양래 명예회장 → 조현범 회장",
        founderOrLeader: "조양래 명예회장 → 조현범 회장",
        lineageRelation: "조홍제 창업주의 차남 직계",
        separationYear: 1985,
        ftcRank: 39,
        assetsTrillion: 12.8,
        keySubsidiaries: ["한국앤컴퍼니", "한국타이어앤테크놀로지", "한온시스템(인수추진)"],
        description: "글로벌 톱티어 타이어 제조사로 최근 차량용 공조 2위 한온시스템을 인수하여 모빌리티 핵심 부품 그룹으로 도약했습니다.",
        color: "bg-stone-900 text-white",
      },
    ],
  },
  {
    id: "FAM_DOOSAN",
    name: "범두산가 (汎斗山家)",
    badge: "두산·네오플럭스·이생그룹",
    founder: "매헌(梅軒) 박승직 (1864~1950) · 연강 박두병",
    foundingYear: 1896,
    originCompany: "박승직상점 (1896, 배오개) - 한국 최장수 기업",
    summary:
      "1896년 배오개 박승직상점으로 출발하여 128년 역사를 이어온 대한민국 최고(最古) 기업 가문입니다. 소비재(OB맥주 등)에서 발전플랜트, 원전, 건설기계 등 첨단 에너지·엔지니어링 그룹으로 완벽히 변신했습니다.",
    accentColor: "from-blue-900 to-sky-950",
    sources: [
      {
        title: "범두산가 가계도",
        url: "https://namu.wiki/w/%EB%B2%94%EB%91%90%EC%82%B0%EA%B0%80",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_DOOSAN_MAIN",
        name: "두산그룹",
        subName: "박용곤 → 박용오 → 박용성 → 박용현 → 박용만 → 박정원 회장",
        founderOrLeader: "박두병 초대회장 → 박정원 회장 (4세 경영)",
        lineageRelation: "박승직-박두병으로 이어지는 두산 본가 (형제공동경영 후 사촌경영)",
        separationYear: 1896,
        ftcRank: 17,
        assetsTrillion: 26.5,
        keySubsidiaries: ["(주)두산", "두산에너빌리티", "두산밥캣", "두산퓨얼셀", "두산로보틱스", "두산테스나"],
        description:
          "SMR(소형원전), 가스터빈, 수소연료전지, 협동로봇, 반도체 테스트를 미래 핵심 포트폴리오로 구축한 에너지 테크놀로지 그룹입니다.",
        color: "bg-blue-950 text-white",
        highlightMarriages: [
          {
            label: "박상민(박지원 부회장 장녀) ↔ LS그룹 구동휘 부사장",
            partnerFamily: "LS그룹",
          },
          {
            label: "박효원(박용욱 장녀) ↔ SPC그룹 허진수 글로벌BU장",
            partnerFamily: "SPC그룹",
            footnoteId: "각주 10",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-10",
          },
        ],
      },
      {
        id: "GRP_ESAENG",
        name: "이생그룹",
        subName: "박두병 5남 박용욱 회장 분가",
        founderOrLeader: "박용욱 회장",
        lineageRelation: "박두병 회장의 5남 일가",
        separationYear: 1990,
        keySubsidiaries: ["이생네오텍", "이생테크"],
        description: "패키징, 인쇄 및 엔지니어링 소재를 주력으로 하는 박용욱 회장의 독자 기업집단입니다.",
        color: "bg-slate-800 text-white",
      },
    ],
  },
  {
    id: "FAM_YOUNGFUNG",
    name: "범영풍가 (汎永豊家)",
    badge: "영풍(장씨) · 고려아연(최씨) · 코리아써키트",
    founder: "장병희(1914~2000) · 최기호(1908~1980) 공동창업",
    foundingYear: 1949,
    originCompany: "영풍기업사 (1949)",
    summary:
      "황해도 동향 출신의 장병희와 최기호가 1949년 공동 창업하여 영풍문고·전자부품(장씨)과 고려아연 비철금속제련(최씨)으로 70여 년간 양문가 동업체제를 이어왔습니다.",
    accentColor: "from-emerald-800 to-teal-950",
    sources: [
      {
        title: "한국의 기업 가문 영풍·고려아연",
        url: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_YOUNGFUNG_MAIN",
        name: "영풍그룹 / 전자계열 (장씨 일가)",
        subName: "장병희 창업주 일가 (장형진 고문 · 장세준 부회장)",
        founderOrLeader: "장병희 공동창업주 → 장형진 고문, 장세준 코리아써키트 부회장",
        lineageRelation: "장병희 창업주 직계",
        separationYear: 1949,
        ftcRank: 27,
        assetsTrillion: 17.5,
        keySubsidiaries: ["(주)영풍", "코리아써키트", "인터플렉스", "시그네틱스", "영풍문고"],
        description: "영풍 석포제련소와 PCB 전자부품 전문 코리아써키트, 인터플렉스, 대형서점 영풍문고를 운영합니다.",
        color: "bg-emerald-950 text-white",
        highlightMarriages: [
          {
            label: "장세경(장철진 전 영풍산업 회장 딸) ↔ 일진그룹 허진규 회장 장남 허정석",
            partnerFamily: "일진그룹",
            footnoteId: "각주 55",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-55",
          },
        ],
      },
      {
        id: "GRP_KOREA_ZINC",
        name: "고려아연그룹 (최씨 일가)",
        subName: "최기호 창업주 일가 (최창걸 명예회장 · 최윤범 회장)",
        founderOrLeader: "최기호 공동창업주 → 최창걸 → 최윤범 회장",
        lineageRelation: "최기호 창업주 직계",
        separationYear: 1974,
        keySubsidiaries: ["고려아연", "영풍정밀", "케이잼(동박)", "아크에너지"],
        description: "세계 1위 비철금속(아연·연·은·인듐) 제련 기술을 보유한 글로벌 알짜 기업입니다. 최근 2차전지 소재와 수소에너지로 영역을 넓히고 있습니다.",
        color: "bg-teal-900 text-white",
        highlightMarriages: [
          {
            label: "최강민(최창걸 2녀) ↔ 조선일보 방우영 장남 방성훈 스포츠조선 대표",
            partnerFamily: "조선일보가",
            footnoteId: "각주 58",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-58",
          },
        ],
      },
    ],
  },
  {
    id: "FAM_DONGKUK",
    name: "범동국제강가 (汎東國製鋼家)",
    badge: "동국제강·한국철강(KISCO)·동국산업",
    founder: "대원(大源) 장경호 (1899~1975)",
    foundingYear: 1954,
    originCompany: "대선발효공업 (1949) · 동국제강 (1954)",
    summary:
      "한국 철강 산업의 개척자 장경호 창업주가 세운 동국제강에서 출발하여, 3남(동국제강), 6남(한국철강그룹), 차남(동국산업)으로 분가하여 국내 굴지의 철강 가문을 구축했습니다.",
    accentColor: "from-slate-700 to-zinc-900",
    sources: [
      {
        title: "한국의 기업 가문 동국제강",
        url: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_DONGKUK_MAIN",
        name: "동국제강그룹",
        subName: "3남 장상태 계열 (장세주 회장 · 장세욱 부회장)",
        founderOrLeader: "장상태 회장 → 장세주 회장, 장세욱 부회장",
        lineageRelation: "장경호 창업주의 3남 직계 (3세 경영)",
        separationYear: 1954,
        ftcRank: 36,
        assetsTrillion: 13.5,
        keySubsidiaries: ["동국홀딩스", "동국제강", "동국씨엠", "인터지스"],
        description: "국내 최초 고로 가동 및 후판·컬러강판 1위 철강 그룹입니다. 지주사 체제 전환을 완료했습니다.",
        color: "bg-slate-900 text-white",
      },
      {
        id: "GRP_KISCO",
        name: "한국철강그룹 (KISCO홀딩스)",
        subName: "6남 장상돈 회장 계열 (장세홍 사장)",
        founderOrLeader: "장상돈 회장 → 장세홍 사장",
        lineageRelation: "장경호 창업주의 6남 일가",
        separationYear: 2001,
        keySubsidiaries: ["KISCO홀딩스", "한국철강", "환영철강공업", "대동배관"],
        description: "2001년 동국제강에서 독립하여 철근과 특수강 분야 국내 유력 철강 지주회사로 자리잡았습니다.",
        color: "bg-zinc-800 text-white",
      },
    ],
  },
  {
    id: "FAM_SEAH",
    name: "범세아가 (汎世亞家)",
    badge: "세아홀딩스(특수강) · 세아제강지주(강관)",
    founder: "해암(海巖) 이종덕 (1914~1995)",
    foundingYear: 1960,
    originCompany: "부산파이프 (1960)",
    summary:
      "한국 강관의 원조 부산파이프에서 시작하여 장남 이운형 회장의 세아홀딩스(특수강 부문, 이태성 사장)와 차남 이순형 회장의 세아제강지주(강관 부문, 이주성 사장)로 '사촌 책임경영'의 모범을 보이고 있습니다.",
    accentColor: "from-blue-700 to-indigo-900",
    sources: [
      {
        title: "한국의 기업 가문 세아그룹",
        url: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_SEAH_HOLDINGS",
        name: "세아홀딩스 (특수강 부문)",
        subName: "장남 고 이운형 회장 일가 (이태성 사장)",
        founderOrLeader: "이운형 회장 → 이태성 세아홀딩스 사장",
        lineageRelation: "이종덕 창업주의 장남 직계",
        separationYear: 2001,
        ftcRank: 41,
        assetsTrillion: 11.5,
        keySubsidiaries: ["세아홀딩스", "세아베스틸지주", "세아베스틸", "세아창원특수강", "세아항공방산소재"],
        description: "자동차·원전·항공방산 특수강 및 단조 소재 국내 1위 그룹입니다. 애경그룹 채형석 총괄부회장 장녀 채문선과 이태성 사장이 혼인했습니다.",
        color: "bg-blue-900 text-white",
        highlightMarriages: [
          {
            label: "이태성 사장 ↔ 애경그룹 채형석 장녀 채문선",
            partnerFamily: "애경그룹",
            footnoteId: "각주 31",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-31",
          },
        ],
      },
      {
        id: "GRP_SEAH_STEEL",
        name: "세아제강지주 (강관·에너지강재 부문)",
        subName: "차남 이순형 세아그룹 회장 일가 (이주성 사장)",
        founderOrLeader: "이순형 회장 → 이주성 세아제강지주 사장",
        lineageRelation: "이종덕 창업주의 차남 직계",
        separationYear: 1960,
        keySubsidiaries: ["세아제강지주", "세아제강", "세아윈드(영국 해상풍력)", "세아씨엠"],
        description: "국내 최대 강관 제조업체이자 글로벌 해상풍력 모노파일(하부구조물) 분야의 선도기업입니다.",
        color: "bg-indigo-950 text-white",
      },
    ],
  },
  {
    id: "FAM_KUMHO",
    name: "범금호가 (汎錦湖家)",
    badge: "금호아시아나 · 금호석유화학",
    founder: "금호(錦湖) 박인천 (1901~1984)",
    foundingYear: 1946,
    originCompany: "광주택시 (1946) · 광주일고 옆 삼륜차 2대",
    summary:
      "박인천 창업주가 택시 2대로 시작하여 고속버스, 타이어, 화학, 항공(아시아나항공)으로 대성장했던 호남 최대의 기업 가문입니다. 형제간 갈등 이후 박삼구 회장의 금호아시아나와 박찬구 회장의 금호석유화학으로 분리되었습니다.",
    accentColor: "from-rose-800 to-red-950",
    sources: [
      {
        title: "한국의 기업 가문 금호그룹",
        url: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8",
        publisher: "계보 검증 아카이브",
      },
    ],
    groups: [
      {
        id: "GRP_KUMHO_PETRO",
        name: "금호석유화학그룹",
        subName: "4남 박찬구 회장 계열 (박준경 사장)",
        founderOrLeader: "박찬구 회장 → 박준경 사장",
        lineageRelation: "박인천 창업주의 4남 일가",
        separationYear: 2015,
        ftcRank: 34,
        assetsTrillion: 14.8,
        keySubsidiaries: ["금호석유화학", "금호피앤비화학", "금호미쓰이화학", "금호폴리켐", "금호개발상사"],
        description: "세계 1위 합성고무(NB라텍스) 및 합성수지, 정밀화학 전문 대기업집단입니다. 2015년 대법원 계열분리 확정 판결을 받았습니다.",
        color: "bg-red-950 text-white",
      },
      {
        id: "GRP_KUMHO_ASIANA",
        name: "금호아시아나그룹",
        subName: "3남 박삼구 회장 계열 (박세창 부회장)",
        founderOrLeader: "박삼구 전 회장 → 박세창 부회장",
        lineageRelation: "박인천 창업주의 3남 직계",
        separationYear: 1946,
        keySubsidiaries: ["금호고속", "금호건설"],
        description: "대우건설 및 대한통운 무리한 인수 후 유동성 위기를 맞아 아시아나항공 등을 매각하고 금호고속과 금호건설 중심으로 재편되었습니다.",
        color: "bg-slate-900 text-white",
        highlightMarriages: [
          {
            label: "박현주(박인천 3녀) ↔ 대상그룹 임창욱 명예회장 (임세령 모친)",
            partnerFamily: "대상그룹",
            footnoteId: "각주 15",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-15",
          },
          {
            label: "박은혜(박정구 3녀) ↔ 일진머티리얼즈 허재명 대표",
            partnerFamily: "일진그룹",
            footnoteId: "각주 14",
            footnoteUrl: "https://namu.wiki/w/%ED%95%9C%EA%B5%AD%EC%9D%98%20%EA%B8%B0%EC%97%85%20%EA%B0%80%EB%AC%B8#rfn-14",
          },
        ],
      },
    ],
  },
];

interface PanChaebolLineageViewProps {
  onSelectFamily?: (familyId: string) => void;
}

export const PanChaebolLineageView: React.FC<PanChaebolLineageViewProps> = ({
  onSelectFamily,
}) => {
  const [selectedPanId, setSelectedPanId] = useState<string>("FAM_HYUNDAI");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentPan = useMemo(() => {
    return PAN_CHAEBOLS.find((p) => p.id === selectedPanId) || PAN_CHAEBOLS[0];
  }, [selectedPanId]);

  // Global search across all groups & subsidiaries
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const hits: {
      pan: PanChaebolData;
      group: SpinoffGroup;
      matchType: string;
      matchedText: string;
    }[] = [];

    PAN_CHAEBOLS.forEach((pan) => {
      pan.groups.forEach((grp) => {
        if (grp.name.toLowerCase().includes(q)) {
          hits.push({ pan, group: grp, matchType: "그룹명", matchedText: grp.name });
        } else if (grp.subName?.toLowerCase().includes(q)) {
          hits.push({ pan, group: grp, matchType: "계열 설명", matchedText: grp.subName });
        } else {
          const matchedSub = grp.keySubsidiaries.find((s) => s.toLowerCase().includes(q));
          if (matchedSub) {
            hits.push({ pan, group: grp, matchType: "계열사", matchedText: matchedSub });
          } else if (grp.founderOrLeader.toLowerCase().includes(q)) {
            hits.push({ pan, group: grp, matchType: "경영자/인물", matchedText: grp.founderOrLeader });
          }
        }
      });
    });
    return hits;
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            범(汎)가문 계열 분가도 · PAN-CHAEBOL DYNASTY & SPINOFF MAP
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            대한민국 10대 범(汎)가문 계열분리 및 분가 계보도
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            호암 이병철, 아산 정주영, 연암 구인회 등 모태 창업주에서 출발하여 독립된 그룹으로 분가·계열분리한
            대한민국 주요 대기업집단(CJ·신세계·한솔, HD현대·HDC아이파크·KCC, GS·LS·LX 등)의 상세 계보와 핵심 계열사,
            그리고 타 재벌가와의 혼맥 연결점을 단번에 파악합니다.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="mt-6 relative max-w-xl">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="그룹명이나 계열사 검색 (예: 아이파크, KCC, 신세계, HD현대, CJ, 빙그레, 농심, 아워홈)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-900 text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-700 px-2 py-0.5 rounded"
            >
              초기화
            </button>
          )}

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-30 max-h-72 overflow-y-auto">
              <div className="p-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 flex justify-between">
                <span>검색 결과 ({searchResults.length}건)</span>
                <span>클릭 시 해당 가문으로 이동</span>
              </div>
              {searchResults.map((hit, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPanId(hit.pan.id);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-3 hover:bg-amber-50/70 border-b border-slate-100 flex items-center justify-between transition group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {hit.pan.name}
                      </span>
                      <span className="font-black text-slate-900 group-hover:text-amber-700">
                        {hit.group.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      일치: <span className="font-semibold text-indigo-600">{hit.matchType}</span> ({hit.matchedText}) · 경영: {hit.group.founderOrLeader}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pan-Chaebol Family Selection Chips */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          가문 선택 (클릭하여 계열 분가도 전환)
        </div>
        <div className="flex flex-wrap gap-2">
          {PAN_CHAEBOLS.map((pan) => {
            const isSelected = pan.id === selectedPanId;
            return (
              <button
                key={pan.id}
                onClick={() => setSelectedPanId(pan.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-102"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{pan.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {pan.groups.length}개 그룹
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED PAN-CHAEBOL DETAIL CANVAS */}
      <div className="space-y-6">
        {/* Founder & Root Umbrella Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-100 text-amber-900 font-black text-xs px-2.5 py-1 rounded-md">
                  {currentPan.badge}
                </span>
                <span className="text-xs text-slate-400">
                  창업 연도: <strong className="text-slate-700">{currentPan.foundingYear}년</strong>
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                <span>{currentPan.name}</span>
                <span className="text-slate-400 text-lg font-medium">계열 분가 및 기업집단도</span>
              </h3>
            </div>

            {/* Direct Link to Family Genealogy */}
            {onSelectFamily && (
              <button
                onClick={() => onSelectFamily(currentPan.id)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-indigo-200 transition"
              >
                <GitBranch className="w-3.5 h-3.5" />
                가계도 탭에서 인물 상세 보기
              </button>
            )}
          </div>

          {/* Root Founder Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                <Crown className="w-4 h-4 text-amber-500" />
                모태 창업주
              </div>
              <div className="text-base font-black text-slate-900">{currentPan.founder}</div>
              <div className="text-xs text-slate-500 mt-1">모태: {currentPan.originCompany}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                가문 역사 및 분가 개요
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{currentPan.summary}</p>
            </div>
          </div>

          {/* Exact Footnote & Verification Citations */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              공식 공시 및 계보 교차검증 자료:
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPan.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px] border border-slate-200 transition"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* VISUAL HIERARCHY TREE / FLOW CONNECTOR */}
        <div className="text-center my-2">
          <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-inner">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600 rotate-90" />
            창업주로부터 계열분리된 {currentPan.groups.length}개 독립 기업집단
          </div>
        </div>

        {/* SPUN-OFF CORPORATE GROUPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentPan.groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header with Badges */}
              <div className="p-5 border-b border-slate-100 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{group.name}</span>
                    </h4>
                    {group.subName && (
                      <div className="text-xs text-indigo-700 font-bold mt-0.5">
                        {group.subName}
                      </div>
                    )}
                  </div>
                  {group.ftcRank && (
                    <span className="bg-indigo-50 text-indigo-800 text-[11px] font-black px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                      재계 {group.ftcRank}위
                    </span>
                  )}
                </div>

                {/* Heir / Leader Badge */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                    <span>경영 주체:</span>
                    <span className="font-bold text-slate-900">{group.founderOrLeader}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                    <span>가계 계통:</span>
                    <span className="text-slate-700 font-medium">{group.lineageRelation}</span>
                  </div>
                  {group.separationYear && (
                    <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                      <span>계열분리/독립:</span>
                      <span className="font-bold text-amber-700">{group.separationYear}년</span>
                    </div>
                  )}
                  {group.assetsTrillion && (
                    <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                      <span>자산 규모:</span>
                      <span className="font-black text-slate-900">{group.assetsTrillion}조원</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {group.description}
                </p>

                {/* Key Subsidiaries Tags */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    핵심 계열사
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.keySubsidiaries.map((sub, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-md font-medium border border-slate-200/80"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inter-Chaebol Marriage Highlights with Exact Footnotes */}
                {group.highlightMarriages && group.highlightMarriages.length > 0 && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-2">
                    <div className="text-[11px] font-black text-rose-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      타 재벌가와의 핵심 혼맥 결절점
                    </div>
                    {group.highlightMarriages.map((m, idx) => (
                      <div key={idx} className="text-xs text-rose-950 font-medium space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span>{m.label}</span>
                          <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-1.5 py-0.2 rounded">
                            {m.partnerFamily}
                          </span>
                        </div>
                        {m.footnoteUrl && (
                          <a
                            href={m.footnoteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-rose-700 hover:text-rose-900 underline font-semibold"
                          >
                            <span>언론 보도 및 계보 원문 확인</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
