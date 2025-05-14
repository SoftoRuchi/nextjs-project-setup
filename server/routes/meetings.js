const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      include: { representative: true }
    });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Get meeting by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: { representative: true }
    });
    if (meeting) {
      res.json(meeting);
    } else {
      res.status(404).json({ error: 'Meeting not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
});

// Create meeting
router.post('/', async (req, res) => {
  const { title, description, date, representativeId } = req.body;
  try {
    const newMeeting = await prisma.meeting.create({
      data: { title, description, date: new Date(date), representativeId }
    });
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// Update meeting
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, date } = req.body;
  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: { title, description, date: new Date(date) }
    });
    res.json(updatedMeeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meeting' });
  }
});

// Delete meeting
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.meeting.delete({ where: { id } });
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
});

module.exports = router;
