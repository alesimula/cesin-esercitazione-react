import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { Route, Switch } from 'react-router';
import { HashRouter, Link , withRouter} from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap'

import { connect, Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import Immutable from 'immutable';


/**
 * Funzione di Redux da chiamare detro la dispatch
 * @param {*} operation operazione da effettuare (e.g. 'INIT', 'ADD'...)
 * @param {*} data parametro dell'operazione
 * @returns JSON che rappresenta l'operazione Redux
 */
const editMap = (operation, data) => {
  return {
      type: ['INIT', 'ADD', 'REMOVE', 'EDIT'].includes(operation) ? operation : 
          (()=>{throw new Error(`Illegal redux operation: ${operation}`)})(),
      data: data
  }
}
const EMPTY_MAP = Immutable.Map()


/**
 * Componente: tabella dei clienti
 */
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
            self.props.dispatch(editMap('INIT', result.data))
        }).catch(function(error) {
            self.props.dispatch(editMap('INIT', []))
            console.log("====> " + error)
        }).then(function() {
            //console.log("====> in finally")
        })
  }

  getTable = () => [...this.props.clients.values()].map( (cliente, index) => (
    <tr key={cliente.id} className={index % 2 === 0 ? "" : "jumbotron"}>
      <td className="text-center">{cliente.id}</td>
      <td className="text-center">{cliente.name}</td>
      <td className="text-center">{cliente.address}</td>
      <td className="text-center">
        <div className="custom-control custom-checkbox">
          <label className="sr-only position-static"></label>
          <input className="custom-control-input" type="checkbox" checked={cliente.public ? true : false} readOnly={true}/>
          <span className="custom-control-label"></span>
        </div>
      </td>
      <td className="text-center"><Link to={`/edit/${cliente.id}`}><i className="bi bi-pencil-square btn btn-info"></i></Link></td>
      <td className="text-center"><Link to={`/remove/${cliente.id}`}><i className="bi bi-trash btn btn-danger"></i></Link></td>
    </tr>
  ))

  componentDidMount() {
    this.retrieveClienti()
  }

  render() {
    return(
      <div>
        <table className="table">
          <thead>
            <tr className="thead-dark">
              <th className="text-center">ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Address</th>
              <th className="text-center">Public</th>
              <th className="text-center">edit</th>
              <th className="text-center">delete</th>
            </tr>
          </thead>
          <tbody>
            {this.getTable()}
          </tbody>
        </table>
      </div>
    )
  }
}


/**
 * Componente: finestra di dialogo per la modifica di un cliente
 */
@connect(({clientState, dispatch}) => ({clients: clientState.map, dispatch}))
@withRouter
class Rename extends React.Component {
  closeModal = (() => {
    if (this.props?.showDialog) {
      this.props.history.push("/")
    }
  })

  confirmModal = (() => {
    let self = this
    let datiCliente = {id: this.id, name: this.name, address: this.address, public: this.public}


    if (this.props?.showDialog) axios.post(`http://localhost:8080/cliente/edit`, datiCliente)
        .then(result => {
            self.closeModal()
            self.props.dispatch(editMap('EDIT', datiCliente))
        }).catch(function(error) {
            console.log("====> " + error)
        }).then(function() {
            //console.log("====> in finally")
        })
  })

  render() {
    let newId = parseInt(this.props.match.params.id)

    if (this.id !== newId || !this.cliente) {
      this.id = newId
      this.cliente = this.props.clients.get(this.id)
      if (this.props?.showDialog && this.props.clients !== EMPTY_MAP && !this.cliente) this.props.history.push("/")

      this.name = this.cliente?.name
      this.address = this.cliente?.address
      this.public = this.cliente?.public ? true : false
    }

    return (
      <Modal show={this.props.showDialog} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
              <label className="col-md-7 control-label" htmlFor="name">Name</label>
                <div className="col-md-6">
                <input defaultValue={this.name} onChange={e => this.name = e.target.value} type="text" id="client-name" className="form-control input-md"/>
                </div>
          </div>

          <div className="form-group">
              <label className="col-md-7 control-label" htmlFor="address">Address</label>
                <div className="col-md-6">
                <input defaultValue={this.address} onChange={e => this.address = e.target.value} type="text" id="client-address" className="form-control input-md"/>
                </div>
          </div>
          
          <div className="col-auto">
            <div className="custom-control custom-checkbox mr-sm-2">
              <input onChange={e => this.public = e.target.checked} type="checkbox" className="custom-control-input" id="client-public" defaultChecked={this.public ? true : false}/>
              <label className="custom-control-label form-check-label" htmlFor="client-public">Public</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.confirmModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}


/**
 * Componente: finestra di dialogo per l'eliminazione di un cliente
 */
@connect(({clientState, dispatch}) => ({clients: clientState.map, dispatch}))
@withRouter
class Remove extends React.Component {
  closeModal = (() => {
    if (this.props?.showDialog) {
      this.props.history.push("/")
    }
  })

  confirmModal = (() => {
    let self = this;

    if (this.props?.showDialog) axios.post(`http://localhost:8080/cliente/remove/${this.props.match.params.id}`)
        .then(result => {
            self.closeModal()
            self.props.dispatch(editMap('REMOVE', this.id))
        }).catch(function(error) {
            console.log("====> " + error)
        }).then(function() {
            //console.log("====> in finally")
        })
  })

  render() {
    this.id = parseInt(this.props.match.params.id || this.id)
    this.cliente = this.props.clients.get(this.id)
    if (this.props?.showDialog && this.props.clients !== EMPTY_MAP && !this.cliente) this.props.history.push("/")

    return (
      <Modal show={this.props.showDialog} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete client {this.cliente?.name || "ERROR"}?</Modal.Body>
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

/**
 * Metodo di definizione delle operazioni di Redux
 * @param {*} state stato di redux
 * @param {*} operation JSON dell'operazione
 * @returns stato di Redux
 */
const operations = (state={map: EMPTY_MAP, opCount: 0}, operation) => {

  console.log(state);
  console.log(operation);

  const initMap = () => {
    if (state.map === EMPTY_MAP) state={map: new Map(), opCount: 0}
  }

  switch(operation.type) {
    //Inizializzazione mappa (parametro = lista di clienti)
    case 'INIT':
      if (state.map !== EMPTY_MAP) state.map.clear()
      return {map: new Map(operation.data.map(e => [e.id, e])), opCount: 0}
    //Aggiunta cliente alla mappa (parametro = un cliente)
    case 'ADD':
      initMap()
      state.map.state.set(operation.data.id, operation.data)
      return {map: state.map, opCount: ++state.opCount}
    //Eliminazione cliente dalla mappa (parametro = un ID)
    case 'REMOVE':
      initMap()
      state.map.delete(parseInt(operation.data))
      return {map: state.map, opCount: ++state.opCount}
    //Modifica cliente nella mappa (parametro = un cliente)
    case 'EDIT':
      initMap()
      if (state.map.has(operation.data?.id)) state.map.set(operation.data.id, operation.data)
      return {map: state.map, opCount: ++state.opCount}
    default:
      return state;
  }
}

/**
 * Creazione dello store di Redux
 */
let store = createStore(combineReducers({clientState: operations}));

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Clienti/>
      <Switch>
        <Route exact path='/' component={Rename}/>
        <Route path='/edit/:id' render={() => <Rename showDialog={true}/>}/>
      </Switch>
      <Switch>
        <Route exact path='/' component={Remove}/>
        <Route path='/remove/:id' render={() => <Remove showDialog={true}/>}/>
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

reportWebVitals();
