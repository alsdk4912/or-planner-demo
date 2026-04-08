export type ChecklistStageName = "Sign In" | "Time Out" | "Sign Out";

export type ChecklistStageStatus = "미시작" | "진행중" | "완료";

export interface ChecklistItemTemplate {
  id: string;
  label: string;
  required: boolean;
}

export interface ChecklistItemState extends ChecklistItemTemplate {
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

export interface ChecklistStageState {
  stage: ChecklistStageName;
  status: ChecklistStageStatus;
  items: ChecklistItemState[];
  completedBy: string | null;
  completedAt: string | null;
}

export interface ChecklistLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  stage: ChecklistStageName;
  action: string;
  detail: string;
}

export interface CaseChecklistState {
  caseId: string;
  stages: Record<ChecklistStageName, ChecklistStageState>;
  logs: ChecklistLogEntry[];
}
