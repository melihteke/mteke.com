import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type CalloutType = "info" | "success" | "warning" | "danger" | "tip";

const styles: Record<
  CalloutType,
  { icon: LucideIcon; iconColor: string; box: string; titleColor: string }
> = {
  info: {
    icon: Info,
    iconColor: "text-sky-600 dark:text-sky-400",
    box: "border-sky-500/30 bg-sky-500/[0.08]",
    titleColor: "text-sky-700 dark:text-sky-300",
  },
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    box: "border-emerald-500/30 bg-emerald-500/[0.08]",
    titleColor: "text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
    box: "border-amber-500/30 bg-amber-500/[0.08]",
    titleColor: "text-amber-700 dark:text-amber-300",
  },
  danger: {
    icon: AlertOctagon,
    iconColor: "text-rose-600 dark:text-rose-400",
    box: "border-rose-500/30 bg-rose-500/[0.08]",
    titleColor: "text-rose-700 dark:text-rose-300",
  },
  tip: {
    icon: Lightbulb,
    iconColor: "text-violet-600 dark:text-violet-400",
    box: "border-violet-500/30 bg-violet-500/[0.08]",
    titleColor: "text-violet-700 dark:text-violet-300",
  },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, iconColor, box, titleColor } = styles[type];
  return (
    <div className={`my-6 rounded-xl border ${box} px-4 py-3 flex gap-3`}>
      <Icon className={`size-5 mt-1 shrink-0 ${iconColor}`} aria-hidden />
      <div className="flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {title && <div className={`mb-1 font-semibold ${titleColor}`}>{title}</div>}
        {children}
      </div>
    </div>
  );
}
