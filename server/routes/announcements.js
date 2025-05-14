const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { representative: true }
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Get announcement by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: { representative: true }
    });
    if (announcement) {
      res.json(announcement);
    } else {
      res.status(404).json({ error: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});

// Create announcement
router.post('/', async (req, res) => {
  const { title, content, representativeId } = req.body;
  try {
    const newAnnouncement = await prisma.announcement.create({
      data: { title, content, representativeId }
    });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update announcement
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  try {
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: { title, content }
    });
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router;
