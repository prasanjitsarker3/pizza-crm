import {
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ShoppingCart,
  Package,
  PackagePlus,
  TrendingUp,
  PackageCheck,
  Boxes,
  Images,
  Palette,
  Tags
} from "lucide-react";

export const adminRoutes = () => [
  {
    icon: BarChart3,
    label: "Dashboard",
    href: "/admin",
    active: true,
  },
  {
    icon: Users,
    label: "Users Management",
    href: "/admin/users",
  },
  {
    icon: Images,
    label: "Banner Management",
    href: "/admin/banner",
  },
  {
    icon: Package,
    label: "Category Management",
    href: "/admin/category",
  },

  {
    icon: ShoppingCart,
    label: "Products",
    // href: "/admin/product",
    subItems: [
      {
        icon: Package,
        label: "Product Management",
        href: "/admin/products",
      },
      {
        icon: PackagePlus,
        label: "New Product",
        href: "/admin/products/new",
      },
      {
        icon: TrendingUp,
        label: "Top Products",
        href: "/admin/products/top",
      }
    ],
  },
  {
    icon: ShoppingCart,
    label: "Order Management",
    href: "/admin/orders",
  },
  // {
  //   icon: Tags,
  //   label: "Coupon Management",
  //   href: "/admin/coupon",
  // },
  // {
  //   icon: Settings,
  //   label: "Settings",
  //   href: "/admin/setting",
  // },
  // {
  //   icon: HelpCircle,
  //   label: "Help & Support",
  //   href: "/admin/help-support",
  // },
  // {
  //   icon: LogOut,
  //   label: "Logout",
  //   href: "/logout",
  // },
];
