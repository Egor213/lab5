// StockChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const StockChart = ({ data, name }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const labels = data.map(item => item.Date);
    const values = data.map(item => parseFloat(item.Open));
    setChartData({
      labels: labels,
      datasets: [
        {
          label: name,
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
      ],
    });
  }, [data]);

  if (!chartData) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div>
      <h3>График изменения курса акций</h3>
      <Line data={chartData}  />
    </div>
  );
};

export default StockChart;
