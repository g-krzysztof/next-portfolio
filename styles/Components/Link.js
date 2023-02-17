import NextLink from 'next/link';

import styled from 'styled-components';

export const Link = ({ children, href, ...rest }) => (
  <NextLink href={href}>
    <LinkText {...rest}>{children}</LinkText>
  </NextLink>
);

const LinkText = styled.a`
  display: inherit;
  text-decoration: none;
  cursor: pointer;
`;
