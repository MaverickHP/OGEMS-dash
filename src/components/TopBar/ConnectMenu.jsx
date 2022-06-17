import { useEffect, useState } from "react";
import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link, Slide, Fade } from "@material-ui/core";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import styled from 'styled-components'

function ConnectMenu({ theme, ispool, width, height, setNotification }) {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const address = useAddress();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);

  let ellipsis = address
    ? address.slice(0, 2) +
    "..." +
    address.substring(address.length - 4, address.length)
    : "Connect Wallet";

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  function onConnect() {
    connect().then(msg => {
      if (msg.type === 'error') {
        setNotification(msg)
      }
    });
  }

  if (isConnected) {
    buttonText = ellipsis;
    clickFunc = disconnect;
  }


  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div
      className="wallet-menu"
      id="wallet-menu"
      style={{ width: '100%' }}
    >
      {buttonText === 'Connect Wallet' && !ispool ? <ConnectButton

        onClick={() => isConnected ? disconnect() : onConnect()}      >
        {buttonText}
      </ConnectButton> : ''}

      {buttonText !== 'Connect Wallet' && !ispool ? <ConnectedButton

        onClick={() => isConnected ? disconnect() : onConnect()}
      >
        <Box />
        {buttonText}
      </ConnectedButton> : ''}

      {ispool && buttonText === 'Connect Wallet' ? <EnableButton

        onClick={() => isConnected ? disconnect() : onConnect()}
        width={width}
        height={height}
      >
        <Box />
        {buttonText}
      </EnableButton> : ''
      }
    </div>
  );
}

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
    transition : all 0.3s;
    :hover{
      transform : translateY(-2px);
    }
`;

const ConnectedButton = styled(Box)`
    width : 114px;
    height : 26px;
    display : flex;
    justify-content : center;
    align-items : center;
    background-color : #292929;
    color : white;
    border-radius : 20px;
    font-size : 11px;
    position : relative;
    overflow : unset;
    border: 1px solid #b7e2fa;
    >div{
        position : absolute;
        border-radius : 50%;
        width : 27px;
        height : 27px;
        border: 1px solid #b7e2fa;
        top : -2px;
        left : -10px;
        background-color : #292929;
    }
    cursor : pointer;
`;

const EnableButton = styled.button`
    font-family : 'Poppins';
    width : ${({ width }) => width};
    height : ${({ height }) => height};
    color : #494949;
    border-radius : 7px;
    background-color : #e2f4fe;
    cursor : pointer;
    padding : 0;
    outline : none;
    border: none;
    >div{
        display : flex;
    justify-content : center;
    align-items : center;
    }
    :disabled{
        color : rgb(150,150,150);
        background-color :  #e2f4feb5;
        cursor : not-allowed;
    }
`;
export default ConnectMenu;
