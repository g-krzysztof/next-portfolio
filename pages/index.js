import { Box } from '../styles'
import useBetterMediaQuery from '../hooks/useBetterMediaQuery'

const Home = () => {
  const modificationPage = useBetterMediaQuery('(min-width: 768px)')

  return <Box>Home page</Box>
}

export default Home
