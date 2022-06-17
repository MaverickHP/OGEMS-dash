import { useEffect, useState, useCallback, useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation, useHistory } from "react-router-dom";
import { useAddress, useWeb3Context } from "./hooks/web3Context";

import Pool from "./views/Pool";
import Tracker from './views/Swap/Swap'
import TopBar from "./components/TopBar/TopBar";
import { ethers } from "ethers";
import axios from "axios";

import "./style.scss";

import { OGEM_ADDR, OGEM_TRACKER_ADDR, OGEM_BNB_ADDR, MANUAL_LOCK, LOCK_ADDR } from './abis/address';
import OnlyGemsFinanceDividendTracker from './abis/OnlyGemsFinanceDividendTracker.json';
import PancakePairABI from './abis/PancakePairABI.json';
import ERC20ABI from './abis/ERC20ABI.json';
import ManualABI from './abis/ManualABI.json';
import LockABI from './abis/LockABI.json';
import Notification from "./components/Notification";


let trackerid = null, txid = null, poolid = null;

function App() {
  const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();
  const address = useAddress();

  const [notification, setNotification] = useState(null);
  const [dividendInfo, setDividendInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [withdrawn, setWithdrawn] = useState(null);
  const [tokentxlist, setTokenTxList] = useState(null);
  const [reserves, setReserves] = useState(null);
  const [payouttxlist, setPayoutTxList] = useState(null);
  const [tokenwholetxlist, setTokenWholeTxList] = useState(null);

  const [manuallockdata, setManualLockData] = useState({ _address: MANUAL_LOCK });
  const [lockdata, setLockData] = useState([{ _address: LOCK_ADDR }, { _address: LOCK_ADDR }]);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(msg => {
        if (msg.type === 'error') {
          setNotification(msg)
        }
      });

    } else {
      // then user DOES NOT have a wallet
    }

    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
  }, []);


  async function fetchTrackerData() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org')
      if (!provider) return;
      const trackerContract = new ethers.Contract(OGEM_TRACKER_ADDR, OnlyGemsFinanceDividendTracker, provider);
      let _dividendInfo = { lastClaimTime: new Date().getTime() / 1000 }, _withdrawn = '0';
      if (address) {
        const _lastClaimTime = await trackerContract.lastClaimTimes(address);
        _dividendInfo.lastClaimTime = _lastClaimTime;
        _withdrawn = (await trackerContract.withdrawnDividendOf(address) / Math.pow(10, 18)).toString();
      }
      setDividendInfo(_dividendInfo);
      setWithdrawn(_withdrawn);
    }
    catch (error) {
      console.log(error);
    }
  }

  async function fetchTokenInfo() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org')
      if (!provider) return;
      const tokenContract = new ethers.Contract(OGEM_ADDR, ERC20ABI, provider);
      const totalSupply = await tokenContract.totalSupply() / Math.pow(10, 9);
      let balance = '0';
      if (address)
        balance = (await tokenContract.balanceOf(address) / Math.pow(10, 9)).toString()
      const price = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${OGEM_ADDR}`);
      setTokenInfo({ name: 'ShitFace Inu', decimal: 18, symbol: 'SFINU', price: price.data.data, totalSupply, balance });
    }
    catch (error) {
      console.log(error);
    }
  }

  async function fetchLiquidityInfo() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org')
      if (!provider) return;
      const pairContract = new ethers.Contract(OGEM_BNB_ADDR, PancakePairABI, provider);
      let _reserves = await pairContract.getReserves(), reserves = { _reserve0: 0, _reserve1: 0 };
      console.log(_reserves);
      reserves._reserve0 = (_reserves._reserve0 / Math.pow(10, 9)).toString();
      reserves._reserve1 = (_reserves._reserve1 / Math.pow(10, 18)).toString();
      console.log(reserves);
      setReserves(reserves);
    }
    catch (error) {
      console.log(error);
    }
  }
  async function fetchTokenTotalInfo() {
    console.log('tokeninfo');
    try {
      let txlist = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${OGEM_BNB_ADDR}&contractaddress=${OGEM_ADDR}&page=1&offset=100&sort=desc&apikey=HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND`);
      txlist = txlist.data.result;
      setTokenTxList(txlist);
    }
    catch (error) {
      console.log(error);
    }
    console.log('tokeninfo done');

  }
  async function fetchTokenWholeData() {
    console.log("wholelist");
    try {
      let txlist = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${OGEM_BNB_ADDR}&contractaddress=${OGEM_ADDR}&page=1&offset=10000&sort=desc&apikey=HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND`);
      txlist = txlist.data.result;
      setTokenWholeTxList(txlist);
    }
    catch (error) {
      console.log(error);
    }
    console.log("wholelist done");
  }
  async function fetchPayoutTxList() {
    console.log("payout");
    try {

      let txlist = await axios.get(`https://api.bscscan.com/api?module=account&action=txlist&address=${OGEM_ADDR}&contractAddress=${OGEM_ADDR}&page=1&offset=1000&sort=desc&apikey=HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND`);
      txlist = txlist.data.result;
      let temp = [];
      for (let i = 0; i < txlist.length; i++) {
        if (!txlist[i].input) continue;
        if (txlist[i].input.includes('0x4e71d92d'))
          temp.push(txlist[i]);
      }
      setPayoutTxList(temp);
    } catch (error) {
      console.log(error);
    }
    console.log("payout done");

  }
  async function fetchPoolData(_address) {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org')
      if (!provider) return;
      if (_address === MANUAL_LOCK) {
        const ManualContract = new ethers.Contract(_address, ManualABI, provider);
        const duration = "UNLOCKED";
        const depositFee = (await ManualContract.depositFee() / 100).toString();
        const withdrawFee = (await ManualContract.withdrawFee() / 100).toString();
        let stakingAmount = '0.00000', pendingReward = '0.00000', pendingReflection = '0.00000', allowance = '0';
        if (address) {
          pendingReward = (await ManualContract.pendingReward(address) / Math.pow(10, 9)).toString();

          pendingReflection = Number(await ManualContract.pendingDividends(address) / Math.pow(10, 18)).toString();

          const userinfo = await ManualContract.userInfo(address);
          stakingAmount = Number(userinfo.amount / Math.pow(10, 9)).toString();

          const tokenContract = new ethers.Contract(OGEM_ADDR, ERC20ABI, provider);
          allowance = await tokenContract.allowance(address, _address);
        }

        const rewardPerBlock = await ManualContract.rewardPerBlock();
        let totalStaked = await ManualContract.totalStaked();
        const rate = Number(rewardPerBlock / totalStaked * 36500 * 28800 * 39.25 / 39.23).toFixed(2);
        const bonusEndBlock = await ManualContract.bonusEndBlock();
        const lastRewardBlock = await ManualContract.lastRewardBlock();
        const performanceFee = await ManualContract.performanceFee();
        totalStaked = numberWithCommas((totalStaked / Math.pow(10, 9)).toFixed(0));

        setManualLockData({
          _address,
          allowance,
          duration,
          depositFee,
          withdrawFee,
          pendingReward,
          pendingReflection,
          stakingAmount,
          rate,
          totalStaked,
          endsIn: numberWithCommas((bonusEndBlock - lastRewardBlock).toString()),
          locked: '0',
          performanceFee
        })
      }
      else {
        const lockContract = new ethers.Contract(_address, LockABI, provider);
        let temp = [];
        for (let i = 0; i < 2; i++) {
          const lockupInfo = await lockContract.lockups(i);
          let stakingAmount = '0.00000', pendingReward = '0.00000', pendingReflection = '0.00000', allowance = 0, locked = '0';
          if (address) {
            pendingReward = Number(await lockContract.pendingReward(address, i) / Math.pow(10, 9)).toString();

            pendingReflection = Number(await lockContract.pendingDividends(address, i) / Math.pow(10, 18)).toString();

            const userinfo = await lockContract.userInfo(i, address);
            stakingAmount = Number(userinfo.amount / Math.pow(10, 9)).toString();

            const tokenContract = new ethers.Contract(OGEM_ADDR, ERC20ABI, provider);
            allowance = await tokenContract.allowance(address, _address);

            locked = (userinfo.locked / Math.pow(10, 9)).toFixed(0);
          }
          const performanceFee = await lockContract.performanceFee();
          const rate = Number(lockupInfo.rate / lockupInfo.totalStaked * 36500 * 28800 * 39.25 / 39.23).toFixed(2);
          const bonusEndBlock = await lockContract.bonusEndBlock();
          temp.push({
            _address: _address + ' ' + i,
            allowance,
            duration: lockupInfo.duration + ' Days',
            depositFee: (lockupInfo.depositFee / 100).toString(),
            withdrawFee: (lockupInfo.withdrawFee / 100).toString(),
            pendingReward,
            pendingReflection,
            stakingAmount,
            rate,
            totalStaked: numberWithCommas((lockupInfo.totalStaked / Math.pow(10, 9)).toFixed(0)),
            endsIn: numberWithCommas((bonusEndBlock - lockupInfo.lastRewardBlock).toString()),
            performanceFee,
            locked
          });
        }
        setLockData(temp);
        console.log(temp);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  function numberWithCommas(x) {
    if (!x) return '0';
    const list = x.split('.')
    if (list.length > 1)
      return list[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + list[1];
    return list[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    fetchPoolData(MANUAL_LOCK);
    fetchPoolData(LOCK_ADDR);
    fetchTrackerData();
    if (txid) {
      clearInterval(txid);
    }
    txid = setInterval(function () {
      // fetchTokenTotalInfo();
      fetchPayoutTxList();
      fetchTokenWholeData();
    }, 300000)
    if (trackerid) {
      clearInterval(trackerid);
    }
    trackerid = setInterval(function () {
      fetchTrackerData();
      fetchTokenInfo();
      fetchLiquidityInfo();
    }, 300000)
    if (poolid) {
      clearInterval(poolid);
    }
    poolid = setInterval(function () {
      fetchPoolData(MANUAL_LOCK);
      fetchPoolData(LOCK_ADDR);
    }, 300000)
  }, [address])

  useEffect(() => {
    fetchTokenInfo();
    fetchLiquidityInfo();
    fetchPayoutTxList();
    // fetchTokenTotalInfo();
    if (!tokenwholetxlist || !tokenwholetxlist.length) {
      console.log("!!!!!!!!!");
      fetchTokenWholeData();
    }
  }, [])


  return (
    <Router>

      <TopBar setNotification={setNotification} />

      <Switch>

        <Route exact path="/reward">
          <Tracker
            account={address}
            dividendInfo={dividendInfo}
            tokenInfo={tokenInfo}
            withdrawn={withdrawn}
            tokenwholetxlist={tokenwholetxlist}
            reserves={reserves}
            payouttxlist={payouttxlist}
          />

        </Route>
        <Route exact path="/pools">
          <Pool
            tokenInfo={tokenInfo}
            account={address}
            pooldatas={[manuallockdata, lockdata[0], lockdata[1]]}
            fetchPoolData={fetchPoolData}
            setNotification={setNotification}
          />
        </Route>
        <Route exact path="/">
          <Redirect to="reward" />
        </Route>
      </Switch>
      <Notification data={notification} />
    </Router>
  );
}

export default App;
