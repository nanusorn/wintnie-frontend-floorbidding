import { useEffect, useState } from 'react'
import Moralis from 'moralis'
import { Button } from '@pancakeswap/uikit'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'

const LoginPage = () => {
  const { isAuthenticated, authenticate, logout, user } = useMoralis()
  const [buttonTitle, setButtonTitle] = useState(isAuthenticated ? 'Log out' : 'Login using Metamask')
  const Web3Api = useMoralisWeb3Api()
  const [nativeBalance, setNativeBalance] = useState('0.0')

  const fetchTokenBalances = async () => {
    try {
      console.log(user.get('ethAddress'))
      const balances = await Web3Api.account.getNativeBalance({
        chain: 'bsc testnet',
        address: user.get('ethAddress'),
      })
      console.log(balances)
      setNativeBalance(balances.balance)
    } catch (err) {
      console.error(err)
    }
  }

  const sendEth = async () => {
    try {
      await Moralis.Web3.enableWeb3()
      const result = await Moralis.Web3.transfer({
        type: 'native',
        amount: Moralis.Units.ETH('0.1'),
        receiver: '0x860AC8a454072aa3506Fceb326FEe8b315308F32',
      })
      console.log(result)
      alert('Transfer of funds succeeded!')
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      setButtonTitle('Log out')
    } else {
      setButtonTitle('Login using Metamask')
    }
  }, [isAuthenticated, user, setButtonTitle])

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1>
        <title>Moralis IO tutorial</title>
        <meta name="description" content="A basic tutorial of Moralis IO" />
        <link rel="icon" href="/favicon.ico" />
      </h1>
      <Button
        onClick={() => {
          if (isAuthenticated) {
            logout()
          } else {
            authenticate({ signingMessage: 'Authorize linking of your wallet' })
              .then(() => {
                console.log(user.get('ethAddress'))
                fetchTokenBalances()
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        }}
      >
        {buttonTitle}
      </Button>
      <Button
        onClick={() => {
          sendEth()
        }}
        disabled={!isAuthenticated}
      >
        Transfer
      </Button>
      <Button
        onClick={() => {
          fetchTokenBalances()
        }}
        disabled={!isAuthenticated}
      >
        {nativeBalance}
      </Button>
    </div>
  )
}

export default LoginPage
