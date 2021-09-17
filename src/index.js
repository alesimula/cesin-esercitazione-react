import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


class Clienti extends React.Component {

  getClienti() {

    let clienti=[];

   for(var i=0;i<10;i++){
     clienti.push(
      <tr>
         <th class="text-center">1</th>
         <th class="text-center">MarioRossi</th>
         <th class="text-center">24 via roma</th>
         <th class="text-center"><input type="checkbox" checked='true' /></th>
         <th class="text-center"><div><i class="bi bi-pencil-square btn btn-info"></i></div></th>
         <th class="text-center"><div><i class="bi bi-trash btn btn-danger"></i></div></th>
      </tr>
     )
   }
     
   return clienti;
  }

  render() {
    return(
      <div>
        <table class="table">
          <tr class="thead-dark">
            <th class="text-center">ID</th>
            <th class="text-center">Name</th>
            <th class="text-center">Address</th>
            <th class="text-center">Public</th>
            <th class="text-center">edit</th>
            <th class="text-center">delete</th>
          </tr>
          {this.getClienti()}

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
