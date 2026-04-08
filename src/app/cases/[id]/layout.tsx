import { surgeryCases } from "@/data/mock-surgeries";

export function generateStaticParams() {
  return surgeryCases.map((item) => ({ id: item.id }));
}

export default function CaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
