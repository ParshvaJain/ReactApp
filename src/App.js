import React, {Component} from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import LoginPage from './Components/LoginPage/LoginPage';
import SignupPage from './Components/SignUpPage/SignupPage';
import AdminHome from './Components/AdminHome/AdminHome';
import UserHome from './Components/UserHome/UserHome';
import ImportData from './Components/ImportData/ImportData';
import ManageCompany from './Components/ManageCompany/ManageCompany';
import ManageExchange from './Components/ManageExchange/ManageExchange';
import ManageIPO from './Components/ManageIPO/ManageIPO';
import UpdateProfile from './Components/UpdateProfile/UpdateProfile';
import ViewCompany from './Components/ViewCompany/ViewCompany';
import UpcomingIPO from './Components/UpcomingIPO/UpcomingIPO';
import CompareCompany from './Components/CompareCompany/CompareCompany';
import CompareSector from './Components/CompareSector/CompareSector';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            authToken:"",
            userId:"",
            userName:""
        }
        this.setAuth = this.setAuth.bind(this);
        this.getAuthToken = this.getAuthToken.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.getUserName = this.getUserName.bind(this);
    }

    setAuth(authToken,userId,userName){
        console.log("New Auth set");
        this.setState(
          {
            authToken:authToken,
            userId:userId,
            userName:userName
          }
        )
      }

    getAuthToken(){
        return (this.state.authToken);
    }

    getUserId(){
        return (this.state.userId);
    }
    
    getUserName(){
        return (this.state.userName);
    }

    render() {
       return (
        <Switch>
            <Route exact path = "/" render={(props) => <LoginPage {...props} getAuthToken={this.getAuthToken} authFunction={this.setAuth} />}/>
            <Route path="/signup" render={(props) => <SignupPage {...props} />} />
            <Route path="/adminHome" render={(props) => <AdminHome getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/userHome" render={(props) => <UserHome getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/importData" render={(props) => <ImportData getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/manageCompany" render={(props) => <ManageCompany getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName}  {...props} />} />
            <Route path="/manageExchange" render={(props) => <ManageExchange getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/manageIPO" render={(props) => <ManageIPO getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/updateProfile/:type" render={(props) => <UpdateProfile getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName}  {...props} />} />
            <Route path="/company/:name/:type" render={(props) => <ViewCompany getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/upcomingIPO" render={(props) => <UpcomingIPO getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/compareCompany" render={(props) => <CompareCompany getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
            <Route path="/compareSectors" render={(props) => <CompareSector getAuthToken={this.getAuthToken} getUserId={this.getUserId} getUserName={this.getUserName} {...props} />} />
        </Switch>
       );
   } 
}

export default App;
