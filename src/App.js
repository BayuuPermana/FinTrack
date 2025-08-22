import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BillsPage from './pages/BillsPage';
import GoalsPage from './pages/GoalsPage';
import BudgetsPage from './pages/BudgetsPage';
import SavingsPage from './pages/SavingsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AccountsPage from './pages/AccountsPage';
import { Home, PieChart as PieChartIcon, Settings, Target, CalendarDays, X, Menu, ArrowLeftRight, ClipboardList, PiggyBank, Wallet, ChevronsLeft } from 'lucide-react';

const App = () => {
    const [page, setPage] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { theme } = useTheme();

    const renderPage = () => {
        switch (page) {
            case 'dashboard': return <Dashboard />;
            case 'transactions': return <TransactionsPage />;
            case 'bills': return <BillsPage />;
            case 'goals': return <GoalsPage />;
            case 'budgets': return <BudgetsPage />;
            // case 'savings': return <SavingsPage />;
            case 'reports': return <ReportsPage />;
            case 'settings': return <SettingsPage />;
            case 'accounts': return <AccountsPage />;
            default: return <Dashboard />;
        }
    };
    
    const NavItem = ({ icon, label, pageName }) => (
        <button
            onClick={() => {
                setPage(pageName);
                if (window.innerWidth < 768) { // Tailwind's 'md' breakpoint
                    setSidebarOpen(false);
                }
            }}
            className={`flex items-center w-full px-4 py-2.5 text-base rounded-lg transition-colors duration-200 focus:outline-none ${
                page === pageName 
                ? 'bg-sky-500 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700'
            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
        >
            {icon}
            <span className={`ml-4 transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 hidden w-0' : 'opacity-100 w-auto'}`}>{label}</span>
        </button>
    );

    return (
        <AuthProvider>
            <DataProvider>
                <div className={`${theme} font-sans flex min-h-screen w-full bg-gray-50 dark:bg-gray-900`}>
                    {/* Sidebar Backdrop */}
                    {isSidebarOpen && (
                        <div 
                            onClick={() => setSidebarOpen(false)} 
                            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ease-in-out"
                        ></div>
                    )}

                    {/* Sidebar */}
                    <aside className={`fixed z-30 inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white dark:bg-gray-800 ${isSidebarCollapsed ? 'w-24' : 'w-64'} flex flex-col border-r border-gray-200 dark:border-gray-700 shrink-0`}>
                        <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className={`hidden md:flex items-center w-full p-4 h-16 shrink-0 focus:outline-none text-left ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                            <div className={`flex items-center overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                <div className="p-2 bg-sky-500 rounded-lg flex items-center justify-center w-10 h-10 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-4-4H7m10 0h-1" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-gray-800 dark:text-white whitespace-nowrap ml-3">FinTrack</span>
                            </div>
                            <div className="text-gray-400 dark:text-gray-500">
                                {isSidebarCollapsed ? 
                                    <Menu size={24} strokeWidth={2}/> : 
                                    <ChevronsLeft size={24} strokeWidth={2}/>
                                }
                            </div>
                        </button>
                        <nav className="flex-grow space-y-1 px-4 overflow-y-auto">
                            <NavItem icon={<Home size={22} />} label="Dashboard" pageName="dashboard" />
                            <NavItem icon={<ArrowLeftRight size={22} />} label="Transactions" pageName="transactions" />
                            <NavItem icon={<Wallet size={22} />} label="Accounts" pageName="accounts" />
                            <NavItem icon={<CalendarDays size={22} />} label="Bills" pageName="bills" />
                            <NavItem icon={<Target size={22} />} label="Goals" pageName="goals" />
                            <NavItem icon={<ClipboardList size={22} />} label="Budgets" pageName="budgets" />
                            {/* <NavItem icon={<PiggyBank size={22} />} label="Savings" pageName="savings" /> */}
                            <NavItem icon={<PieChartIcon size={22} />} label="Reports" pageName="reports" />
                        </nav>
                        <div className="px-4 py-2 shrink-0 mt-auto border-t border-gray-200 dark:border-gray-700">
                            <NavItem icon={<Settings size={22} />} label="Settings" pageName="settings" />
                        </div>
                        
                    </aside>

                    {/* Main Content */}
                    <main className={`flex-1 flex flex-col gap-6 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
                        <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-sky-500 rounded-lg flex items-center justify-center w-10 h-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-4-4H7m10 0h-1" />
                                    </svg>
                                </div>
                                <span className="text-xl font-.bold text-gray-800 dark:text-white">FinTrack</span>
                            </div>
                            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none">
                                {isSidebarOpen ? <ChevronsLeft size={24} strokeWidth={2}/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
                            </button>
                        </div>
                        
                        <div className="flex-1 max-w-7xl mx-auto w-full h-full">
                            {renderPage()}
                        </div>
                    </main>
                </div>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
