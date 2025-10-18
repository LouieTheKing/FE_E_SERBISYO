import React, { useState } from "react";
import axios from "../axios";
import Modal from "../components/Modal/Modal";
import { showCustomToast } from "../components/Toast/CustomToast";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo/santol_logo.png";
import menuItems from "../constants/menuItems";

const SidebarHeader = ({ isCollapsed, user, role }) => (
  <div
    className={`flex flex-col items-center mb-8 transition-all duration-300 ${
      isCollapsed ? "mb-4" : ""
    }`}
  >
    <img
      src={user?.profilePicture || logo}
      alt={user?.name || "User"}
      className={`rounded-full object-cover bg-white border-2 border-white shadow mb-2 transition-all duration-300 ${
        isCollapsed ? "h-10 w-10" : "h-16 w-16"
      }`}
    />
    {!isCollapsed && (
      <>
        <span className="text-white text-sm font-medium tracking-wide transition-opacity duration-300">
          {user?.name || "Welcome"}
        </span>
        {role && (
          <span className="text-gray-200 text-xs mt-1 transition-opacity duration-300">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        )}
      </>
    )}
  </div>
);

const NavItem = ({
  item,
  isActive,
  onClick,
  expanded,
  isCollapsed,
  isMobile,
  onMenuItemClick,
}) => {
  const location = useLocation();
  const IconComponent = item.icon;
  const baseClasses = `flex items-center gap-3 rounded-lg font-medium transition-all duration-150 text-xs ${
    isCollapsed && !isMobile ? "px-2 py-2 justify-center" : "px-4 py-2"
  }`;

  const stateClasses = isActive
    ? "bg-red-100 text-red-800 font-bold shadow-sm"
    : "text-white hover:bg-red-900 hover:text-white";

  if (item.subMenu) {
    return (
      <div className="relative group">
        <button
          className={`${baseClasses} ${stateClasses} w-full focus:outline-none`}
          onClick={() => {
            if (isCollapsed && !isMobile) {
              // Don't toggle submenu when collapsed on desktop
              return;
            }
            onClick(item.label);
          }}
          title={isCollapsed && !isMobile ? item.label : ""}
        >
          <IconComponent className="text-base flex-shrink-0" />
          {(!isCollapsed || isMobile) && (
            <>
              <span className="truncate">{item.label}</span>
              <FaChevronDown
                className={`ml-auto transition-transform flex-shrink-0 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>

        {isCollapsed && !isMobile && (
          <div className="absolute left-full top-0 ml-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-max">
            <div className="p-2">
              <div className="font-medium mb-1">{item.label}</div>
              {item.subMenu && (
                <div className="border-t border-gray-600 pt-1 mt-1">
                  {item.subMenu.map((subItem, index) => (
                    <div key={subItem.to} className="py-1 text-gray-300">
                      {subItem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {(!isCollapsed || isMobile) && item.subMenu && expanded && (
          <div className="ml-6 flex flex-col gap-1 mt-1">
            {item.subMenu.map((subItem) => (
              <SubNavItem
                key={subItem.to}
                item={subItem}
                isActive={location.pathname === subItem.to}
                isCollapsed={false}
                isMobile={isMobile}
                onMenuItemClick={onMenuItemClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // If Logout, use button and call onClick directly
  if (item.label === "Logout" || item.to === "/login" || item.to === "/logout") {
    return (
      <div className="relative group">
        <button
          className={`${baseClasses} ${stateClasses} w-full`}
          title={isCollapsed && !isMobile ? item.label : ""}
          onClick={onClick}
        >
          <IconComponent className="text-base flex-shrink-0" />
          {(!isCollapsed || isMobile) && (
            <span className="truncate">{item.label}</span>
          )}
        </button>
        {isCollapsed && !isMobile && (
          <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </div>
        )}
      </div>
    );
  }
   return (
    <div className="relative group">
      <a
        href={item.to}
        className={`${baseClasses} ${stateClasses}`}
        title={isCollapsed && !isMobile ? item.label : ""}
        onClick={() => onMenuItemClick && onMenuItemClick(item)}
      >
        <IconComponent className="text-base flex-shrink-0" />
        {(!isCollapsed || isMobile) && (
          <span className="truncate">{item.label}</span>
        )}
      </a>
      {isCollapsed && !isMobile && (
        <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
    </div>
  );
};

const SubNavItem = ({
  item,
  isActive,
  isCollapsed,
  isMobile,
  onMenuItemClick,
}) => {
  const IconComponent = item.icon;
  const stateClasses = isActive
    ? "bg-red-100 text-red-700 font-bold shadow-sm"
    : "text-white hover:bg-white hover:text-[var(--color-primary)]";

  if (isCollapsed && !isMobile) return null;

  return (
    <a
      href={item.to}
      className={`flex items-center gap-2 px-3 py-2 rounded font-normal transition-all duration-150 text-xs ${stateClasses}`}
      onClick={() => onMenuItemClick && onMenuItemClick(item)}
    >
      <IconComponent className="text-base flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </a>
  );
};

const UserSidebar = ({
  isMobile = false,
  isOpen = true,
  isCollapsed = false,
  setIsCollapsed = () => {},
  onClose,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  
  // If AuthContext is not available, fall back to localStorage
  const userData = auth?.user || JSON.parse(localStorage.getItem("userData") || "{}");
  const role = userData?.type || "resident";
  const navLinks = menuItems[role] || [];

  // Use onLogout prop for logout
  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    }
    if (isMobile && onClose) {
      onClose();
    }
  };
  const [openMenus, setOpenMenus] = useState({});

  const handleToggle = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleSidebar = () => {
    if (isMobile && onClose) {
      onClose();
    } else {
      setIsCollapsed(!isCollapsed);
      // Close all submenus when collapsing
      if (!isCollapsed) {
        setOpenMenus({});
      }
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.to === "/logout" || item.to === "/" || item.label === "Logout") {
      handleLogout();
      return;
    }
    if (isMobile && !item.subMenu && onClose) {
      onClose();
    }
  };

  const isSubMenuActive = (subMenu) => {
    return (
      subMenu && subMenu.some((subItem) => location.pathname === subItem.to)
    );
  };

  return (
    <>
      <aside
      className={`h-screen bg-red-800 border-r border-red-900 shadow-lg flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-58"
      }`}
    >
      <div
        className={`flex-shrink-0 flex ${
          isCollapsed ? "justify-center" : "justify-end"
        } p-3`}
      >
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-red-700 hover:scale-110 p-2 rounded-lg transition-all duration-200 cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <FaBars className="w-4 h-4" />
          ) : (
            <FaTimes className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className={`flex-shrink-0 ${isCollapsed ? "px-2" : "px-4"}`}>
        <SidebarHeader 
          isCollapsed={isCollapsed} 
          user={{
            name: userData?.full_name || userData?.fullname || (userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : userData?.name || userData?.username || ""),
            profilePicture: userData?.profilePicture
          }}
          role={role}
        />
      </div>
      <div
        className={`flex-1 ${isCollapsed ? "px-2" : "px-4"} overflow-y-auto`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#dc2626 transparent",
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            width: 4px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: #dc2626;
            border-radius: 2px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #b91c1c;
          }
        `}</style>

        <div className="flex flex-col gap-2 py-2 pb-20">
          {navLinks.map((item) => {
            const isActive =
              location.pathname === item.to || isSubMenuActive(item.subMenu);
            const isLogout = item.label === "Logout" || item.to === "/login";
            return (
              <NavItem
                key={item.label || item.to}
                item={item}
                isActive={isActive}
                onClick={isLogout ? handleLogout : handleToggle}
                expanded={!!openMenus[item.label]}
                isCollapsed={isCollapsed}
              />
            );
          })}
        </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
