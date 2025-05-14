const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Import routes
const usersRouter = require('./routes/users');
const representativesRouter = require('./routes/representatives');
const issuesRouter = require('./routes/issues');
const postsRouter = require('./routes/posts');
const announcementsRouter = require('./routes/announcements');
const meetingsRouter = require('./routes/meetings');
const locationsRouter = require('./routes/locations');

// Mount routes
app.use('/api/users', usersRouter);
app.use('/api/representatives', representativesRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/locations', locationsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
