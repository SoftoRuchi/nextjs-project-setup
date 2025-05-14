const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all representatives
router.get('/', async (req, res) => {
  try {
    const reps = await prisma.representative.findMany({
      include: { location: true }
    });
    res.json(reps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch representatives' });
  }
});

// Get representative by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const rep = await prisma.representative.findUnique({
      where: { id },
      include: { location: true }
    });
    if (rep) {
      res.json(rep);
    } else {
      res.status(404).json({ error: 'Representative not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch representative' });
  }
});

// Create representative
router.post('/', async (req, res) => {
  const { name, responsibilities, locationId } = req.body;
  try {
    const newRep = await prisma.representative.create({
      data: { name, responsibilities, locationId }
    });
    res.status(201).json(newRep);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create representative' });
  }
});

// Update representative
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, responsibilities, locationId } = req.body;
  try {
    const updatedRep = await prisma.representative.update({
      where: { id },
      data: { name, responsibilities, locationId }
    });
    res.json(updatedRep);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update representative' });
  }
});

// Delete representative
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.representative.delete({ where: { id } });
    res.json({ message: 'Representative deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete representative' });
  }
});

module.exports = router;
