require('dotenv').config();

const express = require("express");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/comments");
const cors = require("cors");
const bodyParser = require('body-parser');
const { User, Job, Notification, Post } = require('./models');
const authenticateToken = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notification');
// Temporairement commenté en attendant la configuration Firebase
// const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques (auth)
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/posts', authenticateToken, postRoutes);
app.use('/api/comments', authenticateToken, commentRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
// Temporairement commenté
// app.use('/api/upload', uploadRoutes);

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  res.status(500).json({ 
    message: "Une erreur est survenue", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie !");
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur de démarrage:", error);
    process.exit(1);
  }
};

app.get('/api/network', authenticateToken, async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Erreur network:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du réseau" });
  }
});

app.get('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (error) {
    console.error('Erreur jobs:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des offres d'emploi" });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id }
    });
    res.json(notifications);
  } catch (error) {
    console.error('Erreur notifications:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des notifications" });
  }
});

app.get('/api/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.findAll({ 
      include: [User],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error('Erreur posts:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des posts" });
  }
});

startServer();

module.exports = app;
