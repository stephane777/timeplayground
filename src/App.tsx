import React, { FC } from 'react'
import { useState } from 'react'
import './styles/main.scss'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const App: FC = () => {
    return (
        <Navbar expand="lg" bg="light" data-bs-theme="light">
            <Container>
                <Navbar.Brand href="#home">Time Playground</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Stack direction="horizontal" gap={3} className="ms-auto">
                    <Navbar.Text>tet</Navbar.Text>
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav>
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#DatePicker">DatePicker</Nav.Link>
                            <Nav.Link href="#DateRange">DateRange</Nav.Link>
                            <Nav.Link href="#AppleCalendar">
                                AppleCalendar
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Stack>
            </Container>
        </Navbar>
    )
}

export default App
