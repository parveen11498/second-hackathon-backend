const { validate, postSchema } = require("../shared/schema");
const Helper = require("../helpers/post.helper");
// const { insert } = require("../helpers/post.helper");




module.exports = {
    async getAll(req, res) {
        try {
            const posts = await Helper.findAll();
            res.json(posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error fetching posts" })
        }

    },

    async getById(req, res) {
        try {
            const post = await Helper.findById(req.params.id);
            if (!post) {
                res.status(401).json({ message: "post doestnot exists" })
            }

            // if (!post.active) {
            //     res.status(401).json({ message: "post is deleted" })
            // }
            res.json(post);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error fetching posts" })
        }
    },

    async create(req, res) {
        try {
            const isError = await validate(postSchema, req.body)
            if (isError) return res.status(400).json({ error: isError });


            //insert into posts collection
            const { insertedId } = await Helper.insert({ ...req.body, userId: req.user._id })

            const post = await Helper.findById(insertedId);
            res.json({ message: "post is successfully created!!", post })

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while creating post" })
        }


    },

    async update(req, res) {
        try {
            const isError = await validate(postSchema, req.body)
            if (isError) return res.status(400).json({ error: isError });

            // post exist or not
            let post = await Helper.findById(req.params.id)
            if (!post)
                return res.status(401).json({ messsage: "post doesnt exists" });

            if (post.userId != req.user._id)
                return res.status(401).json({ messsage: "user is not authorized to this opertaion" });

            //update into posts collection
            const { value } = await Helper.updateById(req.params.id, req.body);
            res.json({ message: "post updated successfully", post: value })

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while updating" })
        }

    },

    async updateLike(req, res) {
        try {
            let { id, like } = req.params
            like = Number(like)
            console.log(like)
            // post exist or not
            const post = await Helper.findById(req.params.id)
            if (!post)
                return res.status(401).json({ messsage: "post doesnt exists" });

            if (like) {
                if (post.likes && post.likes.includes(req.user._id)) {
                    return res.status(400).json({ messsage: "post liked already" });
                }else {
                    post.likes = [...post.likes, req.user._id]
                }
            } else {
                if (post.likes && post.likes.includes(req.user._id)) {
                    post.likes = post.likes.filter((user) => user != req.user._id)
                } else {
                    return res.status(400).json({ messsage: "post is not liked" });
                }

            }

            await Helper.updateById(id, { ...post });

            res.json({ message: `post ${like ? "liked" : "unliked"}successfully` })

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `error while ${like ? "unliking" : "liking"} liking the post` })
        }

    },

    async remove(req, res) {
        try {


            // post exist or not
            const post = await Helper.findById(req.params.id)
            if (!post)
                return res.json(401).res.json({ messsage: "post doesnt exists" });

            if (post.userId != req.user._id)
                return res.status(401).json({ messsage: "user is not authorized to this opertaion" });

            //delete from posts collection
            await Helper.deleteById(req.params.id);
            res.json({ message: "post deleted successfully" })

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while deleting the post" })
        }
    }
}
