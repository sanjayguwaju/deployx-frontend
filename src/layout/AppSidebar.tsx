import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  GroupIcon,
  CheckCircleIcon,
  UserIcon,
  FileIcon,
  InfoIcon,
  AlertIcon,
  FolderIcon,
  EnvelopeIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useTenant } from "../context/TenantContext";
import SidebarWidget from "./SidebarWidget";
import { useApprovals } from "../hooks/useApprovals";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subject?: string;
  requiredRole?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "sidebar.dashboard",
    path: "/dashboard",
    subject: "dashboard",
  },
  {
    icon: <CheckCircleIcon />,
    name: "sidebar.approvals",
    path: "/approvals",
    subject: "ApprovableDocument",
  },
  {
    icon: <CalenderIcon />,
    name: "sidebar.calendar",
    path: "/calendar",
  },
  {
    icon: <UserIcon />,
    name: "sidebar.citizens",
    path: "/citizens",
    subject: "citizens",
  },
  {
    icon: <FileIcon />,
    name: "sidebar.registrations",
    path: "/registrations",
    subject: "registration",
  },
  {
    icon: <InfoIcon />,
    name: "sidebar.service_requests",
    path: "/service-requests",
    subject: "service_requests",
  },
  {
    icon: <AlertIcon />,
    name: "sidebar.complaints",
    path: "/complaints",
    subject: "complaints",
  },
  {
    icon: <FolderIcon />,
    name: "sidebar.correspondence",
    path: "/correspondence",
    subject: "correspondence",
  },
  {
    icon: <EnvelopeIcon />,
    name: "sidebar.notifications",
    path: "/notifications",
    subject: "notifications",
  },
  {
    icon: <GroupIcon />,
    name: "sidebar.users",
    path: "/users",
    subject: "users",
  },
  {
    icon: <CheckCircleIcon />,
    name: "sidebar.roles",
    path: "/roles",
    subject: "rbac",
  },
  {
    icon: <ListIcon />,
    name: "sidebar.audit_logs",
    path: "/audit-logs",
    subject: "audit_logs",
  },
  {
    icon: <GridIcon />,
    name: "Feature Flags",
    path: "/feature-flags",
    subject: "FeatureFlag",
  },
  {
    icon: <PageIcon />, // Re-using an icon for System Admin stuff
    name: "Tenants Admin",
    path: "/superadmindashboard",
    subject: "all", // Only Master Admin has 'all' access
    requiredRole: "platform_admin",
  },
  {
    icon: <PageIcon />,
    name: "Billing Admin",
    path: "/system/billing-admin",
    subject: "all",
    requiredRole: "platform_admin",
  },
  {
    icon: <GridIcon />,
    name: "Wards",
    path: "/system/wards",
    subject: "system",
  },
  {
    icon: <GridIcon />,
    name: "Admin Dashboard",
    path: "/administrator",
    requiredRole: "cao", // Or could use municipality_admin
  },
  {
    icon: <GridIcon />,
    name: "Branding",
    path: "/settings/branding",
    // No specific subject needed if we just check for municipality_admin in UI
  },
  {
    icon: <PieChartIcon />,
    name: "Charts",
    path: "#",
    subItems: [
      { name: "Bar Chart", path: "/bar-chart", pro: false },
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Pie Chart", path: "/pie-chart", pro: false },
    ],
  },
];

const departmentItems: NavItem[] = [
  {
    icon: <InfoIcon />,
    name: "sidebar.health",
    path: "/departments/health",
    subject: "health",
  },
  {
    icon: <PageIcon />,
    name: "sidebar.education",
    path: "/departments/education",
    subject: "education",
  },
  {
    icon: <BoxCubeIcon />,
    name: "sidebar.infrastructure",
    path: "/departments/infrastructure",
    subject: "infrastructure",
  },
  {
    icon: <GridIcon />,
    name: "sidebar.agriculture",
    path: "/departments/agriculture",
    subject: "agriculture",
  },
  {
    icon: <PieChartIcon />,
    name: "sidebar.finance",
    path: "/departments/finance",
    subject: "finance",
  },
  {
    icon: <FileIcon />,
    name: "sidebar.administrative",
    path: "/departments/administrative",
    subject: "administrative",
  },
  {
    icon: <AlertIcon />,
    name: "sidebar.disaster_management",
    path: "/departments/disaster-management",
    subject: "disaster_management",
  },
];

import { Can } from "../context/AbilityContext";

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { branding } = useTenant();
  const location = useLocation();
  const { pendingCount } = useApprovals();
  const { user } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others" | "departments";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "departments"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : departmentItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "departments",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "departments") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "departments") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isPlatformAdmin = user?.roles?.includes("platform_admin");
        if (isPlatformAdmin) {
          const platformAdminItems = ["Tenants Admin", "Feature Flags", "Billing Admin"];
          if (!platformAdminItems.includes(nav.name)) {
            return null;
          }
        } else {
          if (nav.requiredRole === "platform_admin") {
            return null;
          }
          if (nav.requiredRole && !user?.roles?.includes(nav.requiredRole)) {
            return null;
          }
        }

        const itemContent = (
          <>
            {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{t(nav.name)}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <div className="flex items-center justify-between w-full">
                    <span className="menu-item-text">{t(nav.name)}</span>
                    {nav.name === "sidebar.approvals" && pendingCount > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {pendingCount > 9 ? "9+" : pendingCount}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {t(subItem.name)}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </>
        );

        if (nav.subject) {
          return (
            <Can key={nav.name} I="read" a={nav.subject as string}>
              <li>{itemContent}</li>
            </Can>
          );
        }

        return <li key={nav.name}>{itemContent}</li>;
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/dashboard" className="flex items-center gap-3">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <img
                  src="/images/logo/logo-icon.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                />
              )}
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {branding?.name || "DeployX"}
              </h1>
            </>
          ) : (
            branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            ) : (
              <img
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            )
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.menu')
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.departments')
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(departmentItems, "departments")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
