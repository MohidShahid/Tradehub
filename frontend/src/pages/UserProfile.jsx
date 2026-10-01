import { useState } from "react";
import { useSelector } from "react-redux";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  ShoppingBag,
  MapPin,
  Shield,
  CreditCard,
  Bell,
} from "lucide-react";

const navItems = [
  { id: "profile", label: "Profile Details", icon: User },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "security", label: "Password & Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const UserProfileContent = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const { user } = useSelector((state) => state.user);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleSelectSection = (id) => {
    setActiveSection(id);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const activeTitle = navItems.find((item) => item.id === activeSection)?.label;

  return (
    <div className="flex w-full min-h-[calc(100vh-6rem)] relative">
      {/* 
        collapsible="icon":
        - Desktop: Sticky under the h-24 Navbar, stops at the bottom before the footer
        - Mobile: Closed by default and opens via mobile Sheet drawer when SidebarTrigger is clicked
      */}
      <Sidebar
        collapsible="icon"
        className="md:!sticky md:!top-24 md:!h-[calc(100vh-6rem)] border-r bg-white shadow-xs shrink-0"
      >
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <Avatar className="h-10 w-10 shrink-0 rounded-xl">
                {user?.profilePic ? (
                  <AvatarImage src={user.profilePic} alt={user?.fullName} />
                ) : (
                  <AvatarFallback className="bg-slate-900 text-white font-bold text-sm rounded-xl">
                    {user?.fullName?.slice(0, 2)?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate text-slate-900">
                  {user?.fullName || "User Account"}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {user?.email || "No email available"}
                </p>
              </div>
            </div>

            {/* SidebarTrigger placed directly on the sidebar */}
            <SidebarTrigger className="cursor-pointer hover:bg-slate-100 rounded-lg p-2 text-slate-600 h-9 w-9 shrink-0 mx-auto" />
          </div>
        </SidebarHeader>

        <SidebarContent className="p-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider group-data-[collapsible=icon]:hidden mb-1">
              Account Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        size="lg"
                        onClick={() => handleSelectSection(item.id)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 text-[15px] font-medium rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? "bg-slate-900 text-white shadow-sm hover:bg-slate-900 hover:text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="size-5 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-5 border-t text-xs font-medium text-slate-400 group-data-[collapsible=icon]:hidden">
          TradeHub Account Portal
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset className="flex-1 flex flex-col bg-slate-50/40 min-h-[calc(100vh-6rem)]">
        {/* Mobile-only menu toggle (on desktop, trigger is on the sidebar) */}
        <div className="md:hidden flex items-center gap-3 px-6 pt-5 pb-2">
          <SidebarTrigger className="cursor-pointer hover:bg-slate-100 border rounded-lg p-2 text-slate-700 h-9 w-9" />
          <span className="text-sm font-semibold text-slate-700">Account Menu</span>
        </div>

        {/* Section View */}
        <div className="p-6 md:p-10 flex-1">
          {activeSection === "profile" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Profile Details
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your personal information and contact details.
                </p>
              </div>
              <div className="border rounded-xl p-5 bg-white space-y-4 shadow-xs">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Full Name
                  </label>
                  <p className="text-base text-slate-800 font-medium">
                    {user?.fullName || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Email Address
                  </label>
                  <p className="text-base text-slate-800 font-medium">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "orders" && (
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
              <p className="text-sm text-slate-500">
                Track your recent orders, deliveries, and returns.
              </p>
              <div className="border rounded-xl p-8 text-center text-slate-500 bg-white shadow-xs">
                No orders placed yet.
              </div>
            </div>
          )}

          {activeSection === "addresses" && (
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">Addresses</h2>
              <p className="text-sm text-slate-500">
                Manage your saved shipping and billing addresses.
              </p>
              <div className="border rounded-xl p-8 text-center text-slate-500 bg-white shadow-xs">
                No saved addresses found.
              </div>
            </div>
          )}

          {activeSection === "payments" && (
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Payment Methods
              </h2>
              <p className="text-sm text-slate-500">
                Manage your credit cards and saved payment accounts.
              </p>
              <div className="border rounded-xl p-8 text-center text-slate-500 bg-white shadow-xs">
                No payment methods linked.
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Password & Security
              </h2>
              <p className="text-sm text-slate-500">
                Update your password and secure your account.
              </p>
              <div className="border rounded-xl p-5 bg-white space-y-3 shadow-xs">
                <p className="text-sm text-slate-700">Account status: Active</p>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Notifications
              </h2>
              <p className="text-sm text-slate-500">
                Configure email and order notifications.
              </p>
              <div className="border rounded-xl p-8 text-center text-slate-500 bg-white shadow-xs">
                Notification preferences.
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </div>
  );
};

const UserProfile = () => {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={{
        "--sidebar-width": "18.5rem",
        "--sidebar-width-mobile": "20rem",
        "--sidebar-width-icon": "4.25rem",
      }}
      className="min-h-[calc(100vh-6rem)] w-full"
    >
      <UserProfileContent />
    </SidebarProvider>
  );
};

export default UserProfile;
