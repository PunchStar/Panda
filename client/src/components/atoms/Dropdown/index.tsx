import styled from 'styled-components';
import { useState } from 'react';
import svg from '../svg';

interface DropdownProps {
    arrItem?: string[];
    title?: string;
}

export default function Dropdown(props: DropdownProps) {
  const {
    arrItem=['All', 'Business', 'Crypto', 'Covid-19'],
    title="Category: "
  } = props;
  const [value, setValue] = useState(0);
  const [focus, setFocus] = useState(false);
  const IconDown = svg['downarrow'];
  const IconUp = svg['uparrow'];
  return (
    <Wrapper >
      <MainWrapper>
        <span>{title}</span>
        <FilterWrapper onClick={e => setFocus(!focus)}>
            <span>{arrItem[value]}</span>
        </FilterWrapper>
        <IconContainer onClick={e => setFocus(!focus)}>
            {focus ? <IconUp/> : <IconDown/> }
        </IconContainer>
      </MainWrapper>
      {focus &&<MenuWrapper>
        <MenuInner >
            {arrItem.map((item,index)=>
                <MarketOption active={value === index} onClick={e => {setValue(index); setFocus(false)}}  key={index} >{item}</MarketOption>
            )}
        </MenuInner>
      </MenuWrapper>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
    border-bottom: 1px solid rgba(0,0,0,.1);
    flex-direction: column;
    margin-bottom: 1rem;
    margin-right: 3rem;
    text-transform: capitalize;
    min-width: 190px;
`;  
const MainWrapper = styled.div`
    color: #000;
    display: -moz-box;
    display: flex;
    font-size: .85rem;
    padding: 8px 0;
    span {
        font-family: Heebo, sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 1rem;
        letter-spacing: -0.00214085px;
    }
`;
const MenuWrapper = styled.div`
    position: relative;
`
const MenuInner = styled.div`
        max-width: 100%;
        width: 100%;
        background: #fff;
        border-radius: 5px;
        -webkit-box-shadow: 0 6px 24px rgb(0 0 0 / 16%);
        box-shadow: 0 6px 24px rgb(0 0 0 / 16%);
        min-width: 10rem;
        max-width: 15rem;
        padding: 9px 0;
        position: absolute;
        right: 0;
        top: 0;
        width: -moz-fit-content;
        width: fit-content;
        z-index: 5;
    &:before {
        background-color: #fff;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        content: "";
        display: block;
        height: 14px;
        left: -webkit-calc(75%);
        left: -moz-calc(75%);
        left: calc(75%);
        position: absolute;
        top: -6px;
        -webkit-transform: rotate(
    45deg);
        -moz-transform: rotate(45deg);
        transform: rotate(
    45deg);
        width: 14px;
    }
`;
const MarketOption = styled.div<{ active?:boolean }>`
    cursor: pointer;
    font-size: 1rem;
    line-height: 44px;
    padding: 0 18px;
    &:hover {
        background-color: rgba(0,0,0,.02);
    }
    color: #adadad;
    ${(props) => props.active && `color: #1652f0;`}
`
const FilterWrapper = styled.div`
    margin: 0 12px 0 8px;   
    span {
        font-weight: normal;
    }
`;
const IconContainer = styled.span`
    flex: 1 1;
    text-align: right;
    svg {
        text-align: right;
    }
`