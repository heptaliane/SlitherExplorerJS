import React from 'react';
import PropTypes from 'prop-types';
import {Layout, notification, message} from 'antd';

import Matrix from './matrix.js';
import Definite from './definite.js';
import Solve from './solve.js';
import GridCanvas from './GridCanvas.jsx';
import ControlArea from './ControlArea.jsx';
import StatusBar from './StatusBar.jsx';

const {Content} = Layout;

const defaultCellValue = 4;
const defaultGridValue = 2;
const defaultRows = 5;
const defaultCols = 5;
const defaultControlValue = 0;


const containerStyle = {
  padding: '20px',
  display: 'grid',
  gridGap: '20px',
  gridTemplateColumns: '1fr 3fr',
  textAlign: 'center',
};

const itemStyle = {
  padding: '10px',
  border: 'thick double lightgray',
  borderRadius: '10px',
};


class MainView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      controlValue: defaultControlValue,
      cell: new Matrix({
        height: defaultRows,
        width: defaultCols,
        init: defaultCellValue,
      }),
      row: new Matrix({
        height: defaultRows + 1,
        width: defaultCols,
        init: defaultGridValue,
      }),
      col: new Matrix({
        height: defaultRows,
        width: defaultCols + 1,
        init: defaultGridValue,
      }),
    };

    this.applyDefinite = this.applyDefinite.bind(this);
    this.setNextStep = this.setNextStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  handleChange({radio, cols, rows, submit, clean}) {
    if (radio !== undefined) {
      this.setState({
        controlValue: radio,
      });
    }

    if (cols !== undefined && rows !== undefined) {
      this.setState({
        cell: new Matrix({
          height: rows,
          width: cols,
          init: defaultCellValue,
        }),
        row: new Matrix({
          height: rows + 1,
          width: cols,
          init: defaultGridValue,
        }),
        col: new Matrix({
          height: rows,
          width: cols + 1,
          init: defaultGridValue,
        }),
      });
    }

    if (submit === true) {
      this.applyDefinite();
      for (;;) {
        if (this.setNextStep()) {
          break;
        }
      }

      const idx = this.solve.store.length - 1;
      this.setState({
        row: this.solve.store[idx].rgrid,
        col: this.solve.store[idx].cgrid,
      });
    }

    if (clean === true) {
      this.setState({
        cell: new Matrix({
          height: this.state.cell.getHeight(),
          width: this.state.cell.getWidth(),
          init: defaultCellValue,
        }),
        row: new Matrix({
          height: this.state.cell.getHeight() + 1,
          width: this.state.cell.getWidth(),
          init: defaultGridValue,
        }),
        cell: new Matrix({
          height: this.state.cell.getHeight(),
          width: this.state.cell.getWidth() + 1,
          init: defaultGridValue,
        }),
      });
    }
  }

  handleCellClick({row, col}) {
    const newCell = new Matrix(this.state.cell);
    if (this.state.cell.get(row, col) === this.state.controlValue) {
      newCell.set(row, col, defaultCellValue);
    } else {
      newCell.set(row, col, this.state.controlValue);
    }

    this.setState({cell: newCell});
  }

  setNextStep() {
    if (this.solve === undefined) {
      return true;
    }

    const flg = this.solve.nextStep();

    if (!flg) {
      notification.error({
        message: 'No answer is found',
        duration: 0,
      });

      return true;
    }

    if (this.solve.isCompleted()) {
      message.success('completed!');
      return true;
    }
    return false;
  }

  applyDefinite() {
    const result = Definite.run(
      this.state.cell,
      this.state.row,
      this.state.col
    );
    this.solve = undefined;

    if (result.error === undefined) {
      this.solve = new Solve(this.state.cell, result.rgrid, result.cgrid);

    } else {
      notification.error({
        message: 'Cell data may be wrong.',
        description: result.error,
        duration: 0,
      });
    }
  }

  render() {
    return (
      <Layout>
        <StatusBar
          width={this.state.cell.getWidth()}
          height={this.state.cell.getHeight()}
          input={this.state.controlValue}
        />
        <Content style={containerStyle}>
          <div style={itemStyle}>
            <ControlArea
              initialCellIdx={this.state.controlValue}
              initialCols={defaultCols}
              initialRows={defaultRows}
              onChange={this.handleChange}
            />
          </div>
          <div style={itemStyle}>
            <GridCanvas
              cell={this.state.cell}
              row={this.state.row}
              col={this.state.col}
              onClick={this.handleCellClick}
            />
          </div>
        </Content>
      </Layout>
    );
  }

}

export default MainView;
