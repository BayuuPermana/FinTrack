import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import formatCurrency from '../utils/formatCurrency';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ArrowUpRight, ArrowDownLeft, Bell } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { transactions, goals, bills, loading } = useData();
    const { theme } = useTheme();

    if (loading) return <Spinner />;

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const pieData = {
        labels: Object.keys(expenseByCategory),
        datasets: [{
            data: Object.values(expenseByCategory),
            backgroundColor: ['#91ffccff', '#74c6f2ff', '#eebe86ff','#77f67dff','#99abf5ff', '#f99bd0ff', '#f68282ff'],
            hoverBackgroundColor: ['#3fffb2ff', '#33b6f2ff', '#faa041ff', '#43ed4cff', '#3251ebff', '#f648a8ff', '#f15b5bff']
        }]
    };
    
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: theme === 'dark' ? '#f3f4f6' : '#374151',
                    padding: 20,
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${formatCurrency(value)}`;
                    }
                }
            }
        }
    };

    const recentTransactions = [...transactions].sort((a, b) => b.date - a.date).slice(0, 4);
    const upcomingBills = [...bills]
        .filter(b => !b.isPaid && new Date(b.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 <Card className="bg-gradient-to-br from-green-200 to-green-300 text-green-800">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/40 p-3 rounded-full"><ArrowUpRight size={24} /></div>
                        <div>
                            <p className="text-lg">Total Income</p>
                            <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-red-200 to-red-300 text-red-800">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/40 p-3 rounded-full"><ArrowDownLeft size={24} /></div>
                        <div>
                            <p className="text-lg">Total Expense</p>
                            <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-200 to-purple-300 text-indigo-800">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/40 p-3 rounded-full flex items-center justify-center w-12 h-12">
                            <span className="text-2xl font-bold">Rp</span>
                        </div>
                        <div>
                            <p className="text-lg">Balance</p>
                            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-200 to-orange-300 text-yellow-800">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/40 p-3 rounded-full"><Bell size={24} /></div>
                        <div>
                            <p className="text-lg">Upcoming Bills</p>
                            <p className="text-3xl font-bold">{upcomingBills.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Expense by Category</h2>
                    {pieData.datasets[0].data.length > 0 ? (
                        <div style={{ height: '300px' }}>
                           <Pie data={pieData} options={pieOptions} />
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-12">No expense data to display.</p>
                    )}
                </Card>
                <Card className="lg:col-span-3">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recent Transactions</h2>
                    <div className="space-y-3">
                        {recentTransactions.length > 0 ? recentTransactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'}`}>
                                        {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{t.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.date.toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </p>
                            </div>
                        )) : <p className="text-center text-gray-500 dark:text-gray-400 py-12">No recent transactions.</p>}
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Financial Goals</h2>
                    <div className="space-y-4">
                        {goals.length > 0 ? goals.slice(0,3).map(goal => (
                            <div key={goal.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">{goal.name}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(goal.currentAmount || 0)} / {formatCurrency(goal.targetAmount)}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full" style={{ width: `${((goal.currentAmount || 0) / goal.targetAmount) * 100}%` }}></div>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">You haven't set any goals yet.</p>}
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Upcoming Bills</h2>
                    <div className="space-y-3">
                        {upcomingBills.length > 0 ? upcomingBills.map(bill => (
                            <div key={bill.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{bill.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                                </div>
                                <p className="font-bold text-orange-500">{formatCurrency(bill.amount)}</p>
                            </div>
                        )) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">No upcoming bills. You're all caught up!</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
