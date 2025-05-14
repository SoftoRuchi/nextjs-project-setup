const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get location by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const location = await prisma.location.findUnique({
      where: { id }
    });
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Create location
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newLocation = await prisma.location.create({
      data: { name }
    });
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// Update location
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  try {
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: { name }
    });
    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.location.delete({ where: { id } });
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

module.exports = router;
