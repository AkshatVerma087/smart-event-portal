const express = require('express');
const prisma = require('../prismaClient');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public: List all events
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create event
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, date, venue, totalSeats } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        totalSeats: parseInt(totalSeats, 10),
      },
    });
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update event
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, date, venue, totalSeats } = req.body;

  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        totalSeats: parseInt(totalSeats, 10),
      },
    });
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete event
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({ where: { id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
