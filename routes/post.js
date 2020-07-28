const express = require("express");


// check if user have valid token
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/post");

const router = express.Router();

/*
***************************ROUTES***********************************
*/
router.post('', checkAuth, PostController.createPosts);
router.post('/savepost', checkAuth, PostController.savePostForm);
router.get('', PostController.getPosts);
router.delete('/:id', checkAuth, PostController.deletePosts);
router.put('/:id', checkAuth, PostController.updatePosts);
router.put('/saveeditpost/:idPost', checkAuth, PostController.editPostDataForm);
router.get("/:id", PostController.getPost);
router.get("/alldata/:id", PostController.getPostAllData);
// router.get("/userposts/:creator", PostController.getUsersPosts);
router.get("/userposts/:creator", checkAuth, PostController.getPostsByUser);

module.exports = router;
