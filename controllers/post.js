//import shema
const Post = require('../models/post');
const DateControl = require('../models/dateControl');


/*
***************************POST REQUEST***********************************
*/
exports.createPosts = (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        phone: req.body.phone,
        address: req.body.address,
        valid: req.body.valid,
        creator: req.userData.userId,
        postNumber: req.body.postNumber,
        category: req.body.category,
        price: req.body.price,
        dateControlId: req.body.dateControlId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added succesfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                phone: createdPost.phone,
                address: createdPost.address,
                valid: createdPost.valid,
                creator: req.body.creator,
                postNumber: req.body.postNumber,
                category: createdPost.category,
                price: createdPost.price,
                dateControlId: req.body.dateControlId
            }
        });
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'Creating a post failed'
        })
    });
};
/*
***************************GET REQUEST***********************************
*/
exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Post fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
};

/*
***************************DELETE REQUEST***********************************
*/
exports.deletePosts = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'deletion successfull' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
};


/*
***************************PUT/UPDATE REQUEST***********************************
*/
exports.updatePosts = (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        phone: req.body.phone,
        address: req.body.address,
        valid: req.body.valid,
        creator: req.userData.userId,
        postNumber: req.body.postNumber,
        category: req.body.category,
        price: req.body.price,
        dateControlId: req.body.dateControlId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: 'update successfull' });
        } else {
            res.status(401).json({ message: 'Not authorized!' });
        }
    })
        .catch(error => {
            res.status(500).json({
                message: 'Couldnt update post!'
            });
        });
};


/*
***************************GET REQUEST***********************************
  BY ID
*/
exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Fetching posts failed'
        });
    });
};

exports.getPostAllData = (req, res, next) => {
    Post.findById(req.params.id).populate('dateControlId').then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching posts failed'
        });
    });
};

/*
  ********************* GET all users posts ******************************
 */

exports.getUsersPosts = (req, res, next) => {
    Post.find({ creator: req.params.creator }).then(result => {
        if(!result) {
            res.status(401).json({
                message: "User post's can't be found"
            });
        }else{
            res.status(200).json(result);
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching user posts failed'
        });
    });
};

/*
*   ************************** POST: EDIT POST WITH ALL THE DATA REQUEST ***************************
 */
exports.editPostDataForm = (req, res, next) => {
    const post = new Post({
        _id: req.params.idPost,
        title: req.body.title,
        content: req.body.content,
        phone: req.body.phone,
        address: req.body.address,
        valid: req.body.valid,
        creator: req.userData.userId,
        postNumber: req.body.postNumber,
        category: req.body.category,
        price: req.body.price,
    });
    // call mongoose to update
    Post.findOneAndUpdate({_id: req.params.idPost}, post).then(result => {
        if (result) {
            const dateControlModel = new DateControl({
                _id: result.dateControlId,
                dateTimeFrom: req.body.dateTimeFrom,
                dateTimeTo: req.body.dateTimeTo,
                dateTimeCreated: req.body.dateTimeCreated,
                dateTimeEdited: req.body.dateTimeEdited
            });

            DateControl.updateOne({_id: result.dateControlId}, dateControlModel).then(result => {
                if (result.n > 0) {
                    res.status(200).json({message: 'Update successfull'});
                } else {
                    res.status(401).json({message: 'DateControl not found'});
                }
            })
            .catch(error => {
                res.status(500).json({
                    message: 'Cannot update dateControl!'
                });
            });

        } else {
            res.status(401).json({ message: 'Cant find post!' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Couldnt update post!',
            error: error
        });
    });
};

/*
*   ************************** POST: NEW POST REQUEST ***************************
 */
exports.savePostForm = (req, res, next) => {

    const dateControlModel = new DateControl({
        dateTimeFrom: req.body.dateTimeFrom,
        dateTimeTo: req.body.dateTimeTo,
        dateTimeCreated: req.body.dateTimeCreated,
        dateTimeEdited: req.body.dateTimeEdited
    });

    // save date control
    dateControlModel.save()
        .then(createdDateControl => {
            const post = new Post({
                title: req.body.title,
                content: req.body.content,
                phone: req.body.phone,
                address: req.body.address,
                valid: req.body.valid,
                creator: req.userData.userId,
                postNumber: req.body.postNumber,
                category: req.body.category,
                price: req.body.price,
                dateControlId: createdDateControl._id
            });

            post.save().then(createdPost => {
                res.status(201).json({
                    message: 'Post added succesfully',
                    post: {
                        id: createdPost._id,
                        title: createdPost.title,
                        content: createdPost.content,
                        phone: createdPost.phone,
                        address: createdPost.address,
                        valid: createdPost.valid,
                        creator: req.body.creator,
                        postNumber: req.body.postNumber,
                        category: createdPost.category,
                        price: createdPost.price,
                        dateControlId: createdDateControl._id
                    }
                });
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    message: 'Creating a post failed'
                })
            });

        }).catch(error => {
        res.status(500).json({
            error: error,
            message: 'Creating a dateControl failed'
        })
    });

};

/*
***************************GET REQUEST***********************************
*/
exports.getPostsByUser = (req, res, next) => {
    // parameters from the url - req.query.pageSize - name is made up
    const pageSize = +req.query.pagesize; // + added to convert string to int
    const currentPage = +req.query.page;
    // this won't be excecuted yet, but when we call then()
    const postQuery = Post.find({ creator: req.params.creator });
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
        // if we have 10 items per page and we are on page 3, then we have to skip first 20 posts
            .skip(pageSize * (currentPage - 1))  //define which posts we skip
            .limit(pageSize);  // narrow down the amount of docs we retrieve for the current page - for instance 10 posts on current page
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.countDocuments({ creator: req.params.creator });
        })
        .then(count => {
            res.status(200).json({
                message: 'Post fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Fetching posts failed!'
            });
        });
};

