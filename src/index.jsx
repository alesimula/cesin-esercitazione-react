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

import { connect, Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

@connect(({clientState, dispatch}) => ({clients: clientState.map, opCount: clientState.opCount, dispatch}))
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
              <tr class="jumbotron">
                <td class="text-center">{cliente.id}</td>
                <td class="text-center">{cliente.name}</td>
                <td class="text-center">{cliente.address}</td>
                <td class="text-center">
                  <div class="custom-control custom-checkbox">
                    <label class="sr-only position-static"></label>
                    <input class="custom-control-input" type="checkbox" checked={cliente.public ? true : false}/>
                    <span class="custom-control-label"></span>
                  </div>
                </td>
                <td class="text-center"><Link to={`/edit/${cliente.id}`}><i class="bi bi-pencil-square btn btn-info"></i></Link></td>
                <td class="text-center"><Link to={`/remove/${cliente.id}`}><i class="bi bi-trash btn btn-danger"></i></Link></td>
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


const editMap = (operation, id, data) => {
  return {
      type: ['INIT', 'ADD', 'REMOVE', 'EDIT'].includes(operation) ? operation : 
          (()=>{throw new Error(`Illegal redux operation: ${operation}`)})(), 
      id: parseInt(id),
      data: data
  }
}


@connect(({clientState, dispatch}) => ({clients: clientState.map, dispatch}))
@withRouter
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


@connect(({clientState, dispatch}) => ({clients: clientState.map, dispatch}))
@withRouter
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
            //this.props.store?.dispatch(editMap('ADD'))
        }).catch(function(error) {
            console.log("====> " + error)
        }).then(function() {
            //console.log("====> in finally")
        })
  }).bind(this)

  render() {
    //alert(this.props.dispatch)
    //alert(JSON.stringify(this.props.clients))
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


const operations = (state={map: new Map(), opCount: 0}, operation) => {

  console.log(state);
  console.log(operation);

  switch(operation.type) {
    case 'INIT':
      state.map.clear()
      return {map: new Map(operation.data.map(e => [e.id, e])), opCount: 0}
    case 'ADD':
      state.map.state.set(operation.data.id, operation.data)
      return {map: state.map, opCount: ++state.opCount}
    case 'REMOVE':
      state.map.delete(parseInt(operation.data))
      return {map: state.map, opCount: ++state.opCount}
    case 'EDIT':
      if (state.map.has(operation.data?.id)) state.map.set(operation.data.id, operation.data)
      return {map: state.map, opCount: ++state.opCount}
    default:
      return state;
  }
}

let store = createStore(combineReducers({clientState: operations}));

ReactDOM.render(
  <Provider store={store}>
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
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

reportWebVitals();
