import express, { Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import { adminAuth, auth } from "../middleware/auth";
import Blog from "../models/blogModel";
import Category from "../models/categoryModel";


const categoryRouter = express.Router();


//CREATE CATEGORY
categoryRouter.post("/category", auth, adminAuth, async (req: IReqAuth, res: Response) => {
    try {
        const name = req.body.name.toLowerCase();

        const newCategory = new Category({
            name
        });
        await newCategory.save();

        res.send({ msg: "Create Category Success!", newCategory });

    } catch (err: any) {
        let errMsg;

        if (err.code === 11000) {
            errMsg = Object.values(err.keyValue)[0] + " already exist.";
        }
        else {
            let name = Object.keys(err.errors)[0];
            errMsg = err.errors[`${name}`].message;
        }

        res.status(500).send({ msg: errMsg });
    }
})


//GET CATEGORY
categoryRouter.get("/category", async (req: Request, res: Response) => {
    try {
        const categories = await Category.find({}).sort("-createdAt");

        res.send({ categories });
    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


//UPDATE CATEGORY
categoryRouter.patch("/category/:id", auth, adminAuth, async (req: IReqAuth, res: Response) => {
    try {
        const name = req.body.name.toLowerCase();

        const category = await Category.findOne({ name });
        if (category) return res.status(400).send({ msg: `${name} already exist.` });

        await Category.findByIdAndUpdate(req.params.id, {
            name
        });

        res.send({ msg: "Update Succss!" });
    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})

//DELETE CATEGORY
categoryRouter.delete("/category/:id", auth, adminAuth, async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).send({ msg: "Invalid Authentication." });

    if (req.user.role !== "admin") return res.status(400).send({ msg: "Invalid Authentication." });

    try {
        const blog = await Blog.find({ category: req.params.id });
        if (blog.length !== 0) return res.status(400).send({ msg: "Can not delete! In this category also exist blog." })

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(400).send({ msg: "Category does not exist." });

        res.send({ msg: "Delete Succss!" });
    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
})


export default categoryRouter;