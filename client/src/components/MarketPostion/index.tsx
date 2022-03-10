import styled from 'styled-components';
import PositionsWidget from './PositionsWidget';
import ShowMoreText from 'react-show-more-text';
interface MarketPositionProps {
}

function MarketPosition(props: MarketPositionProps) {
  return (
    <MarketPositionWrapper>
      <PositionsWidget/>
      <h3>
        About this market
      </h3>
      <ShowMoreText
          lines ={5}
          more="...read more"
          less=""
      >
        <span>
          The World Chess Championship 2021 is an ongoing chess match between reigning world champion Magnus Carlsen and challenger Ian Nepomniachtchi to determine the World Chess Champion.
          <br/>
          The full match consists of 14 regular games, and a score of 7½ wins the world championship. If the score is equal after 14 games, tie-break games with faster time controls will be played. Any potential tie-break games will not be considered for this market, only the initial 14 games will be considered. 
        </span>
        <br/>
        <br/>
        <span>After 14 regular games, all games that ended with a draw are counted. </span><br/>
        <span>If there are more than 12 draws, this market will resolve to "More".</span><br/>
        <span>If there are exactly 12 draws, this market will resolve 50-50.</span><br/>
        <span>If there are less than 12 draws, this market will resolve to "Less".</span><br/>
        <br/>
        <span>------------------------------</span>
        <br/>
        <br/>
        <span>WCC 2021 is held under the auspices of FIDE, the world chess federation, and played at Dubai Exhibition Centre, Dubai, United Arab Emirates, between 24 November and 16 December 2021.</span>
        <p>Please read more about the championship here:<br/> <a href="https://en.wikipedia.org/wiki/World_Chess_Championship_2021">https://en.wikipedia.org/wiki/World_Chess_Championship_2021</a></p>
      </ShowMoreText>
      <ResolutionSource>
        Resolution Source:
        <span>
          <a href="https://fideworldchampionship.com/">https://fideworldchampionship.com/</a>
        </span>
      </ResolutionSource>
      <ResolutionSource inline>
         Resolver: 
          <a href="https://explorer-mainnet.maticvigil.com/address/0x0dD333859cF16942dd333D7570D839b8946Ac221">0x0dD333859cF16942dd333D7570D839b8946Ac221</a>
      </ResolutionSource>
    </MarketPositionWrapper>
  );
}

const MarketPositionWrapper = styled.div`
    h3 {
      display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    }
`;
const ResolutionSource = styled.p<{ inline?: boolean }>`
    background: #f4f4f4;
    border-radius: 0.8rem;
    color: #aaa;
    font-size: .8rem;
    height: -moz-fit-content;
    height: fit-content;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    width: -moz-fit-content;
    width: fit-content;
    max-width: 100%;
    a {
      background-color: transparent;
      color: #1652f0;
      text-decoration: none;
      overflow-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      display: block;
      ${(props) => props.inline ? `display: inline;`:`display: block;`}   
  }
`
export default MarketPosition;
