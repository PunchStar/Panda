import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  DownArrow} from './downarrow.svg';
interface DownArrowIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const DownArrowIcon: React.FC = styled(DownArrow)<DownArrowIconProps>`
  width: ${(props) => props.height || 10}px;
  height: ${(props) => props.width || 6}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default DownArrowIcon;
