import React from 'react';
import {render} from 'react-dom';

import {Layout, notification, message} from 'antd';
const {Content} = Layout;

import Matrix from './matrix.js';
import Definite from './definite.js';
import Solve from './solve.js';
import ControlArea from './ControlArea.jsx';
import FieldView from './FieldView.jsx';


const cellDefault = 4;

class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.initialSize = {
      width: 5,
      height: 5,
    };

    this.state = {
      cell: new Matrix({
        width: this.initialSize.width,
        height: this.initialSize.height,
        init: 4,
      }),
      col: new Matrix({
        width: this.initialSize.width + 1,
        height: this.initialSize.height,
        init: 2,
      }),
      row: new Matrix({
        width: this.initialSize.width,
        height: this.initialSize.height + 1,
        init: 2,
      }),
      disabled: true,
    };

    this.handleSize = this.handleSize.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleCell = this.handleCell.bind(this);
    this.handleSolve = this.handleSolve.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleForbid = this.handleForbid.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleSize(args) {
    if (args.width !== this.state.cell.getWidth() ||
      args.height !== this.state.cell.getHeight()) {
      this.setState({
        cell: new Matrix({
          width: args.width,
          height: args.height,
          init: 4,
        }),
        col: new Matrix({
          width: args.width + 1,
          height: args.height,
          init: 2,
        }),
        row: new Matrix({
          width: args.width,
          height: args.height + 1,
          init: 2,
        }),
      });
    }
  }

  handleBack() {
    this.setState({disabled: !this.state.disabled});
  }

  handleCell(pos, value) {
    this.state.cell.set(pos[0], pos[1], value);
  }

  handleForbid(forbid) {
    this.setState({disabled: forbid});
  }

  applyDefinite() {
    const result = Definite.run(
      this.state.cell,
      this.state.row,
      this.state.col
    );

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

  handleSolve(stepByStep, callback) {
    setTimeout(() => {
      if (stepByStep) {
        if (this.solve === undefined) {
          this.applyDefinite();

        } else {
          this.setNextStep();
        }

      } else {
        this.applyDefinite();

        for (;;) {
          if (this.setNextStep()) {
            break;
          }
        }
      }

      const idx = this.solve.store.length - 1;
      this.setState({
        row: this.solve.store[idx].rgrid,
        col: this.solve.store[idx].cgrid,
      });
      callback();
    });
  }

  handleUpload(info, resolve, reject) {
    if (info.file.status !== 'uploading') {
      if (info.file.type === 'text/csv') {
        const reader = new FileReader();
        const reg = /[0-3]/;

        reader.onload = () => {
          const data = reader.result.split('\n').filter((row) => {
            return row.length > 1;
          }).
            map((row) => {
              return row.split(/[\t,]/).map((s) => {
                return reg.test(s) ?
                  Number(s) :
                  cellDefault;
              });
            });
          const cell = new Matrix(data);

          this.setState({
            cell: cell,
            col: new Matrix({
              width: cell.getWidth() + 1,
              height: cell.getHeight(),
              init: 2,
            }),
            row: new Matrix({
              width: cell.getWidth(),
              height: cell.getHeight() + 1,
              init: 2,
            }),
          });
          resolve({
            width: cell.getWidth(),
            height: cell.getHeight(),
          });
        };
        reader.readAsText(info.file.originFileObj);
      } else {
        reject();
      }
    }
  }

  handleRetry() {
    this.solve = undefined;
    this.setState({
      cell: new Matrix({
        width: this.state.cell.getWidth(),
        height: this.state.cell.getHeight(),
        init: 4,
      }),
      col: new Matrix({
        width: this.state.cell.getWidth() + 1,
        height: this.state.cell.getHeight(),
        init: 2,
      }),
      row: new Matrix({
        width: this.state.cell.getWidth(),
        height: this.state.cell.getHeight() + 1,
        init: 2,
      }),
    });
  }

  render() {
    return (
      <Layout>
        <Content style={{textAlign: 'center'}}>
          <ControlArea
            defaultValues={this.initialSize}
            onChange={this.handleSize}
            onForbidInput={this.handleForbid}
            onRetry={this.handleRetry}
            onSolve={this.handleSolve}
            onUpload={this.handleUpload}
          />
          <FieldView
            cell={this.state.cell}
            col={this.state.col}
            disabled={this.state.disabled}
            onChange={this.handleCell}
            row={this.state.row}
          />
        </Content>
      </Layout>
    );
  }

}


render(
  <App />,
  document.getElementById('container')
);
