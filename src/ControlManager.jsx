import React from 'react';
import PropTypes from 'prop-types';

import {Button, Tooltip, Row, Col} from 'antd';


const containerStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '16px',
  marginBottom: '16px',
  padding: '20px',
  backgroundColor: '#fafafa',
  border: '1px dashed #dddddd',
  borderRadius: '6px',
  width: '80%',
  textAlign: 'center',
};


class ControlManager extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      children: props.children,
      disabled: props.disabled,
      isBegin: props.isBegin,
      isEnd: props.isEnd,
    };
    this.handleBack = props.onBack;
    this.handleNext = props.onNext;
    this.handleRetry = props.onRetry;
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      children: newProps.children,
      disabled: newProps.disabled,
      isBegin: newProps.isBegin,
      isEnd: newProps.isEnd,
    });
  }

  render() {
    return (
      <div style={containerStyle}>
        <Row>
          <Col span={6}>
            <Tooltip
              placement="bottom"
              title="previous step"
            >
              <Button
                disabled={this.state.isBegin}
                icon="arrow-left"
                onClick={this.handleBack}
                shape="circle"
                style={{marginRight: '50px'}}
                type="primary"
              />
            </Tooltip>
          </Col>
          <Col span={12}>
            {this.state.children}
          </Col>
          <Col span={6}>
            <Tooltip
              placement="bottom"
              title={
                this.state.isEnd ?
                  'retry' :
                  'next step'
              }
            >
              <Button
                disabled={this.state.disabled}
                icon={
                  this.state.isEnd ?
                    'reload' :
                    'arrow-right'
                }
                onClick={
                  this.state.isEnd ?
                    this.handleRetry :
                    this.handleNext
                }
                shape="circle"
                style={{marginLeft: '50px'}}
                type={
                  this.state.isEnd ?
                    'danger' :
                    'primary'
                }
              />
            </Tooltip>
          </Col>
        </Row>
      </div>
    );
  }

}

ControlManager.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  isBegin: PropTypes.bool,
  isEnd: PropTypes.bool,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  onRetry: PropTypes.func,
};

ControlManager.defaultProps = {
  children: '',
  isBegin: false,
  isEnd: false,
  disabled: false,
  onBack: () => {
    console.log('back');
  },
  onNext: () => {
    console.log('next');
  },
  onRetry: () => {
    console.log('retry');
  },
};

export default ControlManager;
