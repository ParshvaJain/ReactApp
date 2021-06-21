import React, { Component } from 'react';
import './CompareCompany.css';
import Card from 'react-bootstrap/Card';
import {Button,Form} from 'react-bootstrap';
import NavWithDropDownUser from '../UserNavBar';
import {Row,Col} from 'react-bootstrap';
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import excelImport from 'fusioncharts/fusioncharts.excelexport';
import ReactFC from 'react-fusioncharts';
import Column2D from 'react-fusioncharts';


FusionTheme(FusionCharts);
charts(FusionCharts);

//ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme,excelImport);
class CompareCompany extends Component{
    constructor(props){
        super(props);
        this.state = {
            data : [],
            exchangeData : [],
            exchangeSelected : '',
            companySelected : '',
            fromPeriod : '',
            toPeriod : '',
            periodicity : '',
            dataFormatChart : [],
            addButtonClicked : false,
            secondCompanySelected : '',
            category : [],
            companyValue1 : [],
            companyValue2 : []
        }
        this.generateMap = this.generateMap.bind(this);
        this.addNewForm = this.addNewForm.bind(this);
    }

    addNewForm(){
        this.setState({addButtonClicked : true});
    }

    componentDidMount(){
        
        var requestOptions = {
            method : 'GET',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken() }
        }

