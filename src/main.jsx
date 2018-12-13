import React from 'react';
import {render} from 'react-dom';

import {Layout} from 'antd';
const {Content} = Layout;

import Matrix from './matrix.js';
import Definite from './definite.js';
import Solve from './solve.js';
import MainView from './MainView.jsx';


const cellDefault = 4;

class App extends React.PureComponent {

  render() {
    return (
      <MainView />
    );
  }

}


render(
  <App />,
  document.getElementById('container')
);
