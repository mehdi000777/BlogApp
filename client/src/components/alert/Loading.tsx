import React from 'react'

export default function Loading() {
    return (
        <div className="position-fixed w-100 h-100 text-center top-0 start-0 loading">
            <svg width="250" height="250" viewBox="0 0 40 50">
                <polygon stroke="#fff" strokeWidth="1" fill="none" points="20,1 40,40 1,40" />
                <text fill="#fff" x="6" y="47" >Loading</text>
            </svg>
        </div>
    )
}
