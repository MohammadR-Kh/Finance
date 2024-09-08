import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);


const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions/chart-data');
        const data = await response.json();

        const incomeData = [];
        const expenseData = [];
        const balanceData = [];
        const labels = [];

        let cumulativeBalance = 0;

        Object.entries(data).forEach(([date, values]) => {
          labels.push(date);
          const income = values.Income || 0;
          const expense = values.Expense || 0;
          incomeData.push(income);
          expenseData.push(expense);

          cumulativeBalance += income - expense;
          balanceData.push(cumulativeBalance);
        });

        setChartData({
          incomeData,
          expenseData,
          balanceData,
        });
        setLabels(labels);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: chartData.incomeData,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: chartData.expenseData,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Total Balance',
        data: chartData.balanceData,
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income, Expenses, and Total Balance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  return(
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard:</h2>
      </div>
      <Line data={data} options={options} />
    </div>
  )
};

export default Dashboard;