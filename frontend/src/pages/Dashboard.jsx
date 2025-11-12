import React, { useState, useEffect } from 'react';
import { accountsAPI, transactionsAPI } from '../services/api';
import AccountCard from '../components/AccountCard';
import TransactionTable from '../components/TransactionTable';
import AnalyticsChart from '../components/AnalyticsChart';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [accountsRes, analyticsRes] = await Promise.all([
        accountsAPI.getAccounts(),
        transactionsAPI.getAnalytics()
      ]);

      setAccounts(accountsRes.data.data.accounts);
      setAnalytics(analyticsRes.data.data.analytics);

      // Load transactions for the first account
      if (accountsRes.data.data.accounts.length > 0) {
        const firstAccount = accountsRes.data.data.accounts[0];
        setSelectedAccount(firstAccount);
        await fetchTransactions(firstAccount.id);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId) => {
    try {
      const response = await transactionsAPI.getTransactions(accountId, 10);
      setTransactions(response.data.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0 || !selectedAccount) return;

    try {
      await transactionsAPI.deposit({
        account_id: selectedAccount.id,
        amount: parseFloat(depositAmount),
        description: 'Online deposit'
      });
      
      setDepositAmount('');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error making deposit:', error);
      alert(error.response?.data?.message || 'Deposit failed');
    }
  };

  const handleAccountSelect = async (account) => {
    setSelectedAccount(account);
    await fetchTransactions(account.id);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fintech-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Stats */}
      <div className="bg-fintech-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
              <p className="text-2xl font-bold">{formatCurrency(analytics.total_balance || 0)}</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Total Accounts</h3>
              <p className="text-2xl font-bold">{analytics.total_accounts || 0}</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Net Flow</h3>
              <p className="text-2xl font-bold">
                {formatCurrency((analytics.total_deposits || 0) - (analytics.total_withdrawals || 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <form onSubmit={handleDeposit} className="flex items-end gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Deposit
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Amount"
                      className="input-field w-32"
                    />
                    <button
                      type="submit"
                      disabled={!depositAmount || depositAmount <= 0 || !selectedAccount}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Deposit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="mb-8">
          <AnalyticsChart analytics={analytics} />
        </div>

        {/* Accounts Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Accounts</h2>
          </div>
          
          {accounts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">No accounts found</p>
              <button className="btn-primary">
                Create Your First Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div 
                  key={account.id}
                  className={`cursor-pointer transition-transform duration-200 hover:scale-105 ${
                    selectedAccount?.id === account.id ? 'ring-2 ring-fintech-blue' : ''
                  }`}
                  onClick={() => handleAccountSelect(account)}
                >
                  <AccountCard account={account} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions Section */}
        {selectedAccount && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Transactions - {selectedAccount.account_number}
            </h2>
            <TransactionTable transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;