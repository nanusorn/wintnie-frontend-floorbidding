import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { useTranslation } from '@pancakeswap/localization'
import Trans from './Trans'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'
import {useEffect, useState} from "react";

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const handleActive = useActiveHandle()
  const { authenticate, isAuthenticated, logout, user } = useMoralis()
  const [ buttonCaption, setButtonCaption ] = useState("Connect Wallet")

  const handleClick = () => {
    if (isAuthenticated) {
      logout()
      return
    }

    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      authenticate({ signingMessage: 'Authorize linking of your wallet' })
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      const account = user!.get("ethAddress")
      const ellipsis = true
      const accountEllipsis = account
        ? ellipsis
          ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}`
          : account
        : null;
      setButtonCaption(accountEllipsis)
    } else {
      setButtonCaption("Connect wallet")
    }
  }, [isAuthenticated, setButtonCaption])

  return (
    <Button onClick={handleClick} {...props}>
      {buttonCaption}
    </Button>
  )
}

export default ConnectWalletButton
