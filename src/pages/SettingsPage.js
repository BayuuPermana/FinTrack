import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';

const SettingsPage = () => {
    const { user } = useAuth();
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <Card>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">User Information</h2>
                {user ? (
                    <div>
                        <p className="text-gray-600 dark:text-gray-300">
                            You are logged in with User ID:
                        </p>
                        <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded-md mt-2 break-all">
                            {user.uid}
                        </p>
                         <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs">
                            This ID is used to securely store your financial data.
                        </p>                        <p className="text-gray-600 dark:text-gray-300 mt-4">
                            You are currently using an anonymous account. Your data is saved locally.
                        </p>

                    </div>
                ) : (
                    <p>Not logged in.</p>
                )}
            </Card>
             <Card>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Theme</h2>
                <p className="text-gray-600 dark:text-gray-300">Theme switching is not yet implemented.</p>
            </Card>
        </div>
    );
};

export default SettingsPage;
