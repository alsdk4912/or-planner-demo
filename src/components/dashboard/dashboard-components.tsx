import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, Clock3, ShieldAlert, Siren, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import type { PreparationStatus, SurgeryCase } from "@/types/dashboard";

const prepStatusStyleMap: Record<PreparationStatus, string> = {
  준비완료: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  검토필요: "bg-amber-50 text-amber-700 ring-amber-200",
  누락: "bg-rose-50 text-rose-700 ring-rose-200",
  중요: "bg-blue-50 text-blue-700 ring-blue-200",
};

export function SummaryStatCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="bg-white ring-slate-200">
      <CardHeader>
        <CardDescription className="text-slate-600">{title}</CardDescription>
        <CardTitle className="text-3xl font-semibold text-slate-900">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-xs text-slate-500">{helper}</CardContent>
    </Card>
  );
}

export function PrepStatusBadge({ status }: { status: PreparationStatus }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold ring-1 ${prepStatusStyleMap[status]}`}
    >
      {status}
    </span>
  );
}

export function ChecklistProgressBar({ completed, total }: { completed: number; total: number }) {
  const value = Math.round((completed / total) * 100);
  return (
    <div className="space-y-1">
      <Progress value={value}>
        <ProgressLabel className="text-xs text-slate-500">체크리스트 진행률</ProgressLabel>
        <ProgressValue>{value}%</ProgressValue>
      </Progress>
      <p className="text-xs text-slate-500">
        {completed}/{total} 항목 완료
      </p>
    </div>
  );
}

function AlertPill({
  label,
  tone,
  icon,
}: {
  label: string;
  tone: "danger" | "warning" | "info";
  icon: ReactNode;
}) {
  const className =
    tone === "danger"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-blue-50 text-blue-700 ring-blue-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ring-1 ${className}`}>
      {icon}
      {label}
    </span>
  );
}

export function SurgeryCard({ surgery }: { surgery: SurgeryCase }) {
  const checklistProgress = Math.round(
    (surgery.checklist.completedCount / surgery.checklist.totalCount) * 100,
  );
  const immediateAction = surgery.flags.missingSupplies
    ? "누락 준비물 보충 후 Sign In 재검증 필요"
    : surgery.flags.delayedPreparation
      ? "준비 지연 원인 확인 및 우선순위 재조정 필요"
      : surgery.checklist.blockedByStage !== "없음"
        ? `${surgery.checklist.blockedByStage} 해결 후 다음 단계 진행`
        : "현 단계 유지, 다음 단계 브리핑 준비";

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">{surgery.surgeryName}</CardTitle>
            <CardDescription className="mt-1 text-xs text-slate-500">{surgery.id}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <PrepStatusBadge status={surgery.preparationStatus} />
            <Badge
              variant="outline"
              className={
                surgery.urgency === "응급"
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : surgery.urgency === "긴급"
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-slate-50 text-slate-700"
              }
            >
              {surgery.urgency}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {surgery.flags.missingSupplies && (
            <AlertPill label="준비물 누락" tone="danger" icon={<AlertTriangle className="size-3" />} />
          )}
          {surgery.flags.emergency && (
            <AlertPill label="응급/긴급 우선 대응" tone="danger" icon={<Siren className="size-3" />} />
          )}
          {surgery.flags.delayedPreparation && (
            <AlertPill label="준비 지연" tone="warning" icon={<Clock3 className="size-3" />} />
          )}
          {surgery.flags.checklistBlocked && (
            <AlertPill label="체크리스트 차단" tone="info" icon={<ShieldAlert className="size-3" />} />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3 text-slate-700 md:grid-cols-4">
          <DataRow label="수술실" value={surgery.operatingRoom} />
          <DataRow label="예정시간" value={surgery.scheduledTime} />
          <DataRow label="예상 소요" value={`${surgery.estimatedDurationMin}분`} />
          <DataRow label="담당 간호사" value={surgery.assignedNurse} />
          <DataRow label="진료과" value={surgery.department} />
          <DataRow label="교수/집도의" value={surgery.surgeon} />
          <DataRow label="진행 상태" value={surgery.surgeryStatus} />
          <DataRow
            label="단계 차단"
            value={surgery.checklist.blockedByStage}
            valueClassName={
              surgery.checklist.blockedByStage === "없음"
                ? "text-emerald-700"
                : "inline-flex items-center gap-1 text-blue-700"
            }
            icon={surgery.checklist.blockedByStage === "없음" ? null : <TriangleAlert className="size-3" />}
          />
        </div>

        <ChecklistProgressBar
          completed={surgery.checklist.completedCount}
          total={surgery.checklist.totalCount}
        />

        <p className="text-xs text-slate-500">
          현재 케이스는 체크리스트 {checklistProgress}% 진행 상태입니다.
        </p>
        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
          <p className="text-xs font-semibold text-blue-900">지금 필요한 대응</p>
          <p className="mt-1 text-sm text-blue-800">{immediateAction}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end border-slate-100 bg-slate-50/80">
        <Link
          href={`/cases/${surgery.id}`}
          className="inline-flex h-8 items-center rounded-md border border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-700 hover:bg-blue-100"
        >
          케이스 상세 보기
        </Link>
      </CardFooter>
    </Card>
  );
}

function DataRow({
  label,
  value,
  valueClassName,
  icon,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-medium text-slate-800 ${valueClassName ?? ""}`}>
        {icon}
        {value}
      </p>
    </div>
  );
}
