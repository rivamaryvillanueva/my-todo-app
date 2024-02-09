import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import moment from 'moment'
import { useState, useEffect } from 'react';
import "./Header.css";

const Header = () => {

    // Use useState hook to manage the state of the date and time variables
    const [date, setDate] = useState(moment());
    const [time, setTime] = useState(moment());

    // Use useEffect hook to create an interval that updates the date and time variables every second
    useEffect(() => {
        const interval = setInterval(() => {
            setDate(moment()); // Update the date variable with the current date
            setTime(moment()); // Update the time variable with the current time
        }, 1000);
        // Return a function that clears the interval when the component is unmounted
        return() => clearInterval(interval);
    }, []);

    // Return the JSX for the Header component
    return (
        <Navbar expand = "lg" className = "container">
            <Container className='navContainer' >
                <Navbar.Brand className = "appTitle" href = "#home">My Todo</Navbar.Brand>
                <Navbar.Brand className = "dateTime" > {date.format('MMMM DD, YYYY')} <br /> {time.format('h:mm:ss a')} </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default Header