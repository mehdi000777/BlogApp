import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import CardVert from '../components/cards/CardVert';
import Spiner from '../components/global/Spiner';
import { RootStore } from '../utils/Typescript'

export default function Home() {

    const { homeBlogs } = useSelector((state: RootStore) => state);


    if (homeBlogs.length === 0) return <Spiner />
    return (
        <div className="home_page">
            {
                homeBlogs.map(item => (
                    <div key={item._id}>
                        {
                            item.count > 0 &&
                            <>
                                <h3>
                                    <Link to={`/blogs/${item.name.toLowerCase()}`}>
                                        {item.name} <small>({item.count})</small>
                                    </Link>
                                </h3>

                                <hr className="mt-1" />

                                <div className="home_blogs">
                                    {
                                        item.blogs.map(blog => (
                                            <CardVert key={blog._id} blog={blog} />
                                        ))
                                    }
                                </div>
                            </>
                        }

                        {
                            item.count > 4 &&
                            <Link to={`/blogs/${item.name}`} className="d-block text-end">
                                Readmore &gt;&gt;
                            </Link>
                        }
                    </div>
                ))
            }
        </div >
    )
}
