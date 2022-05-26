import React from 'react'
import styled from 'styled-components'
import { Box } from '@material-ui/core'

const Footer: React.FC = () => {
    return (
        <StyledContainer fontSize={'13px'} color={'#303030'} position={'relative'}>
            <Box display={'flex'} justifyContent={'center'} pt={'calc(100vw / 1921 * 50)'}>
                <a href={'https://twitter.com/OnlyGemsFinance'} target={'_blank'}>
                    <Box width={'calc(100vw / 1921 * 55)'} height={'calc(100vw / 1921 * 50)'}>
                        <img src={'/images/twitter.png'} width={'100%'} height={'100%'} />
                    </Box>
                </a>
                <Box mr={'calc(100vw / 1921 * 50)'} />
                <a href={'https://t.me/onlygemsfinance'} target={'_blank'}>
                    <Box width={'calc(100vw / 1921 * 55)'} height={'calc(100vw / 1921 * 55)'}>
                        <img src={'/images/telegram.png'} width={'100%'} height={'100%'} />
                    </Box>
                </a>
            </Box>
            <Box width={'100%'}>
                <Menus maxWidth={'calc(100vw / 1921 * 400)'} mx={'auto'} display={'flex'} justifyContent={'space-between'} mt={'calc(100vw / 1921 * 35)'}>
                    <Box>Calculator</Box>
                    <a href={'https://onlygems-finance.gitbook.io/onlygems-finance/'} style={{ textDecoration: 'none', color: 'white' }}><Box>Whitepaper</Box></a>
                    <Box>FAQs</Box>
                </Menus>
            </Box>
            <Box width={'100%'}>
                <Box textAlign={'center'} mt={'calc(100vw / 1921 * 20)'} pb={'calc(100vw / 1921 * 10)'} color={'white'} >
                    OnlyGems Finance © Inu All rights reserved
                </Box>
            </Box>
        </StyledContainer>
    );
}

const StyledContainer = styled(Box)`
    background-image : url('/images/footer/Footer.png');
    background-size : 100% 100%;
    width : 100%;
    height : calc(100vw / 1921 * 229);
    font-size : calc(100vw / 1921 * 16);
    @media screen and (max-width : 500px){
        font-size : calc(100vw / 500 * 16)!important;
        background-size : unset;
        background-position : center;
        height : fit-content;
        >div:nth-child(1)>div:nth-child(1){
            width : calc(100vw / 500 * 50);
            height : calc(100vw / 500 * 50);
        }
        >div:nth-child(1)>div:nth-child(2){
            margin-right : calc(100vw / 500 * 50);
        }
        >div:nth-child(1)>div:nth-child(3){
            width : calc(100vw / 500 * 50);
            height : calc(100vw / 500 * 50);
        }
    }
`

const Menus = styled(Box)`
    color : white;
    font-weight : 700;
    font-size : calc(100vw / 1921 * 16);
    @media screen and (max-width : 500px){
        flex-direction : column;
        align-items : center;
        max-width : unset;
        >div{
            margin-bottom : 10px;
        }
        font-size : calc(100vw / 500 * 16);
    }
`;
export default Footer;