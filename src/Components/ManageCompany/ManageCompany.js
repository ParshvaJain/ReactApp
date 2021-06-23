import React, { Component } from 'react';
import './ManageCompany.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavWithDropDown from '../NavBar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CreateCompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            color: ''
        }
        this.createCompany = this.createCompany.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    createCompany(event) {
        event.preventDefault();
        event.stopPropagation();

        var name = document.getElementById("formCompanyName").value;
        var turnover = document.getElementById("formTurnover").value;
        var ceo = document.getElementById("formCeo").value;
        var bod = document.getElementById("formBoardOfDirectors").value;
        var exchanges = document.getElementById("formExchanges").value;
        var sector = document.getElementById("formSector").value;
        var brief = document.getElementById("formBrief").value;
        var exchangeToCode = document.getElementById("formETC").value;

        let myMap = new Map();
        var textArray = exchangeToCode.split(",")
        let len = textArray.length;
        for (var i = 0; i < len; i++) {
            var exchange = textArray[i].split(":")[0];
            var code = textArray[i].split(":")[1];
            myMap.set(exchange, code);
        }

        exchanges = exchanges.split(",");
        bod = bod.split(",");
        this.sendRequest(name, turnover, ceo, bod, exchanges, sector, brief, myMap);
    }

    sendRequest(name, turnover, ceo, bod, exchanges, sector, brief, myMap) {

        var ETCObj = {};
        var inArray = [...myMap.entries()];
        var length = inArray.length;
        for (var i = 0; i < length; i++) {
            ETCObj[inArray[i][0]] = inArray[i][1];
        }

        var jsonBody = {
            "companyName": name,
            "turnover": turnover,
            "ceo": ceo,
            "boardOfDirectors": bod,
            "listedInExchanges": exchanges,
            "sector": sector,
            "brief": brief,
            "exchangeToCode": ETCObj
        }

        var requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + this.props.getAuthToken() },
            body: JSON.stringify(jsonBody),
            referrerPolicy: "no-referrer",
        }
        this.setState(() => {
            fetch('https://company--service.herokuapp.com/company/create', requestOptions)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            message: "New Company created ",
                            color: "green"
                        })
                        return response.json();
                    }
                    else {
                        this.setState({
                            message: "Error creating Company!",
                            color: "red"
                        })
                    }
                    return null;
                }).then(data => {
                    if (data != null) {
                        setTimeout(() => {
                            this.props.history.push("/adminHome");
                        }, 2000);
                    }
                })
        })
    }

    render() {

        var messagestyle = {
            fontSize: '16px',
            color: this.state.color
        }

        return (
            <Form id="create-company-form" onSubmit={this.createCompany}>
                <Form.Group controlId="formCompanyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control type="text" placeholder="Company name" required />
                </Form.Group>
                <Form.Group controlId="formTurnover">
                    <Form.Label>Turnover</Form.Label>
                    <Form.Control type="text" placeholder="Enter Turnover in Crores" required />
                </Form.Group>

                <Form.Group controlId="formCeo">
                    <Form.Label>CEO</Form.Label>
                    <Form.Control type="text" placeholder="Enter CEO" required />
                </Form.Group>

                <Form.Group controlId="formBoardOfDirectors">
                    <Form.Label>Board Of Directors</Form.Label>
                    <Form.Control type="text" placeholder="Enter directors in comma seperated" required />
                </Form.Group>

                <Form.Group controlId="formExchanges">
                    <Form.Label>Exchanges</Form.Label>
                    <Form.Control type="text" placeholder="Enter exchanges in comma seperated" required />
                </Form.Group>

                <Form.Group controlId="formSector">
                    <Form.Label>Sector</Form.Label>
                    <Form.Control type="text" placeholder="Enter Sector" required />
                </Form.Group>

                <Form.Group controlId="formBrief">
                    <Form.Label>Brief</Form.Label>
                    <Form.Control type="text" placeholder="Enter Brief" required />
                </Form.Group>

                <Form.Group controlId="formETC">
                    <Form.Label>Exchange To Code</Form.Label>
                    <Form.Control type="text" placeholder="Enter Code for each exchange" required />
                </Form.Group>

                <br></br>
                <br></br>
                <Row>
                    <Col>
                        <Button id="create-company-button" variant="primary" type="submit">
                            Create Company
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

class EditCompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            turnover: '',
            ceo: '',
            bod: '',
            exchanges: '',
            sector: '',
            brief: '',
            exchangeToCode: {}
        }
        this.updateForm = this.updateForm.bind(this);
    }

    updateForm(e) {
        e.preventDefault();

        var jsonBody = {
            "companyName": this.state.name,
            "turnover": this.state.turnover,
            "ceo": this.state.ceo,
            "boardOfDirectors": this.state.bod.split(","),
            "listedInExchanges": this.state.exchanges.split(","),
            "sector": this.state.sector,
            "brief": this.state.brief,
            "exchangeToCode": this.state.exchangeToCode
        }
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + this.props.getAuthToken() },
            body: JSON.stringify(jsonBody),
            referrerPolicy: "no-referrer",
        }

        fetch(`https://company--service.herokuapp.com/company/update/${this.props.companyId}`, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    console.log("in 200");
                    return response.json();
                }
                else {
                    console.log("in !200");
                }
                return null;
            }).then(data => {
                console.log(data);
                setTimeout(() => {
                    this.props.history.push("/adminHome");
                }, 3000);
            })
    }


    componentDidMount() {
        var requestOptions = {
            method: 'GET',
            headers: { "Authorization": "Bearer " + this.props.getAuthToken() }
        }
        console.log(this.props.ipoId);
        fetch(`https://company--service.herokuapp.com/company/${this.props.companyId}`, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            }).then(data => {
                console.log(data);
                if (data != null) {
                    this.setState({
                        name: data.companyName,
                        turnover: data.turnover,
                        ceo: data.ceo,
                        bod: data.boardOfDirectors.toString(),
                        exchanges: data.listedInExchanges.toString(),
                        sector: data.sector,
                        brief: data.brief,
                        exchangeToCode: data.exchangeToCode
                    });
                }
            })
    }

    render() {

        return (
            <Form className="justify-content-center" onSubmit={this.getData}>
                <Form.Group controlId="formCompanyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control onChange={e => this.setState({ name: e.target.value })} value={this.state.name} type="text" placeholder="Company name" required />
                </Form.Group>
                <Form.Group controlId="formTurnover">
                    <Form.Label>Turnover</Form.Label>
                    <Form.Control type="text" onChange={e => this.setState({ turnover: e.target.value })} value={this.state.turnover} placeholder="Enter Turnover in Crores" required />
                </Form.Group>

                <Form.Group controlId="formCeo">
                    <Form.Label>CEO</Form.Label>
                    <Form.Control onChange={e => this.setState({ ceo: e.target.value })} value={this.state.ceo} type="text" placeholder="Enter CEO" required />
                </Form.Group>

                <Form.Group controlId="formBoardOfDirectors">
                    <Form.Label>Board Of Directors</Form.Label>
                    <Form.Control onChange={e => this.setState({ bod: e.target.value })} value={this.state.bod} type="text" placeholder="Enter directors in comma seperated" required />
                </Form.Group>

                <Form.Group controlId="formExchanges">
                    <Form.Label>Exchanges</Form.Label>
                    <Form.Control type="text" onChange={e => this.setState({ exchanges: e.target.value })} value={this.state.exchanges} placeholder="Enter exchanges in comma seperated" required />
                </Form.Group>

                <Form.Group controlId="formSector">
                    <Form.Label>Sector</Form.Label>
                    <Form.Control onChange={e => this.setState({ sector: e.target.value })} value={this.state.sector} type="text" placeholder="Enter Sector" required />
                </Form.Group>

                <Form.Group controlId="formBrief">
                    <Form.Label>Brief</Form.Label>
                    <Form.Control onChange={e => this.setState({ brief: e.target.value })} value={this.state.brief} type="text" placeholder="Enter Brief" required />
                </Form.Group>

                <Form.Group controlId="formETC">
                    <Form.Label>Exchange To Code</Form.Label>
                    <Form.Control onChange={e => this.setState({ exchangeToCode: e.target.value })} value={JSON.stringify(this.state.exchangeToCode)} type="text" placeholder="Enter Code for each exchange" required />
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

class CompanyCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            updateForm: false
        }
        this.deleteCompany = this.deleteCompany.bind(this);
    }

    deleteCompany() {
        var requestOptions = {
            method: 'GET',
            headers: { "Authorization": "Bearer " + this.props.getAuthToken() }
        }

        fetch(`https://company--service.herokuapp.com/company/delete/${this.props.companyName}`, requestOptions)
            .then(res => {
                if (res.status == 200)
                    return res.json();
            })
            .then(data => {
                if (data != null) {
                    console.log("done");
                }
            })
    }
    render() {
        var exchanges = this.props.exchanges;
        var companyExchange = exchanges.toString();
        return (
            <Card bg="white" id="each-card-company" text="black">
                <Card.Header>{this.props.companyName}</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Container>
                            <Row md="3">
                                <Col>
                                    Sector
                                </Col>
                                <Col>
                                    Listed in Exchanges
                                </Col>
                                <Col>
                                    TurnOver
                                </Col>
                            </Row>
                            <br></br>
                            <Row md="3">
                                <Col>
                                    {this.props.sector}
                                </Col>
                                <Col>
                                    {companyExchange}
                                </Col>
                                <Col>
                                    {this.props.turnover}
                                </Col>
                            </Row>
                        </Container>
                    </Card.Text>
                    <Button id="edit-details-company" onClick={(event) => this.props.UpdateCompanyForm(event, this.props.companyId)} variant="primary">Edit Details</Button>
                    <Button id="delete-details-company" id="delete-company-button" onClick={this.deleteCompany} variant="primary">Delete Company</Button>
                </Card.Body>
            </Card>
        );
    }
}
class ManageCompany extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            createForm: false,
            updateForm: false,
            companyId: ''
        }
        this.DisplayData = this.DisplayData.bind(this);
        this.CreateCompanyForm = this.CreateCompanyForm.bind(this);
        this.UpdateCompanyForm = this.UpdateCompanyForm.bind(this);
    }

    DisplayData() {
        console.log(this.props.getAuthToken());
        console.log(this.props.getUserName());
        console.log(this.props.getUserId());
        var CompanyCardList = [];
        var data = this.state.data;
        for (var i = 0; i < data.length; i++) {
            var companyBanner = <CompanyCard key={i}
                companyId={data[i].id}
                companyName={data[i].companyName}
                ceo={data[i].ceo}
                turnover={data[i].turnover}
                BOD={data[i].boardOfDirectors}
                exchanges={data[i].listedInExchanges}
                sector={data[i].sector}
                brief={data[i].brief}
                exchangeToCode={data[i].exchangeToCode}
                UpdateCompanyForm={this.UpdateCompanyForm}
            />
            CompanyCardList.push(companyBanner);
        }
        return CompanyCardList;
    }

    CreateCompanyForm() {
        this.setState({ createForm: true, updateForm: false });
    }

    UpdateCompanyForm(event, companyId) {
        this.setState({ createForm: false, updateForm: true, companyId: companyId });
    }

    componentDidMount() {
        console.log(this.props);
        console.log(this.props.getAuthToken());
        console.log(this.props.getUserName());
        console.log(this.props.getUserId());
        var requestOptions = {
            method: 'GET',
            headers: { "Authorization": "Bearer " + this.props.getAuthToken() }
        }
        fetch("https://company--service.herokuapp.com/company/", requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({ data: data });
            })
    }


    render() {

        let form;
        if (this.state.createForm === true) {
            form = <CreateCompanyForm {...this.props} history={this.props.history} />;
        }
        else {
            if (this.state.updateForm === true) {
                form = <EditCompanyForm {...this.props} history={this.props.history} companyId={this.state.companyId} />;
            }
            else {
                form = <Button onClick={this.CreateCompanyForm} id="add-new-company" variant="primary">Add New Company</Button>;
            }
        }

        return (
            <React.Fragment>
                <NavWithDropDown />
                <br></br>
                <br></br>
                <br></br>
                <Row md="2">
                    <Col>
                        <div id="ipo-company">
                            <Card id="main-card-company">
                                <Card.Header id="card-header-company">Listed Companies</Card.Header>
                                <Card.Body id="card-body-company">
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
                        <div id="form-company">
                            <Card id="form-card-company">
                                <Card.Header>{this.state.createForm === true ? <span id="company-new-header">Create New Company </span> : ''}</Card.Header>
                                <Card.Body id="form-body-company">
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

export default ManageCompany;