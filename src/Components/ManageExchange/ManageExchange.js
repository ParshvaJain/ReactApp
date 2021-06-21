import React, { Component } from 'react';
import './ManageExchange.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavWithDropDown from '../NavBar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CreateExchangeForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            message : '',
            color : ''
        }
        this.createExchange = this.createExchange.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    createExchange(event) {
        event.preventDefault();
        event.stopPropagation();

        var name = document.getElementById("formExchangeName").value;
        var brief = document.getElementById("formBrief").value;
        var contactAddress = document.getElementById("formNumber").value;
        var remarks = document.getElementById("formRemarks").value;
        this.sendRequest(name,brief,contactAddress,remarks);
    }

    sendRequest(name,brief,contactAddress,remarks){

    
        var jsonBody = {
            "name":name,
            "brief":brief,
            "contactAddress":contactAddress,
            "remarks":remarks,
            "companies":[]
        }

        var requestOptions = {
            method : 'POST',
            mode : 'cors',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify(jsonBody),
            referrerPolicy:"no-referrer",
        }

        this.setState(() => {
            fetch('http://localhost:8084/stockexchange/createExchange',requestOptions)
            .then(response => {
                if(response.status  === 200) {
                    this.setState({
                        message : "New Exchange created ",
                        color : "green"
                    })
                    return response.json();
                }
                else {
                    this.setState({
                        message:"Error creating Exchange!",
                        color:"red"
                    })
                }
                return null;
            }).then(data => {
                if(data != null){
                    setTimeout(() => {
                        this.props.history.push("/adminHome");
                    },2000);     
                }
            })
        })      
    }

    render(){
        
        var messagestyle = {
            fontSize : '16px',
            color : this.state.color
        }

        return(
            <Form className="justify-content-center" onSubmit={this.createExchange}>
                        <Form.Group controlId="formExchangeName">
                        <Form.Label>Exchange Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Exchange name"  required/>
                        </Form.Group>
                        <Form.Group controlId="formBrief">
                            <Form.Label>Brief</Form.Label>
                            <Form.Control  type="text" placeholder="Enter Brief details" required />
                        </Form.Group>

                        <Form.Group controlId="formNumber">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" placeholder="Enter Contact Number" required />
                        </Form.Group>

                        <Form.Group controlId="formRemarks">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control type="text" placeholder="Enter Remarks" required />
                        </Form.Group>


                        <br></br>
                        <br></br>

                        <Row>
                            <Col>
                                <Button variant="primary" type="submit">
                                    Create Exchange
                                </Button>
                            </Col>
                            
                            <Col>
                                <span style={messagestyle}>{this.state.message}</span>
                            </Col>
                        </Row>
                     
                    </Form>
        );
    }
}

class ExchangeCard extends Component {
    
    render(){
        var numberListed = this.props.companies;
        var number = numberListed.length;
        return(
            <Card bg="white" id="each-card-exchange" text="black">
                        <Card.Header>{this.props.exchangeName}</Card.Header>
                        <Card.Body>
                        <Card.Text>
                            <Container>
                            <Row md="2">
                                <Col>
                                    Number of Companies Listed
                                </Col>
                                <Col>
                                    Contact Number
                                </Col>
                            </Row>
                            <br></br>
                            <Row md="2">
                                <Col>
                                    {number}
                                </Col>
                                <Col>
                                    {this.props.contactAddress}
                                </Col> 
                            </Row>
                            </Container>    
                        </Card.Text>
                        </Card.Body>
                    </Card>
        );
    }
}
class ManageExchange extends Component{

    constructor(props){
        super(props);
        this.state = {
            data : [],
            createForm : false
        }
        this.DisplayData = this.DisplayData.bind(this);
        this.CreateExchangeForm = this.CreateExchangeForm.bind(this);
    }

    DisplayData(){
        var ExchangeCardList = [];
        var data = this.state.data;
        for(var i = 0; i < data.length; i++) {
            var ExchangeBanner = <ExchangeCard key={i}
                                             exchangeId={data[i].id}
                                             exchangeName={data[i].name}
                                             brief={data[i].brief}
                                             contactAddress={data[i].contactAddress}
                                             remarks={data[i].remarks}
                                             companies={data[i].companies}
                                             />
            ExchangeCardList.push(ExchangeBanner);
        }
        return ExchangeCardList;
    }

    CreateExchangeForm(){
        this.setState({createForm : true});
    }

    componentDidMount(){
        console.log("token" + this.props.getAuthToken());
        var requestOptions = {
            method : 'GET',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken() }
        }
        fetch("http://localhost:8084/stockexchange/",requestOptions)
        .then(response =>  response.json())
        .then(data => {
            this.setState({data : data});
        })
    }

    render(){

        let form;
        if(this.state.createForm === true){
            form = <CreateExchangeForm {...this.props}  history={this.props.history}/>;
        }
        else{
            form = <Button onClick={this.CreateExchangeForm} id="add-new-exchange" variant="primary">Add New Exchange</Button>;
        }

        return(
            <React.Fragment>
                <NavWithDropDown />
                
                <br></br>
                <br></br>
                <br></br>

                <Row md="2">
                <Col>
                <div id="ipo-exchange">
                    <Card id="main-card-exchange">
                        <Card.Header id="card-header-exchange">Listed Exchanges</Card.Header>
                        <Card.Body id="card-body-exchange">
                            <Col>
                            <Row md="1">
                                {this.DisplayData()}
                            </Row>
                            </Col>
                        </Card.Body>
                    </Card>
                </div>
                </Col>

                <Col>
                <div id="form-exchange">
                    <Card id="form-card-exchange">
                    <Card.Header>{this.state.createForm === true ? 'Create New Exchange' : ''}</Card.Header>
                        <Card.Body id="form-body-exchange">
                            <Row md="1">   
                            {form}
                            </Row>
                            
                        </Card.Body>
                    </Card>
                </div>
                </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default ManageExchange;