"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

import {
  BottomCTABar,
  ChecklistStageCard,
  HeaderHero,
  MobileFrame,
  SectionCard,
  StatusChip,
} from "@/components/mobile/design-system";
import { checklistStageOrder } from "@/data/checklist-templates";
import { getSurgeryCaseById } from "@/data/mock-surgeries";
import { useChecklistStore } from "@/store/checklist-store";
import type { ChecklistStageName } from "@/types/checklist";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const demoActor = "김나영 간호사";

export default function ChecklistExecutionPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const surgery = getSurgeryCaseById(caseId);

  const { cases, initializeCase, toggleItem, completeStage, resetCase, getGateReason } =
    useChecklistStore();
  const [selectedStage, setSelectedStage] = useState<ChecklistStageName>("Sign In");
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  useEffect(() => {
    if (caseId) {
      initializeCase(caseId);
    }
  }, [caseId, initializeCase]);

  if (!surgery) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] px-4 py-6">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>케이스를 찾을 수 없습니다</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const caseState = cases[caseId];
  if (!caseState) {
    return null;
  }

  const selected = caseState.stages[selectedStage];
  const completedItems = selected.items.filter((item) => item.completed).length;
  const requiredTotal = selected.items.filter((item) => item.required).length;
  const requiredCompleted = selected.items.filter((item) => item.required && item.completed).length;

  const totalItems = checklistStageOrder.reduce((acc, stage) => acc + caseState.stages[stage].items.length, 0);
  const doneItems = checklistStageOrder.reduce(
    (acc, stage) => acc + caseState.stages[stage].items.filter((item) => item.completed).length,
    0,
  );
  const progress = Math.round((doneItems / totalItems) * 100);

  const stageGateMessages = checklistStageOrder.reduce(
    (acc, stage) => {
      acc[stage] = getGateReason(caseId, stage);
      return acc;
    },
    {} as Record<ChecklistStageName, string | null>,
  );

  const handleSelectStage = (stage: ChecklistStageName) => {
    const reason = stageGateMessages[stage];
    if (reason) {
      setBlockMessage(reason);
      return;
    }
    setBlockMessage(null);
    setSelectedStage(stage);
  };

  const handleToggle = (itemId: string) => {
    const result = toggleItem({ caseId, stage: selectedStage, itemId, actor: demoActor });
    if (!result.ok) {
      setBlockMessage(result.reason ?? "항목을 처리할 수 없습니다.");
    } else {
      setBlockMessage(null);
    }
  };

  const handleCompleteStage = () => {
    const result = completeStage({ caseId, stage: selectedStage, actor: demoActor });
    if (!result.ok) {
      setBlockMessage(result.reason ?? "단계 완료 처리에 실패했습니다.");
    } else {
      setBlockMessage(null);
    }
  };

  return (
    <MobileFrame>
      <HeaderHero
        title="체크리스트 수행"
        subtitle={`${surgery.surgeryName} · 수행자 ${demoActor}`}
      />
      <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-1 text-xs text-slate-600">
        <ArrowLeft className="size-3.5" /> 케이스 상세로 돌아가기
      </Link>
      <SectionCard>
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl border-0 bg-[#f1f5ff]"
          onClick={() => resetCase(caseId, demoActor)}
        >
          <RotateCcw className="size-4" />
          데모 초기화
        </Button>

          <div className="mt-4 grid gap-2">
            <SummaryCard label="전체 진행률" value={`${progress}%`} helper={`${doneItems}/${totalItems} 항목 완료`} />
            <SummaryCard
              label="현재 단계 상태"
              value={selected.status}
              helper={`필수 완료 ${requiredCompleted}/${requiredTotal}`}
            />
            <SummaryCard
              label="단계 완료 정보"
              value={selected.completedAt ? "완료" : "미완료"}
              helper={selected.completedAt ? `${selected.completedBy} | ${selected.completedAt}` : "아직 완료 처리 전"}
            />
          </div>
          <div className="mt-3 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700">
            진행 원칙: Sign In 필수 완료 → Time Out 진행 → Time Out 필수 완료 → Sign Out 진행
          </div>
      </SectionCard>

      <SectionCard title="단계 선택">
          <div className="mt-3 space-y-2">
            {checklistStageOrder.map((stage) => {
              const stageState = caseState.stages[stage];
              const blockedReason = stageGateMessages[stage];
              return (
                <ChecklistStageCard
                  key={stage}
                  onClick={() => handleSelectStage(stage)}
                  title={stage}
                  active={selectedStage === stage}
                  locked={Boolean(blockedReason)}
                  detail={blockedReason ? `차단: ${blockedReason}` : `상태: ${stageState.status}`}
                />
              );
            })}
          </div>
      </SectionCard>

        {blockMessage && (
          <section className="rounded-xl border border-[var(--app-border)] bg-white p-3">
            <p className="flex items-start gap-2 text-sm text-slate-800">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>차단 사유: {blockMessage}</span>
            </p>
          </section>
        )}

        <section className="grid gap-4">
          <Card className="rounded-[22px] border-0 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedStage} 체크 항목</span>
                <StatusChip label={selected.status} tone={selected.status === "완료" ? "ok" : selected.status === "진행중" ? "info" : "neutral"} />
              </CardTitle>
              <CardDescription>
                필수 항목을 모두 완료해야 다음 단계로 진행할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selected.items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl px-3 py-3 ${
                    item.completed ? "bg-emerald-50" : "bg-[#f4f7ff]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-600">
                        {item.required ? "필수 항목" : "선택 항목"} | 상태: {item.completed ? "완료" : "미완료"}
                      </p>
                      {item.completedAt && (
                        <p className="text-xs text-slate-600">
                          completed by {item.completedBy} / completed at {item.completedAt}
                        </p>
                      )}
                    </div>
                    <Button
                      variant={item.completed ? "secondary" : "outline"}
                      className="h-10 rounded-xl border-0 bg-white"
                      onClick={() => handleToggle(item.id)}
                    >
                      {item.completed ? "완료 취소" : "완료 처리"}
                    </Button>
                  </div>
                </div>
              ))}

              <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-800">
                현재 단계 진행: {completedItems}/{selected.items.length} 항목 완료
              </div>

            </CardContent>
          </Card>

          <Card className="rounded-[22px] border-0 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle>완료 로그 이력</CardTitle>
              <CardDescription>최신순으로 표시됩니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {caseState.logs.length === 0 && (
                <p className="text-sm text-slate-500">아직 기록된 로그가 없습니다.</p>
              )}
              {caseState.logs.map((log) => (
                <div key={log.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-900">{log.action}</p>
                  <p className="text-xs text-slate-700">{log.detail}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {log.stage} | {log.actor} | {log.timestamp}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

      <BottomCTABar label={`${selectedStage} 단계 완료 처리`} onClick={handleCompleteStage} />
    </MobileFrame>
  );
}

function SummaryCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-xl bg-[#f4f7ff] px-3 py-3">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </div>
  );
}
