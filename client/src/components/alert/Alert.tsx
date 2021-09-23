import React from 'react'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { RootStore } from '../../utils/Typescript';
import Toast from './Toast';

export default function Alert() {

    const { alert } = useSelector((state: RootStore) => state);

    return (
        <div>
            {alert.loading && <Loading />}
            {alert.success && <Toast bgColor="bg-success" body={alert.success} title="Success" />}
            {alert.errors && <Toast bgColor="bg-danger" body={alert.errors} title="Errors" />}
        </div>
    )
}
