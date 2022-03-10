import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  Exclamation} from './exclamation.svg';
interface ExclamationIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const ExclamationIcon: React.FC = styled(Exclamation)<ExclamationIconProps>`
  width: ${(props) => props.height || 11}px;
  height: ${(props) => props.width || 11}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default ExclamationIcon;
