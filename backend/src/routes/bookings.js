const express = require('express');
const prisma = require('../prismaClient');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get booking history for the logged-in user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        event: true,
      },
      orderBy: { bookedAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book an event
router.post('/', authMiddleware, async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch the event
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      // 2. Check seats
      if (event.bookedSeats >= event.totalSeats) {
        throw new Error('Event is fully booked');
      }

      // 3. Create booking
      const booking = await tx.booking.create({
        data: {
          userId,
          eventId,
        },
      });

      // 4. Increment bookedSeats
      await tx.event.update({
        where: { id: eventId },
        data: { bookedSeats: { increment: 1 } },
      });

      return booking;
    });

    res.status(201).json({ message: 'Booking successful', booking: result });
  } catch (error) {
    console.error('Booking error:', error);
    if (error.message === 'Event not found' || error.message === 'Event is fully booked') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
