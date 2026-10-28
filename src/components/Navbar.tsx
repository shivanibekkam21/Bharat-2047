import React from 'react';
import { Sparkles, Compass, MapPin, Cpu, TrendingUp, BarChart2, Layers, Briefcase, Database, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: 'public' | 'youth' | 'entrepreneur' | 'planner';
  setActiveRole: (role: 'public' | 'youth' | 'entrepreneur' | 'planner') => void;
  onLaunchDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  onLaunchDemo
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'district', label: 'Regional Dashboard', icon: MapPin },
    { id: 'opportunities', label: 'Opportunity Engine', icon: Sparkles },
    { id: 'simulator', label: '2047 Simulator', icon: TrendingUp },
    { id: 'clustering', label: 'ML Clusters', icon: Cpu },
    { id: 'compare', label: 'Compare', icon: BarChart2 },
    { id: 'portals', label: 'Portals', icon: Briefcase },
    { id: 'admin', label: 'Data Management', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#102A43] border-b border-[#1E3E5F] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Wordmark with subtle Indian tricolor accent bar */}
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-[#173B63] border border-[#2A527A] text-white flex items-center justify-center font-black text-sm tracking-widest shadow-xs group-hover:border-[#008C95] transition-colors">
                <span className="text-white">BH</span>
              </div>
              {/* Subtle elegant tricolor accent bar */}
              <div className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full flex overflow-hidden">
                <span className="w-1/3 bg-[#F59E0B]" />
                <span className="w-1/3 bg-white opacity-90" />
                <span className="w-1/3 bg-[#2E8B57]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                  BHARAT <span className="text-[#008C95]">2047</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#173B63] text-[#8EC5CC] border border-[#2A527A]">
                  AI Platform
                </span>
              </div>
              <div className="text-[10px] text-[#8EC5CC] tracking-wider uppercase font-semibold hidden md:block">
                Regional Development Intelligence
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links with Teal active indicators */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#173B63] text-white font-semibold shadow-xs border-b-2 border-[#008C95]'
                      : 'text-[#C5D5E4] hover:text-white hover:bg-[#173B63]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#008C95]' : 'text-[#8EC5CC]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Role Switcher & Primary Action (Expo Demo Mode) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Role Selector */}
            <div className="hidden sm:flex items-center text-xs bg-[#173B63] rounded-lg px-2.5 py-1.5 border border-[#2A527A]">
              <span className="text-[11px] font-medium text-[#8EC5CC] mr-1.5">Role:</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as any)}
                aria-label="Select user role"
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="public" className="bg-[#102A43] text-white">Public Citizen</option>
                <option value="youth" className="bg-[#102A43] text-white">Student / Youth</option>
                <option value="entrepreneur" className="bg-[#102A43] text-white">Entrepreneur</option>
                <option value="planner" className="bg-[#102A43] text-white">Regional Planner</option>
              </select>
            </div>

            {/* Expo Demo Button with Saffron Accent Accentuation */}
            <button
              onClick={onLaunchDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#102A43] bg-[#F59E0B] hover:bg-[#D97706] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#102A43]" />
              <span>Expo Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
