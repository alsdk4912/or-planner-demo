"use client";

import { create } from "zustand";

import { checklistStageOrder, checklistTemplates } from "@/data/checklist-templates";
import type {
  CaseChecklistState,
  ChecklistItemState,
  ChecklistLogEntry,
  ChecklistStageName,
  ChecklistStageState,
} from "@/types/checklist";

function toKstTimeString(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(date);
}

function createInitialCaseState(caseId: string): CaseChecklistState {
  const stages = {} as Record<ChecklistStageName, ChecklistStageState>;
  checklistStageOrder.forEach((stage) => {
    const items: ChecklistItemState[] = checklistTemplates[stage].map((item) => ({
      ...item,
      completed: false,
      completedBy: null,
      completedAt: null,
    }));
    stages[stage] = {
      stage,
      status: "미시작",
      items,
      completedBy: null,
      completedAt: null,
    };
  });

  return { caseId, stages, logs: [] };
}

function allRequiredCompleted(stage: ChecklistStageState) {
  return stage.items.filter((item) => item.required).every((item) => item.completed);
}

function stageProgressStatus(stage: ChecklistStageState): ChecklistStageState["status"] {
  const completedCount = stage.items.filter((item) => item.completed).length;
  if (completedCount === 0) {
    return "미시작";
  }
  if (completedCount === stage.items.length) {
    return "완료";
  }
  return "진행중";
}

function gateReason(caseState: CaseChecklistState, stage: ChecklistStageName): string | null {
  if (stage === "Sign In") {
    return null;
  }

  const signIn = caseState.stages["Sign In"];
  const timeOut = caseState.stages["Time Out"];

  if (stage === "Time Out") {
    if (signIn.status !== "완료") {
      return "Sign In이 완료되지 않아 Time Out을 진행할 수 없습니다.";
    }
    if (!allRequiredCompleted(signIn)) {
      return "Sign In의 필수 항목이 모두 완료되지 않아 Time Out이 차단되었습니다.";
    }
    return null;
  }

  if (timeOut.status !== "완료") {
    return "Time Out이 완료되지 않아 Sign Out을 진행할 수 없습니다.";
  }
  if (!allRequiredCompleted(timeOut)) {
    return "Time Out의 필수 항목이 모두 완료되지 않아 Sign Out이 차단되었습니다.";
  }

  return null;
}

interface ChecklistStore {
  cases: Record<string, CaseChecklistState>;
  initializeCase: (caseId: string) => void;
  toggleItem: (params: {
    caseId: string;
    stage: ChecklistStageName;
    itemId: string;
    actor: string;
  }) => { ok: boolean; reason?: string };
  completeStage: (params: {
    caseId: string;
    stage: ChecklistStageName;
    actor: string;
  }) => { ok: boolean; reason?: string };
  resetCase: (caseId: string, actor: string) => void;
  getGateReason: (caseId: string, stage: ChecklistStageName) => string | null;
}

export const useChecklistStore = create<ChecklistStore>((set, get) => ({
  cases: {},

  initializeCase: (caseId) => {
    set((state) => {
      if (state.cases[caseId]) {
        return state;
      }
      return {
        cases: {
          ...state.cases,
          [caseId]: createInitialCaseState(caseId),
        },
      };
    });
  },

  toggleItem: ({ caseId, stage, itemId, actor }) => {
    const current = get().cases[caseId];
    if (!current) {
      return { ok: false, reason: "체크리스트 상태를 찾을 수 없습니다." };
    }

    const blockedReason = gateReason(current, stage);
    if (blockedReason) {
      return { ok: false, reason: blockedReason };
    }

    const targetStage = current.stages[stage];
    if (targetStage.completedAt) {
      return { ok: false, reason: "이미 완료 처리된 단계는 수정할 수 없습니다." };
    }

    const targetItem = targetStage.items.find((item) => item.id === itemId);
    if (!targetItem) {
      return { ok: false, reason: "체크 항목을 찾을 수 없습니다." };
    }

    const now = new Date();
    const timestamp = toKstTimeString(now);

    set((state) => {
      const caseState = state.cases[caseId];
      if (!caseState) {
        return state;
      }

      const stageState = caseState.stages[stage];
      const updatedItems = stageState.items.map((item) => {
        if (item.id !== itemId) {
          return item;
        }
        const nextDone = !item.completed;
        return {
          ...item,
          completed: nextDone,
          completedBy: nextDone ? actor : null,
          completedAt: nextDone ? timestamp : null,
        };
      });

      const updatedStage: ChecklistStageState = {
        ...stageState,
        items: updatedItems,
        status: stageProgressStatus({ ...stageState, items: updatedItems }),
      };

      const log: ChecklistLogEntry = {
        id: `${caseId}-${stage}-${itemId}-${now.getTime()}`,
        timestamp,
        actor,
        stage,
        action: "항목 상태 변경",
        detail: `${targetItem.label} ${targetItem.completed ? "완료 취소" : "완료 처리"}`,
      };

      return {
        cases: {
          ...state.cases,
          [caseId]: {
            ...caseState,
            stages: {
              ...caseState.stages,
              [stage]: updatedStage,
            },
            logs: [log, ...caseState.logs],
          },
        },
      };
    });

    return { ok: true };
  },

  completeStage: ({ caseId, stage, actor }) => {
    const current = get().cases[caseId];
    if (!current) {
      return { ok: false, reason: "체크리스트 상태를 찾을 수 없습니다." };
    }

    const blockedReason = gateReason(current, stage);
    if (blockedReason) {
      return { ok: false, reason: blockedReason };
    }

    const targetStage = current.stages[stage];
    if (targetStage.completedAt) {
      return { ok: false, reason: "이미 완료된 단계입니다." };
    }

    if (!allRequiredCompleted(targetStage)) {
      return { ok: false, reason: `${stage}의 필수 항목을 먼저 완료해야 합니다.` };
    }

    const now = new Date();
    const timestamp = toKstTimeString(now);

    set((state) => {
      const caseState = state.cases[caseId];
      if (!caseState) {
        return state;
      }

      const stageState = caseState.stages[stage];
      const updatedStage: ChecklistStageState = {
        ...stageState,
        status: "완료",
        completedAt: timestamp,
        completedBy: actor,
      };

      const log: ChecklistLogEntry = {
        id: `${caseId}-${stage}-complete-${now.getTime()}`,
        timestamp,
        actor,
        stage,
        action: "단계 완료",
        detail: `${stage} 단계 완료`,
      };

      return {
        cases: {
          ...state.cases,
          [caseId]: {
            ...caseState,
            stages: {
              ...caseState.stages,
              [stage]: updatedStage,
            },
            logs: [log, ...caseState.logs],
          },
        },
      };
    });

    return { ok: true };
  },

  resetCase: (caseId, actor) => {
    const now = new Date();
    const timestamp = toKstTimeString(now);
    set((state) => ({
      cases: {
        ...state.cases,
        [caseId]: {
          ...createInitialCaseState(caseId),
          logs: [
            {
              id: `${caseId}-reset-${now.getTime()}`,
              timestamp,
              actor,
              stage: "Sign In",
              action: "데모 초기화",
              detail: "체크리스트 상태를 초기화했습니다.",
            },
          ],
        },
      },
    }));
  },

  getGateReason: (caseId, stage) => {
    const current = get().cases[caseId];
    if (!current) {
      return "체크리스트 상태를 찾을 수 없습니다.";
    }
    return gateReason(current, stage);
  },
}));
