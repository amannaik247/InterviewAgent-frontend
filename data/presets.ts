export type CompanyPreset = {
  id: string;
  name: string;
  description: string;
};

export type RolePreset = {
  id: string;
  title: string;
  description: string;
};

// HOW TO ADD A PRESET:
// Copy one object in the array, give it a unique id, then edit the name/title and description.
// The dropdowns update automatically. Do not add a "Custom" entry here.

export const COMPANY_PRESETS: CompanyPreset[] = [
  { id: "company-1", name: "Company One", description: "PLACEHOLDER: Company One description goes here." },
  { id: "company-2", name: "Company Two", description: "PLACEHOLDER: Company Two description goes here." },
  { id: "company-3", name: "Company Three", description: "PLACEHOLDER: Company Three description goes here." },
];

export const ROLE_PRESETS: RolePreset[] = [
  { id: "role-1", title: "Role One", description: "PLACEHOLDER: Role One job description goes here." },
  { id: "role-2", title: "Role Two", description: "PLACEHOLDER: Role Two job description goes here." },
  { id: "role-3", title: "Role Three", description: "PLACEHOLDER: Role Three job description goes here." },
];
