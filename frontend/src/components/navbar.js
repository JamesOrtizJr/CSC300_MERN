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
          <Nav.Link as={Link} to="/">Start</Nav.Link>
          <Nav.Link as={Link} to="/home">Home</Nav.Link>
          <Nav.Link as={Link} to="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link as={Link} to="/mbtaAlerts">MBTA Alerts</Nav.Link>
          <Nav.Link as={Link} to="/mbtaLines">MBTA Lines</Nav.Link>
          <Nav.Link as={Link} to="/homepage1">MovieRus</Nav.Link>
          <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
        </Nav>
      </Container>
    </ReactNavbar>
  );
}