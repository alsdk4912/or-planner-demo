import type { ChecklistItemTemplate, ChecklistStageName } from "@/types/checklist";

export const checklistStageOrder: ChecklistStageName[] = ["Sign In", "Time Out", "Sign Out"];

export const checklistTemplates: Record<ChecklistStageName, ChecklistItemTemplate[]> = {
  "Sign In": [
    { id: "si-1", label: "환자 신원 및 등록번호 확인", required: true },
    { id: "si-2", label: "수술 부위/수술명 확인", required: true },
    { id: "si-3", label: "알레르기 및 특이사항 확인", required: true },
    { id: "si-4", label: "마취 준비 상태 점검", required: true },
    { id: "si-5", label: "예비 혈액제제 준비 확인", required: false },
  ],
  "Time Out": [
    { id: "to-1", label: "팀원 전원 소개 및 역할 확인", required: true },
    { id: "to-2", label: "수술 계획/예상 위험 공유", required: true },
    { id: "to-3", label: "항생제 투여 시점 재확인", required: true },
    { id: "to-4", label: "영상/검사 결과 준비 확인", required: false },
    { id: "to-5", label: "교수별 선호 세팅 반영 여부 확인", required: true },
  ],
  "Sign Out": [
    { id: "so-1", label: "수술명/수술 기록 최종 확인", required: true },
    { id: "so-2", label: "기구/거즈 카운트 일치 확인", required: true },
    { id: "so-3", label: "검체 라벨링 및 전달 확인", required: true },
    { id: "so-4", label: "회복실 인계 포인트 정리", required: true },
    { id: "so-5", label: "장비 재정리 및 다음 케이스 준비", required: false },
  ],
};
