import styled from 'styled-components';

export const Background = () => {
  return (
    <StyledBackground>
      <Squares>
        {/* &#9726; &#9635; &#9640; &#9634; */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <li key={`square${item}`}>&#9634;</li>
        ))}
      </Squares>
    </StyledBackground>
  );
};

const StyledBackground = styled.div`
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -2;
  ${({ theme: { colors } }) => `
      background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
  `};
  background-size: 200% 200%;
  animation: bannerRbg ease 8s infinite;
  @keyframes bannerRbg {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`;

const Squares = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  color: #fff;

  li {
    position: absolute;
    list-style: none;
    display: block;
    opacity: 0.2;
    font-size: 4rem;
    animation: square linear 24s infinite;
    bottom: -400px;
  }

  li:nth-child(1) {
    left: 8.333333333333334%;
    font-size: 15rem;
    opacity: 0.1;
    animation-delay: 0s;
  }

  li:nth-child(5) {
    left: 41.66666666666667%;
    font-size: 3rem;
    opacity: 0.1;
    animation-delay: 0s;
  }

  li:nth-child(9) {
    left: 75%;
    font-size: 1.666666666666667rem;
    opacity: 0.1;
    animation-delay: 0s;
  }

  li:nth-child(2) {
    left: 16.666666666666668%;
    font-size: 8rem;
    opacity: 0.05;
    animation-delay: 4s;
  }

  li:nth-child(6) {
    left: 50%;
    font-size: 8rem;
    opacity: 0.05;
    animation-delay: 2s;
  }

  li:nth-child(10) {
    left: 83.33333333333334%;
    font-size: 8rem;
    opacity: 0.05;
    animation-delay: 6s;
  }

  li:nth-child(3) {
    left: 25%;
    font-size: 6.666666666666666rem;
    opacity: 0.08;
    animation-delay: 10s;
  }

  li:nth-child(7) {
    left: 58.33333333333334%;
    font-size: 2.857142857142857rem;
    opacity: 0.08;
    animation-delay: 12s;
  }

  li:nth-child(11) {
    left: 91.66666666666669%;
    font-size: 1.818181818181818rem;
    opacity: 0.08;
    animation-delay: 8s;
  }

  li:nth-child(4) {
    left: 33.333333333333336%;
    font-size: 8rem;
    opacity: 0.05;
    animation-delay: 14s;
  }

  li:nth-child(8) {
    left: 66.66666666666667%;
    font-size: 16rem;
    opacity: 0.05;
    animation-delay: 16s;
  }

  li:nth-child(12) {
    left: 100%;
    font-size: 24rem;
    opacity: 0.05;
    animation-delay: 18s;
  }

  @keyframes square {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-2400px) rotate(600deg);
    }
  }
`;
