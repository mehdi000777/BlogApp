import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createCategroy, deleteCategroy, updateCategroy } from '../redux/actions/categoryActions';
import { FormSubmit, ICategory, RootStore } from '../utils/Typescript';
import Notfound from './Notfound';

export default function Category() {

    const [name, setName] = useState("");
    const [edit, setEdit] = useState<ICategory | null>(null);

    const { auth, categories } = useSelector((state: RootStore) => state);

    const dispatch = useDispatch();

    const submitHandler = (e: FormSubmit) => {
        e.preventDefault();

        if (!auth.token || !name) return;

        if (edit) {
            if (edit.name === name) return;
            const data = { ...edit, name };
            dispatch(updateCategroy(data, auth.token));
        }
        else {
            dispatch(createCategroy(name, auth.token));
        }

        setName("");
        setEdit(null);
    }

    const deleteHandler = (id: string) => {
        if (!auth.token) return;
        
        if (window.confirm("Do you want delete this category?")) {
            dispatch(deleteCategroy(id, auth.token));
        }
    }

    if (auth.user?.role !== "admin") return <Notfound />
    return (
        <div className="category">
            <form onSubmit={submitHandler}>
                <label htmlFor="category">Category</label>

                <div className="d-flex align-items-center">
                    {
                        edit && <i className="fas fa-times text-danger me-2" style={{ cursor: "pointer" }}
                            onClick={() => { setEdit(null); setName("") }}></i>
                    }
                    <input type="text" id="category" value={name} onChange={e => setName(e.target.value)} />

                    <button type="submit">
                        {edit ? "Update" : "Create"}
                    </button>
                </div>
            </form>

            <div>
                {
                    categories.map(item => (
                        <div key={item._id} className="category_row">
                            <p className="m-0 text-capitalize">{item.name}</p>
                            <div>
                                <i className="fas fa-edit mx-2" onClick={() => { setEdit(item); setName(item.name) }}></i>
                                <i className="fas fa-trash-alt" onClick={() => deleteHandler(item._id)}></i>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
