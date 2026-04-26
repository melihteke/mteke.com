export const siteConfig = {
  name: "Melih Teke",
  shortName: "mteke",
  title: "Melih Teke — Network Engineer & NetDevOps",
  description:
    "Notes and experiments on network automation, NetDevOps, Python, Cisco, and AI.",
  url: "https://mteke.com",
  locale: "en",
  author: {
    name: "Melih Teke",
    email: "me@mteke.com",
    twitter: "@melyteke",
  },
  postsPerPage: 12,
} as const;

export type SiteConfig = typeof siteConfig;
