import React from 'react';

const AccountCard = ({ account }) => {
  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'investment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {account.account_number}
          </h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.account_type)}`}>
            {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-fintech-blue">
            {formatCurrency(account.balance)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p className="font-medium">Total Deposits</p>
          <p className="text-green-600 font-semibold">
            {formatCurrency(account.total_deposits || 0)}
          </p>
        </div>
        <div>
          <p className="font-medium">Total Withdrawals</p>
          <p className="text-red-600 font-semibold">
            {formatCurrency(account.total_withdrawals || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;