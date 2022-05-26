import { AppBar, Toolbar, Box, Button, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import OhmMenu from "./OhmMenu.jsx";
import ThemeSwitcher from "./ThemeSwitch.jsx";
import ConnectMenu from "./ConnectMenu.jsx";
import styled from 'styled-components'
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { AiFillFacebook } from 'react-icons/ai'
import { FaInstagram, FaYoutube, FaTwitter, FaPaperPlane } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi'
import "./topbar.scss";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  const [hamburgeropen, setHamburgerOpen] = useState(false);

  const dialog = useRef();
  const hamburger = useRef();

  useEffect(() => {
    document.addEventListener('mouseup', function (event) {
      if (dialog.current && !dialog.current.contains(event.target) && !hamburger.current.contains(event.target)) {
        setHamburgerOpen(false);
      }
    });
  }, []);

  useEffect(() => {
    console.log(hamburgeropen)
  }, [hamburgeropen])
  return (
    <StyledContainer >
      <Box display={'flex'} width={'100%'}>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
            <Box width={'175px'} height={'50px'} marginY={'15px'}>
              <img src={'/logo.png'} width={'100%'} height={'100%'} alt={'logo'} />
            </Box>
            <Divider ml={'15px'} />
            <Menus>
              <Box><Link to={'/reward'} style={{ color: 'white', textDecoration: 'unset' }}>Tracker</Link></Box>
              <Box><Link to={'/pools'} style={{ color: 'white', textDecoration: 'unset' }}>Pools</Link></Box>
              <Box>FAQ</Box>
              <Box><a href={'https://onlygems-finance.gitbook.io/onlygems-finance/'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}>WhitePaper</a></Box>
              <Box><a href={'https://onlygems.finance/'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}>Official Website</a></Box>
            </Menus>
            <Divider />

            <Socials mt={'6px'}>
              <Box color={'white'}><a href={'https://twitter.com/OnlyGemsFinance'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}><FaTwitter /></a></Box>
              <Box color={'white'}><a href={'https://t.me/onlygemsfinance'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}><FaPaperPlane /></a></Box>
            </Socials>
            <Divider />
          </Box>
        </Box>
        <Box mr={'20px'} display={'flex'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'} height={'64px'} >
            <ConnectMenu theme={theme} />
            <Hamburger onClick={() => setHamburgerOpen(!hamburgeropen)} ref={hamburger}>
              <GiHamburgerMenu />
            </Hamburger>
          </Box>
        </Box>
      </Box>
      <div ref={dialog}>
        <HamburgerMenu width={'100%'} open={hamburgeropen}>
          <Menus open={hamburgeropen}>
            <Box><Link to={'/reward'} style={{ color: 'white', textDecoration: 'unset' }}>Tracker</Link></Box>
            <Box><Link to={'/pools'} style={{ color: 'white', textDecoration: 'unset' }} >Pools</Link></Box>
            <Box>FAQ</Box>
            <Box><a href={'https://onlygems-finance.gitbook.io/onlygems-finance/'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}>WhitePaper</a></Box>
            <Box><a href={'https://onlygems.finance/'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}>Official Website</a></Box>
          </Menus>

          <Socials open={hamburgeropen}>

            <Box ><a href={'https://t.me/onlygemsfinance'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}><FaTwitter /></a></Box>
            <Box ><a href={'https://t.me/onlygemsfinance'} target={'_blank'} style={{ textDecoration: 'unset', color: 'white' }}><FaPaperPlane /></a></Box>
          </Socials>
        </HamburgerMenu >
      </div >
    </StyledContainer >
  );
}
const StyledContainer = styled(Box)`
    width : 100%;
    background-color : rgb(23,23,23);
    @media screen and (max-width : 1175px){
        >div:nth-child(1)>div:nth-child(1)>div{
            justify-content : start;
            >div{
                width : fit-content;
                margin-left : 30px;
            }
        }
    }
    position : fixed;
    top : 0;
    z-index : 10;
`;

const LogoText = styled(Box)`
    font-family : none;
    font-size : 28px;
    font-weight : 400;
    color : #d3824a;
    font-style : italic;
    -webkit-text-stroke: 0.3px #363636;
    margin-left : 20px;
    >span{
        color : white;
    }
    @media screen and (max-width : 500px){
        display : none;
    }
`;

const Divider = styled(Box)`
    width : 2px;
    height : 34px;
    background-color :  rgba(255,255,255,0.3);
    @media screen and (max-width : 1175px){
        display : none;
    }
`;

const Menus = styled(Box)`
    font-size : 12px;
    color : white;
    display : flex;
    justify-content : space-evenly;
    width : 100%;
    max-width : 500px;
    >div{
        cursor : pointer;
    }
    @media screen and (max-width : 1175px){
        display : ${({ open }) => open ? '' : 'none'};
        align-items : center;
        flex-direction : column;
        max-width : unset;
        font-size : 16px;
        >div{
            padding : 5px;
        }
    }
`;
const Socials = styled(Box)`
    color : white;
    display : flex;
    justify-content : space-evenly;
    width : 100%;
    max-width : 80px;
    >div{
        cursor : pointer;
    }
    @media screen and (max-width : 1175px){
        display : ${({ open }) => open ? '' : 'none'};
        justify-content : center;
        max-width : unset;
        font-size : 24px;
        >div{
            padding : 10px 15px;
        }
    }
`;

const ConnectButton = styled(Box)`
    align-items: center;
    border-radius: 20px;
    width : 130px;
    height : 26px;
    box-shadow: rgb(14 14 44 / 40%) 0px -1px 0px 0px inset;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    justify-content: center;
    opacity: 1;
    height: 32px;
    background-color: rgb(31, 199, 212);
    color: white;
`;

const ConnectedButton = styled(Box)`
    width : 114px;
    height : 26px;
    display : flex;
    justify-content : center;
    align-items : center;
    background-color : white;
    color : #56ced7;
    border-radius : 20px;
    font-size : 11px;
    position : relative;
    overflow : unset;
    >div{
        position : absolute;
        border-radius : 50%;
        width : 29px;
        height : 29px;
        border: 1px solid #56ced7;
        top : -2px;
        left : -10px;
        background-color : white;
    }
    cursor : pointer;
`;

const Hamburger = styled.div`
    font-size : 24px;
    color : white;
    margin-top : 7px;
    margin-left : 20px;
    cursor : pointer;
    display : none;
    @media screen and (max-width : 1175px){
        display : unset;
    }
`;

const HamburgerMenu = styled(Box)`
    transition : all 0.3s;
    height : ${({ open }) => open ? '230px' : '0'};
    overflow : hidden;
    @media screen and (min-width : 1175px){
        display : none;
    }
`;
export default TopBar;
