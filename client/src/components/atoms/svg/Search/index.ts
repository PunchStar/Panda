import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  Search} from './search.svg';
interface SearchIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const SearchIcon: React.FC = styled(Search)<SearchIconProps>`
  width: ${(props) => props.height || 16}px;
  height: ${(props) => props.width || 16}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default SearchIcon;
