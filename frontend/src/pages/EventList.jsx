import React, { useState, useEffect } from 'react';
import api from '../api';

function EventList({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBook = async (eventId) => {
    if (!user) {
      alert('Please login to book an event.');
      return;
    }
    try {
      await api.post('/bookings', { eventId });
      alert('Booking successful!');
      fetchEvents(); // Refresh seats
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <div className="loader-text">Loading Events...</div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Let's start your amazing event</div>
          <h1>Every event<br/>should feel <span className="accent">alive.</span></h1>
          <p className="sub">From welcoming delegations to full-scale conferences, we plan, staff, and run events end-to-end — so yours runs itself on the day.</p>
          <div className="cta-row">
            <button className="btn-primary">Browse Events</button>
            <div className="achievements">
              <div className="play-dot">▶</div> Achievements
            </div>
          </div>
        </div>

        <div className="orbit-wrap">
          <div className="orbit-glow"></div>
          <div className="ring ring3"></div>
          <div className="ring ring2"></div>
          <div className="ring ring1"></div>
          <div className="center-core">1,240<br/>guests</div>

          <div className="ring ring1" style={{animationDuration: '24s'}}>
            <div className="dot" style={{top: '-6px', left: '94px'}}></div>
          </div>
          <div className="ring ring2" style={{animationDuration: '36s', animationDirection: 'reverse'}}>
            <div className="dot amber" style={{top: '154px', left: '-6px'}}></div>
            <div className="dot small" style={{bottom: '-4px', right: '100px'}}></div>
          </div>
          <div className="ring ring3" style={{animationDuration: '48s'}}>
            <div className="dot" style={{top: '214px', right: '-6px'}}></div>
            <div className="dot small" style={{top: '40px', left: '60px'}}></div>
          </div>

          <div className="live-tag"><div className="pulse"></div> 2 events live now</div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="events-strip">
        {error && <div className="badge badge-danger mb-4" style={{width: '100%'}}>{error}</div>}
        {events.length > 0 ? events.map((event, index) => (
          <div key={event.id} className="event-card">
            <div className="event-title">{event.title}</div>
            <div className="event-meta">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {event.venue}
              <br/>
              <span style={{fontSize: '12px', marginTop: '4px', display: 'inline-block'}}>
                {event.totalSeats - event.bookedSeats} seats available / {event.totalSeats} total
              </span>
            </div>
            <div className="event-footer">
              <button 
                className="btn-primary" 
                onClick={() => handleBook(event.id)}
                disabled={event.totalSeats <= event.bookedSeats}
                style={{width: '100%', padding: '10px 16px', fontSize: '13px'}}
              >
                {event.totalSeats <= event.bookedSeats ? 'Fully Booked' : 'Book Now'}
              </button>
            </div>
          </div>
        )) : (
          <div style={{width: '100%', textAlign: 'center', padding: '4rem', color: 'var(--muted)'}}>
            No upcoming events found. Create some in the Admin Panel!
          </div>
        )}
      </section>
    </div>
  );
}

export default EventList;
