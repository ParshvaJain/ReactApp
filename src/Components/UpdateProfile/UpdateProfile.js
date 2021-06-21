import React, { Component } from 'react';
import NavWithDropDown from '../NavBar';
import UserNavBar from '../UserNavBar';
import Form from 'react-bootstrap/Form';
import './UpdateProfile.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

class UpdationForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            message : '',
            color : '',
            name : '',
            password : '',
            phoneNumber : ''
        }
        this.updateProfile = this.updateProfile.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }
    componentDidMount(){
        var requestOptions = {
            method : 'GET',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken() , 'Access-Control-Allow-Origin': '*'}
        }
        
        
        fetch("http://localhost:8081/authentication/update/getDetails/"+this.props.getUserId(),requestOptions)
        .then(response =>  response.json())
        .then(data => {
            this.setState({
                name : data.username,
                password : '',
                phoneNumber : data.phoneNumber
            });
        })
    }

    updateProfile(event) {
        event.preventDefault();
        event.stopPropagation();

        var name = document.getElementById("formName").value;
        var password = document.getElementById("formPassword").value;
        var phoneNumber = document.getElementById("formNumber").value;
        this.sendRequest(name,password,phoneNumber);
    }

    sendRequest(name,password,phoneNumber){

        var jsonBody = {
            "username":name,
            "password": password,
            "phoneNumber":phoneNumber,
            "confirmed":true,
            "userType":this.props.type,

        }

        var requestOptions = {
            method : 'POST',
            mode : 'cors',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify(jsonBody),
            referrerPolicy:"no-referrer",
        }

        this.setState(() => {
            fetch('http://localhost:8081/authentication/update/'+this.props.getUserId(),requestOptions)
            .then(response => {
                if(response.status  === 200) {
                    this.setState({
                        message : "Profile Updated",
                        color : "green"
                    })
                    return response.json();
                }
                else {
                    this.setState({
                        message:"Error updating profile",
                        color:"red"
                    })
                }
                return null;
            }).then(data => {
                if(data != null){
                    setTimeout(() => {
                        this.props.history.push("/" +this.props.type +"Home");
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
            <Container id="main-box">
            <Form className="justify-content-center" id="form-update"onSubmit={this.updateProfile}>
                        <Form.Group controlId="formName">
                        <Form.Label>User Name</Form.Label>
                            <Form.Control type="text"  onChange={e => this.setState({name : e.target.value})} value={this.state.name}placeholder="Enter User name"  required/>
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={e => this.setState({password : e.target.value})} value={this.state.password}placeholder="Enter Password" required />
                        </Form.Group>

                        <Form.Group controlId="formNumber">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" onChange={e => this.setState({phoneNumber : e.target.value})}  value={this.state.phoneNumber}placeholder="Enter Number" required />
                        </Form.Group>


                        <br></br>
                        <br></br>

                        <Row>
                            <Col>
                                <Button variant="primary" type="submit">
                                    Update Profile
                                </Button>
                            </Col>
                            
                            <Col>
                                <span style={messagestyle}>{this.state.message}</span>
                            </Col>
                        </Row>
                     
                    </Form>
                    </Container>
        );
    }
}
class UpdateProfile extends Component {

    constructor(props){
        super(props);
        var pathArray = this.props.location.pathname.split('/');
        this.state = {
            type : pathArray[pathArray.length - 1]
        }
    }

    render(){
        console.log(this.props.getAuthToken);
        return(
            <React.Fragment>
                {this.state.type === 'admin' ? <NavWithDropDown /> : <UserNavBar /> }
                <br></br>
                <br></br>
                <br></br>
                <UpdationForm type={this.state.type} history = {this.props.history} getAuthToken={this.props.getAuthToken} getUserId={this.props.getUserId} />
            </React.Fragment>
            
        );
    }
}

export default UpdateProfile;