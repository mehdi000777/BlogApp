import React from 'react'
import { Link } from 'react-router-dom'
import { IBlog } from '../../utils/Typescript'

interface IProps {
    blog: IBlog
}

export default function CardVert({ blog }: IProps) {
    return (
        <div className="card">
            {
                typeof (blog.thumbnail) === "string" &&
                <img src={blog.thumbnail} className="card-img-top" alt="blog"
                    style={{ objectFit: "cover", height: "180px" }} />
            }
            <div className="card-body">
                <h5 className="card-title">
                    <Link to={`/blog/${blog._id}`}>
                        {blog.title}...
                    </Link>
                </h5>
                <p className="card-text">
                    {blog.description.slice(0, 100) + "..."}
                </p>
                <p className="card-text d-flex justify-content-between">
                    <small className="text-muted text-capitalize">
                        {
                            typeof (blog.user) !== "string" &&
                            <Link to={`/profile/${blog.user._id}`}>
                                By: {blog.user.name}
                            </Link>
                        }
                    </small>

                    <small className="text-muted text-capitalize">
                        {new Date().toLocaleString()}
                    </small>
                </p>
            </div>
        </div>
    )
}

