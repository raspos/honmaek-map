export interface Source {
  id: string;
  type: "DART" | "FTC" | "NEWS" | "OFFICIAL" | "ACADEMIC" | "SEED_NAMU";
  publisher: string;
  title: string;
  date: string;
  url: string;
}

export interface Family {
  id: string;
  name: string;
  founder: string;
  origin_region: string;
  founding_year: number;
  verification_status: "VERIFIED" | "REVIEW" | "SEED" | "DISPUTED";
  history_summary: string;
  related_groups: string[];
  major_spinoffs: string[];
  key_figures: string[];
  source_ids: string[];
}

export interface CorporateGroup {
  id: string;
  name: string;
  family_id: string;
  founding_year: number;
  ftc_rank?: number;
  assets_trillion?: number;
  key_companies: string[];
  leader?: string;
  industry?: string;
}

export interface Person {
  id: string;
  name: string;
  family_id: string;
  birth: number;
  death: number | null;
  gen: number;
  role: string;
  company: string;
  active: boolean;
  is_founder?: boolean;
  main_title?: string;
  bio?: string;
}

export interface Relation {
  id: string;
  from_id: string;
  to_id: string;
  type: "BLOOD" | "MARRIAGE" | "SPINOFF" | "EQUITY" | "BUSINESS" | "MANAGEMENT";
  label: string;
  start_year?: number;
  end_year?: number | null;
  status: "VERIFIED" | "REVIEW" | "SEED" | "DISPUTED";
  is_inter_family?: boolean;
  fam_from?: string;
  fam_to?: string;
  desc?: string;
  source_ids?: string[];
}

export interface KPIsAndMetrics {
  families_total_count: number;
  families_verified_count: number;
  persons_total_count: number;
  corporate_groups_count: number;
  verified_marriages_count: number;
  inter_family_marriages_count: number;
  business_relations_count: number;
  verification_rate_percent: number;
  last_updated: string;
  centrality_rankings: {
    by_degree: { family_id: string; score: number; name: string }[];
    by_betweenness: { family_id: string; score: number; name: string }[];
    by_closeness: { family_id: string; score: number; name: string }[];
  };
}

export interface TimelineEvent {
  year: number;
  type: "MARRIAGE" | "SPINOFF" | "BUSINESS" | "FOUNDING";
  title: string;
  desc: string;
  groups: string[];
}

export interface ShortestPathInfo {
  steps: number;
  path_nodes: string[];
}

export type CrossMatrix = Record<
  string,
  Record<
    string,
    {
      category: "DIRECT_MARRIAGE" | "INDIRECT_MARRIAGE" | "SPINOFF_OR_ANCESTOR" | "NONE_VERIFIED" | "SELF" | "BOTH" | "MARRIAGE_ONLY" | "BUSINESS_ONLY";
      has_marriage: boolean;
      has_indirect?: boolean;
      is_spinoff?: boolean;
      has_business?: boolean;
      business_detail?: string | null;
      description: string;
    }
  >
>;
