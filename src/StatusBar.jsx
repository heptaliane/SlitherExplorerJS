import React from 'react';
import PropTypes from 'prop-types';
import {Layout} from 'antd';

const {Header} = Layout;

const headerStyle = {
  display: 'grid',
  gridGap: '20px',
  gridTemplateColumns: 'repeat(6, 1fr)',
  color: 'white',
  textAlign: 'left',
};

const StatusBar = function(props) {
  return (
    <Header style={headerStyle}>
      <div>
        {`cell input value: ${props.input}`}
      </div>
      <div>
        {`field width: ${props.width}`}
      </div>
      <div>
        {`field height: ${props.height}`}
      </div>
      {
        props.loop !== undefined &&
        <div>
          {`loop: ${props.loop}`}
        </div>
      }
    </Header>
  );
};

StatusBar.propTypes = {
  height: PropTypes.number.isRequired,
  input: PropTypes.oneOf([
    0,
    1,
    2,
    3,
    4,
  ]).isRequired,
  width: PropTypes.number.isRequired,
  loop: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([undefined]),
  ]),
};

StatusBar.defaultProps = {
  loop: undefined,
};

export default StatusBar;
