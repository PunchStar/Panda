import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  Close} from './close.svg';
interface CloseIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const CloseIcon: React.FC = styled(Close)<CloseIconProps>`
  width: ${(props) => props.height || 28}px;
  height: ${(props) => props.width || 28}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default CloseIcon;
