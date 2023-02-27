import styled, { css } from 'styled-components';
import Link from 'next/link';
import { Box } from '../../styles';
import { Icon } from '../Icons';
import { menuData } from '../Menu/Menu';

const MobileMenu = () => {
  return (
    <MenuWrapper>
      <MenuList>
        {menuData.map(({ label, icon, iconSize, url }) => (
          <MenuItem>
            <Link key={url} href={url}>
              <LinkContainer>
                <Icon iconName={icon} size={iconSize} />
                <br />
                {label}
              </LinkContainer>
            </Link>
          </MenuItem>
        ))}
      </MenuList>
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
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
  font-size: 12px;
  color: #333;
  transition: 0.2s;
  :hover {
    color: ${({ theme: { colors } }) => colors.secondary};
  }
`;
