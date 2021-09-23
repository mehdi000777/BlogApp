import React, { useRef, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { alertTypes } from '../../redux/types/alertTypes';
import { checkImage, imageUpload } from '../../utils/imageUpload';

interface IProps {
    setBody: (body: string) => void
    body: string
}

export default function Quill({ setBody, body }: IProps) {

    const quillRef = useRef<ReactQuill>(null);

    const dispatch = useDispatch();

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image'],

            ['clean']
        ],
    }

    const handleChangeImage = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            const files = input.files;

            if (!files)
                return dispatch({ type: alertTypes.ALERT, payload: { errors: "File does not exist." } });

            const file = files[0];
            const check = checkImage(file);
            if (check.length !== 0)
                return dispatch({ type: alertTypes.ALERT, payload: { errors: check } });

            dispatch({ type: alertTypes.ALERT, payload: { loading: true } });
            const image = await imageUpload(file);

            const quill = quillRef.current;
            const Rang = quill?.getEditor().getSelection()?.index;
            if (Rang !== undefined) {
                quill?.getEditor().insertEmbed(Rang, "image", image.url);
            }

            dispatch({ type: alertTypes.ALERT, payload: { loading: false } });
        }
    }, [dispatch])

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;

        let toolbar = quill.getEditor().getModule("toolbar");
        toolbar.addHandler("image", handleChangeImage)
    }, [handleChangeImage])

    const changeHnadler = (text: string) => {
        setBody(text)
    }

    return (
        <div>
            <ReactQuill
                onChange={changeHnadler}
                modules={modules}
                placeholder="Write some thing..."
                ref={quillRef}
                value={body}
            />
        </div>
    )
}
