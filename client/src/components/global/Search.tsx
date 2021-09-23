import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { IBlog } from '../../utils/Typescript';
import CardHoriz from '../cards/CardHoriz';

export default function Search() {

    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState<IBlog[]>([]);

    const { pathname } = useLocation();

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (search.length < 2) return setBlogs([]);

            try {
                const res = await axios(`/api/search/blogs?title=${search}`, {
                    method: "get"
                });

                setBlogs(res.data);
            } catch (err) {
                console.log(err);
            }
        }, 400)

        return () => clearTimeout(delay);
    }, [search])

    useEffect(() => {
        setSearch("");
        setBlogs([]);
    }, [pathname])

    return (
        <div className="search w-100 position-relative">
            <input type="text" className="form-control w-100 me-2 my-2 my-lg-0" value={search}
                onChange={e => setSearch(e.target.value)} placeholder="Enter your search..." />

            {
                search.length >= 2 &&
                <div className="position-absolute w-100 rounded pt-2 px-1" style={{
                    backgroundColor: "#eee",
                    maxHeight: "calc(100vh - 100px)",
                    overflow: "auto",
                }}>
                    {
                        blogs.length
                            ? blogs.map(blog => (
                                <CardHoriz key={blog._id} blog={blog} />
                            ))
                            : <h3 className="text-center">No Blog</h3>
                    }
                </div>
            }
        </div>
    )
}
