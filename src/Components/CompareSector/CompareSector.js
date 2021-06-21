import React, { Component } from 'react';
import './CompareSector.css';
import Card from 'react-bootstrap/Card';
import {Button,Form} from 'react-bootstrap';
import NavWithDropDownUser from '../UserNavBar';
import {Row,Col} from 'react-bootstrap';
import FusionCharts from "fusioncharts";
import ReactFusioncharts from "react-fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";

charts(FusionCharts);

class CompareSector extends Component {
    constructor(props){
        super(props);
        this.state = {
            sectorsList : [],
            sectorSelected : '',
            fromPeriod : '',
            toPeriod : '',
            periodicity : '',
            addButtonClicked : false,
            secondSectorSelected : '',
            dataFormatChart : [],
            category : [],
            sectorValue1 : [],
            sectorValue2 : []
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
        fetch('https://sector--service.herokuapp.com/sector/getAllSectors',requestOptions)
        .then(response => {
            if(response.status === 200){
                return response.json();
            }
            return null;
        })
        .then(data => {
            if(data != null){
                this.setState({
                    sectorsList : data
                })
            }
        })
    }

    generateMap(e){
        e.preventDefault();
        if(this.state.secondSectorSelected === ''){
            var jsonBody = {
                "sector" : this.state.sectorSelected,
                "fromPeriod" : this.state.fromPeriod,
                "toPeriod" : this.state.toPeriod,
                "periodicity" : this.state.periodicity
            }
    
            var requestOptions = {
                method : 'POST',
                headers : {"Content-Type":"application/json" },
                body : JSON.stringify(jsonBody)            
            }
    
            fetch('https://stockprice--service.herokuapp.com/excel/getSectorByDate',requestOptions)
            .then(response => {
                if(response.status === 200){
                    return response.json();
                }
                else{
                    console.log(response.status);
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
        else {
            var jsonBody1 = {
                
                "sector" : this.state.sectorSelected,
                "fromPeriod" : this.state.fromPeriod,
                "toPeriod" : this.state.toPeriod,
                "periodicity" : this.state.periodicity
            }
    
            var jsonBody2 = {
            
                "sector" : this.state.secondSectorSelected,
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
                fetch("https://stockprice--service.herokuapp.com/excel/getSectorByDate",requestOptions1),
                fetch("https://stockprice--service.herokuapp.com/excel/getSectorByDate",requestOptions2)
            ])
            .then(([res1,res2]) => {
                return Promise.all([res1.json(),res2.json()])
            })
            .then(([res1,res2]) => {
                if(res1 != null && res2 != null){
                    console.log(res1);
                    console.log(res2);
                    let category = [];
                    let sectorValue1 = [];
                    let sectorValue2 = [];
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
                        sectorValue1.push(comp1Obj);
                        sectorValue2.push(comp2Obj);
                    }
    
                    this.setState({
                        category : category,
                        sectorValue1 : sectorValue1,
                        sectorValue2 : sectorValue2
                    })
                }
            })
        }
        
    }


    render(){

        const dataSource = {
            chart : {
                caption : "Sector Average Price",
                yaxisname : "Price",
                numberprefix: "Rs.",
                rotatelabels: "1",
                setadaptiveymin:"1",
                theme:"fusion"
            },
            data : this.state.dataFormatChart
        };

        const dataSource2 = {
            chart: {
                caption : "Comparison of 2 Sectors over time",
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
                    seriesname : this.state.sectorSelected,
                    data : this.state.sectorValue1
                },
                {
                    seriesname : this.state.secondSectorSelected,
                    data : this.state.sectorValue2
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

                <div id="compare-main-div-sector">
                <Card id="select-form-cc-sector">
                <Card.Header id="header-cc-sector">Compare Sectors</Card.Header>
                <Card.Body>
                    <Col>
                    <Form>
                        <br></br>
                        <Form.Group>
                            <Form.Label id="select-c-sector">Select Sector</Form.Label>
                            <select  onChange={e => this.setState({sectorSelected : e.target.value})} name="sector" id="sector">
                            {this.state.sectorsList.map(sector => (
                            <option key={sector} value={sector}>
                                {sector}
                            </option>
                            ))}
                            </select>
                        </Form.Group>
                        
                        <br></br>
                  
                        <Row md="2">
                            <Form.Group>
                                <Form.Label id="from-period-sector">From Period</Form.Label>
                                <input onChange={e => this.setState({fromPeriod : e.target.value})} id="select-d-sector" type="date"/>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label>To Period</Form.Label>
                                <input onChange={e => this.setState({toPeriod : e.target.value})} id="select-d-sector" type="date"/>
                            </Form.Group>
                        </Row>
                        
                        <br></br>

                        <Row md="2">
                        <Col>
                        <Form.Group>
                            <Form.Label id="select-p-sector">Select Periodicity</Form.Label>
                            <select onChange={e => this.setState({periodicity : e.target.value})} name="period" id="period">
                                <option key="weekly" value="weekly">Weekly</option>
                                <option key="monthly" value="monthly">Monthly</option>
                                <option key="quarterly" value="quarterly">Quarterly</option>
                                <option key="yearly" value="yearly">Yearly</option>
                            </select> 
                        </Form.Group>
                        </Col>
                        <Col>
                            <Form.Label> Click to add sector</Form.Label>
                            {this.state.addButtonClicked === false ? <Button onClick={this.addNewForm} id="add-button-sector" variant="primary"> + </Button> 
                            : 
                            <input type="text" onChange={e => this.setState({secondSectorSelected : e.target.value})} placeholder="Enter new sector name" />}
                            
                        </Col> 
                        </Row>
                        
                        
                        
                        <Button onClick={this.generateMap} variant="primary" id="generate-sector" type="submit">
                            Generate Chart
                        </Button>
                        
                    </Form>
                    </Col>   
                </Card.Body>
            
                </Card>
                </div>

                <div id="chart-sector">
                    <Card id="chart-display">
                        <Card.Header id="chart-header-sector"> Chart</Card.Header>
                        <Card.Body id="chart-body-sector">
                            {this.state.secondSectorSelected === '' ? 
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
                                dataSource={dataSource2}
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

export default CompareSector;