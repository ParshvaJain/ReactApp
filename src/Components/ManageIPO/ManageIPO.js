import React, { Component } from 'react';
import './ManageIPO.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavWithDropDown from '../NavBar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CreateIPOForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            message : '',
            color : ''
        }
        this.createIPO = this.createIPO.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    createIPO(event) {
        event.preventDefault();
        event.stopPropagation();

        var name = document.getElementById("formCompanyName").value;
        var pps = document.getElementById("formPPS").value;
        var number = document.getElementById("formNumberShares").value;
        var date = document.getElementById("formDate").value;
        var exchanges = document.getElementById("formExchanges").value;
        var remarks = document.getElementById("formRemarks").value;
        exchanges = exchanges.split(",");
        this.sendRequest(name,pps,number,date,exchanges,remarks);
    }

    sendRequest(name,pps,number,date,exchanges,remarks){
       
        var jsonBody = {
            "companyName" : name,
            "stockExchange":exchanges,
            "pricePershare":pps,
            "numberOfShares":number,
            "openDate":date,
            "remarks":remarks
        }
        var requestOptions = {
            method : 'POST',
            mode : 'cors',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify(jsonBody),
            referrerPolicy:"no-referrer",
        }
        this.setState(() => {
            fetch('http://localhost:8082/company/ipo/createIPO',requestOptions)
            .then(response => {
                if(response.status  === 200) {
                    this.setState({
                        message : "New IPO created ",
                        color : "green"
                    })
                    return response.json();
                }
                else {
                    this.setState({
                        message:"Error creating IPO!",
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
            <Form className="justify-content-center" onSubmit={this.createIPO}>
                        <Form.Group controlId="formCompanyName">
                        <Form.Label>Company Name</Form.Label>
                            <Form.Control placeholder="Company name"  required/>
                        </Form.Group>
                        <Form.Group controlId="formPPS">
                            <Form.Label>Price Per Share</Form.Label>
                            <Form.Control  type="text" placeholder="Enter Price Per Share" required />
                        </Form.Group>

                        <Form.Group controlId="formNumberShares">
                            <Form.Label>Number Of Shares</Form.Label>
                            <Form.Control type="text" placeholder="Enter Number of shares" required />
                        </Form.Group>

                        <Form.Group controlId="formDate">
                            <Form.Label>Open Date</Form.Label>
                            <Form.Control type="text" placeholder="Enter Date in yyyy-mm-dd format" required />
                        </Form.Group>

                        <Form.Group controlId="formExchanges">
                            <Form.Label>Exchanges</Form.Label>
                            <Form.Control type="text" placeholder="Enter exchanges in comma seperated" required />
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
                                Create
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
class EditIPOForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:'',
            pps:'',
            number:'',
            date : '',
            remarks:'',
            exchanges : ''
        }
        this.updateForm = this.updateForm.bind(this);
    }

    updateForm(){
        var jsonBody = {
            "companyName" : this.state.name,
            "pricePershare": this.state.pps,
            "numberOfShares": this.state.number,
            "openDate": this.state.date,
            "remarks" : this.state.remarks,
            "stockExchange":this.state.exchanges.split(",")
        }
        var requestOptions = {
            method : 'POST',
            headers: {'Content-Type':'application/json', 'mode' : 'no-cors'},
            body : JSON.stringify(jsonBody),
            referrerPolicy:"no-referrer",
        }

        fetch(`http://localhost:8082/company/ipo/updateIPO/${this.props.ipoId}`,requestOptions)
            .then(response => {
                if(response.status  === 200) {
                    console.log("in 200");
                    return response.json();
                }
                else{
                    console.log("in !200");
                }
                return null;
            }).then(data => {
                console.log(data);
                setTimeout(() => {
                    this.props.history.push("/adminHome");
                },2000);
            })
    }


    componentDidMount(){
        var requestOptions = {
            method : 'GET',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken() }
        }
        console.log(this.props.ipoId);
        fetch(`http://localhost:8082/company/ipo/getIPOById/${this.props.ipoId}`,requestOptions)
            .then(response => {
                if(response.status  === 200) {
                    return response.json();
                }
                return null;
            }).then(data => {
                console.log(data);
                if(data != null){
                    this.setState({
                        name : data.companyName,
                        pps : data.pricePershare,
                        number : data.numberOfShares,
                        date : data.openDate,
                        remarks : data.remarks,
                        exchanges : data.stockExchange.toString()
                    });
                }
            })
    }

    render(){
        
        return(
            <Form className="justify-content-center" onSubmit={this.getData}>
                        <Form.Group controlId="formCompanyName">
                        <Form.Label>Company Name</Form.Label>
                            <Form.Control onChange={e => this.setState({name : e.target.value})} value={this.state.name} placeholder="Company name"  required/>
                        </Form.Group>
                        <Form.Group controlId="formPPS">
                            <Form.Label>Price Per Share</Form.Label>
                            <Form.Control onChange={e => this.setState({pps : e.target.value})} value={this.state.pps} type="text" placeholder="Enter Price Per Share" required />
                        </Form.Group>

                        <Form.Group controlId="formNumberShares">
                            <Form.Label>Number Of Shares</Form.Label>
                            <Form.Control value={this.state.number} onChange={e => this.setState({number : e.target.value})} type="text" placeholder="Enter Number of shares" required />
                        </Form.Group>

                        <Form.Group controlId="formDate">
                            <Form.Label>Open Date</Form.Label>
                            <Form.Control value={this.state.date} type="text" onChange={e => this.setState({date : e.target.value})}placeholder="Enter Date in yyyy-mm-dd format" size="10" required />
                        </Form.Group>

                        <Form.Group controlId="formDate">
                            <Form.Label>Stock Exchanges</Form.Label>
                            <Form.Control value={this.state.exchanges} type="text" onChange={e => this.setState({exchanges : e.target.value})}placeholder="Enter Exchanges in comma seperated" required />
                        </Form.Group>

                        <Form.Group controlId="formRemarks">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control value={this.state.remarks} onChange={e => this.setState({remarks : e.target.value})}type="text" placeholder="Enter Remarks" required />
                        </Form.Group>

                        <br></br>
                        <br></br>
                        <Button variant="primary" type="submit" onClick={this.updateForm}>
                            Update
                        </Button>
                    </Form>
        );
    }
}
export class IPOCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            updateForm : false
        } 
    }

    render(){
        var openDate = this.props.ipoOpenDate;
        var date = new Date(openDate);
        openDate = date.toDateString();

        var exchanges = this.props.ipoExchanges;
        var ipoExchange = exchanges.toString(); 
        return(
                    <Card bg="white" id="each-card-ipo" text="black">
                        <Card.Header>{this.props.ipoName}</Card.Header>
                        <Card.Body>
                        <Card.Text>
                            <Container>
                            <Row md="4">
                                <Col>
                                    OpenDate
                                </Col>
                                <Col>
                                    Price Per Share
                                </Col>
                                <Col>
                                    Number of Shares
                                </Col> 
                                <Col>
                                    Listed in Exchanges 
                                </Col> 
                            </Row>
                            <br></br>
                            <Row md="4">
                                <Col>
                                    {openDate}
                                </Col>
                                <Col>
                                    Rs. {this.props.ipoPPS}
                                </Col>
                                <Col>
                                    {this.props.ipoShares}
                                </Col> 
                                <Col>
                                    {ipoExchange} 
                                </Col> 
                            </Row>
                            </Container>    
                        </Card.Text>
                        <Button id="edit-details" onClick={(event) => this.props.UpdateIPOForm(event,this.props.ipoId)} variant="primary">Edit Details</Button>
                        </Card.Body>
                    </Card>  
        );
    }
}

class ManageIPO extends Component{
    constructor(props){
        super(props);
        this.state = {
            data : [],
            createForm : false,
            updateForm : false,
            ipoId : ''
        }
        this.displayData = this.displayData.bind(this);
        this.CreateIPOForm = this.CreateIPOForm.bind(this);
        this.UpdateIPOForm = this.UpdateIPOForm.bind(this);
    } 

    UpdateIPOForm(event,ipoId){
        this.setState({createForm : false,updateForm : true,ipoId : ipoId});
    }
    CreateIPOForm(){
        this.setState({createForm : true,updateForm : false});
    }
    
    displayData(){

        var IPOCardList = [];
        var data = this.state.data;
        for(var i = 0; i < data.length; i++) {
            var ipoBanner = <IPOCard key={i}
                                             ipoId={data[i].id}
                                             ipoName={data[i].companyName}
                                             ipoExchanges={data[i].stockExchange}
                                             ipoPPS={data[i].pricePershare}
                                             ipoShares={data[i].numberOfShares}
                                             ipoOpenDate = {data[i].openDate}
                                             ipoRemarks = {data[i].remarks}
                                             UpdateIPOForm={this.UpdateIPOForm}
                                             />
            IPOCardList.push(ipoBanner);
        }
        return IPOCardList;
    }

    componentDidMount(){
        console.log("token" + this.props.getAuthToken());
        var requestOptions = {
            method : 'GET',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken() }
        }
        fetch("http://localhost:8082/company/ipo/getIPO",requestOptions)
        .then(response =>  response.json())
        .then(data => {
            this.setState({data : data});
        })
    }

    render(){
        let form;
        if(this.state.createForm === true){
            form = <CreateIPOForm {...this.props}  history={this.props.history}/>;
        }
        else{
            if(this.state.updateForm === true){
                form = <EditIPOForm {...this.props}  history={this.props.history} ipoId = {this.state.ipoId}/>;
            }
            else{
                form = <Button onClick={this.CreateIPOForm} id="add-new-ipo" variant="primary">Add New IPO</Button>;
            }
        }
        return(
            <React.Fragment>
                <NavWithDropDown />
                <br></br>
                <br></br>
                <br></br>
                <Row md="2">
                <Col>
                <div id="ipo-c">
                    <Card id="main-card-ipo">
                        <Card.Header id="card-header">Upcoming IPO</Card.Header>
                        <Card.Body id="card-body-ipo">
                            <Col>
                            <Row md="1">
                                {this.displayData()}
                            </Row>
                            </Col>
                        </Card.Body>
                    </Card>
                </div>
                </Col>

                <Col>
                <div id="form-c">
                    <Card id="form-card">
                    <Card.Header id="form-header">{this.state.createForm === true ? 'Create New IPO' : ''}</Card.Header>
                        <Card.Body id="form-body">
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

export default ManageIPO;