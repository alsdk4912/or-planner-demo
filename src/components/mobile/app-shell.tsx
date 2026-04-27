import Link from "next/link";
import type { ReactNode } from "react";

export function MobileAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <Link href="/" className="fixed left-4 top-3 z-40 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-[#0052CC] shadow-[0_4px_12px_rgba(0,82,204,0.16)]">
        OR-<span>V</span>
        <span className="-ml-0.5 text-[11px]">✓</span>
      </Link>
      <main className="mx-auto w-full max-w-[28rem] space-y-4 px-4 py-5">{children}</main>
    </div>
  );
}

export function BlueHero({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <section className="rounded-[var(--app-radius-xl)] bg-[var(--app-blue)] p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-wide text-blue-100">
            OR-<span className="text-white">V</span>
            <span className="-ml-0.5 text-[11px] text-white">✓</span>
          </p>
          <h1 className="text-xl font-semibold leading-tight">{title}</h1>
          <p className="mt-1 text-sm text-blue-100">{subtitle}</p>
        </div>
        {right}
      </div>
    </section>
  );
}

export function AppCard({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-white p-4 shadow-[0_1px_6px_rgba(15,23,42,0.04)]">
      {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      <div className={title || subtitle ? "mt-3" : ""}>{children}</div>
    </section>
  );
}

export function PrimaryCTA({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="block w-full rounded-[var(--app-radius-lg)] bg-[var(--app-blue)] px-4 py-3 text-center text-sm font-semibold text-white"
    >
      {label}
    </a>
  );
}
