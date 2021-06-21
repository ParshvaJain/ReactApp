import React, { Component } from 'react';
import './UserHome.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Row,Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class NavWithDropDownUser extends Component {
    constructor(props){
        super(props);
        this.state={ searchedValue : ''};
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(event){
        console.log(event.target.value);
        this.setState({searchedValue: event.target.value.toLowerCase()});
        var listOfCompanies = this.props.originalData;
        console.log(listOfCompanies);
        var filteredCompanies = listOfCompanies.filter((company) => company.companyName.toLowerCase().includes(this.state.searchedValue));
        this.props.changeParentState(filteredCompanies);
        console.log(filteredCompanies);
    }

    render(){
   
        return(
            <Container>
                <Navbar fixed="top" id="top-navbar" bg="dark" variant="dark">
                        <Navbar.Brand href="/adminHome">StockChart</Navbar.Brand>
                        <Nav className="mr-auto">
                        <Nav.Link href="/upcomingIPO">Upcoming IPOs</Nav.Link>
                        <Nav.Link href="/compareCompany">Compare Company</Nav.Link>
                        <Nav.Link href="/compareSectors">Compare Sectors</Nav.Link>
                        </Nav>

                        <Form inline id="search-box-full">
                            <FormControl id="search-box" type="text" onChange={this.onSearch} value={this.state.searchedValue} placeholder="Search For Company" className="mr-sm-2" />                                                    
                            <Button variant="outline-info">Search</Button>
                        </Form>

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

export class CompanyCard extends Component {
    render(){

        return( 
                    <Card bg="dark" text="white" id="each-card">
                        <Card.Header>Sector : {this.props.companySector}</Card.Header>
                        <Card.Body>
                        <Card.Title>{this.props.companyName}</Card.Title>
                        <Card.Text>
                            {this.props.companyBrief}
                        </Card.Text>
                        <Card.Link href={`/company/${this.props.companyName}/user`}>Click here to know more</Card.Link>
                        </Card.Body>
                    </Card>
        );
    }
}


class UserHome extends Component {

    constructor(props){
        super(props);
        this.state = {
            data : []
        }
        this.displayData = this.displayData.bind(this);
        this.changeParentState = this.changeParentState.bind(this);
    }

    changeParentState(updatedData){
        this.setState({data : updatedData});
    }

    displayData(){

        var CompanyCardList = [];
        var data = this.state.data;
        for(var i = 0; i < data.length; i++) {
            var companyBanner = <CompanyCard key={i}
                                             companyId={data[i].id}
                                             companyName={data[i].companyName}
                                             companySector={data[i].sector}
                                             companyBrief={data[i].brief}
                                             />
            CompanyCardList.push(companyBanner);
        }
        return CompanyCardList;
    }

    componentDidMount(){
        console.log("token" + this.props.getAuthToken());
        var requestOptions = {
            method : 'GET',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken() }
        }
        fetch("http://localhost:8082/company/",requestOptions)
        .then(response =>  response.json())
        .then(data => {
            this.setState({data : data,originalData : data});
        })
    }
    render(){
        return(
            <React.Fragment>
                <NavWithDropDownUser data = {this.state.data} originalData = {this.state.originalData} changeParentState = {this.changeParentState}/>
                <br></br>
                <br></br>
                <br></br>
                <Container fluid>
                    <Card id="main-card-user">
                        <Card.Header id="card-header-user">Check out the companies</Card.Header>
                        <Card.Body>
                            <Row md="4">
                                {this.displayData()}
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </React.Fragment>
            
        );
    }
}

export default UserHome;