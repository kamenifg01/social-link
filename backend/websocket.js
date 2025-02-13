const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    
    this.init();
  }

  init() {
    this.wss.on('connection', async (ws, req) => {
      try {
        // Authentification
        const token = this.extractToken(req);
        if (!token) {
          ws.close(4001, 'Authentification requise');
          return;
        }

        const user = await this.authenticateUser(token);
        if (!user) {
          ws.close(4002, 'Utilisateur non trouvé');
          return;
        }

        // Stocker la connexion
        this.clients.set(user.id, ws);

        // Gérer les messages
        ws.on('message', (message) => this.handleMessage(user.id, message));

        // Gérer la déconnexion
        ws.on('close', () => {
          this.clients.delete(user.id);
        });

        // Envoyer un message de confirmation
        ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));

      } catch (error) {
        console.error('Erreur WebSocket:', error);
        ws.close(4000, 'Erreur de connexion');
      }
    });
  }

  extractToken(req) {
    const url = new URL(req.url, process.env.FRONTEND_URL || 'https://bf6e-31-14-70-38.ngrok-free.app');
    return url.searchParams.get('token');
  }

  async authenticateUser(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findByPk(decoded.id);
    } catch (error) {
      return null;
    }
  }

  handleMessage(userId, message) {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'ping':
          this.sendToUser(userId, { type: 'pong' });
          break;
        // Ajouter d'autres types de messages ici
      }
    } catch (error) {
      console.error('Erreur de traitement du message:', error);
    }
  }

  sendToUser(userId, data) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  broadcast(data, excludeUserId = null) {
    this.clients.forEach((ws, userId) => {
      if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }

  notifyUser(userId, notification) {
    this.sendToUser(userId, {
      type: 'notification',
      data: notification
    });
  }

  notifyNewMessage(userId, message) {
    this.sendToUser(userId, {
      type: 'new_message',
      data: message
    });
  }
}

module.exports = WebSocketServer; 