import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, BarChart3, CheckCircle2, ClipboardList, Eye, GraduationCap, Users } from "lucide-react";

import { AppCard, BlueHero, MobileAppShell } from "@/components/mobile/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { completionLogMocks } from "@/data/admin-mock";
import { surgeryCases } from "@/data/mock-surgeries";
import { surgeonPreferenceProfiles } from "@/data/surgeon-preferences";

export default function KpiPage() {
  const totalChecklistItems = surgeryCases.reduce(
    (acc, item) => acc + item.checklist.totalCount,
    0,
  );
  const completedChecklistItems = surgeryCases.reduce(
    (acc, item) => acc + item.checklist.completedCount,
    0,
  );
  const checklistCompletionRate = Math.round((completedChecklistItems / totalChecklistItems) * 100);

  const currentMissingCases = surgeryCases.filter(
    (item) => item.flags.missingSupplies,
  ).length;
  const baselineMissingCases = 9; // 데모 기준(도입 전 평균)
  const missingReductionRate = Math.round(
    ((baselineMissingCases - currentMissingCases) / baselineMissingCases) * 100,
  );

  const baselineLookupMin = 6.5;
  const currentLookupMin = 3.1;
  const lookupReduceRate = Math.round(
    ((baselineLookupMin - currentLookupMin) / baselineLookupMin) * 100,
  );

  const visibleReadinessCases = surgeryCases.filter(
    (item) => item.preparationStatus !== "검토필요",
  ).length;
  const readinessVisibilityRate = Math.round((visibleReadinessCases / surgeryCases.length) * 100);

  const onboardingBaselineDays = 18;
  const onboardingCurrentDays = 12;
  const onboardingImproveRate = Math.round(
    ((onboardingBaselineDays - onboardingCurrentDays) / onboardingBaselineDays) * 100,
  );

  const managedProtocolCount = surgeonPreferenceProfiles.reduce(
    (acc, profile) => acc + profile.comparisonRows.length,
    0,
  );

  const normalCompletionRate = Math.round(
    (completionLogMocks.filter((item) => item.result === "정상 완료").length /
      completionLogMocks.length) *
      100,
  );

  return (
    <MobileAppShell>
      <BlueHero title="KPI 요약" subtitle="수술실 표준화 운영 효과를 간결하게 확인합니다." />
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-600">
        <ArrowLeft className="size-3.5" /> 대시보드로 돌아가기
      </Link>
      <AppCard>
          <p className="text-sm text-slate-600">
            수술실 간호 표준화 도입 효과를 데모 데이터 기준으로 정리했습니다. 수치는 설명 목적의 mock KPI이며,
            과장 없이 운영 관점에서 해석 가능하도록 구성했습니다.
          </p>
      </AppCard>

        <section className="grid gap-3">
          <KpiCard
            icon={<CheckCircle2 className="size-4 text-emerald-700" />}
            title="체크리스트 완료율"
            value={`${checklistCompletionRate}%`}
            detail={`${completedChecklistItems}/${totalChecklistItems} 항목 완료`}
          />
          <KpiCard
            icon={<ClipboardList className="size-4 text-blue-700" />}
            title="준비 누락 감소 효과"
            value={`${missingReductionRate}% 개선`}
            detail={`도입 전 ${baselineMissingCases}건 → 현재 ${currentMissingCases}건`}
          />
          <KpiCard
            icon={<BarChart3 className="size-4 text-indigo-700" />}
            title="준비 정보 조회 시간 단축"
            value={`${lookupReduceRate}% 단축`}
            detail={`평균 ${baselineLookupMin}분 → ${currentLookupMin}분`}
          />
          <KpiCard
            icon={<Eye className="size-4 text-sky-700" />}
            title="수술실 준비 현황 가시성"
            value={`${readinessVisibilityRate}%`}
            detail={`${visibleReadinessCases}/${surgeryCases.length} 케이스 상태 추적 가능`}
          />
          <KpiCard
            icon={<GraduationCap className="size-4 text-violet-700" />}
            title="신규 간호사 온보딩 지원 효과"
            value={`${onboardingImproveRate}% 단축`}
            detail={`독립 수행까지 평균 ${onboardingBaselineDays}일 → ${onboardingCurrentDays}일`}
          />
          <KpiCard
            icon={<Users className="size-4 text-amber-700" />}
            title="관리 중인 교수별 프로토콜 수"
            value={`${managedProtocolCount}개`}
            detail={`${surgeonPreferenceProfiles.length}명 교수 선호 항목 체계화`}
          />
        </section>

        <section className="grid gap-3 pb-2">
          <Card className="rounded-[var(--app-radius-lg)] border-[var(--app-border)]">
            <CardHeader>
              <CardTitle className="text-base">운영 관점 해석</CardTitle>
              <CardDescription>과장 없는 해석 문구</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>체크리스트 완료율 {checklistCompletionRate}%는 단계 게이팅 준수 기반의 현재 운영 수준을 보여줍니다.</p>
              <p>준비 누락 건수 감소는 재료/장비/선호정보의 선제 확인 체계가 실제 준비 품질에 기여함을 시사합니다.</p>
              <p>조회 시간 단축은 바쁜 수술실 환경에서 간호사의 탐색 부담을 줄이는 실무 가치로 연결됩니다.</p>
            </CardContent>
          </Card>

          <Card className="rounded-[var(--app-radius-lg)] border-[var(--app-border)]">
            <CardHeader>
              <CardTitle className="text-base">품질 신뢰 지표</CardTitle>
              <CardDescription>감사/운영 보고에 활용 가능한 요약</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>완료 로그 기준 정상 완료 비율: {normalCompletionRate}%</p>
              <p>프로토콜은 표준과 교수별 변형을 분리 관리하여 신규 인력 인수인계 리스크를 낮춥니다.</p>
              <p>이 화면은 의사결정 회의에서 “운영 가시성 + 표준화 실행력”을 설명하기 위한 데모 리포트입니다.</p>
            </CardContent>
          </Card>
        </section>
    </MobileAppShell>
  );
}

function KpiCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="rounded-[var(--app-radius-lg)] border-[var(--app-border)]">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2 text-slate-600">
          {icon}
          {title}
        </CardDescription>
        <CardTitle className="text-2xl text-slate-900">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-xs text-slate-600">{detail}</CardContent>
    </Card>
  );
}
