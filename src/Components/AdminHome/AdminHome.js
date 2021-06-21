import React, { Component } from 'react';
import './AdminHome.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Row} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

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
                        <Card.Link href={`/company/${this.props.companyName}/admin`}>Click here to know more</Card.Link>
                        </Card.Body>
                    </Card>
        );
    }
}



class NavWithDropDown extends Component {
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
                        <Nav.Link><Link to="/importData">Import Data</Link></Nav.Link>
                        <Nav.Link><Link to="/manageCompany">Manage Company</Link></Nav.Link>
                        <Nav.Link><Link to="/manageExchange">Manage Exchange</Link></Nav.Link>
                        <Nav.Link><Link to="/manageIPO">Manage IPO</Link></Nav.Link>
                        </Nav>

                        <Form inline id="search-box-full">
                            <FormControl id="search-box" type="text" onChange={this.onSearch} value={this.state.searchedValue} placeholder="Search For Company" className="mr-sm-2" />                                                    
                            <Button variant="outline-info">Search</Button>
                        </Form>
                        
                        <DropdownButton menuAlign="right" title="Admin" id="dropdown-menu-align-right">
                            <Dropdown.Item eventKey="1"><Link to="/updateProfile/admin">Update Profile</Link></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="4" href="/">Logout</Dropdown.Item>
                        </DropdownButton>

                    </Navbar>
                   
                    <br />
                    
            </Container>
        );
    }
}

class AdminHome extends Component {

    constructor(props){
        super(props);
        this.state = {
            data : [],
            userId : '',
            userName : '',
            userToken : ''
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
        console.log("name" + this.props.getUserName());
        console.log("id" + this.props.getUserId());

        var requestOptions = {
            method : 'GET',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken() }
        }
        fetch("https://company--service.herokuapp.com/company/",requestOptions)
        .then(response =>  response.json())
        .then(data => {
            this.setState({
                data : data,
                userId : this.props.getUserId(),
                userName : this.props.getUserName(),
                userToken : this.props.getAuthToken()
            });
        })
    }

    render(){
      

        return(
            <React.Fragment>
                <NavWithDropDown data = {this.state.data} originalData = {this.state.originalData} changeParentState = {this.changeParentState}/>
                <br></br>
                <br></br>
                <br></br>
                <Container fluid>
                    <Card id="main-card">
                        <Card.Header id="card-header">Check out the companies</Card.Header>
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

export default withRouter(AdminHome);