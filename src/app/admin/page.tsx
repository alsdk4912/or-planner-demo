"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import {
  checklistTemplateMocks,
  completionLogMocks,
  equipmentLocationMocks,
  manualVersionMocks,
  surgeonPreferenceMocks,
  surgeryTemplateMocks,
} from "@/data/admin-mock";
import { AppCard, BlueHero, MobileAppShell } from "@/components/mobile/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function nowLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

export default function AdminPage() {
  const [surgeryTemplates, setSurgeryTemplates] = useState(surgeryTemplateMocks);
  const [surgeonPrefs, setSurgeonPrefs] = useState(surgeonPreferenceMocks);
  const [equipmentLocations, setEquipmentLocations] = useState(equipmentLocationMocks);
  const [checklistTemplates, setChecklistTemplates] = useState(checklistTemplateMocks);
  const [manualVersions, setManualVersions] = useState(manualVersionMocks);
  const [completionLogs] = useState(completionLogMocks);
  const [selectedSurgeonForTimeline, setSelectedSurgeonForTimeline] = useState("김도윤 교수");
  const [lastSavedAt, setLastSavedAt] = useState<string>("미저장");

  const timelineInsight = useMemo(() => {
    const base = {
      "김도윤 교수": { avgReadyMin: 15, top10ReadyMin: 12, delayRate: 8 },
      "이승민 교수": { avgReadyMin: 18, top10ReadyMin: 14, delayRate: 12 },
      "정태훈 교수": { avgReadyMin: 21, top10ReadyMin: 16, delayRate: 16 },
    } as const;
    return base[selectedSurgeonForTimeline as keyof typeof base] ?? base["김도윤 교수"];
  }, [selectedSurgeonForTimeline]);

  const counts = useMemo(
    () => ({
      surgeryTemplate: surgeryTemplates.length,
      surgeonPreference: surgeonPrefs.length,
      equipmentLocation: equipmentLocations.length,
      checklistTemplate: checklistTemplates.length,
      manualVersion: manualVersions.length,
      completionLog: completionLogs.length,
    }),
    [
      surgeryTemplates.length,
      surgeonPrefs.length,
      equipmentLocations.length,
      checklistTemplates.length,
      manualVersions.length,
      completionLogs.length,
    ],
  );

  const saveMock = () => {
    setLastSavedAt(nowLabel());
  };

  return (
    <MobileAppShell>
      <BlueHero title="관리자 화면" subtitle="운영 템플릿과 이력을 카드형으로 관리합니다." />
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-600">
        <ArrowLeft className="size-3.5" /> 대시보드로 돌아가기
      </Link>
      <AppCard>
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
            마지막 저장 시각: {lastSavedAt}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniStat label="수술 템플릿" value={`${counts.surgeryTemplate}개`} />
            <MiniStat label="교수 선호" value={`${counts.surgeonPreference}개`} />
            <MiniStat label="장비 위치" value={`${counts.equipmentLocation}개`} />
            <MiniStat label="체크리스트" value={`${counts.checklistTemplate}개`} />
            <MiniStat label="매뉴얼 버전" value={`${counts.manualVersion}개`} />
            <MiniStat label="완료 로그" value={`${counts.completionLog}건`} />
          </div>
      </AppCard>

      <AppCard title="수술 템플릿">
                {surgeryTemplates.map((item, index) => (
                  <div key={item.id} className="mb-2 grid gap-2 rounded-xl border border-[var(--app-border)] p-3">
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        setSurgeryTemplates((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)),
                        )
                      }
                    />
                    <Input
                      value={item.department}
                      onChange={(e) =>
                        setSurgeryTemplates((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, department: e.target.value } : row)),
                        )
                      }
                    />
                    <Input
                      type="number"
                      value={item.expectedDurationMin}
                      onChange={(e) =>
                        setSurgeryTemplates((prev) =>
                          prev.map((row, i) =>
                            i === index ? { ...row, expectedDurationMin: Number(e.target.value) } : row,
                          ),
                        )
                      }
                    />
                    <Input
                      value={item.status}
                      onChange={(e) =>
                        setSurgeryTemplates((prev) =>
                          prev.map((row, i) =>
                            i === index ? { ...row, status: e.target.value as "사용중" | "검토필요" } : row,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
                <SaveButton onClick={saveMock} />
      </AppCard>

      <AppCard title="교수별 선호">
                {surgeonPrefs.map((item, index) => (
                  <div key={item.surgeon} className="mb-2 space-y-2 rounded-xl border border-[var(--app-border)] p-3">
                    <div className="grid gap-2">
                      <Input
                        value={item.surgeon}
                        onChange={(e) =>
                          setSurgeonPrefs((prev) =>
                            prev.map((row, i) => (i === index ? { ...row, surgeon: e.target.value } : row)),
                          )
                        }
                      />
                      <Input
                        value={item.focus}
                        onChange={(e) =>
                          setSurgeonPrefs((prev) =>
                            prev.map((row, i) => (i === index ? { ...row, focus: e.target.value } : row)),
                          )
                        }
                      />
                      <Input
                        value={item.version}
                        onChange={(e) =>
                          setSurgeonPrefs((prev) =>
                            prev.map((row, i) => (i === index ? { ...row, version: e.target.value } : row)),
                          )
                        }
                      />
                    </div>
                    <Textarea
                      value={item.note}
                      onChange={(e) =>
                        setSurgeonPrefs((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, note: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                ))}
                <SaveButton onClick={saveMock} />
      </AppCard>

      <AppCard title="장비 위치">
                {equipmentLocations.map((item, index) => (
                  <div key={`${item.equipment}-${index}`} className="mb-2 grid gap-2 rounded-xl border border-[var(--app-border)] p-3">
                    <Input
                      value={item.equipment}
                      onChange={(e) =>
                        setEquipmentLocations((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, equipment: e.target.value } : row)),
                        )
                      }
                    />
                    <Input
                      value={item.location}
                      onChange={(e) =>
                        setEquipmentLocations((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, location: e.target.value } : row)),
                        )
                      }
                    />
                    <Input
                      value={item.manager}
                      onChange={(e) =>
                        setEquipmentLocations((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, manager: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                ))}
                <SaveButton onClick={saveMock} />
      </AppCard>

      <AppCard title="체크리스트 템플릿">
                {checklistTemplates.map((item, index) => (
                  <div key={item.stage} className="mb-2 grid gap-2 rounded-xl border border-[var(--app-border)] p-3">
                    <Input value={item.stage} readOnly />
                    <Input
                      type="number"
                      value={item.requiredCount}
                      onChange={(e) =>
                        setChecklistTemplates((prev) =>
                          prev.map((row, i) =>
                            i === index ? { ...row, requiredCount: Number(e.target.value) } : row,
                          ),
                        )
                      }
                    />
                    <Input
                      type="number"
                      value={item.optionalCount}
                      onChange={(e) =>
                        setChecklistTemplates((prev) =>
                          prev.map((row, i) =>
                            i === index ? { ...row, optionalCount: Number(e.target.value) } : row,
                          ),
                        )
                      }
                    />
                    <Input
                      value={item.version}
                      onChange={(e) =>
                        setChecklistTemplates((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, version: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                ))}
                <SaveButton onClick={saveMock} />
      </AppCard>

      <AppCard title="매뉴얼 버전">
                {manualVersions.map((item, index) => (
                  <div key={`${item.surgeryType}-${index}`} className="mb-2 grid gap-2 rounded-xl border border-[var(--app-border)] p-3">
                    <Input
                      value={item.surgeryType}
                      onChange={(e) =>
                        setManualVersions((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, surgeryType: e.target.value } : row)),
                        )
                      }
                    />
                    <Input
                      value={item.version}
                      onChange={(e) =>
                        setManualVersions((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, version: e.target.value } : row)),
                        )
                      }
                    />
                    <Input
                      value={item.updatedAt}
                      onChange={(e) =>
                        setManualVersions((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, updatedAt: e.target.value } : row)),
                        )
                      }
                    />
                    <Input
                      value={item.owner}
                      onChange={(e) =>
                        setManualVersions((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, owner: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                ))}
                <SaveButton onClick={saveMock} />
      </AppCard>

      <AppCard title="완료 로그">
                {completionLogs.map((log) => (
                  <div key={`${log.caseId}-${log.stage}-${log.completedAt}`} className="mb-2 rounded-xl border border-[var(--app-border)] bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {log.caseId} | {log.stage}
                    </p>
                    <p className="mt-1 text-xs text-slate-700">
                      완료자: {log.actor} / 완료시각: {log.completedAt}
                    </p>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        log.result === "정상 완료" ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      결과: {log.result}
                    </p>
                  </div>
                ))}
      </AppCard>

      <AppCard title="수술별 표준 타임라인 분석">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-700">분석 대상 교수</p>
          <select
            value={selectedSurgeonForTimeline}
            onChange={(event) => setSelectedSurgeonForTimeline(event.target.value)}
            className="mt-2 h-10 w-full rounded-lg border border-blue-200 bg-white px-2 text-sm"
          >
            {["김도윤 교수", "이승민 교수", "정태훈 교수"].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {selectedSurgeonForTimeline}의 평균 수술 준비 시간은 {timelineInsight.avgReadyMin}분이며, 상위 10% 숙련 간호사는{" "}
            {timelineInsight.top10ReadyMin}분 만에 완료함
          </p>
          <p className="mt-1 text-xs text-slate-600">
            지연 케이스 비율 {timelineInsight.delayRate}% · 표준 템플릿 기반 간극 자동 학습 중
          </p>
        </div>
      </AppCard>
    </MobileAppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <Button onClick={onClick}>
        <Save className="size-4" />
        변경사항 저장(모의)
      </Button>
    </div>
  );
}
