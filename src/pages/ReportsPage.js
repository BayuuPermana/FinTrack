import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import formatCurrency from '../utils/formatCurrency';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const ReportsPage = () => {
    const { transactions, accounts, loading } = useData();
    const { theme } = useTheme();
    const [selectedAccountId, setSelectedAccountId] = useState('all');

    const filteredTransactions = useMemo(() => {
        if (selectedAccountId === 'all') {
            return transactions;
        }
        return transactions.filter(t => t.accountId === selectedAccountId);
    }, [transactions, selectedAccountId]);

    if (loading) return <Spinner />;

    const monthlyData = filteredTransactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = { income: 0, expense: 0, name: month };
        }
        if (t.type === 'income') {
            acc[month].income += t.amount;
        } else {
            acc[month].expense += t.amount;
        }
        return acc;
    }, {});

    const sortedMonths = Object.values(monthlyData).sort((a,b) => new Date(a.name) - new Date(b.name));

    const totalIncome = sortedMonths.reduce((acc, m) => acc + m.income, 0);
    const totalExpense = sortedMonths.reduce((acc, m) => acc + m.expense, 0);

    const dailyExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const date = new Date(t.date).toLocaleDateString('en-CA'); // YYYY-MM-DD for sorting
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += t.amount;
            return acc;
        }, {});

    const sortedDailyExpenses = Object.entries(dailyExpenses)
        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        .map(([date, amount]) => ({ date: new Date(date).toLocaleDateString('default', { month: 'short', day: 'numeric' }), amount }));

    const barChartData = {
        labels: sortedMonths.map(m => m.name),
        datasets: [
            {
                type: 'bar',
                label: 'Income',
                data: sortedMonths.map(m => m.income),
                backgroundColor: '#a7f3d0',
                borderRadius: 4,
            },
            {
                type: 'bar',
                label: 'Expense',
                data: sortedMonths.map(m => m.expense),
                backgroundColor: '#fecaca',
                borderRadius: 4,
            },
            {
                type: 'line',
                label: 'Net Flow',
                data: sortedMonths.map(m => m.income - m.expense),
                borderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                backgroundColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                pointBackgroundColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                tension: 0.2,
                yAxisID: 'y',
                borderWidth: 3, 
                pointRadius: 5, 
                pointHoverRadius: 7,
            }
        ]
    };

    const pieChartData = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                data: [totalIncome, totalExpense],
                backgroundColor: ['#a7f3d0', '#fecaca'],
                borderColor: [theme === 'dark' ? '#374151' : '#ffffff', theme === 'dark' ? '#374151' : '#ffffff'],
                borderWidth: 2,
            }
        ]
    };

    const lineChartData = {
        labels: sortedDailyExpenses.map(d => d.date),
        datasets: [
            {
                label: 'Daily Expenses',
                data: sortedDailyExpenses.map(d => d.amount),
                borderColor: theme === 'dark' ? '#fca5a5' : '#ef4444',
                backgroundColor: theme === 'dark' ? 'rgba(252, 165, 165, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.1,
                pointStyle: 'rectRot',
                pointBackgroundColor: theme === 'dark' ? '#fca5a5' : '#ef4444',
                pointRadius: 5,
                pointHoverRadius: 7,
            }
        ]
    };

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: theme === 'dark' ? '#f3f4f6' : '#374151',
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                titleColor: '#f3f4f6',
                bodyColor: '#f3f4f6',
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`
                }
            }
        },
    };

    const barChartOptions = {
        ...commonChartOptions,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                }
            },
            y: {
                grid: {
                    color: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                },
                ticks: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    callback: (value) => formatCurrency(value)
                }
            }
        }
    };

    const lineChartOptions = { 
        ...barChartOptions,
        animation: {
            x: {
                type: 'number',
                easing: 'linear',
                duration: 1500,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * 100;
                },
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: 1000,
                from: (ctx) => {
                    if (ctx.type === 'data') {
                        return ctx.chart.scales.y.getBasePixel();
                    }
                    return undefined;
                }
            }
        }
    };

    const pieChartOptions = {
        ...commonChartOptions,
        plugins: {
            ...commonChartOptions.plugins,
            legend: {
                position: 'bottom',
                 labels: {
                    color: theme === 'dark' ? '#f3f4f6' : '#374151',
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
                <select 
                    value={selectedAccountId} 
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="block w-48 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                >
                    <option value="all">All Accounts</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Monthly Cash Flow</h2>
                    {sortedMonths.length > 0 ? (
                        <div style={{ height: '400px' }}>
                            <Bar options={barChartOptions} data={barChartData} />
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-16">Not enough data for a report. Add some transactions first.</p>
                    )}
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Income vs Expense</h2>
                    {totalIncome > 0 || totalExpense > 0 ? (
                        <div style={{ height: '400px', display: 'flex', justifyContent: 'center' }}>
                            <Pie options={pieChartOptions} data={pieChartData} />
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-16">Not enough data for a report. Add some transactions first.</p>
                    )}
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Daily Expense Trend</h2>
                    {sortedDailyExpenses.length > 1 ? (
                        <div style={{ height: '400px' }}>
                            <Line options={lineChartOptions} data={lineChartData} />
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-16">Not enough expense data for a trend line. Please add more expense records.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ReportsPage;
