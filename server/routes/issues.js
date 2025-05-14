const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all issues
router.get('/', async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        user: true,
        representative: true
      }
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get issue by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        user: true,
        representative: true
      }
    });
    if (issue) {
      res.json(issue);
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

// Create issue
router.post('/', async (req, res) => {
  const { title, description, userId, representativeId } = req.body;
  try {
    const newIssue = await prisma.issue.create({
      data: { title, description, userId, representativeId }
    });
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// Update issue
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, status } = req.body;
  try {
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: { title, description, status }
    });
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

// Delete issue
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.issue.delete({ where: { id } });
    res.json({ message: 'Issue deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete issue' });
  }
});

module.exports = router;
