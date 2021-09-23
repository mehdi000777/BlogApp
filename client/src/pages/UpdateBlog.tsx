import React from 'react'
import { useParams } from 'react-router'
import CreateBlog from './CreateBlog';

interface IParams {
    id: string
}

export default function UpdateBlog() {

    const { id }: IParams = useParams();

    return (
        <CreateBlog slug={id} />
    )
}
