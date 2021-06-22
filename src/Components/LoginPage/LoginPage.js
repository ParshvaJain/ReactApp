import React, { Component } from 'react';
import './LoginPage.css';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import {
  withRouter
} from 'react-router-dom';
import Form from 'react-bootstrap/Form';

class CardTemplate extends Component {

    constructor(props){
        super(props);
        this.state = {
            message:"",
            color:"",
            isAdmin:false
        }
        this.sendRequest = this.sendRequest.bind(this);
        this.verifyData = this.verifyData.bind(this);
    }

    verifyData(e){
        e.preventDefault();
        var name = document.getElementById("name").value;
        var password = document.getElementById("password").value;
        this.sendRequest(name,password);
    }

    sendRequest(name,password) {
        var jsonBody = {
            "username":name,
            "password":password
        };
        
        this.setState({
            isAdmin : name.includes("admin")  ? true : false 
        });
    
        var requestOptions = {
            method : 'POST',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify(jsonBody)
        }

        fetch('https://authentication--service.herokuapp.com/authentication/signin',requestOptions)
            .then(response => {
                if(response.status === 200){
                    this.setState({message : "Login Successfull",color:"green"});
                    return response.json()
                }
                else if(response.status === 401){
                    this.setState({message : "Please confirm your email before login",color:"red"});
                }
                else{
                    this.setState({message : "UserName does not exist",color:"red"});
                }
                return null;
            }).then(data => {
                if(data != null){
                    console.log(data.accessToken);
                    console.log(data.id);
                    console.log(data.username);
                    this.props.authFunction(data.accessToken,data.id,data.username);
                    if(this.state.isAdmin === true)
                        this.props.history.push({
                            pathname : '/adminHome',
                        });
                    else{
                        this.props.history.push({
                            pathname : '/userHome',
                        });
                    }      
                }
            })
    }

    render() {
        
        var messagestyle = {
            fontSize : '15px',   
            color : this.state.color
        }

        return (
            <Container id="card-login" md="auto">
                <Card className="text-center" id="text-header-login">
                <Card.Header>{this.props.type.toUpperCase()}</Card.Header>
                <Card.Body>
                    
                    <Form className="justify-content-center" onSubmit={this.verifyData}>
                        <Form.Group>
                            <Form.Label>User Name</Form.Label>
                            <Form.Control id="name" type="text" placeholder="Enter Username" required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control id="password" type="password" placeholder="Password" required />
                        </Form.Group>

                        <Card.Text style={messagestyle}>{this.state.message}</Card.Text> 
                        
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

class LoginPage extends Component {
    render() {
        return (
            <CardTemplate {...this.props} authFunction={this.props.authFunction} history={this.props.history} type="Login" text="Dont have an account ?" hlinktext="Sign Up" hlink="/signup"/>
        );
    }
}
export default withRouter(LoginPage);