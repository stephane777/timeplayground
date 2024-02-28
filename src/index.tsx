import { createRoot } from 'react-dom/client'
import React, { FC } from 'react'
import { useState } from 'react'
import './scss/main.scss'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Collapse from 'react-bootstrap/Collapse'

import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const App: React.FC = () => {
    return (
        <Navbar expand="lg" bg="light" data-bs-theme="light">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#DatePicker">DatePicker</Nav.Link>
                        <Nav.Link href="#DateRange">DateRange</Nav.Link>
                        <Nav.Link href="#AppleCalendar">AppleCalendar</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)
root.render(<App />)
