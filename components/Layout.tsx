import React from 'react';
import { LayoutDashboard, Camera, History, Settings, Home } from 'lucide-react';
import { UserSettings } from '../types';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  settings: UserSettings;
}

const Layout: React.FC<Props> = ({ children, activeTab, onTabChange, settings }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Resumo' },
    { id: 'scan', icon: Camera, label: 'Capturar' },
    { id: 'history', icon: History, label: 'Histórico' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className={`min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Simulator Container */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 min-h-screen shadow-2xl relative flex flex-col transition-colors duration-200">
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center pb-8 z-40 transition-colors duration-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;