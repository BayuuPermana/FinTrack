import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import Button from '../components/ui/Button';

const SettingsPage = () => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();

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
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-300">
                        Current theme: <span className="font-semibold capitalize">{theme}</span>
                    </p>
                    <Button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        variant="ghost"
                        size="icon"
                    >
                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                </div>
            </Card>
        </div>
    );
};
export default SettingsPage;
