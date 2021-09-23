import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IReqAuth } from '../config/interface';
import { auth } from '../middleware/auth';
import { validateBlog } from '../middleware/validate';
import Blog from '../models/blogModel';
import Comment from '../models/commentModel';

const blogRouter = express.Router();


export const pagination = (req: IReqAuth) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 4;
    let skip = (page - 1) * limit;

    return { page, limit, skip }
}

//Create Blog
blogRouter.post("/blog", validateBlog, auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication" });

    try {
        const { title, thumbnail, category, content, description } = req.body;

        const newBlog = new Blog({
            title: title.toLowerCase(),
            thumbnail,
            category,
            content,
            description,
            user: req.user._id
        });

        await newBlog.save();

        res.send({
            msg: "Create Blog Success!",
            blog: {
                ...newBlog._doc,
                user: req.user
            }
        });

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})

//Get Blogs For Home Page
blogRouter.get("/home/blogs", async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.aggregate([
            // User
            {
                $lookup: {
                    from: "users",
                    let: { user_id: "$user" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                        { $project: { password: 0 } }
                    ],
                    as: "user"
                }
            },

            // array => object
            { $unwind: "$user" },

            // Categroy
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },

            //array => object
            { $unwind: "$category" },

            // Sort
            { $sort: { "createdAt": -1 } },

            // Group by category
            {
                $group: {
                    _id: "$category._id",
                    name: { $first: "$category.name" },
                    blogs: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                }
            },

            // Pagination for blogs
            {
                $project: {
                    blogs: {
                        $slice: ["$blogs", 0, 4]
                    },
                    count: 1,
                    name: 1
                }
            }
        ])

        res.send(blogs);
    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


// Get Blog With Category ID
blogRouter.get("/blogs/category/:category_id", async (req: Request, res: Response) => {
    try {
        const { category_id } = req.params;
        const { skip, limit } = pagination(req);

        const Data = await Blog.aggregate([
            {
                $facet: {
                    totalData: [
                        { $match: { category: mongoose.Types.ObjectId(category_id) } },
                        // User
                        {
                            $lookup: {
                                from: "users",
                                let: { user_id: "$user" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                    { $project: { password: 0 } }
                                ],
                                as: "user"
                            }
                        },
                        // array => object
                        { $unwind: "$user" },
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        { $match: { category: mongoose.Types.ObjectId(category_id) } },
                        { $count: 'count' }
                    ]
                }
            },
            {
                $project: {
                    count: { $arrayElemAt: ["$totalCount.count", 0] },
                    totalData: 1
                }
            }
        ])

        const blogs = Data[0].totalData;
        const count = Data[0].count;

        // Pagination
        let total = 0;

        if (count % limit === 0) {
            total = count / limit;
        } else {
            total = Math.floor(count / limit) + 1;
        }

        res.send({ blogs, total });

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})

// User Blogs
blogRouter.get("/blogs/user/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { limit, skip } = pagination(req);

        const data = await Blog.aggregate([
            {
                $facet: {
                    totalData: [
                        { $match: { user: mongoose.Types.ObjectId(userId) } },
                        // User
                        {
                            $lookup: {
                                from: "users",
                                let: { user_Id: "$user" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$user_Id"] } } },
                                    { $project: { password: 0 } }
                                ],
                                as: "user"
                            }
                        },
                        // array => object
                        { $unwind: "$user" },
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $match: { user: mongoose.Types.ObjectId(userId) } },
                        { $count: "count" }
                    ]
                }
            },
            {
                $project: {
                    count: { $arrayElemAt: ["$totalCount.count", 0] },
                    totalData: 1
                }
            }
        ])

        const blogs = data[0].totalData;
        const count = data[0].count;

        //pagination
        let total;

        if (count % limit === 0) {
            total = count / limit;
        }
        else {
            total = Math.floor(count / limit) + 1;
        }

        res.send({ blogs, total })

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})

// Get A Blog Whith ID
blogRouter.get("/blog/:id", async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id }).populate("user", "-password");
        if (!blog) return res.status(400).send({ msg: "Blog does not exist." });

        res.send(blog);

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})

// Update Blog
blogRouter.put("/blog/:id", validateBlog, auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication" });

    try {
        const blog = await Blog.findOneAndUpdate({
            _id: req.params.id, user: req.user._id
        }, req.body);

        if (!blog) return res.status(400).send({ msg: "Invalid Authentication" });

        res.send({ msg: "Update Blog Success!", blog });

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})

// Delete Blog
blogRouter.delete("/blog/:id", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication" });

    try {
        // Delete Blog
        const blog = await Blog.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!blog) return res.status(400).send({ msg: "Invalid Authentication" });

        // Delete Comment
        await Comment.deleteMany({ blog_id: blog._id });

        res.send({ msg: "Delete Success!" });
    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


// Search Blogs
blogRouter.get("/search/blogs", async (req: Request, res: Response) => {
    try {
        const { title } = req.query;

        const blogs = await Blog.find({ title: { $regex: title } })
        .select("title description thumbnail createdAt")
        .sort("-createdAt")
        .limit(5);

        res.send(blogs);
    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})



export default blogRouter;