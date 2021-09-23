import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


interface IProps {
    body: string
    setBody: (body: string) => void
}

export default function LiteQuill({ setBody, body }: IProps) {

    const modules = {
        toolbar: [
            [{ 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block', 'link'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'align': [] }],
            [{ 'direction': 'rtl' }],
        ],
    }

    const changeHnadler = (text: string) => {
        setBody(text)
    }

    return (
        <div>
            <ReactQuill
                onChange={changeHnadler}
                modules={modules}
                placeholder="Write some thing..."
                value={body}
            />
        </div>
    )
}
