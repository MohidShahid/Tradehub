import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Logo from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import {
  SquareDashedKanbanIcon,
  PackagePlusIcon,
  PackageIcon,
  ShoppingCartIcon,
  InboxIcon,
  ChartNoAxesCombinedIcon,
  StoreIcon,
  BadgePercentIcon,
  StarIcon,
  CalendarDaysIcon,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    link: "/seller/dashboard",
    icon: <SquareDashedKanbanIcon />,
  },
  {
    name: "Create Product",
    link: "/seller/products/create",
    icon: <PackagePlusIcon />,
  },
  {
    name: "All Products",
    link: "/seller/products",
    icon: <PackageIcon />,
  },
  {
    name: "Orders",
    link: "/seller/orders",
    icon: <ShoppingCartIcon />,
  },
  {
    name: "Inbox",
    link: "/seller/inbox",
    icon: <InboxIcon />,
  },
  {
    name: "Sales & Analytics",
    link: "/seller/analytics",
    icon: <ChartNoAxesCombinedIcon />,
  },
  {
    name: "Shop",
    link: "/seller/shop",
    icon: <StoreIcon />,
  },
  {
    name: "Coupons",
    link: "/seller/discounts",
    icon: <BadgePercentIcon />,
  },
  {
    name: "Reviews",
    link: "/seller/reviews",
    icon: <StarIcon />,
  },
  {
    name: "Events",
    link: "/seller/events",
    icon: <CalendarDaysIcon />,
  },
];
export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-1">
          <img src={Logo} alt="" width={40} height={40} />
          <span className="flex font-bold text-[24px]">
            <p className="text-(--color-primary)">Trade</p>
            <p className="text-(--color-accent) ">Hub</p>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.link;
                return (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link to={item.link} />}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

