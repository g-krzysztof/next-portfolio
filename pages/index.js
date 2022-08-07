import { Box, Background } from '../styles'
import useBetterMediaQuery from '../hooks/useBetterMediaQuery'

const Home = () => {
  const modificationPage = useBetterMediaQuery('(min-width: 768px)')

  return <Background>Home page</Background>
}

export default Home
