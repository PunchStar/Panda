import React from "react"
import Popup from 'reactjs-popup';
import MarketDetailHeader from "src/components/MarketDetailHeader/MarketDetailHeader"
import svg from 'src/components/atoms/svg';
import MainLayout from "src/layouts/MainLayout"
import styled from "styled-components"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.scss';
import Button from 'src/components/atoms/Button/Button';
import Outcome from 'src/components/Outcome';
import SlippageProtection from "src/components/SlippageProtection";
import ButtonGroup from "src/components/atoms/ButtonGroup";
import MarketPosition from "src/components/MarketPostion";
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js';
import { Line } from 'react-chartjs-2';
import checkSvg from 'src/assets/images/check.svg';

Chart.register(CategoryScale);
const state = {
  labels: ['January', 'February', 'March',
           'April', 'May'],
  datasets: [
    {
      label: 'More',
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'rgba(255,255,255)',
      borderColor: 'rgb(0,0,255)',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56]
    },
    {
      label: 'Less',
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'rgba(255,255,255)',
      borderColor: 'rgb(255,0,0)',
      borderWidth: 2,
      data: [12, 32, 44, 32, 99]
    }
  ]
}

export default function MarketDetail() {

  const IconEx = svg['exclamation'];

  return (
    <MainLayout>
    <MarketDetailHeader/>
        <Content>
            <section>
              <StockGraphContainer>
                <ButtonGroup
                  btns={[{ label: '24h' }, { label: '7d' }, { label: '30d' }, { label: 'All' }]}
                  onChange={(active:any) => {
                  }}
                />
                <Line
                    data={state}
                  />
              </StockGraphContainer>
              <StockGraphLegend>
                    <MoreLi checkImg = {checkSvg}>
                      <input type="checkbox"/>
                      <dt>More</dt>
                      <span title="0.495302">$0.50</span>
                    </MoreLi>
                    <LessLi checkImg = {checkSvg}>
                      <input type="checkbox"/>
                      <dt>Less</dt>
                      <span title="0.495302">$0.50</span>
                    </LessLi>
              </StockGraphLegend>
              <MarketPostion>
                  <Tabs>
                      <TabList>
                        <Tab >Market Postions</Tab>
                      </TabList>
                      <TabPanel>

                        <MarketPosition/>
                      </TabPanel>
                  </Tabs>
              </MarketPostion>
            </section>
            <WidgetColumn>
              <BuySellWidget>
                  <Tabs>
                    <TabList className="two_tabs">
                      <Tab >Buy</Tab>
                      <Tab>Sell</Tab>
                    </TabList>
                    <TabPanel>
                      <div>
                        <form>
                          <OutcomePickerLabel>
                            <div>Pick outcome</div>
                            <Button
                                title="Refresh Prices"
                                icon="refresh"
                                onClick={() => {}}
                            />
                          </OutcomePickerLabel>
                          <Outcome
                                type={false}
                                onChange={(active:any) => {
                                }}
                                width={170}
                                activeColor="#05b16a"
                          />
                          <OutcomePickerLabel>
                            <div>How much?</div>
                            <SlippageProtection onChange={(active:any) => {}}/>
                          </OutcomePickerLabel>
                          <OutcomePickerShareInput>
                              <input type="number" value="0.0" placeholder="0" min="0" step="0.000001"/>
                              <span>USDC | &nbsp;<button>Max</button></span>
                          </OutcomePickerShareInput>
                        </form>
                        <BuyInfoContainer>
                          <BuyInfoRow firstCol>
                            <ColLeft>
                                LP Fee
                                <StyledPopup trigger={open => (
                                    <IconSpan><IconEx/></IconSpan>
                                  )}
                                  position="bottom center"
                                    on={['hover','focus']}
                                  >
                                      The LP fee is paid to users who add liquidity and is included in “Your Avg. Price”.
                                </StyledPopup>
                            </ColLeft>
                            <ColRight>2%</ColRight>
                          </BuyInfoRow>
                          <BuyInfoRow>
                            <ColLeft>Your Avg. Price</ColLeft>
                            <ColRight>$0.00</ColRight>
                          </BuyInfoRow>
                          <BuyInfoRow>
                            <ColLeft>Estimated Shares Bought</ColLeft>
                            <ColRight>0.00</ColRight>
                          </BuyInfoRow>
                          <BuyInfoRow>
                            <ColLeft>Maximum Winnings</ColLeft>
                            <ColRight>$0.00</ColRight>
                          </BuyInfoRow>
                          <BuyInfoRow>
                            <ColLeft>Max Return on investment</ColLeft>
                            <ColRight>0.00%</ColRight>
                          </BuyInfoRow>
                      </BuyInfoContainer>
                      <SignupButton>
                          <span>Sign Up To Trade</span>
                        </SignupButton>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        <form>
                          <OutcomePickerLabel>
                            <div>Pick outcome</div>
                            <Button
                                title="Refresh Prices"
                                icon="refresh"
                                onClick={() => {}}
                            />
                          </OutcomePickerLabel>
                            <Outcome
                                type={true}
                                onChange={(active:any) => {
                                }}
                                width={170}
                                activeColor="#05b16a"
                              />
                        </form>
                        <BuyInfoContainer>
                          <BuyInfoRow firstCol>
                            <ColLeft>
                                LP Fee
                                <StyledPopup trigger={open => (
                                    <IconSpan><IconEx/></IconSpan>
                                  )}
                                  position="bottom center"
                                    on={['hover','focus']}
                                  >
                                      The LP fee is paid to users who add liquidity and is included in “Your Avg. Price”.
                                </StyledPopup>
                            </ColLeft>
                            <ColRight>2%</ColRight>
                          </BuyInfoRow>
                          <BuyInfoRow>
                            <ColLeft>Your Avg. Price</ColLeft>
                            <ColRight>$0.00</ColRight>
                          </BuyInfoRow>
                          <BuyInfoRow>
                            <ColLeft>Remaining Shares</ColLeft>
                            <ColRight>0.00</ColRight>
                          </BuyInfoRow>
                          <BuyInfoRow>
                            <ColLeft>You'll Receive</ColLeft>
                            <ColRight>$0.00</ColRight>
                          </BuyInfoRow>
                      </BuyInfoContainer>
                        <SignupButton>
                          <span>Sign Up To Trade</span>
                        </SignupButton>
                      </div>
                    </TabPanel>
                  </Tabs>
              </BuySellWidget>
            </WidgetColumn>
        </Content>
    </MainLayout>
  )
}
const Content = styled.div`
  display: flex;
  margin-top: 1.5rem;
  padding:0px!important;
`
const WidgetColumn = styled.div`
  display:block;
  flex-direction: column;
  margin-bottom: 0;
  margin-left: 1.5rem;
  justify-content: space-around;
  min-width: 287px;
  width: 287px;

`
const BuySellWidget = styled.div`
    background: #fff;
    border: 1px solid #dedede;  
    border-radius: 5px;
    display: -moz-box;
    display: flex;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    flex-direction: column;
    flex-shrink: 1;
    -moz-box-pack: justify;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    position: relative;
`
const OutcomePickerLabel = styled.div`
  display: flex;
  font-size: 1rem;
  margin: 1rem 0 0.4375rem;
  justify-content: space-between;
`
const StockGraphContainer = styled.div`
    background: #fff;
    border: 1px solid #dedede;
    -webkit-box-shadow: 0 3px 11px rgb(0 0 0 / 5%);
    box-shadow: 0 3px 11px rgb(0 0 0 / 5%);
    height: 420px;
    padding: 2.5rem 0.5rem 0.5rem;
    position: relative;
    width: 680px;
    border-radius: 5px;
`
const OutcomePickerShareInput = styled.div`
  position: relative;
  font-size: 1rem;
  input {
    border: 1px solid #ccc;
    border-radius: 2px;
    line-height: 1.4375;
    padding: 0.5625rem 0.75rem 0.4375rem;
    width: 100%;
    overflow: visible;
  }
  span {
    background-color: #fff;
    padding: 0 0.5rem;
    position: absolute;
    right: 0.1rem;
    top: 0.75rem;
     button {
      background: none;
      border: none;
      color: #1652f0;
      cursor: pointer;
      text-decoration: underline;
      text-transform: none;
      line-height: 1.15;
      outline:0;
      margin: 0;
     }
  }
`
const BuyInfoContainer = styled.div`
  display:block;
  margin-top: 18px; 
  width:100%;
`
const BuyInfoRow = styled.div<{ firstCol?: boolean }>`
  display:flex;
  div {
    color: #000;
    font-size: 14px;
    letter-spacing: -.00187324px;
    line-height: 21px;
    white-space: nowrap;
    ${(props) => props.firstCol && `color: #979797!important;`}   
   }
