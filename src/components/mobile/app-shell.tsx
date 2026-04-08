import type { ReactNode } from "react";

export function MobileAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
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
