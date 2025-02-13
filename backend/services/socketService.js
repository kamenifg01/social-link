const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { User, Notification } = require('../models');

let io;
const connectedUsers = new Map();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://bf6e-31-14-70-38.ngrok-free.app",
  methods: ["GET", "POST"],
  credentials: true
};

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: corsOptions,
    pingTimeout: 5000,
    pingInterval: 10000
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: ' + error.message));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    // Stocker la connexion de l'utilisateur
    connectedUsers.set(socket.user.id, socket);
    
    // Rejoindre une room personnelle pour les notifications
    socket.join(`user:${socket.user.id}`);

    // Émettre l'événement de connexion réussie
    socket.emit('connected', {
      userId: socket.user.id,
      socketId: socket.id
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      connectedUsers.delete(socket.user.id);
      socket.leave(`user:${socket.user.id}`);
    });

    // Gérer les erreurs de socket
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.id}:`, error);
    });

    // Ping/Pong pour garder la connexion active
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  return io;
};

const sendNotification = async (notification) => {
  try {
    // Sauvegarder la notification en base de données
    const savedNotification = await Notification.create(notification);

    // Charger les relations
    const fullNotification = await Notification.findByPk(savedNotification.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'profilePicture']
        }
      ]
    });

    // Envoyer la notification en temps réel
    if (io) {
      io.to(`user:${notification.userId}`).emit('notification', fullNotification);
    }

    return fullNotification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.update({ isRead: true });

    // Informer le client que la notification a été lue
    if (io) {
      io.to(`user:${userId}`).emit('notificationRead', notificationId);
    }

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const isUserConnected = (userId) => {
  return connectedUsers.has(userId);
};

const getUserSocket = (userId) => {
  return connectedUsers.get(userId);
};

const broadcastToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    return true;
  }
  return false;
};

module.exports = {
  initializeSocket,
  sendNotification,
  markNotificationAsRead,
  isUserConnected,
  getUserSocket,
  broadcastToUser
}; 