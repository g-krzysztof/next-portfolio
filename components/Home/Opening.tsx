'use client';

import styled from 'styled-components';

// Turkusowe pole hero: wspólne tło pozwala kwadratom wychodzić poza samą kartę
const Opening = styled.div`
  position: relative;
  isolation: isolate;
  background: ${({ theme }) => theme.colors.field};
`;

export default Opening;
