export interface SurgeryTemplateMock {
  id: string;
  name: string;
  department: string;
  expectedDurationMin: number;
  status: "사용중" | "검토필요";
}

export interface SurgeonPreferenceMock {
  surgeon: string;
  focus: string;
  version: string;
  note: string;
}

export interface EquipmentLocationMock {
  equipment: string;
  location: string;
  manager: string;
}

export interface ChecklistTemplateMock {
  stage: "Sign In" | "Time Out" | "Sign Out";
  requiredCount: number;
  optionalCount: number;
  version: string;
}

export interface ManualVersionMock {
  surgeryType: string;
  version: string;
  updatedAt: string;
  owner: string;
}

export interface CompletionLogMock {
  caseId: string;
  stage: string;
  actor: string;
  completedAt: string;
  result: "정상 완료" | "지연 후 완료";
}

export const surgeryTemplateMocks: SurgeryTemplateMock[] = [
  { id: "TPL-ORT-01", name: "고관절 전치환술", department: "정형외과", expectedDurationMin: 150, status: "사용중" },
  { id: "TPL-GEN-02", name: "복강경 담낭절제술", department: "외과", expectedDurationMin: 90, status: "사용중" },
  { id: "TPL-NS-03", name: "개두술(종양 절제)", department: "신경외과", expectedDurationMin: 240, status: "검토필요" },
];

export const surgeonPreferenceMocks: SurgeonPreferenceMock[] = [
  { surgeon: "김도윤 교수", focus: "관절치환", version: "v1.4", note: "삽입물 트레이 우측 정렬 선호" },
  { surgeon: "이승민 교수", focus: "복강경", version: "v1.2", note: "절개 전 30초 추가 브리핑" },
  { surgeon: "정태훈 교수", focus: "신경미세수술", version: "v1.6", note: "baseline 2회 확인 필수" },
];

export const equipmentLocationMocks: EquipmentLocationMock[] = [
  { equipment: "복강경 타워", location: "중앙 장비보관실 B-1", manager: "장비관리 김현수" },
  { equipment: "수술 현미경", location: "OR-3 고정 배치 구역", manager: "장비관리 정세윤" },
  { equipment: "C-arm", location: "OR 장비실 A-2 구역", manager: "장비관리 박진호" },
];

export const checklistTemplateMocks: ChecklistTemplateMock[] = [
  { stage: "Sign In", requiredCount: 4, optionalCount: 1, version: "v2.1" },
  { stage: "Time Out", requiredCount: 4, optionalCount: 1, version: "v2.1" },
  { stage: "Sign Out", requiredCount: 4, optionalCount: 1, version: "v2.1" },
];

export const manualVersionMocks: ManualVersionMock[] = [
  { surgeryType: "정형외과 관절치환", version: "v3.2", updatedAt: "2026-04-06 09:30", owner: "책임간호사 박선영" },
  { surgeryType: "복강경 일반외과", version: "v2.8", updatedAt: "2026-04-03 14:10", owner: "책임간호사 최지원" },
  { surgeryType: "신경외과 개두술", version: "v3.4", updatedAt: "2026-04-07 08:20", owner: "책임간호사 한미경" },
];

export const completionLogMocks: CompletionLogMock[] = [
  { caseId: "OR-2026-001", stage: "Sign In", actor: "김나영 간호사", completedAt: "2026-04-08 07:22:10", result: "정상 완료" },
  { caseId: "OR-2026-001", stage: "Time Out", actor: "김나영 간호사", completedAt: "2026-04-08 07:38:41", result: "정상 완료" },
  { caseId: "OR-2026-008", stage: "Sign In", actor: "오민지 간호사", completedAt: "2026-04-08 09:57:05", result: "지연 후 완료" },
  { caseId: "OR-2026-014", stage: "Time Out", actor: "최유진 간호사", completedAt: "2026-04-08 12:44:55", result: "지연 후 완료" },
];
