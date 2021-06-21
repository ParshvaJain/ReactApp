import React, { Component } from 'react';
import './ImportData.css';
import XLSX from "xlsx";
import NavWithDropDown from '../NavBar';
import Card from 'react-bootstrap/Card';


class ImportData extends Component{
    constructor(props) {
        super(props);
        this.state = {
          data: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
          cols: [] /* Array of column objects e.g. { name: "C", K: 2 } */
        };
        this.handleFile = this.handleFile.bind(this);
        this.exportFile = this.exportFile.bind(this);
      }
      handleFile(file /*:File*/) {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = e => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          console.log(rABS, wb);
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 ,raw:false,dateNF:'dd-mm-yyyy'});
          console.log(JSON.stringify(data)+"this data needs to be passed to rest endpoint to save prices");
          
          var requestOptions = {
            method : 'POST',
            headers : {"Authorization" : "Bearer " + this.props.getAuthToken()},
            body : JSON.stringify(data)
        }
          
          fetch('http://localhost:8085/excel/upload',requestOptions)
          .then(response => {
            response.json();
          })
          .then(data => {
            if(data != null){
                this.props.history.push("/adminHome");
            }
          })
          
          /* Update state */
          this.setState({ data: data, cols: make_cols(ws["!ref"]) });
        };
        if (rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
      }
      exportFile() {
        /* convert state to workbook */
        const ws = XLSX.utils.aoa_to_sheet(this.state.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "sheetjs.xlsx");
      }
      render() {
        return (
          <DragDropFile handleFile={this.handleFile}>
            <div className="row">
              <div className="col-xs-12">
                <DataInput handleFile={this.handleFile} />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <button id="export-button"
                  disabled={!this.state.data.length}
                  className="btn btn-success"
                  onClick={this.exportFile}
                >
                  Export
                </button>
              </div>
            </div>
            <div className="row" id="output-row">
              <div className="col-xs-12">
                <OutTable data={this.state.data} cols={this.state.cols} />
              </div>
            </div>
          </DragDropFile>
        );
      }
}

class DragDropFile extends React.Component {
    constructor(props) {
      super(props);
      this.onDrop = this.onDrop.bind(this);
    }
    suppress(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    onDrop(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      const files = evt.dataTransfer.files;
      if (files && files[0]) this.props.handleFile(files[0]);
    }
    render() {
      return (
        <div
          onDrop={this.onDrop}
          onDragEnter={this.suppress}
          onDragOver={this.suppress}
        >
          {this.props.children}
        </div>
      );
    }
  }
  
  class DataInput extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
      const files = e.target.files;
      if (files && files[0]) this.props.handleFile(files[0]);
    }
    render() {
      return (
        <React.Fragment>
            <NavWithDropDown />
            <br></br>
            <br></br>
            <br></br>

            
            <Card className="text-center" id="text-header-i">
                <Card.Header>Import data</Card.Header>
                <Card.Body>
                    
                <form className="form-inline">
                    <div className="form-group">
                    <label id="label-s" htmlFor="file">Spreadsheet</label>
                    <input
                    type="file"
                    className="form-control"
                    id="file"
                    accept={SheetJSFT}
                    onChange={this.handleChange}
                    />
                    </div>
                </form>
                    
                       
                </Card.Body>
                </Card>
            
        </React.Fragment>
      );
    }
  }

  class OutTable extends React.Component {
    render() {
      return (
          <React.Fragment>
              <div id="summary">
                  Excel File Uploaded
              </div>
              <div className="table-responsive" id="table">
          <table className="table table-striped">
            <thead>
              <tr>
                {this.props.cols.map(c => (
                  <th key={c.key}>{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.props.data.map((r, i) => (
                <tr key={i}>
                  {this.props.cols.map(c => (
                    <td key={c.key}>{r[c.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </React.Fragment>
        
      );
    }
  }
  
  /* list of supported file types */
  const SheetJSFT = [
    "xlsx",
    "xlsb",
    "xlsm",
    "xls",
    "xml",
    "csv",
    "txt",
    "ods",
    "fods",
    "uos",
    "sylk",
    "dif",
    "dbf",
    "prn",
    "qpw",
    "123",
    "wb*",
    "wq*",
    "html",
    "htm"
  ]
    .map(function(x) {
      return "." + x;
    })
    .join(",");
  
  /* generate an array of column objects */
  const make_cols = refstr => {
    let o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
    return o;
  };
  
export default ImportData;