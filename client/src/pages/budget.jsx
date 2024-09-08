import { useEffect, useState } from 'react';


const Budget = () => {

  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, remainingBalance: 0 });

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSummary = async () => {
    setLoading(true); 
    try {
      
      const query = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }).toString();

      const response = await fetch(`http://localhost:5000/api/transactions/summary${query ? `?${query}` : ''}`);
      const data = await response.json();
      setSummary(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch budget summary:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate]);

  return(
    <div className="budget">
      <div className="budget-header">
        <h2>Budget Overview:</h2>
        <div className="date-filters">
          <label>
            Start Date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
        </div>
      </div>
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <div className='budget-summary'>
          <div className='total-income'>
            Total Income: ${summary.totalIncome.toFixed(2)}
          </div>
          <div className='total-expense'>
            Total Expense: ${summary.totalExpenses.toFixed(2)}
          </div>
          <div className='remaining-balance' style={{ color: summary.remainingBalance >= 0 ? "green" : "red" }}>
            Remaining Balance: ${summary.remainingBalance.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  )
};

export default Budget;