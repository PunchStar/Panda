import { useState } from 'react';
import styled from 'styled-components';
import OutcomeItem from './OutcomeItem';


interface BtnGroupProps {
  type: boolean;
  onChange: Function;
  activeColor?: string;
  width?: number;
  active?: number;
}

function Outcome(props: BtnGroupProps) {
  const {
    type, activeColor, active,
  } = props;
  const [activeBtn, setActive] = useState(active || 0);

  function handleActive(nextActiveIndex: number) {
    setActive(nextActiveIndex);
  }

  return (
    <Wrapper>
      <OutcomeItem
        active={activeBtn === 0}
        handleActive={handleActive}
        labels={'More'}
        types={type}
        index={0}
        activeColor={activeColor}
        icon="rightArrow"
        amount="0.48"
      />
      <OutcomeItem
        labels={'Less'}
        types={type}
        active={activeBtn === 1}
        handleActive={handleActive}
        index={1}
        icon="rightArrow"
        activeColor={activeColor}
        amount="0.52"
      />
    </Wrapper>
  );
}

const Wrapper = styled.fieldset`
  border: none;
  display: grid;
  grid-auto-rows: 1fr;
  grid-gap: 11px;
  grid-template-columns: repeat(1,1fr);
  padding: 0;
  width:100%;
`;

export default Outcome;
