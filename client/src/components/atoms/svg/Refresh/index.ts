import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  Refresh} from './refresh.svg';
interface RefreshIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const RefreshIcon: React.FC = styled(Refresh)<RefreshIconProps>`
  width: ${(props) => props.height || 9}px;
  height: ${(props) => props.width || 9}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default RefreshIcon;
