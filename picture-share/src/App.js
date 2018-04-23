import React, { Component } from 'react';

import './App.css';
import Content from './Components/Content'

import { createStore, applyMiddleware } from 'redux'
import imgApp from '../src/Redux/reducers'
import { Provider } from 'react-redux'

import logger from 'redux-logger'


//let store = createStore(imgApp)
const store = createStore(
  imgApp,
  applyMiddleware(logger)
)





class App extends Component {
  render() {
    return (
      
      <div id = 'app_wrapper'>
        <Provider store={store}>
          <Content />
        </Provider> 
      </div>
    );
  }
}

export default App;
