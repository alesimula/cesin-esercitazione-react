import React from 'react';
import {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { Route, Switch } from 'react-router';
import { HashRouter, Link , useHistory, withRouter} from 'react-router-dom';
import { render } from '@testing-library/react';
import {Modal, Button} from 'react-bootstrap'


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


class Rename extends React.Component {
  closeModal = (() => {
    if (this.props?.showDialog) {
      this.props.history.push("/")
    }
  }).bind(this)

  confirmModal = (() => {
    let self = this

    if (this.props?.showDialog) axios.post(`http://localhost:8080/cliente/edit`)
        .then(result => {
            self.closeModal()
        }).catch(function(error) {
            console.log("====> " + error)
        }).then(function() {
            //console.log("====> in finally")
        })
  }).bind(this)

  render() {
    return (
      <Modal show={this.props.showDialog} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="form-group">
              <label class="col-md-7 control-label" for="title">Title</label>
                <div class="col-md-6">
                <input defaultValue={this.props.match.params.name} type="text" id="client-name" class="form-control input-md"/>
                </div>
          </div>

          <div class="form-group">
              <label class="col-md-7 control-label" for="title">Title</label>
                <div class="col-md-6">
                <input defaultValue={this.props.match.params.name} type="text" id="client-name2" class="form-control input-md"/>
                </div>
          </div>
          
          <div class="col-auto">
            <div class="custom-control custom-checkbox mr-sm-2">
              <input type="checkbox" class="custom-control-input" id="client-public"/>
              <label class="custom-control-label form-check-label" for="client-public">Public</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.closeModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
Rename = withRouter(Rename)


class Remove extends React.Component {
  closeModal = (() => {
    if (this.props?.showDialog) {
      this.props.history.push("/")
    }
  }).bind(this)

  confirmModal = (() => {
    let self = this;

    if (this.props?.showDialog) axios.post(`http://localhost:8080/cliente/remove/${this.props.match.params.id}`)
        .then(result => {
            self.closeModal()
        }).catch(function(error) {
            console.log("====> " + error)
        }).then(function() {
            //console.log("====> in finally")
        })
  }).bind(this)

  render() {
    return (
      <Modal show={this.props.showDialog} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete client {this.props.match.params.id || "ERROR"}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.confirmModal}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
Remove = withRouter(Remove)

 
ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact path='/' component={Rename}/>
      <Route path='/edit/:id' render={() => <Rename showDialog={true}/>}/>
    </Switch>
    <Switch>
      <Route exact path='/' component={Remove}/>
      <Route path='/remove/:id' render={() => <Remove showDialog={true}/>}/>
    </Switch>
    <Clienti/>
  </HashRouter>,
  document.getElementById('root')
)

reportWebVitals();
