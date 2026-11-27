import {
  BookOpen,
  Bell,
  Clock,
  LifeBuoy,
  ListChecks,
  MessageCircleQuestion,
  Newspaper,
  Scale,
  ScanSearch,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import type { NavIcon } from "@/lib/site";

/** The icon for each header menu item (names are set in nav.ts). */
export const NAV_ICONS: Record<NavIcon, LucideIcon> = {
  track: ScanSearch,
  statuses: ListChecks,
  times: Clock,
  alerts: Bell,
  answers: MessageCircleQuestion,
  guides: BookOpen,
  blog: Newspaper,
  lawyers: Scale,
  scams: ShieldAlert,
  help: LifeBuoy,
};
