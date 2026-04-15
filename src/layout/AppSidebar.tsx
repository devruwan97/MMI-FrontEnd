import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  GridIcon,
  ChevronDownIcon,
  HorizontaLDots,
  CalenderIcon,
  DollarLineIcon,
  UserCircleIcon,
  PieChartIcon,
  GroupIcon,
  MailIcon,
  TableIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles: string[];
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Home", path: "/", roles: ["admin", "teacher", "student"] },

  {
    icon: <TableIcon />,
    name: "Courses",
    roles: ["admin", "teacher", "student"],
    subItems: [{ name: "All Courses", path: "/courses" }],
  },

  { icon: <UserCircleIcon />, name: "Add New User", path: "/createUser", roles: ["admin"] },

  { icon: <DollarLineIcon />, name: "Payments", path: "/payments", roles: ["admin"] },

  { icon: <UserCircleIcon />, name: "About Us", path: "/about", roles: ["admin", "teacher", "student"] },

  { icon: <MailIcon />, name: "Contact", path: "/contact", roles: ["admin", "teacher", "student"] },

  { icon: <GroupIcon />, name: "Management", path: "/admin/management", roles: ["admin"] },

  { icon: <PieChartIcon />, name: "Analytics", path: "/admin/analytics", roles: ["admin"] },

  { icon: <CalenderIcon />, name: "Teacher Dashboard", path: "/teacher/dashboard", roles: ["teacher"] },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const role = localStorage.getItem("role") || "student";

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // ✅ FILTER BY ROLE (ONLY CHANGE THAT MATTERS)
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  useEffect(() => {
    let submenuMatched = false;

    filteredNavItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive, role]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) =>
      prev && prev.index === index ? null : { type: "main", index }
    );
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>

              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}

              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
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
                  isActive(nav.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
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
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${openSubmenu?.type}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${openSubmenu?.type}-${index}`]}px`
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
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
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
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img src="/images/logo/logo-icon.svg" width={32} />
              <span className="text-base font-bold">
                Mathsmastery Institute
              </span>
            </div>
          ) : (
            <img src="/images/logo/logo-icon.svg" width={32} />
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto">
        <nav className="mb-6">
          <h2 className="mb-4 text-xs uppercase text-gray-400">
            {(isExpanded || isHovered || isMobileOpen) ? "Menu" : <HorizontaLDots />}
          </h2>

          {renderMenuItems(filteredNavItems)}
        </nav>

        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;
