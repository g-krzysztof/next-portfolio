import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box } from '../../styles';
import { Icon } from '../Icons';
import { LangContext } from '../../pages/_app';
import { useContext } from 'react';
import EnFlag from '../Flags/EnFlag';
import PlFlag from '../Flags/PlFlag';

export const menuData = [
  {
    labelPl: 'o mnie',
    labelEn: 'About me',
    icon: 'avatar',
    iconSize: '24px',
    url: '/',
  },
  {
    labelPl: 'CV',
    labelEn: 'CV',
    icon: 'document',
    iconSize: '20px',
    url: '/resume',
  },
  {
    labelPl: 'opinie',
    labelEn: 'opinions',
    icon: 'nodes',
    iconSize: '26px',
    url: '/recommendation',
  },
  {
    labelPl: 'kontakt',
    labelEn: 'Contact',
    icon: 'email',
    iconSize: '26px',
    url: '/contact',
  },
];

const Menu = () => {
  const router = useRouter();
  const { pathname } = router;

  const [lang, setLang] = useContext(LangContext);

  return (
    <Box display="flex" flexDirection="column">
      <MenuWrapper borderRadius="border5" mt="-130px" mr="space10">
        <MenuList>
          {menuData.map(({ labelPl, labelEn, icon, iconSize, url }) => (
            <MenuItem key={url}>
              <Link href={url}>
                <LinkContainer>
                  <Icon
                    iconName={icon}
                    size={iconSize}
                    color={pathname === url && 'secondary'}
                  />
                  <br />
                  {`${lang === 'pl' ? labelPl : labelEn}`}
                </LinkContainer>
              </Link>
            </MenuItem>
          ))}
        </MenuList>
      </MenuWrapper>
      <Box pt="15px" pr="5px" display="flex" flexDirection="column" alignItems="center">
        {lang === 'pl' && <EnFlag onClick={() => setLang('en')} width="60px" />}
        {lang === 'en' && <PlFlag onClick={() => setLang('pl')} width="54px" />}
      </Box>
    </Box>
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

  :last-child::before {
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
