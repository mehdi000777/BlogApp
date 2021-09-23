import React from 'react'

export default function Spiner() {
    return (
        <div className="d-flex justify-content-center align-items-center my-4" style={{height:"calc(100vh - 246px)"}}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
