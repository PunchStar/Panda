import styled from 'styled-components';
import svg from '../svg';

interface ButtonProps {
  background?: string;
  color?: string;
  title?: string;
  icon?: string | null;
  onClick: () => void;
}

export default function Button(props: ButtonProps) {
  const {
    background,
    color,
    title,
    icon,
    onClick,
  } = props;
  const Icon = icon && svg[icon];
  return (
    <ButtonWrapper background={background} color={color} title={title} icon={icon}  onClick={onClick} >
      {icon && (
        <IconWrapper
        >
          <Icon
            stroke={color}
          />
        </IconWrapper>
      )}
      {title}
    </ButtonWrapper>
  );
}

// function getPaddingByType(type: string) {
//   switch (type) {
//     case 'large':
//       return '15px 16px';
//     case 'medium':
//       return '11px 12px';
//     case 'small':
//       return '7px 12px';
//     default: return '';
//   }
// }

const ButtonWrapper = styled.button<{
  background?: string;
  color?: string;
  icon:any;
}>`
  border: ${(props) => (props.icon === null
    ? 'none'
    : `1px solid ${props.color || '#074EE8'}`)};
  background: ${(props) => (props.icon === null ? 'transparent' : props.background || '#074EE8')};
  // border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;cursor: pointer;
  background: none;
  border: none;
  border: 1px solid rgba(0,0,0,.1);
  border-radius: 3px;
  font-size: .8333em;
  font-size: .625rem;
  opacity: 50%;
  outline: none;
  padding: 0.375rem;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
`;


const IconWrapper = styled.span`
  line-height: .625rem;
  padding-right: 0.375rem;
  vertical-align: middle;
`;
