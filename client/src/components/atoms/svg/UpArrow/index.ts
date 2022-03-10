import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  UpArrow} from './uparrow.svg';
interface UpArrowIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const UpArrowIcon: React.FC = styled(UpArrow)<UpArrowIconProps>`
  width: ${(props) => props.height || 10}px;
  height: ${(props) => props.width || 7}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default UpArrowIcon;
