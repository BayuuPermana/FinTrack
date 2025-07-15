import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import formatCurrency from '../utils/formatCurrency';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
    const { transactions, loading } = useData();
    const { theme } = useTheme();

    if (loading) return <Spinner />;

    const monthlyData = transactions.reduce((acc, t) => {
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

    const chartData = {
        labels: sortedMonths.map(m => m.name),
        datasets: [
            {
                label: 'Income',
                data: sortedMonths.map(m => m.income),
                backgroundColor: '#a7f3d0',
                borderRadius: 4,
            },
            {
                label: 'Expense',
                data: sortedMonths.map(m => m.expense),
                backgroundColor: '#fecaca',
                borderRadius: 4,
            }
        ]
    };

    const chartOptions = {
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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
            <Card>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Monthly Cash Flow</h2>
                {sortedMonths.length > 0 ? (
                    <div style={{ height: '400px' }}>
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-16">Not enough data for a report. Add some transactions first.</p>
                )}
            </Card>
        </div>
    );
};

export default ReportsPage;
