import React from 'react';
import ReactDOM from 'react-dom';
import "src/assets/scss/index.scss"
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux"
import configureStore from "./store/configureStore";
// import contract from './contract/ABI/ConractABI.json';
// import web3 from 'web3';
// import web3eth from 'web3-eth';
const store = configureStore();
// const contractAddress = "0x704592b09F12140A66372E00448F6c46Ce024B58np";
// const abi = contract;
// console.log(abi);
// if(typeof web3 !== 'undefined'){
//   web3.givenProvider()
// }
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
