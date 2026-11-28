import type { IconName } from "../common/Icon";

export type NavItem = {
  to: string;
  label: string;
  icon: IconName;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/** 사이드바 메뉴. 경로·라벨은 기존 라우팅 그대로이고 묶음만 나눈다. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "개요",
    items: [{ to: "/app/dashboard", label: "대시보드", icon: "dashboard" }],
  },
  {
    label: "지원 관리",
    items: [
      { to: "/app/applications", label: "지원 현황", icon: "briefcase" },
      { to: "/app/resumes", label: "이력서", icon: "fileText" },
      { to: "/app/ai", label: "AI 도우미", icon: "sparkles" },
    ],
  },
  {
    label: "커리어 기록",
    items: [
      { to: "/app/studies", label: "학습 기록", icon: "book" },
      { to: "/app/projects", label: "프로젝트", icon: "folder" },
    ],
  },
];
