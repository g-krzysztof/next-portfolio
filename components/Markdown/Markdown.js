import MarkdownToJsx from 'markdown-to-jsx';

// markdown-to-jsx v9 follows CommonMark, so `** text **` (spaces inside the
// delimiters) is no longer bold. CMS content relies on the old lenient parsing.
const normalizeEmphasis = (text) =>
  text.replace(/\*\*[ \t]*([^*\n]+?)[ \t]*\*\*/g, '**$1**');

const Markdown = ({ children, ...rest }) => (
  <MarkdownToJsx {...rest}>
    {typeof children === 'string' ? normalizeEmphasis(children) : children}
  </MarkdownToJsx>
);

export default Markdown;
