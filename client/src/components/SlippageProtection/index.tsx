import styled from 'styled-components';
import svg from 'src/components/atoms/svg';
import Popup from 'reactjs-popup';
import ButtonGroup from '../atoms/ButtonGroup';

interface SlippageProps {
  onChange: Function;
  active?: number;
}

function SlippageProtection(props: SlippageProps) {
  // const {
  //   active,
  // } = props;

  const Icon = svg['setting'];
  const IconEx = svg['exclamation'];
  return (
    <SlippageProtectionWraaper>
        <Popup trigger={<Icon />} position="bottom right">
              <Title>Slippage Tolerance 
                <StyledPopup trigger={open => (
                  <span><IconEx/></span>
                )}
                position="bottom center"
                  on={['hover','focus']}
                >
                    Your transaction will revert if prices change unfavorably due to other orders. This does not account for slippage caused by your own order.
                </StyledPopup>
              </Title>
              <ButtonGroup
            btns={[{ label: '0%' }, { label: '1%' }, { label: '2%' }]}
            percentType
            onChange={(active:any) => {
            }}
          />
        </Popup>
         
    </SlippageProtectionWraaper>
  );
}

const SlippageProtectionWraaper = styled.div`
  margin-top: atuo;
  margin-bottom: auto;
  cursor: pointer;
  
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #000;
  span{
    display:inline-flex;
    margin-left: 4px;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
  }
  height: 32px;
    width: 100%;
    margin: 0px 0px 8px 2px;
`
const StyledPopup = styled(Popup)`
    
   &-content {
     background: rgb(149,149,149);
     color:white;
     font-size:12px;
     padding:8px;
     width:380px;
     svg{
      stroke:rgb(149,149,149);
     }
     path{
      fill:rgb(149,149,149)!important;
     }
   }
`
export default SlippageProtection;
