import React,{ Component } from 'react';
import './ViewCompany.css';
import NavWithDropDown from '../NavBar';
import {Container,Row,Col,Card} from 'react-bootstrap';
import UserNavBar from '../UserNavBar';


class ViewCompany extends Component{

    constructor(props){
        super(props);
        var pathArray = this.props.location.pathname.split('/');
        
        this.state = {
            companyId : '',
            name : pathArray[pathArray.length - 2],
            turnover : '',
            ceo : '',
            BOD : '',
            exchanges : '',
            sector : '',
            brief : '',
            ETC : [],
            type : pathArray[pathArray.length - 1]
        }

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData(){
        var requestOptions = {
            method: "GET",
            headers: { "Authorization":"Bearer " + this.props.getAuthToken() }
        }
        
        fetch("http://localhost:8082/company/getCompanyByName/"+this.state.name,requestOptions)
            .then(response=> response.json())
            .then(data =>{
                this.setState({
                    companyId : data.id,
                    name : this.state.name,
                    turnover : data.turnover,
                    ceo : data.ceo,
                    BOD : data.boardOfDirectors.toString(),
                    exchanges : data.listedInExchanges.toString(),
                    sector : data.sector,
                    brief : data.brief,
                    ETC : data.exchangeToCode.toString()
                });
            })
    }
    render(){
        

        return(
            <React.Fragment>
                {this.state.type === 'admin' ? <NavWithDropDown /> : <UserNavBar /> }

                <br></br>
                <br></br>
                <br></br>

                <Container id="main-c-name">
                <Card id="main-card-c-name">
                        <Card.Header id="card-header-c-name">{this.state.name}</Card.Header>
                        <Card.Body>
                            <Row>
                                <Container id="chart">
                                </Container>  
                            </Row>
                            <Container id="data">
                            <Row md = "4">
                                <Col>
                                CEO
                                </Col>
                                <Col>
                                Turnover 
                                </Col>
                                <Col>
                                Sector
                                </Col>
                                <Col>
                                Listed In Exchanges
                                </Col>
                            </Row>

                            <Row md = "4">
                                <Col>
                                {this.state.ceo}
                                </Col>
                                <Col>
                                Rs.{this.state.turnover} Cr
                                </Col>
                                <Col>
                                {this.state.sector}
                                </Col>
                                <Col>
                                {this.state.exchanges}
                                </Col>
                            </Row>
                            <br></br>
                            <br></br>
                            <Row md = "4">
                                <Col>
                                Board Of Directors
                                </Col>
                                
                            </Row>

                            <Row md = "4">
                                <Col>
                                {this.state.BOD}
                                </Col>
                              
                                
                            </Row>
                            </Container>
                            <br></br>
                            <br></br>
                            <Container id="about">
                                <Row md="1">
                                    About the Company
                                </Row>
                                <Row md="1">
                                    {this.state.brief}
                                </Row>
                            </Container>
                            
                            
                            
                        </Card.Body>
                    </Card>
                </Container>
            </React.Fragment>
        );
    }
}

export default ViewCompany;