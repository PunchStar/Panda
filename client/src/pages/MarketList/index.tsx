import React, { useState, useEffect, useRef } from "react"
import Checkbox from "src/components/atoms/Checkbox"
import Dropdown from "src/components/atoms/Dropdown"
import SearchInput from "src/components/atoms/SearchInput"
import MarketBlog from "src/components/MarketBlog"
import MainLayout from "src/layouts/MainLayout"
import styled from "styled-components"
import { MarketDetailData } from "src/store/mockData"
import Pagination from 'rc-pagination';
import cloneDeep from 'lodash/cloneDeep';
import throttle from 'lodash/throttle';
import { Link } from 'react-router-dom';
import 'rc-pagination/assets/index.css';
import {useWeb3React} from '@web3-react/core';
import { injected } from 'src/wallet/connector';
import Web3 from "web3";
import abi from 'src/contract/ABI/ConractABI.json';
declare var window: any

export default function MarketList() {
  const { active, account, library, connector, activate, deactivate} = useWeb3React();
  const [eth, setEth] = useState(0);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [wethBalance, setWethBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const contractAddress = "0x704592b09F12140A66372E00448F6c46Ce024B58";
  

  const onClick = () => {
    activate(injected);
  }
  useEffect(() => {
    if (active) {
      const web3js = new Web3(window.ethereum);
      console.log('Web', web3js);
      setWeb3(web3js);
      const contractjs = new web3js.eth.Contract(abi as any[], contractAddress);
      
      setContract(contractjs);   
    }
  },[active]);
  const createQuestionToken = async() => {
   const xxx = await web3?.eth.estimateGas({gas: 5000000}, function(err:any, gasAmount:any){
      console.log('gas', gasAmount)
      if(gasAmount == 5000000)
        console.log('method ran out of gas');
    })
    // const xxx = await contract.methods.createQuestion(contractAddress, account,'title', 123, 345).estimateGas({gas: 5000000}, function(err:any, gasAmount:any){
    //   console.log('gas', gasAmount)
    //   if(gasAmount == 5000000)
    //     console.log('method ran out of gas');
    // });
    console.log("ddd", xxx)
    const yyy = await contract.methods.createQuestion(contractAddress, account,'title', 123, 345).send({from:account});
    console.log('dddddd', yyy)
  }

  const countPerPage = 10;
  const [value, setValue ] = useState("");
  const [resolved, setResolved] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection ] = useState(
    cloneDeep(MarketDetailData.slice(0, countPerPage))
  )
  const searchData = useRef(
    throttle((res:any) => {
      const query = res.val.toLowerCase();
      setCurrentPage(1);
      const data = cloneDeep(
        MarketDetailData
          .filter(item => item.title.toLowerCase().indexOf(query) > -1)
          .filter(item => res.resolved && item.type === 'Resolved' || !res.resolved && item.type !== 'Resolved')
          .slice(0, countPerPage)
      );
      setCollection(data);
    }, 400)
  );
  useEffect(() => {
      searchData.current({val:value, resolved:resolved, favorite:favorite});
      if(favorite) {
        try{
          activate(injected);
        }catch(ex){
          console.log("eee", ex)
        }
      }
  }, [value, resolved, favorite]);

  const updatePage = (p:any )=> {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setCollection(cloneDeep(MarketDetailData.slice(from, to)));
    window.scrollTo(0,0);
  };
  return (
    <MainLayout>
        <Content>
          <button onClick={onClick}>Connect</button>
          <button onClick={createQuestionToken}>CreateQuestion</button>
          <SearchInput onClick={(value) => {
            setValue(value);
          }}/>
          <SearchFilter>
            <MarketSelect>
              <Dropdown title="Category: " arrItem={['All','Business','Chess','Covid-19', 'Crypto', 'Global Politics', 'NFTs']}/>
            </MarketSelect>
            <MarketSelect>
              <Dropdown title="Sort By: " arrItem={['Volume', 'Liquidity', 'Newest', 'Expiring', 'Competitive']}/>
            </MarketSelect>
            <Checkbox label="Show Resolved" onClick={(value) => {
              setResolved(value);
            }}/>
            <Checkbox label="Show Favorites" type="star" onClick={(value) => {
              setFavorite(value);
            }}/>
          </SearchFilter>
          <h5>Popular Markets</h5>
          <BlogList>
              {collection.map((item, index) =>
                <Link key={index} to={'/detail'}>
                  <MarketBlog 
                    
                    img = {item.img}
                    title = {item.title}
                    type = {item.type}
                    volume = {item.volume}
                    noVal = {item.noVal}
                    yesVal = {item.yesVal}
                    featured = {item.featured}
                  />
                </Link>
              )}
          </BlogList>
          <Pagination
                pageSize={countPerPage}
                onChange={updatePage}
                current={currentPage}
                total={MarketDetailData.length}
              />
        </Content>
    </MainLayout>
  )
}
const Content = styled.div`
  margin-top: 1.5rem;
  padding:0px!important;
`
const SearchFilter = styled.div`
  display: flex;
  justify-content: space-around;
  -moz-box-align: start;
  align-items: flex-start;
  margin-top: 1rem;
`
const MarketSelect = styled.div`
  display: flex;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  margin-bottom: 1rem;
  margin-right: 3rem;
  text-transform: capitalize;
  min-width: 190px;
`
const BlogList= styled.div`
  -webkit-column-gap: 25px;
  -moz-column-gap: 25px;
  column-gap: 25px;
  display: grid;
  grid-column-gap: 25px;
  grid-template-columns: repeat(3,1fr);
  margin-top: 1.5625rem;
  padding: 0;
  grid-row-gap: 19px;
  row-gap: 19px;
  overflow:hidden;
  a{
    text-decoration: none;
  }
`