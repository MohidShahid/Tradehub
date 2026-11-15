import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Heart,
  MapPin,
  Shield,
  CreditCard,
  Bell,
  MessageSquareIcon,
} from "lucide-react";
import ProfileContent from "../components/UserProfile/ProfileContent";
import OrdersSection from "../components/UserProfile/OrdersSection";
import WishlistSection from "../components/Wishlist/WishlistSection";

const navItems = [
  { id: "profile", label: "Profile Details", icon: User },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "wishlist", label: "My Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "inbox", label: "Inbox", icon: MessageSquareIcon },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "security", label: "Password & Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const UserProfileContent = () => {
  const { section } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeSection = section || searchParams.get("tab") || "profile";
  const { user } = useSelector((state) => state.user);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleSelectSection = (id) => {
    navigate(id === "profile" ? "/user-profile" : `/user-profile/${id}`);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

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
                        className={`w-full flex items-center gap-3.5 px-4 py-3 text-[15px] font-medium  transition-all cursor-pointer ${
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
          <span className="text-sm font-semibold text-slate-700">
            Account Menu
          </span>
        </div>

        {/* Section View */}
        <div className="p-6 md:p-10 flex-1">
          {activeSection === "profile" && (
             <ProfileContent />
          )}

          {activeSection === "orders" && (
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
              <p className="text-sm text-slate-500">
                Track your recent orders, deliveries, and receipts.
              </p>
              <OrdersSection />
            </div>
          )}

          {activeSection === "wishlist" && <WishlistSection embedded />}

          {activeSection === "addresses" && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Addresses</h2>
                  <p className="text-sm text-slate-500">
                    Manage your saved shipping and delivery addresses.
                  </p>
                </div>
                <Link
                  to="/address/create"
                  className="rounded-lg bg-(--color-accent) px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
                >
                  + Add Address
                </Link>
              </div>
              <div className="border rounded-xl p-8 text-center bg-white shadow-xs">
                <MapPin className="mx-auto mb-2 text-slate-300" size={36} />
                <p className="text-sm font-semibold text-slate-700">
                  Manage your delivery locations
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Configure default addresses for quick checkout.
                </p>
                <Link
                  to="/address"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-(--color-accent) hover:underline"
                >
                  View All Addresses &rarr;
                </Link>
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
