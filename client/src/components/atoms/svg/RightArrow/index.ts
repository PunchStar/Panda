import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  RightArrow} from './rightArrow.svg';
interface RightArrowIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const RightArrowIcon: React.FC = styled(RightArrow)<RightArrowIconProps>`
  width: ${(props) => props.height || 21}px;
  height: ${(props) => props.width || 5}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default RightArrowIcon;
