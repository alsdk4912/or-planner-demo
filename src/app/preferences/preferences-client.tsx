"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, BriefcaseMedical, Landmark } from "lucide-react";

import { AppCard, BlueHero, MobileAppShell } from "@/components/mobile/app-shell";
import {
  allPreferenceSurgeons,
  getPreferenceProfileBySurgeon,
  surgeonPreferenceProfiles,
} from "@/data/surgeon-preferences";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SurgeonPreferenceComparisonClient() {
  const searchParams = useSearchParams();
  const [surgeon, setSurgeon] = useState<string>(allPreferenceSurgeons[0] ?? "");
  const querySurgeon = searchParams.get("surgeon");
  const selectedSurgeon =
    querySurgeon && allPreferenceSurgeons.includes(querySurgeon) ? querySurgeon : surgeon;
  const profile = useMemo(() => getPreferenceProfileBySurgeon(selectedSurgeon), [selectedSurgeon]);

  if (!profile) {
    return null;
  }

  return (
    <MobileAppShell>
      <BlueHero title="교수별 선호 비교" subtitle="표준과 변형을 분리해 간호 편차를 줄입니다." />
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-600">
        <ArrowLeft className="size-3.5" /> 대시보드로 돌아가기
      </Link>
      <AppCard>
        <div className="w-full space-y-1">
          <p className="text-xs font-medium text-slate-500">교수 선택</p>
          <Select value={selectedSurgeon} onValueChange={(v) => v != null && setSurgeon(v)}>
            <SelectTrigger className="h-10 w-full bg-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allPreferenceSurgeons.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 grid gap-3">
          <ValueCard title="진료과" value={profile.department} />
          <ValueCard title="집중 수술 영역" value={profile.procedureFocus} />
          <ValueCard title="관리 중 선호 프로토콜" value={`${profile.comparisonRows.length}개 항목`} />
        </div>
      </AppCard>

      <AppCard title="사업적 가치">
        <div className="flex items-center gap-2">
          <Landmark className="size-4 text-blue-700" />
          <h2 className="text-sm font-semibold text-blue-900">사업적 가치</h2>
        </div>
        <ul className="mt-3 space-y-2">
          <li className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700">
            표준 vs 변형을 분리 표시해 신규/숙련 간호사 모두 같은 기준으로 준비
          </li>
          <li className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700">
            교수별 요구사항을 구조화해 누락/재세팅으로 인한 준비 지연 감소
          </li>
          <li className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700">
            케이스 전 브리핑 품질을 균질화해 팀 커뮤니케이션 편차 완화
          </li>
          <li className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700">
            병원 운영 관점에서 프로토콜 관리 체계가 있다는 신뢰 확보
          </li>
        </ul>
      </AppCard>

      <section className="space-y-3 pb-2">
        {profile.comparisonRows.map((row) => (
          <Card key={row.category} className="rounded-[var(--app-radius-lg)] border-[var(--app-border)]">
            <CardHeader>
              <CardTitle className="text-base">{row.category}</CardTitle>
              <CardDescription>표준과 변형을 동시에 확인해 실무 편차를 줄입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-semibold text-emerald-800">좌측: 표준 프로토콜</p>
                  <p className="mt-1 text-sm text-slate-800">{row.standardProtocol}</p>
                </div>
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800">우측: 교수별 변형사항</p>
                  <p className="mt-1 text-sm text-slate-800">{row.surgeonVariant}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <MetaBox label="주의사항" value={row.caution} tone="rose" />
                <MetaBox label="준비 영향" value={row.prepImpact} tone="blue" />
                <MetaBox label="장비 영향" value={row.equipmentImpact} tone="indigo" />
                <MetaBox label="커뮤니케이션 팁" value={row.communicationTip} tone="slate" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-white p-4">
        <p className="flex items-center gap-2 text-sm text-slate-700">
          <BriefcaseMedical className="size-4 text-blue-700" />
          총 {surgeonPreferenceProfiles.length}명 교수의 선호 프로토콜 템플릿을 운영 중입니다.
        </p>
      </section>
    </MobileAppShell>
  );
}

function ValueCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function MetaBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "rose" | "blue" | "indigo" | "slate";
}) {
  const style =
    tone === "rose"
      ? "border-rose-200 bg-rose-50 text-rose-900"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-900"
        : tone === "indigo"
          ? "border-indigo-200 bg-indigo-50 text-indigo-900"
          : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div className={`rounded-md border px-3 py-2 ${style}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
