'use strict';

var express = require('express');
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/testing/:page', controller.paginate);
router.get('/newsfeed/:page', auth.isAuthenticated(), controller.newsfeed);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:type/:id/:page', auth.isAuthenticated(), controller.index);

router.post('/createPost', auth.isAuthenticated(), controller.createPost);
router.post('/addComment', auth.isAuthenticated(), controller.addComment);
router.post('/:id', auth.belongsTo(), controller.createPost); //What does this do?

router.put('/:id', controller.update);

router.patch('/:id', controller.update);

router.delete('/:id', controller.destroy);

module.exports = router;
