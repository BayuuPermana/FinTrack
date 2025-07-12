import React from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import formatCurrency from '../utils/formatCurrency';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
    const { transactions, loading } = useData();

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

    const chartData = Object.values(monthlyData).sort((a,b) => new Date(a.name) - new Date(b.name));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
            <Card>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Monthly Cash Flow</h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                    borderColor: '#4b5563',
                                    borderRadius: '0.75rem'
                                }}
                                labelStyle={{ color: '#f3f4f6' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                            <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-16">Not enough data for a report. Add some transactions first.</p>
                )}
            </Card>
        </div>
    );
};

export default ReportsPage;
