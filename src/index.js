import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";


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
                <th class="text-center"><div><i class="bi bi-pencil-square btn btn-info"></i></div></th>
                <th class="text-center"><div><i class="bi bi-trash btn btn-danger"></i></div></th>
              </tr>
            ))
            //self.setState({clienti: clienti})
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

ReactDOM.render(
  <Clienti />,
  document.getElementById('root')
);

reportWebVitals();
