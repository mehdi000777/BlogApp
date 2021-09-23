import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserBlogs } from '../../redux/actions/blogActions';
import { IBlog, RootStore } from '../../utils/Typescript';
import Spiner from '../global/Spiner';
import CardHoriz from '../cards/CardHoriz';
import Pagination from '../global/Pagination';
import { useHistory } from 'react-router-dom';

interface IProps {
    id: string
}

export default function UserBloges({ id }: IProps) {

    const [blogsInfo, setBlogsInfo] = useState<IBlog[]>();
    const [total, setTotal] = useState(0);

    const history = useHistory();
    const { search } = history.location;

    const { userBlogs } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;

        if (userBlogs.every(item => item.id !== id)) {
            dispatch(getUserBlogs(id, search));
        }
        else {
            const blogs = userBlogs.find(item => item.id === id);

            if (blogs) {
                setBlogsInfo(blogs.blogs);
                setTotal(blogs.total)
                if (blogs.search) history.push(blogs.search)
            }
        }
    }, [dispatch, id, history, search, userBlogs])

    const paginationHandler = (num: number) => {
        const search = `?page=${num}`
        dispatch(getUserBlogs(id, search));
    }

    if (!blogsInfo) return <Spiner />

    if (blogsInfo.length === 0 && total === 0) return (
        <h3 className="text-center">No Blogs</h3>
    )

    return (
        <div>
            {
                blogsInfo.map(item => (
                    <CardHoriz key={item._id} blog={item} />
                ))
            }
            {
                total > 1 &&
                <Pagination total={total} callback={paginationHandler} />
            }
        </div>
    )
}
