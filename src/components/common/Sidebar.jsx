import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  BarChart3,
  Wheat,
  Truck,
  Gavel,
  FileText,
  CloudRain,
  Newspaper,
  MessageCircle,
  Users,
  Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, userRole }) => {
  const { t } = useLanguage();

  const getMenuItems = () => {
    const common = [
      { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
      { id: 'chat', label: t('chat'), icon: MessageCircle },
    ];

    const roleSpecific = {
      farmer: [
        { id: 'crops', label: t('crops'), icon: Wheat },
        { id: 'equipment', label: t('equipment'), icon: Truck },
        { id: 'auctions', label: t('auctions'), icon: Gavel },
        { id: 'schemes', label: t('schemes'), icon: FileText },
        { id: 'weather', label: t('weather'), icon: CloudRain },
        { id: 'news', label: t('news'), icon: Newspaper },
      ],
      buyer: [
        { id: 'crops', label: t('crops'), icon: Wheat },
        { id: 'auctions', label: t('auctions'), icon: Gavel },
        { id: 'news', label: t('news'), icon: Newspaper },
      ],
      admin: [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'schemes', label: t('schemes'), icon: FileText },
        { id: 'crops', label: t('crops'), icon: Wheat },
        { id: 'news', label: t('news'), icon: Newspaper },
      ],
      equipmentSeller: [
        { id: 'equipment', label: t('equipment'), icon: Truck },
        { id: 'news', label: t('news'), icon: Newspaper },
      ],
      consumer: [
        { id: 'crops', label: t('crops'), icon: Wheat },
        { id: 'news', label: t('news'), icon: Newspaper },
      ]
    };

    return [...common, ...(roleSpecific[userRole] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;