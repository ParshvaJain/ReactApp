import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { DropdownButton,Dropdown} from 'react-bootstrap';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class NavWithDropDown extends Component {
    render(){
        return(
            <Container>
                <Navbar fixed="top" id="top-navbar" bg="dark" variant="dark">
                        <Navbar.Brand href="/adminHome">StockChart</Navbar.Brand>
                        <Nav className="mr-auto">
                        <Nav.Link><Link to="/importData">Import Data</Link></Nav.Link>
                        <Nav.Link><Link to="/manageCompany">Manage Company</Link></Nav.Link>
                        <Nav.Link><Link to="/manageExchange">Manage Exchange</Link></Nav.Link>
                        <Nav.Link><Link to="/manageIPO">Manage IPO</Link></Nav.Link>
                        </Nav>

                        <DropdownButton menuAlign="right" title="Admin" id="dropdown-menu-align-right">
                            <Dropdown.Item eventKey="1" href="/updateProfile">Update Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="4" href="/">Logout</Dropdown.Item>
                        </DropdownButton>

                    </Navbar>
                   
                    <br />
                    
            </Container>
        );
    }
}

export default NavWithDropDown;