import styled from 'styled-components';
import { Box } from '../../styles';
import { Icon } from '../Icons';

const MobileCard = () => (
  <Box width="100%" maxWidth="1000px">
    <CardBackground
      height="auto"
      width="100%"
      pt="110px"
      pl="space20"
      pb="20px"
      backgroundColor="white"
    >
      <AvatarPhoto>
        <a href="https://krzysztofg.pl">
          <AvatarImage src={'images/avatar-kriss.png'} />
        </a>
      </AvatarPhoto>
    </CardBackground>
    <Box width="100%" height="10px" backgroundColor="white" color="white" />
    <Box display="flex" width="100%" justifyContent="space-between">
      <Box display="flex" flexDirection="column" pl="space20">
        <Title mt={{ _: 'space10' }}>Krzysztof Gryc</Title>
        <SubTitle mt={{ _: 'space10' }} mb={{ _: 'space30' }}>
          Senior React Developer
        </SubTitle>
      </Box>
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
    </Box>
  </Box>
);

export default MobileCard;

const CardBackground = styled(Box)`
  background-image: url('images/card-background.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
`;

const AvatarPhoto = styled(Box)`
  position: relative;
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
    color: ${colors.white100};
  `};
`;

const Socials = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: -20px;
  padding-right: 20px;
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
