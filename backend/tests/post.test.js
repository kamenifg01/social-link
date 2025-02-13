const request = require('supertest');
const app = require('../app');
const { Post, User, sequelize } = require('../models');
const jwt = require('jsonwebtoken');

describe('Post Sharing Features', () => {
  let testUser;
  let testPost;
  let authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Créer un utilisateur de test
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });

    // Créer un post de test
    testPost = await Post.create({
      content: 'Post original pour les tests',
      authorId: testUser.id,
      type: 'original',
      visibility: 'public'
    });

    // Générer un token d'authentification
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET);
  });

  describe('POST /api/posts/:id/share', () => {
    test('devrait créer un repost avec succès', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shareType: 'repost',
          content: 'Mon repost'
        });

      expect(response.status).toBe(201);
      expect(response.body.post.type).toBe('repost');
      expect(response.body.post.originalPostId).toBe(testPost.id);
    });

    test('devrait créer un partage avec un message personnalisé', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shareType: 'share',
          customMessage: 'Regardez ce super post !',
          visibility: 'connections'
        });

      expect(response.status).toBe(201);
      expect(response.body.post.type).toBe('share');
      expect(response.body.post.customMessage).toBe('Regardez ce super post !');
      expect(response.body.post.visibility).toBe('connections');
    });

    test('devrait partager avec un public ciblé', async () => {
      const targetUser = await User.create({
        username: 'targetuser',
        email: 'target@test.com',
        password: 'password123'
      });

      const response = await request(app)
        .post(`/api/posts/${testPost.id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shareType: 'share',
          targetAudience: [targetUser.id],
          customMessage: 'Partage privé'
        });

      expect(response.status).toBe(201);
      expect(response.body.post.type).toBe('share');
      // Vérifier la création de la notification
      const notifications = await Notification.findAll({
        where: { userId: targetUser.id }
      });
      expect(notifications.length).toBe(1);
    });
  });

  describe('DELETE /api/posts/:id/share', () => {
    test('devrait supprimer un partage avec succès', async () => {
      // D'abord créer un partage
      const share = await Post.create({
        type: 'share',
        originalPostId: testPost.id,
        authorId: testUser.id
      });

      const response = await request(app)
        .delete(`/api/posts/${testPost.id}/share`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      
      // Vérifier que le partage a été supprimé
      const deletedShare = await Post.findByPk(share.id);
      expect(deletedShare).toBeNull();
    });
  });

  describe('GET /api/posts/:id/shares', () => {
    test('devrait récupérer tous les partages d\'un post', async () => {
      // Créer plusieurs partages
      await Post.bulkCreate([
        {
          type: 'repost',
          originalPostId: testPost.id,
          authorId: testUser.id
        },
        {
          type: 'share',
          originalPostId: testPost.id,
          authorId: testUser.id,
          customMessage: 'Test share'
        }
      ]);

      const response = await request(app)
        .get(`/api/posts/${testPost.id}/shares`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(share => share.type === 'repost')).toBe(true);
      expect(response.body.some(share => share.type === 'share')).toBe(true);
    });

    test('devrait filtrer par type de partage', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}/shares?type=repost`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.every(share => share.type === 'repost')).toBe(true);
    });
  });

  describe('PUT /api/posts/:id/visibility', () => {
    test('devrait mettre à jour la visibilité d\'un post', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPost.id}/visibility`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ visibility: 'connections' });

      expect(response.status).toBe(200);
      expect(response.body.visibility).toBe('connections');
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
}); 