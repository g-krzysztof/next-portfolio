import styled from 'styled-components';
import parse from 'html-react-parser';
import { Box } from '../../styles';

const ContentContainer = ({title, paragraphs}) => {

  return (
    <Container color="grey">
        {/*<Scrollbars>*/}
          <Box pr="space20" width="100%">
            <Title>{title}</Title>
            {paragraphs.map(({text})=><Paragraph key={text.slice(0,10)}>{parse(text)}</Paragraph>)}
          </Box>
        {/*</Scrollbars>*/}
    </Container>
  )
}

export default ContentContainer


const Container = styled(Box)`
  flex-grow: 1;
  max-width: 1000px;
  display: flex;
  height: auto;
  min-height: 680px;
  background-color:white;
  border-radius: 0 5px 5px 0;
  margin: -16px 0 0 0;
  padding: 10px 10px 20px 20px;
  box-shadow: inset 20px 0 20px -20px rgba(0,0,0, 0.1);
  transition: 0.5s;
`;

const Title = styled.h1`
  font-weight: 800;
  font-size: 21px;
  line-height: 1.2;
  padding: 10px 0 12px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid #80cc7e;
  color: inherit;
  width: 100%;
`

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  padding-bottom: 20px;
`;