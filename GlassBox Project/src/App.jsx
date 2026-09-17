import React from 'react';
import { RunProvider, useRuns } from './context/RunContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import OverviewPage from './pages/OverviewPage';
import RunsPage from './pages/RunsPage';
import AgentsPage from './pages/AgentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function DashboardContent() {
  const { activeTab } = useRuns();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'runs':
        return <RunsPage />;
      case 'agents':
        return <AgentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="page-container">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RunProvider>
      <DashboardContent />
    </RunProvider>
  );
}
