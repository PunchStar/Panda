import styled from 'styled-components';

type Btn = {
  label: string;
  active: boolean;
  index: number;
  handleActive: Function;
  activeColor?: string;
  percentType?: boolean;
};

function SubButton(props: Btn) {
  const {
    label,
    active,
    handleActive,
    index,
    percentType,
  } = props;
  function handleClick() {
    handleActive(index);
  }
  return (
    <Item
      active={active}
      disabled={active}
      onClick={handleClick}
      percentType={percentType}
    >
      {label}
    </Item>
  );
}

const Item = styled.button<{ active?: boolean, percentType?: boolean }>`
  font-family: Heebo;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  letter-spacing: -0.00214085px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  border-radius: 2px;
  width: 50px;
  padding: 6px 2px 2px;
  margin: 0px;
  margin-right:7px;
  color: rgb(0, 0, 0); 
  &:focus {
    outline:none;
  }
  background: #fff;
  ${(props) => (props.active
    ? `
    color: #FFF!important;
    background: rgb(22, 82, 240)};
    `
    : !props.percentType && `color: rgba(0,0,0,.5);background:rgb(239, 239, 239);`)}

`;
export default SubButton;
