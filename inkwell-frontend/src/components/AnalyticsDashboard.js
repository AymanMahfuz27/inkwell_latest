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
import { ChevronDown } from 'lucide-react';
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
  const [selectedView, setSelectedView] = useState('profile');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/analytics/');
      setAnalytics(response.data);
      if (response.data.book_analytics.length > 0) {
        setSelectedBook(response.data.book_analytics[0].id);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  const { user_analytics, book_analytics } = analytics;

  const renderProfileAnalytics = () => {
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
        legend: { position: 'top' },
        title: { display: true, text: 'Follower Growth Over Time' }
      }
    };

    return (
      <div className="analytics-content">
        <div className="analytics-charts">
          <div className="analytics-chart">
            <Line data={followerData} options={followerOptions} />
          </div>
        </div>
        <div className="analytics-stats">
          <div className="stat-item">
            <span className="stat-label">Profile Views</span>
            <span className="stat-value">{user_analytics.profile_views}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Book Likes</span>
            <span className="stat-value">{user_analytics.total_book_likes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Book Views</span>
            <span className="stat-value">{user_analytics.total_book_views}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${user_analytics.total_revenue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBookAnalytics = () => {
    const book = book_analytics.find(b => b.id === selectedBook);
    if (!book) return null;

    const engagementData = {
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
    };

    const geoData = {
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
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Book Analytics' }
      }
    };

    return (
      <div className="analytics-content">
        <div className="analytics-charts">
          <div className="analytics-chart">
            <Bar data={engagementData} options={chartOptions} />
          </div>
          <div className="analytics-chart">
            <Pie data={geoData} options={chartOptions} />
          </div>
        </div>
        <div className="analytics-stats">
          <div className="stat-item">
            <span className="stat-label">Views</span>
            <span className="stat-value">{book.view_count}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Unique Views</span>
            <span className="stat-value">{book.unique_view_count}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed Reads</span>
            <span className="stat-value">{book.completed_reads}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Reading Time</span>
            <span className="stat-value">{book.total_reading_time}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Likes</span>
            <span className="stat-value">{book.likes_count}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">${book.revenue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-selector">
        <select 
          value={selectedView} 
          onChange={(e) => setSelectedView(e.target.value)}
          className="analytics-dropdown"
        >
          <option value="profile">Profile Analytics</option>
          <option value="books">Book Analytics</option>
        </select>
        <ChevronDown className="dropdown-icon" />
      </div>
      {selectedView === 'profile' ? (
        renderProfileAnalytics()
      ) : (
        <>
          <div className="analytics-selector">
            <select 
              value={selectedBook} 
              onChange={(e) => setSelectedBook(Number(e.target.value))}
              className="analytics-dropdown"
            >
              {book_analytics.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
            <ChevronDown className="dropdown-icon" />
          </div>
          {renderBookAnalytics()}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;