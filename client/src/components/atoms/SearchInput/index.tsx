import styled from 'styled-components';
import { useState, useEffect } from 'react';
import svg from '../svg';

interface SearchInputProps {
  onClick: (value: string) => void;
}

export default function SearchInput(props: SearchInputProps) {
  const {
    onClick,
  } = props;
  const [value, setValue] = useState("");
  const IconSearch = svg['search'];
  const IconClose = svg['close'];
  const resetClick = () =>{
      setValue("");
  }
  useEffect(() => {
    onClick(value);
  },[value])
  return (
    <Wrapper >
      <IconWrapper> 
           <IconSearch/>
      </IconWrapper>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Search markets..."}/>
      <div onClick={resetClick}>
         {value.length > 0 &&
            <IconClose/>
         } 
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
    padding: 0px 8px;
    border-radius: 5px;
    height: 43px;
    background-color: rgba(0, 0, 0, 0.05);
    width: 100%;
    margin-top: 1rem;
    position: relative;
    color: rgba(0, 0, 0, 0.87);
    cursor: text;
    display: inline-flex;
    position: relative;
    font-size: 1rem;
    box-sizing: border-box;
    align-items: center;
    font-family: Heebo, sans-serif;
    font-weight: 400;
    line-height: 1.1876em;
    input {
        color: black;
        padding: 10px 0px 7px;
        font: inherit;
        width: 100%;
        border: 0;
        height: 1.1876em;
        margin: 0;
        display: block;
        padding: 6px 0 7px;
        min-width: 0;
        background: none;
        box-sizing: content-box;
        animation-name: mui-auto-fill-cancel;
        letter-spacing: inherit;
        animation-duration: 10ms;
        -webkit-tap-highlight-color: transparent;
    }
    input:focus {
        outline: 0;
    }
    div {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        width: 40px;
        margin-right: -6px;
        cursor:pointer;
    }
`;


const IconWrapper = styled.span`
  line-height: .625rem;
  padding-right: 0.375rem;
  vertical-align: middle;
`;
