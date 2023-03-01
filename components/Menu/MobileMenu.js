import styled from 'styled-components';
import Link from 'next/link';
import { Box } from '../../styles';
import { Icon } from '../Icons';
import { menuData } from '../Menu/Menu';

const MobileMenu = () => {
  return (
    <MenuWrapper px="space30">
      <MenuContainer>
        <MenuList>
          {menuData.map(({ label, icon, iconSize, url }) => (
            <MenuItem key={url}>
              <Link href={url}>
                <LinkContainer>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                  >
                    <Icon iconName={icon} size={iconSize} />
                  </Box>
                  <Box mt="space5">{label}</Box>
                </LinkContainer>
              </Link>
            </MenuItem>
          ))}
        </MenuList>
        <Box height="70px" display="flex" justifyContent="space-between">
          <CardButton borderRadius={{ _: 'border0', tablet: 'border5' }}>
            <a
              href="/utils/krzysztofgryc.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                iconName="download"
                size="32px"
                mr={{ _: 'space15' }}
                color="primary"
              />
            </a>
          </CardButton>
          <CardButton borderRadius={{ _: 'border0', tablet: 'border5' }}>
            <a href="tel:+4853-538-3727">
              <Icon
                iconName="phone"
                size="32px"
                mr={{ _: 'space5' }}
                color="primary"
              />
            </a>
          </CardButton>
        </Box>
      </MenuContainer>
    </MenuWrapper>
  );
};

export default MobileMenu;

const MenuWrapper = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 15px -10px rgba(0, 0, 0, 0.5);
`;

const MenuContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
`;

const MenuList = styled(Box)`
  display: flex;
  align-items: flex-end;
  list-style: none;
`;

const MenuItem = styled(Box)`
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0;
  a {
    text-decoration: none;
  }
`;

const LinkContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 10px;
  font-size: 12px;
  color: #333;
  transition: 0.2s;
  :hover {
    color: ${({ theme: { colors } }) => colors.secondary};
  }
`;

const CardButton = styled(Box)`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: 0.2s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.grey};
  :hover {
    color: ${({ theme: { colors } }) => colors.secondary};
  }
  a {
    text-decoration: none;
    transition: 0.2s;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: ${({ theme: { colors } }) => colors.grey};
  }
  a:hover {
    color: ${({ theme: { colors } }) => colors.secondary};
  }
`;
