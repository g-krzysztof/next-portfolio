import styled from 'styled-components';
import { Box } from '../../styles';
import { Icon } from '../Icons'

const Menu = () => {

  return (
    <MenuWrapper borderRadius={{_:'border0', tablet:'border5'}} mt={{_:'space0', tablet:'-290px'}} mr={{_:'space0', tablet:'space10'}}>
        <MenuList>
          <MenuItem>
            <a href="/">
              <LinkContainer>
                <Icon iconName='avatar' size='24px'/>
                <br />o mnie
              </LinkContainer>
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/resume">
              <LinkContainer className="Header__link">
                <Icon iconName='document' size='20px'/>
                <br />CV
              </LinkContainer>
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/contact">
              <LinkContainer className="Header__link">
                <Icon iconName='email' size='26px'/>
                <br />kontakt
              </LinkContainer>
            </a>
          </MenuItem>
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
  //@media #{$mw7}{
  //  padding: 0 5vw;
  //  width: 70vw;
  //  margin: 0 15vw;
  //  display: flex;
  //  position: fixed;
  //  background-color: #fff;
  //  box-shadow: 0px 10px 15px -10px rgba(0,0,0,0.5)
  //}
  //@media #{$mw4} {
  //  padding: 0 0 0 0;
  //  width: 100vw;
  //  margin: 0 0 0 0;
  //}
`

const MenuItem = styled(Box)`
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0;
  a {
    text-decoration: none;
  }
  //a.active{
  //  color: $main-color;
  //}
  //@media #{$mw7}{
  //  flex-grow: 1;
  //}
  ::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: radial-gradient(ellipse at right,#ddd 0%,rgba(255,255,255,0) 70%);
    //@media #{$mw7}{
    //  background: #fff;
    //}
  }

  :nth-child(3)::before {
    height: 0;
    //@media #{$mw7}{
    //  background: #fff;
    //  height: 1px;
    //}
  }
`

const LinkContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
  font-size: 12px;
  color: #333;
  transition: .2s;
  :hover {
    color: ${({theme:{colors}})=>colors.secondary};
  }
  //&__link.active {
  //  color: #876543;
  //}
`
