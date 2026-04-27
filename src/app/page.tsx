"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Camera, HelpCircle, Lock, TriangleAlert, User } from "lucide-react";

import { AppTabBar } from "@/components/mobile/design-system";
import { surgeryCases } from "@/data/mock-surgeries";

type RoleMode = "NURSE_MODE" | "ADMIN_MODE";

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  reorderPoint: number;
}

const initialInventory: InventoryItem[] = [
  { id: "ITEM-001", name: "멸균 봉합사 2-0", stock: 40, reorderPoint: 30 },
  { id: "ITEM-002", name: "복강경 트로카", stock: 16, reorderPoint: 12 },
  { id: "ITEM-003", name: "수술용 거즈", stock: 60, reorderPoint: 45 },
];

export default function DashboardPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [roleMode, setRoleMode] = useState<RoleMode | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [cameraSyncMessage, setCameraSyncMessage] = useState("");
  const [quickHelpOpen, setQuickHelpOpen] = useState(false);
  const [timeOutDoneRooms, setTimeOutDoneRooms] = useState(94);

  const shortageList = useMemo(
    () => inventory.filter((item) => item.stock <= item.reorderPoint),
    [inventory],
  );

  const timeoutRate = useMemo(() => Math.round((timeOutDoneRooms / 98) * 100), [timeOutDoneRooms]);
  const currentSurgery = useMemo(
    () => surgeryCases.find((item) => item.surgeryStatus === "진행중" || item.surgeryStatus === "준비중") ?? surgeryCases[0],
    [],
  );
  const timelineCases = useMemo(
    () => surgeryCases.filter((item) => item.surgeryStatus === "준비중" || item.surgeryStatus === "지연위험").slice(0, 4),
    [],
  );
  const [selectedTimelineCaseId, setSelectedTimelineCaseId] = useState(
    timelineCases[0]?.id ?? currentSurgery.id,
  );
  const selectedTimelineCase = useMemo(
    () => timelineCases.find((item) => item.id === selectedTimelineCaseId) ?? timelineCases[0] ?? currentSurgery,
    [currentSurgery, selectedTimelineCaseId, timelineCases],
  );

  const nextActionHint = useMemo(() => {
    if (selectedTimelineCase.checklist.blockedByStage === "Sign In 미완료") {
      return "다음 진행: 환자/수술부위 확인 후 Sign In 완료";
    }
    if (selectedTimelineCase.checklist.blockedByStage === "Time Out 미완료") {
      return "다음 진행: 팀 브리핑 후 Time Out 완료";
    }
    return "다음 진행: 사용 소모품 스캔 및 Sign Out 기록";
  }, [selectedTimelineCase.checklist.blockedByStage]);

  const login = () => {
    if (userId === "nurse") setRoleMode("NURSE_MODE");
    if (userId === "admin") setRoleMode("ADMIN_MODE");
  };

  const applyConsumption = (itemId: string, qty: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, stock: Math.max(0, item.stock - qty) } : item,
      ),
    );
    setCameraSyncMessage(`OR-V 동기화 완료 · ${itemId} -${qty}`);
    setTimeOutDoneRooms((prev) => Math.min(98, prev + 1));
  };

  const simulateCameraScan = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      applyConsumption("ITEM-003", 10);
    } catch {
      setCameraSyncMessage("카메라 권한 필요: 관리자에게 권한을 요청하세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#101C3A]">
      <main className="mx-auto w-full max-w-[430px] space-y-4 px-4 py-4">
        {!roleMode ? (
          <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_10px_24px_rgba(0,82,204,0.10)]">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-[#101C3A]">
                OR-<span className="bg-gradient-to-b from-[#0052CC] to-[#2DA8FF] bg-clip-text text-transparent">V</span>
              </h1>
              <p className="-mt-1 text-2xl font-black text-[#2DA8FF]">✓</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Surgical Safety, Redefined.</p>
            </div>
            <div className="mt-5 space-y-2">
              <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                <User className="size-4 text-slate-400" />
                <input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="Nurse ID"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                <Lock className="size-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={login}
              className="mt-4 h-12 w-full rounded-full bg-[#0052CC] text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,82,204,0.28)]"
            >
              LOG IN
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">Login with: Fingerprint/Face ID</p>
            <p className="mt-2 rounded-xl bg-blue-50 px-3 py-2 text-center text-xs font-semibold text-blue-700">
              수술실의 새로운 시야, OR-V가 안전을 체크합니다
            </p>
          </section>
        ) : roleMode === "NURSE_MODE" ? (
          <>
            <header className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_8px_20px_rgba(0,82,204,0.10)]">
              <p className="text-xs font-semibold text-slate-500">Current Surgery</p>
              <h1 className="mt-1 text-2xl font-extrabold text-[#101C3A]">Thyroidectomy</h1>
              <p className="text-xs text-slate-600">
                Thyroidectomy · {currentSurgery.surgeon} · {currentSurgery.operatingRoom}
              </p>
              <div className="mt-3 h-2 rounded-full bg-blue-100">
                <div className="h-2 rounded-full bg-[#0052CC]" style={{ width: "58%" }} />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Progress</p>
            </header>
            <section className="rounded-[24px] border border-blue-100 bg-white p-4">
              <button
                type="button"
                onClick={() => void simulateCameraScan()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0052CC] text-sm font-semibold text-white"
              >
                <Camera className="size-4" />
                물품 추가
              </button>
              <div className="mt-3 space-y-1 text-xs text-slate-700">
                {timelineCases.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTimelineCaseId(item.id)}
                    className={`w-full rounded-lg px-2 py-2 text-left ${
                      selectedTimelineCase.id === item.id ? "bg-blue-600 text-white" : "bg-blue-50 text-slate-700"
                    }`}
                  >
                    {item.scheduledTime} {item.surgeryName}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] font-semibold text-blue-700">{nextActionHint}</p>
            </section>
            {cameraSyncMessage && (
              <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold text-emerald-700">{cameraSyncMessage}</p>
              </section>
            )}
            <button
              type="button"
              onClick={() => setQuickHelpOpen(true)}
              className="fixed bottom-24 right-4 inline-flex size-16 items-center justify-center rounded-full bg-[#0052CC] text-white shadow-[0_8px_20px_rgba(0,82,204,0.35)]"
            >
              <HelpCircle className="size-8" />
            </button>
            {quickHelpOpen && (
              <section className="fixed inset-0 z-30 flex items-end bg-black/30">
                <div className="w-full rounded-t-3xl bg-white p-4">
                  <p className="text-sm font-semibold text-[#0052CC]">Quick Help</p>
                  <p className="mt-2 rounded-lg bg-blue-50 px-2 py-2 text-xs">
                    기구 도감: Retractor / C-arm / 흡인기 기본 핸들링
                  </p>
                  <p className="mt-2 rounded-lg bg-blue-50 px-2 py-2 text-xs">
                    교수님 특이 요청: 절개 직전 30초 브리핑 필수
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuickHelpOpen(false)}
                    className="mt-3 h-11 w-full rounded-xl bg-slate-100 text-sm font-semibold text-slate-700"
                  >
                    닫기
                  </button>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <header className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_8px_20px_rgba(0,82,204,0.10)]">
              <p className="text-xs font-semibold text-slate-500">Admin Dashboard</p>
              <h1 className="mt-1 text-lg font-bold text-[#0052CC]">오르비 지수 (Compliance Index)</h1>
              <p className="text-xs text-slate-600">Time-Out: {timeoutRate}%</p>
              <div className="mt-3 flex items-end gap-2">
                {[62, 71, 58, 79, 66, 84, 73, 90].map((bar, idx) => (
                  <div key={`${bar}-${idx}`} className="flex flex-col items-center gap-1">
                    <div className="w-4 rounded-sm bg-[#0052CC]" style={{ height: `${bar / 2}px` }} />
                    <span className="text-[10px] text-slate-400">
                      {["Jan", "Feb", "Mar", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </header>
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
                <TriangleAlert className="size-3.5" />
                AI Inventory Alert
              </p>
              <p className="mt-1 text-sm font-bold text-rose-900">2 hrs until Gauze Shortage</p>
              <p className="mt-1 text-xs text-rose-800">발주 필요 대상 {shortageList.length}건</p>
            </section>
            <section className="rounded-2xl border border-blue-100 bg-white p-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">Room Status</p>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-blue-50 text-slate-600">
                    <tr>
                      <th className="px-2 py-2 text-left">Room</th>
                      <th className="px-2 py-2 text-left">Status</th>
                      <th className="px-2 py-2 text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { room: "OR 4", stage: "Room", completion: "1h" },
                      { room: "OR 2", stage: "Room", completion: "2h" },
                      { room: "OR 1", stage: "Room", completion: "38m" },
                    ].map((row) => (
                      <tr key={row.room} className="border-t border-slate-100">
                        <td className="px-2 py-2">{row.room}</td>
                        <td className="px-2 py-2">{row.stage}</td>
                        <td className="px-2 py-2 text-right">{row.completion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
      {roleMode && (
        <div className="fixed right-4 top-4 z-30 flex items-center gap-2">
          <Link
            href="/settings/"
            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#0052CC] shadow-[0_4px_12px_rgba(0,82,204,0.18)]"
          >
            설정
          </Link>
          <button
            type="button"
            onClick={() => {
              setRoleMode(null);
              setUserId("");
              setPassword("");
            }}
            className="rounded-lg bg-[#0052CC] px-3 py-2 text-xs font-semibold text-white"
          >
            로그아웃
          </button>
        </div>
      )}
      <AppTabBar currentPath="/" />
    </div>
  );
}
