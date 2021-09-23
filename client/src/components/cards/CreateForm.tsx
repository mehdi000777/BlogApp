import React from 'react'
import { useSelector } from 'react-redux'
import { IBlog, inputChange, RootStore } from '../../utils/Typescript'

interface IProps {
    blog: IBlog
    setBlog: (blog: IBlog) => void
}

export default function CreateForm({ blog, setBlog }: IProps) {

    const { categories } = useSelector((state: RootStore) => state);

    const changeHandler = (e: inputChange) => {
        const { name, value } = e.target;

        setBlog({ ...blog, [name]: value });
    }

    const changeThumbnailHandler = (e: inputChange) => {
        const target = e.target as HTMLInputElement;

        const files = target.files;
        if (files) {
            const file = files[0];
            setBlog({ ...blog, thumbnail: file });
        }
    }

    return (
        <form>
            <div className="form-group position-relative">
                <input type="text" className="form-control" name="title" value={blog.title}
                    onChange={changeHandler} />
                <small className="text-muted position-absolute bottom-0" style={{ right: "5px", opacity: .4 }}>
                    {blog.title.trim().length}/50
                </small>
            </div>

            <div className="form-group my-3">
                <input type="file" className="form-control" accept="image/*"
                    onChange={changeThumbnailHandler} />
            </div>

            <div className="form-group position-relative">
                <textarea style={{ resize: "none" }} className="form-control" value={blog.description} rows={4}
                    name="description" onChange={changeHandler} />
                <small className="text-muted position-absolute bottom-0" style={{ right: "5px", opacity: .4 }}>
                    {blog.description.trim().length}/200
                </small>
            </div>

            <div className="form-group my-3">
                <select className="form-control text-capitalize" value={blog.category}
                    name="category" onChange={changeHandler}>
                    <option value="">Choose a categroy...</option>
                    {
                        categories.map(item => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))
                    }
                </select>
            </div>
        </form>
    )
}
