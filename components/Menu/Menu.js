import styled, { css } from 'styled-components';
import Link from 'next/link';
import { Box } from '../../styles';
import { Icon } from '../Icons';

export const menuData = [
  {
    label: 'o mnie',
    icon: 'avatar',
    iconSize: '24px',
    url: '/',
  },
  {
    label: 'CV',
    icon: 'document',
    iconSize: '20px',
    url: '/resume',
  },
  {
    label: 'kontakt',
    icon: 'email',
    iconSize: '26px',
    url: '/contact',
  },
];

const Menu = () => {
  return (
    <MenuWrapper borderRadius="border5" mt="-290px" mr="space10">
      <MenuList>
        {menuData.map(({ label, icon, iconSize, url }) => (
          <MenuItem key={url}>
            <Link href={url}>
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

export default Menu;

const MenuWrapper = styled(Box)`
  position: relative;
  background-color: #fff;
  z-index: 10;
`;

const MenuList = styled(Box)`
  position: relative;
  list-style: none;
  margin: 0;
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
  ::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: radial-gradient(
      ellipse at right,
      #ddd 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }

  :nth-child(3)::before {
    height: 0;
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
