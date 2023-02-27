import styled from 'styled-components';
import { Box } from '../../styles';
import { Icon } from '../Icons';

const Card = () => (
  <CardContainer
    height={{ _: '100vh', tablet: '800px' }}
    width={{ _: '100vw', mobileL: '480px', laptopS: '380px' }}
    borderRadius={{ _: 'border0', tablet: 'border5' }}
  >
    <CardBackground
      height={{ _: '40vh', tablet: '250px' }}
      borderRadius={{ _: 'border0', tablet: 'border5' }}
    />
    <AvatarPhoto>
      <a href="https://krzysztofg.pl">
        <AvatarImage src={'images/avatar-kriss.png'} />
      </a>
    </AvatarPhoto>
    <Title mt={{ _: 'space30' }}>Krzysztof Gryc</Title>
    <SubTitle mt={{ _: 'space10' }} mb={{ _: 'space20' }}>
      Senior React Developer
    </SubTitle>
    <Socials>
      <a
        href="https://github.com/g-krzysztof"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon iconName="github" />
      </a>
      <a
        href="https://linkedin.com/in/krzysztof-gryc"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon iconName="linkedin" ml={{ _: 'space10' }} />
      </a>
    </Socials>
    <CardButtons>
      <CardButton borderRadius={{ _: 'border0', tablet: 'border5' }}>
        <a
          href="/utils/krzysztofgryc.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          pobierz cv
          <Icon iconName="download" size="16px" ml={{ _: 'space5' }} />
        </a>
      </CardButton>
      <CardButton borderRadius={{ _: 'border0', tablet: 'border5' }}>
        <a href="tel:+4853-538-3727">
          <Icon iconName="phone" size="16px" mr={{ _: 'space5' }} />
          535 383 727
        </a>
      </CardButton>
    </CardButtons>
  </CardContainer>
);

export default Card;

const CardContainer = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme: { colors, space, radii } }) => `
    background-color: ${colors.white100};
    ::before {
      margin-left: -${space.space15};
      margin-top: -${space.space15};
      border-radius: ${radii.border5};
      content: '';
      position: absolute;
      z-index: -1;
      width: inherit;
      height: inherit;
      background: linear-gradient(135deg,rgba(120,204,109,.4) 0%,rgba(120,204,109,.01) 100%);
      transition: .5s;
    }
  `};
`;

const CardBackground = styled(Box)`
  background-image: url('images/card-background.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  overflow: hidden;
  ::before {
    content: '';
    position: absolute;
    left: -25%;
    bottom: -63%;
    width: 100%;
    height: 70%;
    background: #fff;
    transform: rotate(12deg);
  }
  ::after {
    content: '';
    position: absolute;
    left: auto;
    right: -25%;
    bottom: -63%;
    width: 100%;
    height: 70%;
    background: #fff;
    transform: rotate(-8deg);
  }
`;

const AvatarPhoto = styled(Box)`
  position: relative;
  margin-top: -25%;
  width: 140px;
  height: 140px;
  ::before {
    background: linear-gradient(
      135deg,
      rgba(120, 204, 109, 0.4) 0%,
      rgba(120, 204, 109, 0.01) 100%
    );
    content: '';
    position: absolute;
    top: 10px;
    left: -10px;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const AvatarImage = styled.img`
  border-radius: 50%;
  position: relative;
  width: 140px;
`;

const Title = styled(Box)`
  font-size: 32px;
  font-weight: 600;
  ${({ theme: { colors } }) => `
    color: ${colors.grey};
  `};
`;

const SubTitle = styled(Box)`
  font-weight: 600;
  ${({ theme: { colors } }) => `
    color: ${colors.secondary};
  `};
`;

const Socials = styled(Box)`
  display: flex;
  a {
    text-decoration: none;
    font-size: 20px;
    transition: 0.2s;
    ${({ theme: { colors } }) => `
      color: ${colors.grey};
  `};
  }
  a:hover {
    ${({ theme: { colors } }) => `
      color: ${colors.secondary};
    `};
  }
`;

const CardButtons = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  z-index: 10;
  border-radius: 0 0 5px 5px;
  ::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background: radial-gradient(
      ellipse at center,
      #ddd 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
`;

const CardButton = styled(Box)`
  width: 100%;
  background-color: #fff;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: 0.2s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.grey};
  :hover {
    color: ${({ theme: { colors } }) => colors.secondary};
  }
  :nth-child(1)::before {
    content: '';
    position: absolute;
    right: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    background: radial-gradient(
      ellipse at top,
      #ddd 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  a {
    text-decoration: none;
    transition: 0.2s;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: ${({ theme: { colors } }) => colors.grey};
  }
  a:hover {
    color: ${({ theme: { colors } }) => colors.secondary};
  }
`;
