const express = require('express');
const router = express.Router();
const magazineController = require('../controllers/magazineController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateArticle } = require('../validators/magazineValidator');

// Get all articles
router.get('/', magazineController.getArticles);

// Get featured articles
router.get('/featured', magazineController.getFeaturedArticles);

// Get article by ID
router.get('/:id', magazineController.getArticleById);

// Create article (admin/editor)
router.post('/', authenticate, authorize(['admin', 'editor']), validateArticle, magazineController.createArticle);

// Update article
router.put('/:id', authenticate, authorize(['admin', 'editor']), magazineController.updateArticle);

// Delete article
router.delete('/:id', authenticate, authorize(['admin', 'editor']), magazineController.deleteArticle);

// Add comment
router.post('/:id/comments', authenticate, magazineController.addComment);

// Delete comment
router.delete('/:id/comments/:commentId', authenticate, magazineController.deleteComment);

// Increment views
router.post('/:id/views', magazineController.incrementViews);

module.exports = router;