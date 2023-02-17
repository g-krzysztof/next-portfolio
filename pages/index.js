import { Box, Background } from '../styles'
import useBetterMediaQuery from '../hooks/useBetterMediaQuery'
import styled from 'styled-components'

import { Card } from '../components/Card'

const Home = () => {
  const modificationPage = useBetterMediaQuery('(min-width: 768px)')

  return (
    <>
      <StyledBox display="flex" justifyContent="center" alignItems="center">
        <Box>jeden</Box>
        <Card />
        <ContentContainer>jeden</ContentContainer>
      </StyledBox>
      <Background />
    </>
  )
}

export default Home

const StyledBox = styled(Box)`
  min-height: 100vh;
  width: 90%;
  margin: 0 auto;
`

const ContentContainer = styled(Box)`
  flex-grow: 1;
  max-width: 1000px;
`
