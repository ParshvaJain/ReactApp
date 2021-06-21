import React, { Component } from 'react';
import './UpcomingIPO.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import {Row,Col} from 'react-bootstrap';
import NavWithDropDownUser from '../UserNavBar';

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
                    <Card bg="white" id="each-card-ipo-up" text="black">
                        <Card.Header id="upcoming-card-header">{this.props.ipoName}</Card.Header>
                        <Card.Body>
                        <Card.Text>
                            <Container id="up-container">
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
                        
                        </Card.Body>
                    </Card>  
        );
    }
}

class UpcomingIPO extends Component {
    constructor(props){
        super(props);
        this.displayData = this.displayData.bind(this);
        this.state = {
            data : []
        }
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
        return(
            <React.Fragment>
                <NavWithDropDownUser />
                <br></br>
                <br></br>
                <br></br>

                <div id="main-upcoming-ipo">
                    <Card id="main-card-upipo">
                        <Card.Header id="container-head-upcoming">Upcoming IPO</Card.Header>
                        <Card.Body id="card-body-ipo-up">
                            <Col>
                            <Row md="1">
                                {this.displayData()}
                            </Row>
                            </Col>
                        </Card.Body>
                    </Card>
                </div>
            </React.Fragment>
        );
    }
}

export default UpcomingIPO;