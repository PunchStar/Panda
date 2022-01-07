import styled from 'styled-components';
import { useState, useEffect } from 'react';
import svg from '../svg';
import checkSvg from 'src/assets/images/check-white.svg';

interface CheckBoxProps {
  label?:string;
  type?:string;
  onClick: (checked:boolean) => void;
}

export default function Checkbox(props: CheckBoxProps) {
  const {
    label,
    type="checkbox",
    onClick,
  } = props;
  const Icon = svg['star'];
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    onClick(checked);
  },[checked])
  return (
    <Wrapper checkImg = {checkSvg}>
      {type === 'checkbox' ? <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}/>
      :<IconWrapper checked={checked}>
        <span>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}  />
          <Icon/>
        </span>
        </IconWrapper>
        }
      <span>
        {label}
      </span>
    </Wrapper>
  );
}

const Wrapper = styled.div<{checkImg:string}>`
margin-top:10px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  input {
    align-self: center;
    appearance: none;
    border-radius: 5px;
    box-sizing: border-box;
    display: flex;
    height: 1.5rem;
    margin-right: 0.75rem;
    position: relative;
    width: 1.5rem;
    background: rgb(255, 255, 255) !important;
    border: 1px solid rgba(0, 0, 0, 0.4) !important;
  }
  input:checked {
    background: rgb(22, 82, 240) !important;
    border: 1px solid rgb(22, 82, 240) !important;
  }
  input:checked::after {
    ${props => props.checkImg && `background: url(${props.checkImg}) 0.375rem 0.375rem / 0.75rem 0.75rem no-repeat;`}
    content: "";
    display: block;
    font-size: 1.2rem;
    height: 1.5rem;
    left: -1px;
    line-height: 1.5rem;
    position: absolute;
    text-align: center;
    top: -1px;
    width: 1.5rem;
  } 
  span{
    font-size: 1rem;
    font-family: Heebo, sans-serif;
    font-weight: 400;
    line-height: 1.5;
    color: rgb(0, 0, 0);
    margin-right:5px;
  }
`;
const IconWrapper = styled.span<{checked:boolean}>`
  padding: 0 8px 0 0;
  color: rgba(0, 0, 0, 0.54);
  position:relative;
  span{
      width: 100%;
      display: flex;
      align-items: inherit;
      justify-content: inherit;
    }
      input{
        top: 0;
        left: 0;
        width: 100%;
        cursor: inherit;
        height: 100%;
        margin: 0;
        opacity: 0;
        padding: 0;
        z-index: 1;
        position: absolute;
      }
      svg{
        ${props => props.checked && `fill:#1652f0`}
      }
`