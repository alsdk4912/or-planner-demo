"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Brain, Clock3, PackageSearch, ShieldAlert, ShoppingCart } from "lucide-react";

import {
  AppTabBar,
  HeaderHero,
  MobileFrame,
  SectionCard,
  StatusChip,
} from "@/components/mobile/design-system";
import { surgeryCases } from "@/data/mock-surgeries";
import { getInventoryDashboardStats, getRecommendationForItem } from "@/lib/inventory-engine";
import { itemMasters } from "@/data/inventory-mock";

export default function DashboardPage() {
  const summary = useMemo(() => {
    const total = surgeryCases.length;
    const emergencyCount = surgeryCases.filter((item) => item.urgency === "응급").length;
    const inProgressCount = surgeryCases.filter(
      (item) => item.surgeryStatus === "준비중" || item.surgeryStatus === "지연위험",
    ).length;
    return { total, emergencyCount, inProgressCount };
  }, []);

  const urgentCases = useMemo(
    () =>
      surgeryCases
        .filter((item) => item.flags.missingSupplies || item.flags.emergency || item.checklist.blockedByStage !== "없음")
        .slice(0, 5),
    [],
  );

  const inventoryStats = useMemo(() => getInventoryDashboardStats(), []);
  const orderNeedCount = inventoryStats.orderNeeded;
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(new Date()),
    [],
  );

  const upcomingSurgeries = useMemo(
    () =>
      [...surgeryCases]
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
        .slice(0, 3),
    [],
  );

  const urgentRecommendations = useMemo(
    () =>
      itemMasters
        .map((item) => ({ item, rec: getRecommendationForItem(item.item_id) }))
        .filter((x) => x.rec.urgent_order_required)
        .slice(0, 2),
    [],
  );

  return (
    <MobileFrame>
      <HeaderHero title="오늘 수술실 상황판" subtitle={todayLabel} right={<StatusChip label={`발주 ${orderNeedCount}건`} tone="warn" />}>
        <div className="grid grid-cols-4 gap-2">
          <HeroChip label="오늘 수술" value={`${summary.total}`} />
          <HeroChip label="응급" value={`${summary.emergencyCount}`} />
          <HeroChip label="진행 중" value={`${summary.inProgressCount}`} />
          <HeroChip label="발주 필요" value={`${orderNeedCount}`} />
        </div>
      </HeaderHero>

      <SectionCard title="핵심 KPI">
        <div className="grid grid-cols-3 gap-2">
          <KpiCard label="오늘 수술" value={summary.total} tone="info" />
          <KpiCard label="재고 부족" value={inventoryStats.shortage} tone={inventoryStats.shortage > 0 ? "danger" : "ok"} />
          <KpiCard label="유효기간 임박" value={inventoryStats.soonExpiry} tone={inventoryStats.soonExpiry > 0 ? "warn" : "ok"} />
          <KpiCard label="멸균 만료 예정" value={inventoryStats.sterilizationDue} tone={inventoryStats.sterilizationDue > 0 ? "warn" : "ok"} />
          <KpiCard label="자동발주 추천" value={inventoryStats.orderNeeded} tone={inventoryStats.orderNeeded > 0 ? "warn" : "ok"} />
          <KpiCard label="긴급 대응 필요" value={urgentRecommendations.length} tone={urgentRecommendations.length > 0 ? "danger" : "ok"} />
        </div>
      </SectionCard>

      <SectionCard title="오늘의 핵심 액션">
        <div className="grid grid-cols-2 gap-2">
          <QuickAction href="/inventory" label="재고 부족 품목" icon={<PackageSearch className="size-4" />} />
          <QuickAction href="/inventory" label="AI 재고추천" icon={<Brain className="size-4" />} />
          <QuickAction href="/procurement" label="발주 추천" icon={<ShoppingCart className="size-4" />} />
          <QuickAction href="/schedule" label="긴급 수술 대응" icon={<ShieldAlert className="size-4" />} />
          <QuickAction href="/sterilization" label="유효기간 임박" icon={<AlertTriangle className="size-4" />} />
        </div>
      </SectionCard>

      <SectionCard title="긴급 / 주의" subtitle="가장 시급한 3건">
        <div className="space-y-2">
          {urgentCases.slice(0, 3).map((item) => (
            <Link key={item.id} href={`/cases/${item.id}`} className="block rounded-2xl border border-rose-100 bg-rose-50 p-3">
              <p className="text-sm font-semibold text-rose-700">{item.surgeryName}</p>
              <p className="mt-1 text-xs text-rose-700">
                {item.scheduledTime} · {item.operatingRoom} · {item.checklist.blockedByStage}
              </p>
            </Link>
          ))}
          <Link href="/schedule" className="block text-right text-xs font-semibold text-blue-700">
            더보기
          </Link>
        </div>
      </SectionCard>

      <SectionCard title="AI 인사이트">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
            다음주 정형외과 수술 증가로 봉합사 사용량 증가가 예상됩니다.
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
            이번 주 멸균 만료 품목 {inventoryStats.sterilizationDue}건으로 우선 사용/재멸균 처리가 필요합니다.
          </div>
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-800">
            일부 공급사의 납기 지연 위험이 있어 대체 발주 검토가 필요합니다.
          </div>
        </div>
      </SectionCard>

      <SectionCard title="다가오는 수술 3건">
        <div className="space-y-2">
          {upcomingSurgeries.map((surgery) => (
            <Link key={surgery.id} href={`/cases/${surgery.id}`} className="block rounded-2xl bg-[#f4f7ff] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{surgery.surgeryName}</p>
                <StatusChip label={surgery.urgency} tone={surgery.urgency === "응급" ? "danger" : surgery.urgency === "긴급" ? "warn" : "info"} />
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                <Clock3 className="size-3.5" /> {surgery.scheduledTime} · {surgery.operatingRoom}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <AppTabBar currentPath="/" />
    </MobileFrame>
  );
}

function HeroChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-2 py-2">
      <p className="text-[11px] text-blue-100">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "danger" | "info";
}) {
  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-slate-50 px-2 py-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-600">{label}</p>
        <StatusChip label={tone === "ok" ? "정상" : tone === "warn" ? "주의" : tone === "danger" ? "위험" : "정보"} tone={tone} />
      </div>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#eef3ff] px-2 py-3 text-xs font-semibold text-slate-800">
      {icon}
      {label}
    </Link>
  );
}
