import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  Star} from './star.svg';
interface StarIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const StarIcon: React.FC = styled(Star)<StarIconProps>`
  width: ${(props) => props.height || 24}px;
  height: ${(props) => props.width || 24}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default StarIcon;
