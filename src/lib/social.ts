import { Mail, Rss, type LucideIcon } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaTelegram,
  FaYoutube,
  FaDocker,
} from "react-icons/fa6";
import type { ComponentType, SVGProps } from "react";

export type SocialIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

export type SocialLink = {
  name: string;
  href: string;
  icon: SocialIcon;
  handle?: string;
};

export const socialLinks: SocialLink[] = [
  { name: "GitHub",   href: "https://github.com/melihteke",           icon: FaGithub,    handle: "melihteke" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/melih-teke", icon: FaLinkedin,  handle: "melih-teke" },
  { name: "X",        href: "https://x.com/melyteke",                 icon: FaXTwitter,  handle: "@melyteke" },
  { name: "Telegram", href: "https://t.me/melyteke",                  icon: FaTelegram,  handle: "melyteke" },
  { name: "YouTube",  href: "https://www.youtube.com/@devmely",       icon: FaYoutube,   handle: "@devmely" },
  { name: "Docker",   href: "https://hub.docker.com/u/melihteke",     icon: FaDocker,    handle: "melihteke" },
  { name: "Email",    href: "mailto:me@mteke.com",                    icon: Mail,        handle: "me@mteke.com" },
  { name: "RSS",      href: "/rss.xml",                               icon: Rss,         handle: "/rss.xml" },
];
