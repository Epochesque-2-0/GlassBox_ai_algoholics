import React from 'react';
import { 
  LayoutDashboard, 
  ListTree, 
  Bot, 
  BarChart3, 
  Settings,
  Terminal
} from 'lucide-react';
import { useRuns } from '../context/RunContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, setSelectedRunId } = useRuns();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'runs', label: 'Runs', icon: ListTree },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (id !== 'runs') {
      setSelectedRunId(null);
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <Terminal size={16} strokeWidth={2.5} />
        </div>
        <div>
          <span className="brand-title">GlassBox</span>
        </div>
      </div>

      {/* Navigation Group */}
      <nav className="nav-group">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot-green" />
          <span>Tracing Active</span>
        </div>
      </div>
    </aside>
  );
}
