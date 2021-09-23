import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import Search from './Search'

export default function Header() {
    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light p-3">
            <Link to="/" className="navbar-brand">BLOG APP</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#NavbarNav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="NavbarNav">
                <Search />
                <Menu />
            </div>
        </nav>
    )
}
