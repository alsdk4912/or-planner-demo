"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Camera, ChevronDown, ChevronUp, Clock3 } from "lucide-react";

import { AppTabBar, HeaderHero, MobileFrame, SectionCard, StatusChip } from "@/components/mobile/design-system";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allOperatingRooms, allSurgeons, surgeryCases } from "@/data/mock-surgeries";
import { getCaseItemStatus } from "@/lib/inventory-engine";
import type { UrgencyLevel } from "@/types/dashboard";

const urgencyOptions: Array<UrgencyLevel | "전체"> = ["전체", "일반", "긴급", "응급"];

export default function SchedulePage() {
  const [roomFilter, setRoomFilter] = useState("전체");
  const [surgeonFilter, setSurgeonFilter] = useState("전체");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | "전체">("전체");
  const [showPlannedList, setShowPlannedList] = useState(false);

  const items = useMemo(
    () =>
      surgeryCases.filter(
        (item) =>
          (roomFilter === "전체" || item.operatingRoom === roomFilter) &&
          (surgeonFilter === "전체" || item.surgeon === surgeonFilter) &&
          (urgencyFilter === "전체" || item.urgency === urgencyFilter),
      ),
    [roomFilter, surgeonFilter, urgencyFilter],
  );

  const inProgressItems = items.filter((item) => item.surgeryStatus === "준비중" || item.surgeryStatus === "지연위험");
  const plannedItems = items.filter((item) => !inProgressItems.some((live) => live.id === item.id));

  return (
    <MobileFrame>
      <HeaderHero title="수술 일정" subtitle="진행 수술 우선 표시 · 상단 고정 필터" right={<StatusChip label={`${items.length}건`} tone="info" />} />
      <section className="sticky top-2 z-20 rounded-[22px] border border-blue-100 bg-white/95 p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] backdrop-blur">
        <p className="text-base font-semibold text-slate-900">필터</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <FilterSelect value={roomFilter} onChange={setRoomFilter} options={["전체", ...allOperatingRooms]} placeholder="수술실 방" />
          <FilterSelect value={surgeonFilter} onChange={setSurgeonFilter} options={["전체", ...allSurgeons]} placeholder="교수명" />
          <FilterSelect value={urgencyFilter} onChange={(v) => setUrgencyFilter(v as UrgencyLevel | "전체")} options={urgencyOptions} placeholder="긴급도" />
        </div>
      </section>

      <SectionCard title="현재 진행 수술">
        <div className="space-y-2">
          {inProgressItems.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#f4f7ff] p-3">
              {(() => {
                const risks = getCaseItemStatus(item.id);
                const shortage = risks.some((r) => r.risk === "부족");
                const warning = risks.some((r) => r.risk === "부족 우려" || r.lot_status === "임박" || r.lot_status === "재멸균 필요");
                return (
                  <div className="mb-1 flex justify-end">
                    {(shortage || warning) && (
                      <StatusChip label={shortage ? "재고 부족 영향" : "재고 주의"} tone={shortage ? "danger" : "warn"} />
                    )}
                  </div>
                );
              })()}
              <div className="flex items-center justify-between gap-2">
                <Link href={`/cases/${item.id}/`} className="text-sm font-semibold text-slate-900 hover:underline">
                  {item.surgeryName}
                </Link>
                <StatusChip
                  label={item.preparationStatus}
                  tone={item.preparationStatus === "누락" ? "danger" : item.preparationStatus === "검토필요" ? "warn" : "ok"}
                />
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                <Clock3 className="size-3.5" /> {item.scheduledTime} · {item.operatingRoom} · {item.assignedNurse}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Link href={`/cases/${item.id}/`} className="rounded-xl bg-white px-2 py-2 text-center text-xs font-semibold text-slate-700">
                  상세
                </Link>
                <Link href={`/cases/${item.id}/checklist/`} className="rounded-xl bg-blue-600 px-2 py-2 text-center text-xs font-semibold text-white">
                  체크리스트
                </Link>
                <Link href={`/notes?caseId=${encodeURIComponent(item.id)}`} className="rounded-xl bg-slate-200 px-2 py-2 text-center text-xs font-semibold text-slate-700">
                  기록/메모
                </Link>
              </div>
            </div>
          ))}
          {inProgressItems.length === 0 && <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">조건에 맞는 진행 수술이 없습니다.</p>}
        </div>
      </SectionCard>

      <SectionCard title="예정 수술">
        <button
          type="button"
          onClick={() => setShowPlannedList((prev) => !prev)}
          className="mb-2 inline-flex w-full items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
        >
          예정 수술 {plannedItems.length}건
          {showPlannedList ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        {showPlannedList && (
          <div className="space-y-2 pb-24">
            {plannedItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-sm font-semibold text-slate-900">{item.surgeryName}</p>
                <p className="mt-1 text-xs text-slate-600">{item.scheduledTime} · {item.operatingRoom} · {item.surgeon}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <Link
        href="/sterilization"
        className="fixed bottom-24 right-4 z-30 inline-flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)]"
      >
        <Camera className="size-5" />
      </Link>
      <AppTabBar currentPath="/schedule" />
    </MobileFrame>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger aria-label={placeholder} className="h-10 w-full rounded-xl border-0 bg-[#f3f6ff] px-2 text-xs text-slate-700">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
