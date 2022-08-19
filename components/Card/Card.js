import styled from 'styled-components'
import { Box } from '../../styles'

const Card = () => (
  <CardContainer
    height={{ _: '100vh', tablet: '600px' }}
    width={{ _: '100vw', tablet: '380px' }}
    borderRadius={{ _: 'border0', tablet: 'border5' }}
  >
    <CardBackground
      height={{ _: '40vh', tablet: '250px' }}
      borderRadius={{ _: 'border0', tablet: 'border5' }}
    />
  </CardContainer>
)

export default Card

const CardContainer = styled(Box)`
  position: relative;
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
`

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
`
