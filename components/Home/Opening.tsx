'use client';

import styled from 'styled-components';

// Hero i talia opinii to jedno turkusowe pole: wspólne tło pozwala kwadratom
// przepływać przez granicę sekcji bez ucięcia
const Opening = styled.div`
  position: relative;
  isolation: isolate;
  background: ${({ theme }) => theme.colors.field};
`;

export default Opening;
