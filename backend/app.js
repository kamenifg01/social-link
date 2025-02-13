require('dotenv').config();

const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const http = require('http');
const morgan = require('morgan');
const path = require('path');
const cacheControl = require('./middleware/cache');
const socketService = require('./services/socketService');

const app = express();
const server = http.createServer(app);

// Middleware de logging
app.use(morgan(':date[iso] :method :url'));

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://73e5-31-14-70-38.ngrok-free.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(cacheControl);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware d'authentification amélioré
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    console.log('Token présent:', token.substring(0, 10) + '...');
  } else {
    console.log('Aucun token fourni');
  }
  next();
});

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration des routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));
app.use('/api', require('./routes/reactionRoutes'));
app.use('/api', require('./routes/commentRoutes'));

// Initialisation de Socket.io via le service
socketService.initializeSocket(server);

// Middleware de logging détaillé
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.method !== 'GET') {
      console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie !");
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur de démarrage:", error);
    process.exit(1);
  }
};

startServer();

module.exports = { app };
