import styled from 'styled-components';
import svg from 'src/components/atoms/svg';

interface MarketBlogProps {
    img:string;
    title:string;
    volume:number;
    yesVal:number;
    noVal:number;
    type?:string;
    featured?:boolean;
    fFirst?:boolean;
}

function MarketBlog(props: MarketBlogProps) {
    const {featured, fFirst, type, img, title, noVal, yesVal} = props;
    const Icon = svg['star'];
  
  return (
    <MarketBlogWrapper type={type} featured={featured} fFirst={fFirst}>
     {fFirst && <FeaturedMark>Featured</FeaturedMark>}
      <li>
        <header>
            <Avatar>
                <img alt="Market icon" src={img} />
            </Avatar>
            {title}
            {type && <span>
                {type}
            </span>}
        </header>
        <aside>
            <ul>
                <li>
                    <dt>Volume</dt>
                    <dd>$276,533</dd>
                </li>
                <li>
                    <dt>Yes</dt>
                    <YesNoVal>${yesVal}</YesNoVal>
                </li>   
                <li>
                    <dt>No</dt>
                    <YesNoVal>${noVal}</YesNoVal>
                </li>
            </ul>
            <button>
                <Icon />
            </button>
        </aside>
      </li>
    </MarketBlogWrapper>
  );
}

const MarketBlogWrapper = styled.span<{ type?: string, featured?:boolean , fFirst?:boolean }>`
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    height:100%;
    -webkit-box-shadow: 0 3px 11px rgb(0 0 0 / 4%);
    box-shadow: 0 3px 11px rgb(0 0 0 / 4%);
    color: inherit;
    display: -moz-box;
    display: flex;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    flex-direction: column;
    -moz-box-pack: justify;
    justify-content: space-between;
    list-style-type: none;
    padding: 1rem;
    width: 316px;
    text-decoration: none;
    color: black;
    &:hover {
        color:black;
    }
    ${(props) => props.featured && `    border: 2px solid #42c772;
    position: relative;`}
    li {
        display: -moz-box;
        display: flex;
        -moz-box-orient: vertical;
        -moz-box-direction: normal;
        flex-direction: column;
        height: 100%;
        -moz-box-pack: justify;
        justify-content: space-between;
        header {
            display: -moz-box;
            display: flex;
            font-size: .85rem;
            margin-bottom: 2rem;
            span  {
                border-radius: 0.125rem;
                font-size: .85rem;
                height: -moz-fit-content;
                height: fit-content;
                margin-left: 0.5rem;
                padding: 0.3rem 1rem;
                ${(props) => (props.type === 'New') && `background-color: #dff6e7;
                color: #42c772;`}
                ${(props) => (props.type === 'Scalar') && `background-color: #d6e0fc;
                color: #1652f0;`}
                ${(props) => (props.type === 'Resolved') && `background-color: #fef2f3;
                color: #f3313d;`}
            }
        }
    }
    aside {
        display: flex;
        -moz-box-pack: justify;
        justify-content: space-between;
        ul {
            list-style-type: none;
            padding: 0;   
             display: flex;
            -moz-box-pack: justify;
            justify-content: space-between;

            li {
                margin-right: 1rem;
                width: 69px;
                dt {
                    color: rgba(0,0,0,.5);
                    font-size: .75rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                dd {
                    font-size: .75rem;
                    margin: 0.5rem 0 0;
                    padding: 3.34px 7.81px 3.1px 5.58px;
                    width: -moz-fit-content;
                    width: fit-content;
                }
            }
        }
        button {
            padding: 0px 0px 2px;
            margin: 0px;
            align-self: flex-end;
            background-color: transparent;
            flex: 0 0 auto;
            color: rgba(0, 0, 0, 0.54);
            border:0px;
            padding: 12px;
            overflow: visible;
            font-size: 1.5rem;
            text-align: center;
            transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            display: flex;
            align-items: inherit;
            justify-content: inherit;
        }
    }
`;
const YesNoVal = styled.dd`
    background-color: #f2f2f2;
    color: #1652f0;
`
const FeaturedMark = styled.span`
    background-color: #42c772;
    border-radius: 0.1875rem 0.1875rem 0 0;
    color: #fff;
    display: block;
    font-size: .75rem;
    left: -2px;
    line-height: 1.125;
    padding: 0.1875rem 0.5625rem;
    position: absolute;
    top: -19px;
`
const Avatar = styled.div`
    margin-right:8px;
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
export default MarketBlog;
