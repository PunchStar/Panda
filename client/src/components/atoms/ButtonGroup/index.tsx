import { useState } from 'react';
import styled from 'styled-components';
import SubButton from './SubButton';

type SubButtons = {
  label: string;
  // onClick: () => void;
};

interface BtnGroupProps {
  btns: SubButtons[];
  onChange: Function;
  activeColor?: string;
  active?: number;
  percentType?:boolean;
}

function ButtonGroup(props: BtnGroupProps) {
  const {
    btns, onChange, activeColor, active, percentType
  } = props;
  const [activeBtn, setActive] = useState(active || 0);
  const [inputValue, setInputValue] = useState('0');
  function handleActive(nextActiveIndex: number) {
    setActive(nextActiveIndex);
    onChange(btns[nextActiveIndex]);
  }

  return (
      <BtnGroupWrapper
      percentType={percentType}
      >
        {btns.map((btn, index) => (
          <SubButton
            key={btn.label}
            active={index === activeBtn}
            handleActive={handleActive}
            label={btn.label}
            index={index}
            activeColor={activeColor}
            percentType={percentType}
          />
        ))}
        {percentType &&<PercentInput>
            <input aria-invalid="true" 
              name="amount" 
              placeholder="0.00"
              type="text" 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              />
              %
        </PercentInput>}
      </BtnGroupWrapper>
  );
}

const BtnGroupWrapper = styled.div<{ percentType?: boolean }>`
  ${(props) => props.percentType ? `display: flex;`:'display:block; text-align:right;'}      
  width: 100%;
  justify-content: space-around;
  margin: 4px 0px;
  padding: 0px 1px;
`;
const PercentInput = styled.div`
position: relative;
cursor: text;
display: inline-flex;
 font-family: Heebo, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 23px;
    letter-spacing: -0.00214085px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
    width: 60px;
    height: 36px;
    padding: 6px 4px 4px;
    border-radius: 2px;
    color: rgba(0, 0, 0, 0.5);
    text-align: right;
    input {
      text-align: right;
      padding-right: 4px;
      font: inherit;
        color: currentColor;
        width: 100%;
        border: 0;
        height: 1.1876em;
        margin: 0;
        display: block;
        padding: 3px 0 7px;
        min-width: 0;
        background: none;
        box-sizing: content-box;
        animation-name: mui-auto-fill-cancel;
        letter-spacing: inherit;
        animation-duration: 10ms;
        -webkit-tap-highlight-color: transparent;
    }
    input:focus{
      outline:0;
    }
`;
export default ButtonGroup;