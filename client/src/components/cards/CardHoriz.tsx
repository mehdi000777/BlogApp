import React from 'react';
import { Link } from 'react-router-dom';
import { IBlog, RootStore } from '../../utils/Typescript';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog } from '../../redux/actions/blogActions';

interface IProps {
    blog: IBlog
}

interface IParams {
    id: string
}

export default function CardHoriz({ blog }: IProps) {

    const { id }: IParams = useParams();
    const { auth } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    const deleteHandler = () => {
        if (!auth.user || !auth.token) return;

        if (id !== auth.user._id) return dispatch({ type: "ALERT", payload: { errors: "Invalid Authentication." } })

        if (window.confirm("Do you want delete this post?")) {
            dispatch(deleteBlog(blog, auth.token));
        }
    }

    return (
        <div className="card mb-3" style={{
            minWidth: "280px"
        }}>
            <div className="row g-0 p-2">
                <div className="col-md-4" style={{ minHeight: "150px", maxHeight: "200px", overflow: "hidden" }}>
                    {
                        blog.thumbnail &&
                        <>
                            {
                                typeof (blog.thumbnail) === "string"
                                    ? <Link to={`/blog/${blog._id}`}>
                                        <img src={blog.thumbnail} className="img-fluid rounded-start w-100 h-100" alt="thumbnail"
                                            style={{ objectFit: "cover" }} />
                                    </Link>
                                    : <img src={URL.createObjectURL(blog.thumbnail)} className="img-fluid rounded-start w-100 h-100"
                                        alt="thumbnail" style={{ objectFit: "cover" }} />
                            }
                        </>
                    }
                </div>

                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">
                            <Link className="text-capitalize" to={`/blog/${blog._id}`}>
                                {blog.title}
                            </Link>
                        </h5>
                        <p className="card-text">{blog.description}</p>
                        {
                            blog.title &&
                            <div className="card-text d-flex justify-content-between align-items-center">
                                {
                                    (auth.user && id === auth.user?._id) &&
                                    <div>
                                        <Link to={`/update_blog/${blog._id}`}>
                                            <i className="fas fa-edit" title="edit"></i>
                                        </Link>
                                        <i className="fas fa-trash text-danger mx-3" style={{ cursor: "pointer" }}
                                            onClick={deleteHandler}></i>
                                    </div>
                                }
                                <small className="text-muted">
                                    {new Date(blog.createdAt).toLocaleString()}
                                </small>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}
