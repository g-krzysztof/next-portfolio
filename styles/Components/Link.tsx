import type { ComponentProps } from 'react';
import NextLink from 'next/link';

import styled from 'styled-components';

export const Link = ({
  children,
  href,
  ...rest
}: ComponentProps<typeof NextLink>) => (
  <LinkText href={href} {...rest}>
    {children}
  </LinkText>
);

const LinkText = styled(NextLink)`
  display: inherit;
  text-decoration: none;
  cursor: pointer;
`;
