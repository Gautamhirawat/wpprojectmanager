import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from "@/api/base44Client";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Users, 
  Settings, 
  Menu,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { createPageUrl } from '@/utils';

// This layout mimics the WordPress Admin Dashboard
export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Not logged in", error);
      }
    };
    fetchUser();
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: 'Dashboard' },
    { icon: FolderKanban, label: 'Projects', path: 'Projects' },
    { icon: CheckSquare, label: 'Tasks', path: 'Tasks' },
    { icon: BarChart3, label: 'Kanban Board', path: 'Kanban' },
    { icon: Clock, label: 'Time Tracking', path: 'TimeTracking' },
    { icon: BarChart3, label: 'Reports', path: 'Reports' },
    { icon: Users, label: 'Team', path: 'Team' },
    { icon: Settings, label: 'Settings', path: 'Settings' },
  ];

  // WordPress Colors
  const wpDark = "#1d2327";
  const wpBlue = "#2271b1";
  const wpLightBg = "#f0f0f1";
  const wpHover = "#135e96";

  return (
    <div className="min-h-screen flex flex-col font-sans text-[13px] text-[#3c434a]">
      
      {/* WP Admin Bar */}
      <div className="h-8 bg-[#1d2327] text-white flex items-center justify-between px-3 fixed w-full z-50">
        <div className="flex items-center gap-4">
          <div className="font-bold flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-full text-[#1d2327] flex items-center justify-center font-serif font-bold text-sm">W</div>
            <span>WP Project Manager</span>
          </div>
          <div className="flex items-center gap-3 text-[#c3c4c7] text-xs">
            <Link to={createPageUrl('Dashboard')} className="hover:text-[#72aee6] flex items-center gap-1">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            <div className="relative group cursor-pointer h-full flex items-center">
              <div className="hover:text-[#72aee6] flex items-center gap-1">
                <Plus size={14} /> New
              </div>
              <div className="absolute top-full left-0 bg-[#1d2327] w-40 py-2 hidden group-hover:block border border-[#3c434a] shadow-lg">
                 <Link to={createPageUrl('Projects')} className="block px-4 py-2 hover:bg-[#2271b1] hover:text-white text-[#c3c4c7]">Project</Link>
                 <Link to={createPageUrl('Tasks')} className="block px-4 py-2 hover:bg-[#2271b1] hover:text-white text-[#c3c4c7]">Task</Link>
                 <Link to={createPageUrl('TimeTracking')} className="block px-4 py-2 hover:bg-[#2271b1] hover:text-white text-[#c3c4c7]">Time Log</Link>
                 <Link to={createPageUrl('Team')} className="block px-4 py-2 hover:bg-[#2271b1] hover:text-white text-[#c3c4c7]">User</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#c3c4c7]">
          <span className="hover:text-[#72aee6] cursor-pointer">
            Howdy, {user ? (user.full_name || user.email) : 'Guest'}
          </span>
          {user && user.avatar_url && (
            <img src={user.avatar_url} alt="Avatar" className="w-6 h-6 rounded-sm" />
          )}
        </div>
      </div>

      <div className="flex flex-1 pt-8">
        {/* Sidebar */}
        <div 
          className={`bg-[#1d2327] text-white flex-shrink-0 transition-all duration-300 overflow-y-auto fixed h-full z-40 ${sidebarCollapsed ? 'w-9' : 'w-40'}`}
        >
          <div className="py-2">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link 
                  key={item.path} 
                  to={createPageUrl(item.path)}
                  className={`
                    flex items-center gap-2 px-3 py-2 mb-0.5 cursor-pointer transition-colors relative
                    ${isActive ? 'bg-[#2271b1] text-white font-semibold' : 'text-[#c3c4c7] hover:bg-[#191e23] hover:text-[#72aee6]'}
                  `}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <item.icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {isActive && !sidebarCollapsed && (
                     <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-0"></div> /* triangular indicator logic omitted for simplicity */
                  )}
                </Link>
              );
            })}
          </div>
          
          <div 
            className="absolute bottom-0 w-full p-2 text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer border-t border-[#3c434a] flex justify-center"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu size={20} />
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 bg-[#f0f0f1] transition-all duration-300 ${sidebarCollapsed ? 'ml-9' : 'ml-40'} min-h-[calc(100vh-32px)]`}>
          <div className="p-5 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
      
      {/* WP-like styles globally injected for specific elements if needed */}
      <style>{`
        .wp-btn {
          background: #2271b1;
          color: white;
          border: 1px solid #2271b1;
          padding: 4px 12px;
          border-radius: 3px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.1s ease;
        }
        .wp-btn:hover {
          background: #135e96;
          border-color: #135e96;
        }
        .wp-btn-secondary {
          background: #f6f7f7;
          color: #2271b1;
          border: 1px solid #2271b1;
          padding: 4px 12px;
          border-radius: 3px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.1s ease;
        }
        .wp-btn-secondary:hover {
          background: #f0f0f1;
          border-color: #0a4b78;
          color: #0a4b78;
        }
        .wp-card {
          background: white;
          border: 1px solid #c3c4c7;
          box-shadow: 0 1px 1px rgba(0,0,0,0.04);
          padding: 0;
        }
        .wp-input {
          border: 1px solid #8c8f94;
          border-radius: 4px;
          padding: 0 8px;
          height: 30px;
          width: 100%;
          max-width: 400px;
        }
        .wp-input:focus {
          border-color: #2271b1;
          box-shadow: 0 0 0 1px #2271b1;
          outline: none;
        }
        h1.wp-heading {
            font-size: 23px;
            font-weight: 400;
            margin: 0 0 20px 0;
            padding: 9px 0 4px 0;
            line-height: 1.3;
            color: #1d2327;
        }
      `}</style>
    </div>
  );
}