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
                        <Navbar.Brand><Link to="/userHome">Chart Market</Link></Navbar.Brand>
                        <Nav className="mr-auto">
                        <Nav.Link><Link to="/upcomingIPO">Upcoming IPOs</Link></Nav.Link>
                        <Nav.Link><Link to="/compareCompany">Compare Company</Link></Nav.Link>
                        <Nav.Link><Link to="/compareSectors">Compare Sectors</Link></Nav.Link>
                        </Nav>

                    
                        <DropdownButton menuAlign="right" title="User" id="dropdown-menu-align-right">
                            <Dropdown.Item eventKey="1"><Link to="/updateProfile/user">Update Profile</Link></Dropdown.Item>
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