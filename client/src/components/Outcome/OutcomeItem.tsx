import styled from 'styled-components';
import svg from 'src/components/atoms/svg';

type Btn = {
  types?: boolean;
  labels: string;
  active: boolean;
  index: number;
  handleActive: Function;
  activeColor?: string;
  icon?: string | null;
  amount?:string;
};

function OutcomeItem(props: Btn) {
  const {
    types,
    labels,
    active,
    handleActive,
    index,
    activeColor = '#074ee8',
    amount,
    icon,
  } = props;

  const Icon = icon? svg[icon] : null;
  function handleClick() {
    handleActive(index);
  }

  return (
    <OutcomeItemWrapper>
      <Item
          active={active}
          disabled={active}
          labels={labels}
          onClick={handleClick}
          activeColor={activeColor}
        >
          {labels}
          <span>
            {amount}
          </span>
         {active && icon && ( <div>
            <Icon
              stroke={'#fff'}
            />
            <span>{amount}</span>
          </div> )}
        </Item>
      {types && <SharesBalance>
        {"No Shares"}
      </SharesBalance>}
    </OutcomeItemWrapper>
    
  );
}
const OutcomeItemWrapper = styled.div`
  width:100%;
`
const Item = styled.button<{ active?: boolean,activeColor: string, labels:string }>`
  display: inline-block;
  color: #000;
  ${(props) => (props.active
    ? `
    color: #FFF!important;
    background: ${props.activeColor}};
    `
    : `background: rgba(0,0,0,.04);`)}
  &:focus {
    outline:none;
    ${(props) => (props.labels === "More" ? `background-color: rgba(5,177,106,.2)`
    :`background-color: rgba(224,69,69,.2)`)}
  }
  border: none;
  border-radius: 2px;
  text-align: left;
  font-size: 1rem;
  height: 3rem;
  outline: none;
  padding-right: 0.625rem;
  width: 100%;
  span {
    margin-left: 3px;
    opacity: 60%;
  }
  div {
    font-size: 14px;
    margin-top: 0.4375rem;
    display: inline;
    margin-left: 0.75rem;
    width: 100%;
    span {
      margin-left: 0.375rem;
    }
  }
`;  
const SharesBalance = styled.span`
  font-size: 10px;
    opacity: 50%; 
`
export default OutcomeItem;
