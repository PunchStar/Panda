import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  Favorite} from './favorite.svg';
interface FavoriteIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const FavoriteIcon: React.FC = styled(Favorite)<FavoriteIconProps>`
  width: ${(props) => props.height || 10}px;
  height: ${(props) => props.width || 10}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default FavoriteIcon;
