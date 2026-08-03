import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      alert('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, date, venue, totalSeats: parseInt(totalSeats) };
    try {
      if (editId) {
        await api.put(`/events/${editId}`, payload);
        alert('Event updated');
      } else {
        await api.post('/events', payload);
        alert('Event created');
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/events/${id}`);
      alert('Event deleted');
      fetchEvents();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setTitle(event.title);
    setDescription(event.description || '');
    // Format date for datetime-local input
    const d = new Date(event.date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setDate(d.toISOString().slice(0, 16));
    setVenue(event.venue);
    setTotalSeats(event.totalSeats);
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setVenue('');
    setTotalSeats('');
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      <h2 className="mb-4">Admin Panel - Manage Events</h2>
      
      <div className="card mb-4">
        <h3>{editId ? 'Edit Event' : 'Create New Event'}</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group">
            <label>Title</label>
            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
          </div>
          <div className="form-group">
            <label>Date & Time</label>
            <input type="datetime-local" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input type="text" className="form-control" value={venue} onChange={e => setVenue(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Total Seats</label>
            <input type="number" className="form-control" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} required min="1" />
          </div>
          <button type="submit" className="btn btn-primary">{editId ? 'Update Event' : 'Create Event'}</button>
          {editId && <button type="button" className="btn btn-danger" style={{marginLeft: '10px'}} onClick={resetForm}>Cancel</button>}
        </form>
      </div>

      <h3>Existing Events</h3>
      <div className="grid mt-4">
        {events.map(event => (
          <div key={event.id} className="card event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-details">
              {new Date(event.date).toLocaleString()} <br/>
              {event.venue} <br/>
              Seats: {event.totalSeats} (Booked: {event.bookedSeats})
            </p>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn btn-primary" style={{flex: 1}} onClick={() => handleEdit(event)}>Edit</button>
              <button className="btn btn-danger" style={{flex: 1}} onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
