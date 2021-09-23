import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { IComment } from '../../utils/Typescript';
import LiteQuill from '../editor/LiteQuill';

interface IProps {
    callback: (body: string) => void
    edit?: IComment
    setEdit?: (edit?: IComment) => void
}

export default function Input({ callback, edit, setEdit }: IProps) {
    const [body, setBody] = useState("");

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (edit) setBody(edit.content)
    }, [edit])

    const submitHandler = () => {
        const div = divRef.current;
        const text = (div?.innerText as string);
        if (!text.trim()) {
            if(setEdit) return setEdit(undefined);
            return;
        }

        callback(body);
    }

    return (
        <div>
            <LiteQuill setBody={setBody} body={body} />

            <div ref={divRef} dangerouslySetInnerHTML={{ __html: body }} style={{ display: "none" }}>

            </div>

            <button className="btn btn-dark d-block ms-auto mt-2 px-4" onClick={submitHandler}>
                {edit ? "Update" : "Send"}
            </button>
        </div>
    )
}
