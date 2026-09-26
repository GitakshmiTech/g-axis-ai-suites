import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  ClipboardList, 
  Box, 
  Store, 
  CreditCard, 
  Tags, 
  HeadphonesIcon, 
  FileText, 
  Settings, 
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  Menu,
  X,
  UserPlus,
  FileSpreadsheet,
  AlertTriangle,
  LayoutGrid,
  RefreshCcw
} from 'lucide-react';
import logo from '../assets/Group 4.png';

const SidebarSection = ({ title, items, setMobileMenuOpen }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-white-100/50 mb-2 px-6 uppercase tracking-wider">{title}</h3>
    <ul className="space-y-1 px-4">
      {items.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-secondary text-white-100' 
                  : 'text-white-100/70 hover:bg-white-100/10 hover:text-white-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </div>
                {isActive && <ChevronLeft size={16} className="rotate-180" />}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'GOVERNANCE',
      items: [
        { label: 'Role Management', path: '/roles', icon: Users },
        { label: 'Tenant Directory', path: '/tenants', icon: Building2 },
        { label: 'Employee Management', path: '/employees', icon: Briefcase },
        { label: 'Global Audit Logs', path: '/audit', icon: ClipboardList },
      ]
    },
    {
      title: 'ECOSYSTEM',
      items: [
        { label: 'Product Registry', path: '/products', icon: Box },
        { label: 'Marketplace & Addons', path: '/marketplace', icon: Store },
      ]
    },
    {
      title: 'BILLING & COMMERCE',
      items: [
        { label: 'Plans Management', path: '/plans', icon: CreditCard },
        { label: 'Product Price Manage...', path: '/pricing', icon: Tags },
      ]
    },
    {
      title: 'CLIENT SUCCESS',
      items: [
        { label: 'Support Ticket', path: '/support', icon: HeadphonesIcon },
        { label: 'Terms of Service', path: '/terms', icon: FileText },
        { label: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  const notifications = [
    { icon: UserPlus, color: 'text-secondary', bg: 'bg-secondary/10', title: 'New Tenant Onboarded:', desc: 'TechCorp Inc. has completed the setup process.', time: '2 mins ago • Ecosystem', unread: true },
    { icon: FileSpreadsheet, color: 'text-secondary', bg: 'bg-secondary/10', title: 'Invoice Generated:', desc: 'INV-2023-089 for Enterprise Plan is ready.', time: '15 mins ago • Billing & Commerce', unread: false },
    { icon: AlertTriangle, color: 'text-secondary', bg: 'bg-secondary/10', title: 'Storage Limit Warning:', desc: 'Data warehouse is at 92% capacity.', time: '1 hour ago • System', unread: true },
    { icon: LayoutGrid, color: 'text-secondary', bg: 'bg-secondary/10', title: 'g-HRMS Activated:', desc: 'Human Resources suite is now available for your organization.', time: '3 hours ago • Governance', unread: false },
    { icon: RefreshCcw, color: 'text-secondary', bg: 'bg-secondary/10', title: 'Plan Renewed:', desc: 'Annual Enterprise License extended successfully.', time: '5 hours ago • Billing & Commerce', unread: false },
    { icon: UserPlus, color: 'text-secondary', bg: 'bg-secondary/10', title: 'New Tenant Onboarded:', desc: 'TechCorp Inc. has completed the setup process.', time: '2 mins ago • Ecosystem', unread: false },
  ];

  return (
    <div className="flex h-screen w-full bg-gray overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black-90/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative w-[280px] bg-primary flex flex-col h-full z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex-none flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2 text-white-100 font-bold text-xl">
             <img src={logo} alt="g-axis" className="h-8" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
             <span style={{ display: 'none' }}>g-axis ai suites</span>
          </div>
          <button className="text-white-100/70 hover:text-white-100 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
             <X size={20} />
          </button>
          <button className="text-white-100/70 hover:text-white-100 hidden lg:block">
             <ChevronLeft size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar mt-4">
          {navSections.map((section, idx) => (
            <SidebarSection key={idx} title={section.title} items={section.items} setMobileMenuOpen={setMobileMenuOpen} />
          ))}
        </div>

        <div className="flex-none px-4 py-6 overflow-hidden">
          <NavLink to="/" className="flex items-center justify-between px-4 py-3 text-alert border border-alert rounded-lg hover:bg-alert/10 transition-colors bg-[#111827]/20 w-full">
            <div className="flex items-center gap-3 text-sm font-medium">
              <LogOut size={18} />
              Logout
            </div>
            <ChevronLeft size={16} className="rotate-180" />
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-gray">
        {/* Header */}
        <header className="h-[88px] flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden text-black-90 p-1" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black-90/40" size={20} />
                <input 
                  type="text" 
                  placeholder="Search Tenants or Employees..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-black-90 placeholder:text-black-90/40 shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              className="relative p-2 text-black-90/60 hover:text-black-90 rounded-full bg-white-100 shadow-sm transition-colors"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-alert text-white-100 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white-100">
                5
              </span>
            </button>
            <div className="flex items-center gap-3 bg-white-100 py-1.5 px-3 rounded-full shadow-sm cursor-pointer hover:bg-white-100/80 transition-colors">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-col hidden sm:flex pr-2">
                <span className="text-sm font-bold text-black-90 leading-tight">Johnson Doe</span>
                <span className="text-xs text-black-90/60 font-medium">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Outlet */}
        <main className="flex-1 overflow-auto px-4 lg:px-8 pb-4 lg:pb-8 pt-2">
          <Outlet />
        </main>

        {/* Notifications Sidebar */}
        {isNotificationsOpen && (
          <div className="fixed inset-0 bg-black-90/20 z-40" onClick={() => setNotificationsOpen(false)} />
        )}
        <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white-100 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isNotificationsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-stroke">
            <h2 className="text-lg font-bold text-black-90">Notifications</h2>
            <button 
              onClick={() => setNotificationsOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray text-black-90/60 transition-colors border border-stroke"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-stroke">
            <div className="flex bg-white-100 border border-stroke rounded-lg p-1">
              <button className="px-4 py-1.5 bg-primary text-white-100 text-sm font-bold rounded-md">All</button>
              <button className="px-4 py-1.5 text-black-90/60 hover:text-black-90 text-sm font-medium rounded-md">Unread</button>
              <button className="px-4 py-1.5 text-black-90/60 hover:text-black-90 text-sm font-medium rounded-md">Mentions</button>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-secondary text-white-100 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-colors">
                Mark as All Read
              </button>
              <button className="text-primary text-xs font-bold hover:underline">
                Clear All
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.map((notif, idx) => (
              <div key={idx} className="flex gap-4 p-5 border-b border-stroke hover:bg-gray/30 transition-colors relative">
                <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${notif.bg}`}>
                  <notif.icon className={notif.color} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold text-black-90 mr-1">{notif.title}</span>
                    <span className="text-black-90/80">{notif.desc}</span>
                  </p>
                  <p className="text-xs text-black-90/50 mt-1 font-medium">{notif.time}</p>
                </div>
                {notif.unread && (
                  <div className="absolute top-6 right-5 w-1.5 h-1.5 rounded-full bg-alert"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

