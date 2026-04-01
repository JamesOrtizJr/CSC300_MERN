import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const info = getUserInfo();
    if (info) setUser(info);
  }, []);

  return (
    <ReactNavbar bg="dark" variant="dark">
    <Container>
      <Nav className="me-auto">
        <Nav.Link href="/">Start</Nav.Link>
        <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
        <Nav.Link href="/admin">Admin</Nav.Link>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/homepage1">MovieRus</Nav.Link>
        <Nav.Link as={Link} to="/movies/tt1375666">Movie Details</Nav.Link>
     
      </Nav>
    </Container>
  </ReactNavbar>

  );
}