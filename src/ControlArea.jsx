import React from 'react';
import PropTypes from 'prop-types';

import {Steps, Button, Checkbox, Icon, Upload} from 'antd';

import ControlManager from './ControlManager.jsx';
import SizeInput from './SizeInput.jsx';


const uploadPage = 0;
const sizePage = 1;
const cellPage = 2;
const solvePage = 3;

const steps = [
  'Choose Data Input Type',
  'Configure Size',
  'Input Cell Data',
  'Solve',
];

const stepStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '16px',
  marginBottom: '16px',
  padding: '20px',
  width: '80%',
  textAlign: 'left',
};

class ControlArea extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      stepByStep: false,
      step: 0,
      width: props.defaultValues.width,
      height: props.defaultValues.height,
      loading: false,
      disabled: false,
    };

    this.callbackSize = props.onChange;
    this.callbackSolve = props.onSolve;
    this.callbackRetry = props.onRetry;
    this.callbackForbid = props.onForbidInput;
    this.callbackUpload = props.onUpload;
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSolve = this.handleSolve.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleNext() {
    const newStep = this.state.step + 1;

    if (newStep === cellPage) {
      this.callbackForbid(false);
      this.callbackSize({
        width: this.state.width,
        height: this.state.height,
      });
    } else if (newStep === solvePage) {
      this.callbackForbid(true);
    }

    this.setState({step: newStep});
  }

  handleBack() {
    const newStep = this.state.step - 1;

    if (newStep === sizePage) {
      this.callbackForbid(true);
    } else if (newStep === cellPage) {
      this.callbackForbid(false);
    }

    this.setState({step: newStep});
  }

  handleRetry() {
    this.setState({step: 0});
    this.callbackRetry();
  }

  handleChange(args) {
    this.setState({
      width: args.width,
      height: args.height,
    });
  }

  handleCheck() {
    this.setState({stepByStep: !this.state.stepByStep});
  }

  handleSolve() {
    this.setState({loading: true});

    this.callbackSolve(this.state.stepByStep, () => {
      this.setState({loading: false});
    });
  }

  handleUpload(info) {
    this.setState({disabled: true});
    this.callbackUpload(info, ({width, height}) => {
      this.setState({
        step: solvePage,
        width: width,
        height: height,
        disabled: false,
      });
    }, () => {
      this.setState({disabled: false});
    });
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <Steps
          current={this.state.step}
          style={stepStyle}
        >
          {steps.map((title) => {
            return (
              <Steps.Step
                key={title}
                title={title}
              />
            );
          })}
        </Steps>
        <ControlManager
          disabled={this.state.disabled}
          isBegin={this.state.step === 0}
          isEnd={this.state.step === steps.length - 1}
          onBack={this.handleBack}
          onNext={this.handleNext}
          onRetry={this.handleRetry}
          onUpload={this.handleUpload}
        >
          {
            this.state.step === uploadPage &&
            <div>
              <p>
upload csv file or press next button
              </p>
              <Upload
                action="https://jsonplaceholder.typicode.com/posts/"
                onChange={this.handleUpload}
                style={{margin: '16px'}}
              >
                <Button
                  icon="upload"
                  type="primary"
                >
                  upload
                </Button>
              </Upload>
            </div>
          }
          {
            this.state.step === sizePage &&
            <SizeInput
              cols={this.state.width}
              onChange={this.handleChange}
              rows={this.state.height}
            />
          }
          {
            this.state.step === cellPage &&
            <div>
              <p style={{margin: '16px'}}>
                Input cell data below
              </p>
              <Icon
                type="arrow-down"
              />
            </div>
          }
          {
            this.state.step === solvePage &&
            <div>
              <div style={{margin: '16px'}}>
                <Checkbox
                  checked={this.state.stepByStep}
                  onChange={this.handleCheck}
                >
                  use step-by-step solution
                </Checkbox>
              </div>
              <Button
                icon={
                  this.state.stepByStep ?
                    'step-forward' :
                    'bulb'
                }
                loading={this.state.loading}
                onClick={this.handleSolve}
                type="primary"
              >
                {
                  this.state.stepByStep ?
                    'next step' :
                    'solve'
                }
              </Button>
            </div>
          }
        </ControlManager>
      </div>
    );
  }

}

ControlArea.propTypes = {
  defaultValues: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onForbidInput: PropTypes.func,
  onRetry: PropTypes.func,
  onSolve: PropTypes.func,
  onUpload: PropTypes.func,
};

ControlArea.defaultProps = {
  defaultValues: {
    height: 1,
    width: 1,
  },
  onChange: (args) => {
    console.log(args);
  },
  onForbidInput: (args) => {
    console.log(args);
  },
  onRetry: (args) => {
    console.log(args);
  },
  onSolve: (args) => {
    console.log(args);
  },
  onUpload: (args) => {
    console.log(args);
  },
};

export default ControlArea;
