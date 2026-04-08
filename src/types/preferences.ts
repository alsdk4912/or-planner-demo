export interface PreferenceComparisonRow {
  category: string;
  standardProtocol: string;
  surgeonVariant: string;
  caution: string;
  prepImpact: string;
  equipmentImpact: string;
  communicationTip: string;
}

export interface SurgeonPreferenceProfile {
  surgeon: string;
  department: string;
  procedureFocus: string;
  comparisonRows: PreferenceComparisonRow[];
}
