const { Post, User, Comment } = require('../models');

exports.getAllPosts = async () => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'profilePicture', 'title']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'profilePicture']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      likes: post.likes || 0,
      authorName: post.author?.name || post.author?.email?.split('@')[0],
      authorTitle: post.author?.title || 'Membre',
      authorAvatar: post.author?.profilePicture,
      authorId: post.author?.id,
      comments: post.comments?.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        authorName: comment.author?.name || comment.author?.email?.split('@')[0],
        authorAvatar: comment.author?.profilePicture,
        authorId: comment.author?.id
      }))
    }));
  } catch (error) {
    throw new Error('Erreur lors de la récupération des posts: ' + error.message);
  }
};

exports.getPostById = async (postId) => {
  const post = posts.find(post => post.id === parseInt(postId));
  if (!post) throw new Error('Post not found');
  return post;
};

exports.createPost = async (postData) => {
  const newPost = { id: posts.length + 1, ...postData };
  posts.push(newPost);
  return newPost;
};

exports.updatePost = async (postId, postData) => {
  const index = posts.findIndex(post => post.id === parseInt(postId));
  if (index !== -1) {
    posts[index] = { ...posts[index], ...postData };
    return posts[index];
  }
  throw new Error('Post not found');
};

exports.deletePost = async (postId) => {
  const index = posts.findIndex(post => post.id === parseInt(postId));
  if (index !== -1) {
    posts.splice(index, 1);
  } else {
    throw new Error('Post not found');
  }
}; 