import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import CardVert from '../components/cards/CardVert';
import { getBlogsByCategory } from '../redux/actions/blogActions';
import { IBlog, RootStore } from '../utils/Typescript';
import Spiner from '../components/global/Spiner'
import Pagination from '../components/global/Pagination';

interface IParams {
    category: string
}

export default function BlogsByCategory() {

    const [category_id, setCategory_id] = useState("");
    const [blogs, setBlogs] = useState<IBlog[]>();
    const [total, setTotal] = useState(0);

    const { category: categroySlug }: IParams = useParams();

    const dispatch = useDispatch();

    const history = useHistory();
    const { search } = history.location;

    const { categories, blogsCategory } = useSelector((state: RootStore) => state)

    useEffect(() => {
        const category = categories.find(item => item.name === categroySlug);
        if (category) setCategory_id(category._id);
    }, [categories, categroySlug])

    useEffect(() => {
        if (!category_id) return;

        if (blogsCategory.every(item => item.id !== category_id)) {
            dispatch(getBlogsByCategory(category_id, search));
        }
        else {
            const data = blogsCategory.find(item => item.id === category_id);
            if (data) {
                setBlogs(data.blogs);
                setTotal(data.total);
                if (data.search) history.push(data.search);
            }
        }
    }, [dispatch, category_id, blogsCategory, history, search])

    const paginationHanlder = (num: number) => {
        const search = `?page=${num}`;
        dispatch(getBlogsByCategory(category_id, search));
    }


    if (!blogs) return <Spiner />
    return (
        <div className="blogs_category">
            <div className="show_blogs">
                {
                    blogs.map(item => (
                        <CardVert key={item._id} blog={item} />
                    ))
                }
            </div>
            {
                total > 1 &&
                <Pagination total={total} callback={paginationHanlder} />
            }
        </div>
    )
}
