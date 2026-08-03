import React, { useState, useEffect } from 'react';
import api from '../api';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/history');
        setBookings(res.data);
      } catch (err) {
        setError('Failed to fetch booking history');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2 className="mb-4">My Bookings</h2>
      {error && <div className="badge badge-danger mb-4">{error}</div>}
      {bookings.length === 0 && <p>You have no bookings yet.</p>}
      <div className="grid">
        {bookings.map(booking => (
          <div key={booking.id} className="card event-card">
            <h3 className="event-title">{booking.event.title}</h3>
            <p className="event-details">
              <strong>Date:</strong> {new Date(booking.event.date).toLocaleDateString()} {new Date(booking.event.date).toLocaleTimeString()}<br/>
              <strong>Venue:</strong> {booking.event.venue}<br/>
              <strong>Booked At:</strong> {new Date(booking.bookedAt).toLocaleString()}
            </p>
            <span className="badge badge-success" style={{alignSelf: 'flex-start'}}>Confirmed</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingHistory;
