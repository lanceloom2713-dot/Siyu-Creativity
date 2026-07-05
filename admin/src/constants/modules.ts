import {
  BarChart3,
  BookOpen,
  Boxes,
  Contact,
  FolderTree,
  HelpCircle,
  Home,
  Images,
  Search,
  Settings,
  Users
} from "lucide-react";

export const adminModules = [
  { label: "Dashboard", path: "/", icon: BarChart3 },
  { label: "Products", path: "/products", icon: Boxes },
  { label: "Categories", path: "/categories", icon: FolderTree },
  { label: "Media Library", path: "/media", icon: Images },
  { label: "Homepage Builder", path: "/homepage", icon: Home },
  { label: "Blogs", path: "/blogs", icon: BookOpen },
  { label: "FAQs", path: "/faqs", icon: HelpCircle },
  { label: "Enquiries", path: "/enquiries", icon: Contact },
  { label: "SEO Manager", path: "/seo", icon: Search },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Admin Users", path: "/users", icon: Users }
];
