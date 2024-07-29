import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import api from '../services/api';
import '../css/AnalyticsDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/analytics/');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  const { user_analytics, book_analytics } = analytics;

  const followerData = {
    labels: Object.keys(user_analytics.follower_count_history),
    datasets: [{
      label: 'Follower Growth',
      data: Object.values(user_analytics.follower_count_history),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const followerOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Follower Growth Over Time'
      }
    }
  };

  return (
    <div className="analytics-dashboard">
      <h2>Your Analytics Dashboard</h2>
      
      <div className="user-analytics">
        <h3>Profile Analytics</h3>
        <p>Total Profile Views: {user_analytics.profile_views}</p>
        <Line data={followerData} options={followerOptions} />
        <p>Total Book Likes: {user_analytics.total_book_likes}</p>
        <p>Total Book Views: {user_analytics.total_book_views}</p>
        <p>Total Revenue: ${user_analytics.total_revenue.toFixed(2)}</p>
      </div>
      
      <div className="book-analytics">
        <h3>Book Analytics</h3>
        {book_analytics.map(book => (
          <div key={book.id} className="book-analytics-item">
            <h4>{book.title}</h4>
            <p>Views: {book.view_count}</p>
            <p>Unique Views: {book.unique_view_count}</p>
            <p>Completed Reads: {book.completed_reads}</p>
            <p>Total Reading Time: {book.total_reading_time}</p>
            <p>Likes: {book.likes_count}</p>
            <p>Revenue: ${book.revenue.toFixed(2)}</p>
            
            <Bar
              data={{
                labels: ['Views', 'Unique Views', 'Completed Reads', 'Likes'],
                datasets: [{
                  label: 'Book Engagement',
                  data: [book.view_count, book.unique_view_count, book.completed_reads, book.likes_count],
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                  ]
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Book Engagement Metrics'
                  }
                }
              }}
            />
            
            <Pie
              data={{
                labels: Object.keys(book.geographic_distribution),
                datasets: [{
                  data: Object.values(book.geographic_distribution),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                  ]
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Geographic Distribution'
                  }
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;