import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { DropdownButton,Dropdown} from 'react-bootstrap';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class NavWithDropDownUser extends Component {
   
    render(){
   
        return(
            <Container>
                <Navbar fixed="top" id="top-navbar" bg="dark" variant="dark">
                        <Navbar.Brand href="/userHome">StockChart</Navbar.Brand>
                        <Nav className="mr-auto">
                        <Nav.Link href="/upcomingIPO">Upcoming IPOs</Nav.Link>
                        <Nav.Link href="/compareCompany">Compare Company</Nav.Link>
                        <Nav.Link href="/compareSectors">Compare Sectors</Nav.Link>
                        </Nav>

                    
                        <DropdownButton menuAlign="right" title="User" id="dropdown-menu-align-right">
                            <Dropdown.Item eventKey="1"><Link to="/updateProfile">Update Profile</Link></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="4" href="/">Logout</Dropdown.Item>
                        </DropdownButton>

                    </Navbar>
                   
                    <br />
                    
            </Container>
        );
    }
}

export default NavWithDropDownUser;