`
const ColLeft = styled.div`
    flex: 0 1;
    font-weight: 400;   
`
const ColRight = styled.div`
    flex: 1 1;
    font-weight: 500;
    text-align: right;
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
const IconSpan = styled.span`
   padding-left:3px;
`
const SignupButton = styled.button`
  height: 48px;
  width: 100%;
  flex-wrap: nowrap;
  background-color: rgb(22, 82, 240);
  box-sizing: border-box;
  border-radius: 5px;
  text-transform: capitalize;
  font-family: Heebo, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  color: white;
  min-height: 32px;
  min-width: max-content;
  padding: 6px;
  line-height: 23px;
  letter-spacing: -0.00214085px;
  box-shadow: none;
  border: 0px;
  margin-top:18px;
  span {
    width: 100%;
    display: inherit;
    align-items: inherit;
    justify-content: inherit;
    text-transform: capitalize;
    font-family: Heebo, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    text-align: center;
    color: white;
  }
  &:hover{
      box-shadow: none;
      opacity: 0.9;
      background-color: rgb(22, 82, 240);
  }
`
const MarketPostion = styled.div`
  display:block;
  margin-top:20px;
`
const StockGraphLegend = styled.ul`
    -webkit-column-gap: 19px;
    -moz-column-gap: 19px;
    column-gap: 19px;
    display: grid;
    grid-column-gap: 19px;
    grid-template-columns: repeat(2,1fr);
    margin: 15px 0 1.5rem;
    grid-row-gap: 19px;
    row-gap: 19px;
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
    li {
      line-height: 1.5rem;
      background: #fff;
      border: 1px solid #dedede;
      -webkit-box-shadow: 0 3px 11px rgb(0 0 0 / 5%);
      box-shadow: 0 3px 11px rgb(0 0 0 / 5%);
      cursor: pointer;
      display: -moz-box;
      display: flex;
      -moz-box-pack: justify;
      justify-content: space-between;
      padding: 1rem 2rem;
      border-radius: 5px;
      input {
        appearance: none;
        border: 2px solid #000;
        height: 1.5rem;
        position: relative;
        width: 1.5rem;
      }
      input[type=checkbox]:checked:after {
        background-size: 0.75rem 0.75rem;
        content: "";
        display: block;
        font-size: 1.2rem;
        height: 1.5rem;
        left: -2px;
        line-height: 1.5rem;
        position: absolute;
        text-align: center;
        top: -2px;
        width: 1.5rem;
      }
       dt {
        color: #aaa;
        margin: 0 2rem;
      }
  }
`

const MoreLi = styled.li<{checkImg:string}>`
  input[type=checkbox]:checked {
    border: 2px solid #1652f0!important;
  }
  input[type=checkbox]:checked:after {
    ${props => props.checkImg && `background: url(${props.checkImg}) 0.375rem 0.375rem / 0.75rem 0.75rem no-repeat;`}
  }
`;
const LessLi = styled.li<{checkImg:string}>`
  input[type=checkbox]:checked {
    border: 2px solid #dc3737!important;
  }
  input[type=checkbox]:checked:after {
    ${props => props.checkImg && `background: url(${props.checkImg}) 0.375rem 0.375rem / 0.75rem 0.75rem no-repeat;`}
  }
`;