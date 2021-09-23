import express, { Request, Response } from 'express';
import { IReqAuth } from '../config/interface';
import { auth } from '../middleware/auth';
import Comment from '../models/commentModel';
import mongoose from 'mongoose';
import { pagination } from './blogRouter';
import { io } from '../index';


const commentRouter = express.Router();

commentRouter.post("/comment", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication" });

    try {
        const { content, blog_id, blog_user_id } = req.body;

        const newComment = new Comment({
            user: req.user._id,
            content,
            blog_id,
            blog_user_id
        })

        const data = {
            ...newComment._doc,
            user: req.user,
            createdAt: new Date().toISOString()
        }

        io.to(`${blog_id}`).emit("createComment", data);

        await newComment.save();

        res.send(newComment);

    } catch (err: any) {
        return res.status(500).send({ msg: err.message });
    }
})

commentRouter.get("/comment/:id", async (req: Request, res: Response) => {
    try {
        const blog_id = req.params.id

        const { limit, skip } = pagination(req);

        const Data = await Comment.aggregate([
            {
                $facet: {
                    totalData: [
                        {
                            $match: {
                                blog_id: mongoose.Types.ObjectId(blog_id),
                                comment_root: { $exists: false },
                                reply_user: { $exists: false }
                            }
                        },
                        //user
                        {
                            $lookup: {
                                from: "users",
                                let: { user_Id: "$user" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$user_Id"] } } },
                                    { $project: { password: 0 } }
                                ],
                                as: "user"
                            },
                        },
                        { $unwind: "$user" },

                        {
                            $lookup: {
                                from: "comments",
                                let: { comment_id: "$replyCM" },
                                pipeline: [
                                    { $match: { $expr: { $in: ["$_id", "$$comment_id"] } } },
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: { user_Id: "$user" },
                                            pipeline: [
                                                { $match: { $expr: { $eq: ["$_id", "$$user_Id"] } } },
                                                { $project: { name: 1, avatar: 1 } }
                                            ],
                                            as: "user"
                                        },
                                    },
                                    { $unwind: "$user" },

                                    {
                                        $lookup: {
                                            from: "users",
                                            let: { user_Id: "$reply_user" },
                                            pipeline: [
                                                { $match: { $expr: { $eq: ["$_id", "$$user_Id"] } } },
                                                { $project: { name: 1, avatar: 1 } }
                                            ],
                                            as: "reply_user"
                                        },
                                    },
                                    { $unwind: "$reply_user" },
                                ],
                                as: "replyCM"
                            }
                        },

                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        {
                            $match: {
                                blog_id: mongoose.Types.ObjectId(blog_id),
                                comment_root: { $exists: false },
                                reply_user: { $exists: false }
                            }
                        },
                        { $count: "count" }
                    ]
                },
            },
            {
                $project: {
                    count: { $arrayElemAt: ["$totalCount.count", 0] },
                    totalData: 1
                }
            }
        ])

        const comments = Data[0].totalData;
        const count = Data[0].count

        let total;

        if (count % limit === 0) {
            total = count / limit;
        }
        else {
            total = Math.floor(count / limit) + 1;
        }

        res.send({ comments, total });
    } catch (err: any) {
        return res.status(500).send({ msg: err.message });
    }
})

commentRouter.post("/reply_comment", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication" });

    try {
        const { content, blog_id, blog_user_id, comment_root, reply_user } = req.body;

        const newComment = new Comment({
            user: req.user._id,
            content,
            blog_id,
            blog_user_id,
            comment_root,
            reply_user: reply_user._id
        })

        await Comment.findByIdAndUpdate(comment_root, {
            $push: { replyCM: newComment._id }
        })

        const data = {
            ...newComment._doc,
            user: req.user,
            reply_user: reply_user,
            createdAt: new Date().toISOString()
        }

        io.to(`${blog_id}`).emit("replyComment", data);

        await newComment.save();

        res.send(newComment);

    } catch (err: any) {
        return res.status(500).send({ msg: err.message });
    }
})


commentRouter.patch("/comment/:id", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication" });

    try {
        const { data } = req.body;

        const comment = await Comment.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, {
            content: data.content
        })

        if (!comment) return res.status(400).send({ msg: "Comment does not exist." });

        io.to(`${data.blog_id}`).emit("updateComment", data);

        res.send({ msg: "Update Success!" });

    } catch (err: any) {
        return res.status(500).send({ msg: err.message })
    }
})

commentRouter.delete("/comment/:id", auth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication" });

    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.id,
            $or: [
                { user: req.user._id },
                { blog_user_id: req.user._id }
            ]
        });
        if (!comment) return res.status(400).send({ msg: "Comment does not exist." });

        if (comment.comment_root) {
            await Comment.findOneAndUpdate({ _id: comment.comment_root }, {
                $pull: { replyCM: comment._id }
            })
        }
        else {
            await Comment.deleteMany({ _id: { $in: comment.replyCM } })
        }

        io.to(`${comment.blog_id}`).emit("deleteComment", comment);

        res.send({ msg: "Delete Success!" });

    } catch (err: any) {
        return res.status(500).send({ msg: err.message })
    }
})


export default commentRouter;