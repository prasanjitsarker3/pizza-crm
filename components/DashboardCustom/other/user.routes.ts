import {
    BarChart3,
    Users,
    Settings,
    HelpCircle,
    LogOut
} from "lucide-react";

export const userRoutes = () => [
    {
        icon: BarChart3,
        label: "Dashboard",
        href: "/admin",
        active: true,
    },
    {
        icon: Users,
        label: "Other Users",
        href: "/admin/users",
    },
    // {
    //   icon: ShoppingCart,
    //   label: "Products",
    //   href: "/admin/products",
    //   subItems: [
    //     {
    //       icon: Package,
    //       label: "Product Management",
    //       href: "/admin/products/management",
    //     },
    //     {
    //       icon: PackagePlus,
    //       label: "New Product",
    //       href: "/admin/products/new",
    //     },
    //     {
    //       icon: TrendingUp,
    //       label: "Top Products",
    //       href: "/admin/products/top",
    //     },
    //     {
    //       icon: PackageCheck,
    //       label: "Return Products",
    //       href: "/admin/products/returns",
    //     },
    //   ],
    // },
    {
        icon: Settings,
        label: "Settings",
        href: "/admin/settings",
    },
    {
        icon: HelpCircle,
        label: "Help & Support",
        href: "/admin/help",
    },
    {
        icon: LogOut,
        label: "Logout",
        href: "/logout",
    },
];
