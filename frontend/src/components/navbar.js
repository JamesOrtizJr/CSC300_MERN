import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import { UserContext } from "../App";

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
         <Nav.Link href="/homepage1">Home Page</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/admin">Admin</Nav.Link>
               
       
        <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
     
      </Nav>
    </Container>
  </ReactNavbar>

  );
}