        Promise.all([
            fetch("http://localhost:8082/company/getCompanies",requestOptions),
            fetch("http://localhost:8084/stockexchange/getNames",requestOptions)
        ])
        .then(([res1,res2]) => {
            return Promise.all([res1.json(),res2.json()])
        })
        .then(([res1,res2]) => {
            this.setState({
                data : res1,
                exchangeData : res2
            })
        })
    }

    generateMap(e){
        e.preventDefault();
        if(this.state.secondCompanySelected === ''){
        var jsonBody = {
            "exchange" : this.state.exchangeSelected,
            "company" : this.state.companySelected,
            "fromPeriod" : this.state.fromPeriod,
            "toPeriod" : this.state.toPeriod,
            "periodicity" : this.state.periodicity
        }

        var requestOptions = {
            method : 'POST',
            headers : {"Content-Type":"application/json" },
            body : JSON.stringify(jsonBody)            
        }

        fetch('http://localhost:8085/excel/getCompaniesByDate',requestOptions)
        .then(res => {
            if(res.status === 200){
                return res.json();
            }
            else{
                console.log(res.status);
            }
            return null;
        })
        .then(data => {
            if(data != null){
                console.log(data);
                let dataChart = [];
                var length = data.length;
                for(var i = 0;i<length;i++){
                    let price = data[i].currentPrice;
                    let date = data[i].date;
                    let tempObj = {
                        "label" : date,
                        "value" : price
                    }

                    dataChart.push(tempObj);
                }
                console.log(dataChart);
                this.setState({
                    dataFormatChart : dataChart,
                    addButtonClicked : false
                })
            }
        })
    } 
    else 
    {
        var jsonBody1 = {
            "exchange" : this.state.exchangeSelected,
            "company" : this.state.companySelected,
            "fromPeriod" : this.state.fromPeriod,
            "toPeriod" : this.state.toPeriod,
            "periodicity" : this.state.periodicity
        }

        var jsonBody2 = {
            "exchange" : this.state.exchangeSelected,
            "company" : this.state.secondCompanySelected,
            "fromPeriod" : this.state.fromPeriod,
            "toPeriod" : this.state.toPeriod,
            "periodicity" : this.state.periodicity
        }

        var requestOptions1 = {
            method : 'POST',
            headers : {"Content-Type":"application/json" },
            body : JSON.stringify(jsonBody1)            
        }

        var requestOptions2 = {
            method : 'POST',
            headers : {"Content-Type":"application/json" },
            body : JSON.stringify(jsonBody2)            
        }

        Promise.all([
            fetch("http://localhost:8085/excel/getCompaniesByDate",requestOptions1),
            fetch("http://localhost:8085/excel/getCompaniesByDate",requestOptions2)
        ])
        .then(([res1,res2]) => {
            return Promise.all([res1.json(),res2.json()])
        })
        .then(([res1,res2]) => {
            if(res1 != null && res2 != null){
                console.log(res1);
                console.log(res2);
                let category = [];
                let companyValue1 = [];
                let companyValue2 = [];
                var length = res1.length;
                for(var i=0;i<length;i++){
                    let date = res1[i].date;
                    let price1 = res1[i].currentPrice;
                    let price2 = res2[i].currentPrice;

                    let tempObj = {
                        "label" :  date
                    }
                    let comp1Obj = {
                        "value" : price1
                    }
                    let comp2Obj = {
                        "value" : price2
                    }
                    category.push(tempObj);
                    companyValue1.push(comp1Obj);
                    companyValue2.push(comp2Obj);
                }

                this.setState({
                    category : category,
                    companyValue1 : companyValue1,
                    companyValue2 :companyValue2
                })
            }
        })

    }
    }

    render(){
        const dataSource = {
            chart : {
                caption : "Stock Market Price",
                exportEnabled: "1",
                exportMode: "client",
                yaxisname : "Price",
                numberprefix: "Rs.",
                rotatelabels: "1",
                setadaptiveymin:"1",
                theme:"fusion"
            },
            data : this.state.dataFormatChart
        };

        const dataSource2Companies = {
            chart: {
                caption : "Comparison of 2 Companies over time",
                exportEnabled: "1",
                exportMode: "client",
                yaxisname : "Price",
                numberprefix : "Rs.",
                showhovereffect: "1",
                theme : "fusion"
            },
            categories : [
                {
                    category : this.state.category
                }
            ],
            dataset : [
                {
                    seriesname : this.state.companySelected,
                    data : this.state.companyValue1
                },
                {
                    seriesname : this.state.secondCompanySelected,
                    data : this.state.companyValue2
                }
            ]
        };

        return(
            <React.Fragment>
                <NavWithDropDownUser />
                <br></br>
                <br></br>
                <br></br>
                <Row>
                <div id="compare-main-div">
                <Card id="select-form-cc">
                <Card.Header id="header-cc">Compare Companies</Card.Header>
                <Card.Body>
                    <Col>
                    <Form>
                        <br></br>
                        <Form.Group>
                            <Form.Label id="select-c-s">Select Stock Exchange</Form.Label>
                            <select  onChange={e => this.setState({exchangeSelected : e.target.value})} name="exchange" id="exchange">
                            {this.state.exchangeData.map(exchange => (
                            <option key={exchange} value={exchange}>
                                {exchange}
                            </option>
                            ))}
                            </select>
                        </Form.Group>
                                <br></br>
                        <Form.Group>
                            <Form.Label>Enter Company</Form.Label>
                            <input onChange={e => this.setState({companySelected : e.target.value})} type="text" id="select-c" placeholder="Enter Company name" />
                        </Form.Group>
                        <br></br>
                        <Row md="2">
                            <Form.Group>
                                <Form.Label id="from-period">From Period</Form.Label>
                                <input onChange={e => this.setState({fromPeriod : e.target.value})} id="select-d" type="date"/>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label>To Period</Form.Label>
                                <input onChange={e => this.setState({toPeriod : e.target.value})} id="select-d" type="date"/>
                            </Form.Group>
                        </Row>
                        
                        <br></br>
                        <Row md="2">
                        <Col>
                        <Form.Group>
                            <Form.Label id="select-p">Select Periodicity</Form.Label>
                            <select onChange={e => this.setState({periodicity : e.target.value})} name="period" id="period">
                                <option key="weekly" value="weekly">Weekly</option>
                                <option key="monthly" value="monthly">Monthly</option>
                                <option key="quarterly" value="quarterly">Quarterly</option>
                                <option key="yearly" value="yearly">Yearly</option>
                            </select> 
                        </Form.Group>
                        </Col>
                        <Col>
                            <Form.Label> Click to add company</Form.Label>
                            {this.state.addButtonClicked === false ? <Button onClick={this.addNewForm}id="add-button" variant="primary"> + </Button> 
                            : 
                            <input type="text" onChange={e => this.setState({secondCompanySelected : e.target.value})} placeholder="Enter new company name" />}
                            
                        </Col> 
                        </Row>
                        
                        
                        
                        <Button onClick={this.generateMap} variant="primary" id="generate" type="submit">
                            Generate Chart
                        </Button>
                        
                    </Form>
                    </Col>   
                </Card.Body>
            
                </Card>
                </div>

                <div id="chart">
                    <Card id="chart-display">
                        <Card.Header id="chart-header"> Chart</Card.Header>
                        <Card.Body id="chart-body">
                            {this.state.secondCompanySelected === '' ? 
                            <ReactFusioncharts
                                id="fusionCharts"
                                type="line"
                                width="100%"
                                height="100%"
                                dataFormat="JSON"

                                dataSource={dataSource}
                                />
                            :
                            <ReactFusioncharts
                                type="msline"
                                width="100%"
                                height="100%"
                                dataFormat="JSON"
                                dataSource={dataSource2Companies}
                                />
                            }
                                 
                        </Card.Body>
                    </Card>
                </div>
            </Row>

            </React.Fragment>
            
        );
    }
}

export default CompareCompany;