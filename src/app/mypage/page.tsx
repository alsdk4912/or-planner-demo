"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AppTabBar, HeaderHero, MobileFrame, SectionCard } from "@/components/mobile/design-system";

const skillMetrics = [
  { label: "준비 속도", value: 84 },
  { label: "체크리스트 이행률", value: 93 },
  { label: "돌발상황 대응", value: 78 },
];

export default function MyPage() {
  const center = 120;
  const radius = 78;
  const angles = [-90, 30, 150];
  const points = skillMetrics
    .map((metric, idx) => {
      const rad = (angles[idx] * Math.PI) / 180;
      const r = (metric.value / 100) * radius;
      return `${center + Math.cos(rad) * r},${center + Math.sin(rad) * r}`;
    })
    .join(" ");

  return (
    <MobileFrame>
      <HeaderHero title="간호사 마이페이지" subtitle="나의 수술 숙련도 데이터" />
      <Link href="/settings/" className="inline-flex items-center gap-1 text-xs text-slate-600">
        <ArrowLeft className="size-3.5" /> 설정으로 돌아가기
      </Link>

      <SectionCard title="나의 수술 숙련도 차트">
        <div className="rounded-2xl border border-blue-100 bg-[#f4f8ff] p-3">
          <svg viewBox="0 0 240 240" className="mx-auto h-64 w-full max-w-[320px]">
            <circle cx="120" cy="120" r="78" fill="none" stroke="#dbeafe" strokeWidth="1" />
            <circle cx="120" cy="120" r="52" fill="none" stroke="#dbeafe" strokeWidth="1" />
            <circle cx="120" cy="120" r="26" fill="none" stroke="#dbeafe" strokeWidth="1" />
            {angles.map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1={120}
                  y1={120}
                  x2={120 + Math.cos(rad) * 78}
                  y2={120 + Math.sin(rad) * 78}
                  stroke="#bfdbfe"
                  strokeWidth="1"
                />
              );
            })}
            <polygon points={points} fill="rgba(37,99,235,0.25)" stroke="#2563eb" strokeWidth="2" />
            {skillMetrics.map((metric, idx) => {
              const rad = (angles[idx] * Math.PI) / 180;
              const x = center + Math.cos(rad) * 92;
              const y = center + Math.sin(rad) * 92;
              return (
                <text key={metric.label} x={x} y={y} textAnchor="middle" className="fill-slate-700 text-[10px] font-semibold">
                  {metric.label}
                </text>
              );
            })}
          </svg>
          <div className="grid grid-cols-3 gap-2">
            {skillMetrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-white px-2 py-2 text-center">
                <p className="text-[11px] text-slate-500">{metric.label}</p>
                <p className="text-lg font-bold text-blue-700">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
      <AppTabBar currentPath="/settings" />
    </MobileFrame>
  );
}
