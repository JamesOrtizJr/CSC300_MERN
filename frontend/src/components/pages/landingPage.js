import React from 'react'
import Card from 'react-bootstrap/Card';

const Landingpage = () => {
    
    return (
        <div className="bg-blue-500 text-white p-5">
            <Card style={{ width: '30rem' }} className="mx-2 my-2">
                <Card.Body>
                    <Card.Title>Welcome to MoviesRus!</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Our website for all things movies.</Card.Subtitle>
                    <Card.Text>
                        If you see this we can't wait for you to join us!
                    </Card.Text>
                    <Card.Link href="/signup">Sign Up</Card.Link>
                    <Card.Link href="/login">Login</Card.Link>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Landingpage;
