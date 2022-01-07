import styled from "styled-components"
import { connect } from "react-redux"
import Button from 'src/components/atoms/Button/Button';
import { Appstate } from "../../store/reducers/rootReducer";
const mapStateToProps = ( state:Appstate ) => {
  return {
    price: state.price.price,
  };
};
interface Props {
  price?: string;
}

const MarketDetailHeader = (props: Props) => {
  // const { price } = props;
  return (
    <HeaderWrapper>
      <HeaderTitle>
          <Avatar>
            <img src="https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/PedroPinhata/phpACLwMM.png" alt="avatar"/>
          </Avatar>
          <Content>
            <Category>Chess</Category>
            <Title>World Chess Championship 2021: Will there be more or less than 12 draws?</Title>
            <HeaderRow>
              <Button
                title="Favorite"
                icon="favorite"
                onClick={() => {}}
              />
              <Info>
                <span>•</span>Deployed by: <a href="/">0x790A...949B</a>
              </Info>
              <Info>
                <span>•</span>Resolver: <a href="/">0x0dD3...c221</a>
              </Info>
            </HeaderRow>
          </Content>
      </HeaderTitle>
      <BoxContainer>
        <DetailBox>
          <dt>Market ends on</dt>
          <dd>December 14, 2021</dd>
        </DetailBox>
        <DetailBox>
          <dt>Trade volume</dt>
          <dd>7376.695853</dd>
        </DetailBox>
        <DetailBox>
          <dt>Liquidity</dt>
          <dd>5435.169586</dd>
        </DetailBox>
      </BoxContainer>
    </HeaderWrapper>
  )
}
const HeaderWrapper = styled.div`
    position: reltiave;
    width: 100%;
    background: #fff!important;
    border: 1px solid #dedede;
    display: flex;
    justify-content: space-between; 
    border-radius: 5px;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,.04));
`
const HeaderTitle = styled.div`
  display: flex;
  margin: 1.125rem 0.5rem 1rem 1.125rem;
  position: relative;
`
const Avatar = styled.div`
    width: 40px;  
    height: 40px;
    display: flex;
    overflow: hidden;
    position: relative;
    font-size: 1.25rem;
    align-items: center;
    flex-shrink: 0;
    font-family: Heebo, sans-serif;
    line-height: 1;
    user-select: none;
    border-radius: 50%;
    justify-content: center;

    img {
      color: transparent;
      width: 100%;
      height: 100%;
      object-fit: cover;
      text-align: center;
      text-indent: 10000px;
    }
`
const Content= styled.div`
  display:flex;
  flex-direction: column;
  margin-left: 12px;
`
const Category = styled.div`
  color: #000;
  font-family: Heebo;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -.00160563px;
  line-height: 12px;
  mix-blend-mode: normal;
  opacity: .5;
`
const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 400;
  margin: 0.375rem 0 0;
`
const HeaderRow = styled.div`
  display:flex;
  padding-top: 7px;
`
const Info = styled.div`
  color: rgba(0,0,0,.5);
  font-family: Heebo;
  font-size: .8rem;
  font-style: normal;
  font-weight: 400;
  
  span {
    padding: 0px 12px;
    color: rgb(216, 216, 216);
    font-family: Heebo, sans-serif;
    font-size: 1rem;
    font-style: normal;
    font-weight: normal;
    height: fit-content;
    letter-spacing: -0.00160563px;
    line-height: 0.8rem;
  }

  a {
    margin: 0px;
    font-family: Heebo, sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: -0.00160563px;
    color: rgb(22, 82, 240)!important;
    cursor:pointer;
    text-decoration: none;
  }
`
const BoxContainer = styled.div`
    align-items: center;
    display: -moz-box;
    display: flex;
    margin: 2rem 1.8rem 1.56rem;
    padding: 0;
`;
const DetailBox = styled.div`
  background: #f4f4f4;
  display: block;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  height: 3.8rem;
  -moz-box-pack: justify;
  justify-content: space-between;
  min-width: 8rem;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  margin-right:3px;
  margin-left:3px;
  dt {
    color: rgba(0,0,0,.5);
    font-size: .75rem;
  }
  dd {
    font-size: 1rem;
    margin: 0.2rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
export default connect(
  mapStateToProps,null,
)(MarketDetailHeader);
