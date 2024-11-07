type Metric = {
    name: string;
    value: string;
};

export const INIT_PROJECT: {
    name: string;
    thumbnail: string;
    images: string[];
    status: number;
    capital_raising_target: number;
    mobilized_fund: number;
    address: string;
    company_size: string;
    website: string;
    project_information_description: string;
    valuation: string;
    funding_amount: string;
    total_slots: string;
    price_per_slot: string;
    investors: string;
    funding_round: string;
    investment_field: string;
    date_of_establishment: string;
    head_office: string;
    operating_status: string;
    founder: string;
    company_name: string;
    email: string;
    phone: string;
    growth_prospects: string;
    metrics: Metric[];
    description: string;
    industry_ids: number[];
    pitching_deck: string;
    contract_template: string;
    financial_roadmap: string;
    business_plan: string;
} = {
    name: "",
    thumbnail: "",
    images: [],
    status: 1,
    capital_raising_target: 0,
    mobilized_fund: 0,
    address: "",
    company_size: "",
    website: "",
    project_information_description: "",
    valuation: "",
    funding_amount: "",
    total_slots: "",
    price_per_slot: "",
    investors: "",
    funding_round: "",
    investment_field: "",
    date_of_establishment: "",
    head_office: "",
    operating_status: "",
    founder: "",
    company_name: "",
    email: "",
    phone: "",
    growth_prospects: "",
    metrics: [],
    description: "",
    industry_ids: [],
    pitching_deck: "",
    contract_template: "",
    financial_roadmap: "",
    business_plan: "",
};

export type InitProjectKeys = typeof INIT_PROJECT;
