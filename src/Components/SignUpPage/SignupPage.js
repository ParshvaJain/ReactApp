import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import './SignupPage.css';
import { Link } from 'react-router-dom';

class RedirectMessage extends Component {
    render(){
        return(
            <span>Redirecting to Login Page !</span>
        );
    }
}
class LoadingSpinner extends Component{
    render(){
        return(
            <div>
                <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }
} 

class CardTemplate extends Component {

    constructor(props){
        super(props);
        this.props = props;
        console.log(this.props);
        this.state = {
            message : "",
            color : "",
            reDirectMessage:false,
            isLoading : false
        }
        
        this.getData = this.getData.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    getData(event) {
        event.preventDefault();
        event.stopPropagation();

        var email = document.getElementById("formBasicEmail").value;
        var pass = document.getElementById("formBasicPassword").value;
        var name = document.getElementById("firstName").value + " " + document.getElementById("secondName").value;
        var number = document.getElementById("formBasicPhoneNumber").value;

        this.sendRequest(email,pass,name,number);
    }

    sendRequest(email,password,name,number){
       
        var jsonBody = {
            "username":name,
            "email":email,
            "password":password,
            "phoneNumber":number
        }
        var requestOptions = {
            method : 'POST',
            mode : 'cors',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify(jsonBody),
            referrerPolicy:"no-referrer",
        }
        this.setState({isLoading : true} , () => {
            fetch('https://authentication--service.herokuapp.com/authentication/signup',requestOptions)
            .then(response => {
                if(response.status  === 200) {
                    this.setState({
                        isLoading:false,
                        message:"Confirm your email",
                        reDirectMessage:true,
                        color:"green"
                    })
                    return response.json();
                }
                else {
                    this.setState({
                        isLoading:false,
                        message:"Email already taken !",
                        color:"red"
                    })
                }
                return null;
            }).then(data => {
                if(data != null){
                    setTimeout(() => {
                        this.props.history.push("/");
                    },5000);
                    
                }
            })
        })      
    }

    render() {

        var messagestyle = {
            fontSize : '16px',
            color : this.state.color
        }
        return(
            <Container id="card" md="auto">
            <Card className="text-center" id="text-header">
                <Card.Header>{this.props.type}</Card.Header>
                <Card.Body>
                    
                    <Form className="justify-content-center" onSubmit={this.getData}>
                        <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                            <Form.Row>
                                <Col>
                                    <Form.Control id="firstName" placeholder="First name"  required/>
                                </Col>
                                <Col>
                                    <Form.Control id="secondName" placeholder="Last name" />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control  type="email" placeholder="Enter email" required />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" minLength='8' required />
                        </Form.Group>

                        <Form.Group controlId="formBasicPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="tel" placeholder="Enter Phone Number" size="10" required />
                        </Form.Group>

                        {this.state.isLoading ? <LoadingSpinner /> : ''} 

                        <Card.Text style={messagestyle}>{this.state.message}</Card.Text>

                        {this.state.reDirectMessage ? <RedirectMessage /> : ''}
                        <br></br>
                        <br></br>
                        <Button variant="primary" type="submit">
                            {this.props.type}
                        </Button>
                    </Form>
                       
                </Card.Body>
                <Card.Footer className="text-muted"><span id="footer-text">{this.props.text}</span><Link to={this.props.hlink}> {this.props.hlinktext}</Link></Card.Footer>
            </Card>
        </Container>
        );
    }
}
class SignupPage extends Component {
    render() {
        return(
            <React.Fragment>
                <CardTemplate {...this.props}  history={this.props.history} type="Sign Up" text="Already have an account ? " hlinktext="Log In" hlink="/"/>
            </React.Fragment>
        );
    }
}

export default SignupPage;