import React from 'react';
import styled from 'styled-components';
import { ReactComponent as  Setting} from './setting.svg';
interface SettingIconProps {
  stroke?: string;
  height?: number;
  width?: number;
}

const SettingIcon: React.FC = styled(Setting)<SettingIconProps>`
  width: ${(props) => props.height || 13}px;
  height: ${(props) => props.width || 13}px;

  ${(props) => `
  > path {
    stroke: ${props.stroke}
  }
  `}
`;

export default SettingIcon;
