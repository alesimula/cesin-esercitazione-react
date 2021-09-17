import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import reportWebVitals from './reportWebVitals';
import axios from "axios";

import { Route, Switch } from 'react-router';
import { HashRouter, Link } from 'react-router-dom';
import { render } from '@testing-library/react';


class Clienti extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      clienti: []
    }
  }

  retrieveClienti() {
    let self = this;

    this.serverRequest = axios.get("http://localhost:8080/cliente/list")
        .then(result => {
            let clienti = result.data.map(cliente => (
              <tr>
                <th class="text-center">{cliente.id}</th>
                <th class="text-center">{cliente.name}</th>
                <th class="text-center">{cliente.address}</th>
                <th class="text-center"><input type="checkbox" checked={cliente.public ? "true" : "false"}/></th>
                <th class="text-center"><Link to={`/edit/${cliente.id}`}><i class="bi bi-pencil-square btn btn-info"></i></Link></th>
                <th class="text-center"><Link to={`/remove/${cliente.id}`}><i class="bi bi-trash btn btn-danger"></i></Link></th>
              </tr>
            ))
            self.setState({clienti: clienti})
        }).catch(function(error) {
            console.log("====> " + error)
        }).then(function() {
            //console.log("====> in finally")
        })
  }

  getClienti() {

    let clienti=[];

    for(var i=0;i<10;i++){
      clienti.push (
        <tr>
          <th className="text-center">1</th>
          <th className="text-center">MarioRossi</th>
          <th className="text-center">24 via roma</th>
          <th className="text-center"><input type="checkbox" checked='true' /></th>
          <th className="text-center"><div><i className="bi bi-pencil-square btn btn-info"></i></div></th>
          <th className="text-center"><div><i className="bi bi-trash btn btn-danger"></i></div></th>
        </tr>
      )
    }
     
    return clienti;
  }

  componentDidMount() {
    this.retrieveClienti()
  }

  render() {
    return(
      <div>
        <table className="table">
          <tr className="thead-dark">
            <th className="text-center">ID</th>
            <th className="text-center">Name</th>
            <th className="text-center">Address</th>
            <th className="text-center">Public</th>
            <th className="text-center">edit</th>
            <th className="text-center">delete</th>
          </tr>
          {this.state.clienti}
        </table>
      </div>
    )
  }
}

class Test extends React.Component {
  render() {
    let modal = (
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="modal-title" class="modal-title">Conferm deletion</h5>            
            </div>
            <div class="modal-body">
                <p id="modal-dialog">Delete client {this.props.id || "BOH"}?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button id="modal-confirm" type="button" class="btn btn-primary">Confirm</button>
            </div>
        </div>
  )
  return modal;
  }
}
 
ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact path='/' component={Clienti} /> 
      <Route path='/edit/:id' component={Test} />
      <Route path='/remove/:id' component={Test} />
    </Switch>
  </HashRouter>,
  document.getElementById('root')
);

reportWebVitals();
