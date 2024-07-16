import {
  Tag,
  Users,Plus,
  Settings,
  Bookmark,
  SquarePen,Star,
  LayoutGrid,UploadCloud, Trash2,
  Share2
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
       
        {
          href: "/dashboard/bin",
          label: "Bin",
          active: pathname.includes("/dashboard/bin"),
          icon: Trash2,
          submenus: []
        },
        {
          href: "/dashboard/favourite",
          label: "Favourite",
          active: pathname.includes("/favourite"),
          icon: Star,
          submenus: []
        },{
          href: "/dashboard/sharedwithyou",
          label: "Shared with you",
          active: pathname.includes("/sharedwithyou"),
          icon: Share2,
          submenus: []
        }
      ]
    },
    
  ];
}
