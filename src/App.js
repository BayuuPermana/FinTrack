import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BillsPage from './pages/BillsPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { Home, List, PieChart as PieChartIcon, Settings, Target, CalendarDays, X } from 'lucide-react';

const App = () => {
    const [page, setPage] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { theme } = useTheme();

    const renderPage = () => {
        switch (page) {
            case 'dashboard': return <Dashboard />;
            case 'transactions': return <TransactionsPage />;
            case 'bills': return <BillsPage />;
            case 'goals': return <GoalsPage />;
            case 'reports': return <ReportsPage />;
            case 'settings': return <SettingsPage />;
            default: return <Dashboard />;
        }
    };
    
    const NavItem = ({ icon, label, pageName }) => (
        <button
            onClick={() => {
                setPage(pageName);
                setSidebarOpen(false);
            }}
            className={`flex items-center w-full px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${
                page === pageName 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ml-4">{label}</span>
        </button>
    );

    return (
        <AuthProvider>
            <DataProvider>
                <div className={`${theme} font-sans flex min-h-screen`}>
                    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex w-full">
                        {/* Sidebar */}
                        <aside className={`fixed z-30 inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 w-64 p-6 space-y-6 flex flex-col shadow-2xl md:shadow-none`}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-600 rounded-lg flex items-center justify-center w-10 h-10">
                                   <span className="text-white font-bold text-lg">Rp</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">FinTrack</span>
                            </div>
                            <nav className="flex-grow space-y-2">
                                <NavItem icon={<Home size={24} />} label="Dashboard" pageName="dashboard" />
                                <NavItem icon={<List size={24} />} label="Transactions" pageName="transactions" />
                                <NavItem icon={<CalendarDays size={24} />} label="Bills" pageName="bills" />
                                <NavItem icon={<Target size={24} />} label="Goals" pageName="goals" />
                                <NavItem icon={<PieChartIcon size={24} />} label="Reports" pageName="reports" />
                            </nav>
                            <div>
                               <NavItem icon={<Settings size={24} />} label="Settings" pageName="settings" />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                            {/* Mobile Header */}
                            <div className="md:hidden flex justify-between items-center mb-4">
                                 <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-600 rounded-lg flex items-center justify-center w-10 h-10">
                                        <span className="text-white font-bold text-lg">Rp</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-800 dark:text-white">FinTrack</span>
                                </div>
                                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-md z-40">
                                    {isSidebarOpen ? <X size={24}/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
                                </button>
                            </div>
                            
                            <div className="max-w-7xl mx-auto">
                               {renderPage()}
                            </div>
                        </main>
                    </div>
                </div>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
