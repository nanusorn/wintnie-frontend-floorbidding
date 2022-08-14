import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  Text,
  Button,
  Box,
  CardFooter,
  ExpandableLabel,
  BalanceInput,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from '@pancakeswap/localization'
import { FloorBidding } from 'config/constants/types'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import useCatchTxError from '../../../hooks/useCatchTxError'
import { useMoralis } from "react-moralis";
import Moralis from "moralis";

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-template-columns: auto 1fr;
  }
`

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 520px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 500px;
  }
`

const PreviousWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const getValueAsEthersBn = (value: string) => {
  const valueAsFloat = parseFloat(value)
  return Number.isNaN(valueAsFloat) ? Zero : parseUnits(value)
}

const getButtonProps = (value: BigNumber, bnbBalance: BigNumber, minBetAmountBalance: BigNumber) => {
  const hasSufficientBalance = () => {
    if (value.gt(0)) {
      return value.lte(bnbBalance)
    }
    return bnbBalance.gt(0)
  }

  if (!hasSufficientBalance()) {
    return { key: 'Insufficient %symbol% balance', disabled: true }
  }

  if (value.eq(0)) {
    return { key: 'Enter an amount', disabled: true }
  }

  return { key: 'Confirm', disabled: value.lt(minBetAmountBalance) }
}
//
// const TOKEN_BALANCE_CONFIG = {
//   BNB: useGetBnbBalance,
//   CAKE: useGetCakeBalance,
// }

// const dust = parseUnits('0.001', 18)

const BidCard = () => {
  const { t } = useTranslation()
  // const { account } = useWeb3React()
  // const {currentRound} = useFloorBidding()
  // const {endTime, amountCollectedInCake, userTickets, status} = currentRound
  // const { account } = useWeb3React()
  // const minBetAmount = useGetMinBetAmount()
  const [errorMessage] = useState(null)
  // const { currentBiddingId, isTransitioning, currentRound } = useFloorBidding()
  const { isAuthenticated, user } = useMoralis()

  // const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} roundStatus={status} />)
  const [isExpanded, setIsExpanded] = useState(false)
  // const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning
  const [value, setValue] = useState('')
  const [depositValue, setDepositValue] = useState('')

  const valueAsBn = getValueAsEthersBn(value)
  const depositValueAsBn = getValueAsEthersBn(depositValue)
  const showFieldWarning = isAuthenticated && valueAsBn.gt(0) && errorMessage !== null
  const [bucketBalance, setBucketBalance] = useState("999")
  const currentAccount = async () => {
    try {
      console.log(user!.get('ethAddress'))
    } catch (err) {
      console.log(err);
    }
  }
  const getContractOwner = async () => {
    // await Moralis.enableWeb3();
    const ABI = [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ];
    const options = {
      contractAddress: "0x3fC3bc57b2a799Defd0BD0d04D6dF24A661fCEb4",
      functionName: "owner",
      abi: ABI,
      params: {},
    };
    // const contractOwner = await Moralis.executeFunction(options);
    // const currentAddress = user.get('ethAddress');
    // console.log("-----> ", contractOwner);
    // console.log("-----> ", currentAddress);
    // if (contractOwner == currentAddress) {
    //   return true;
    // }
    // return false;
  }
  const [isContractOwner, setIsContractOwner] = useState(false)
  useEffect(() => {
    if (currentAccount() == getContractOwner()) {
      setIsContractOwner(true)
    } else {
      setIsContractOwner(false)
    }
  }, [currentAccount, getContractOwner, setIsContractOwner]);


  // const cakePriceBusd = usePriceCakeBusd()
  // const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  // const endTimeMs = parseInt(endTime, 10) * 1000
  // const endDate = new Date(endTimeMs)
  // const isFloorBiddingOpen = status === FloorBiddingStatus.OPEN
  // const isFloorBiddingOpen = true
  // const status = FloorBiddingStatus.OPEN
  // const userTicketCount = userTickets?.tickets?.length || 0
  const { loading: isTxPending } = useCatchTxError()
  // const { address: predictionsAddress, token } = useConfig()

  // const predictionsContract = usePredictionsContract(predictionsAddress, token.symbol)
  // const useTokenBalance = useMemo(() => {
  //   return TOKEN_BALANCE_CONFIG[token.symbol]
  // }, [token.symbol])

  // const { balance: bnbBalance } = useTokenBalance()

  // const maxBalance = useMemo(() => {
  //   return bnbBalance.gt(dust) ? bnbBalance.sub(dust) : Zero
  // }, [bnbBalance])
  // const balanceDisplay = formatBigNumber(bnbBalance)

  // const { isVaultApproved, setLastUpdated } = useCakeApprovalStatus(token.symbol === 'CAKE' ? predictionsAddress : null)
  // const { handleApprove, pendingTx } = useCakeApprove(
  //   setLastUpdated,
  //   predictionsAddress,
  //   t('You can now start prediction'),
  // )

  // BNB prediction doesn't need approval
  // const doesCakeApprovePrediction = token.symbol === 'BNB' || isVaultApproved

  const handleInputChange = (input: string) => {
    // const inputAsBn = getValueAsEthersBn(input)

    // if (inputAsBn.eq(0)) {
    //   setPercent(0)
    // } else {
    //   const inputAsFn = FixedNumber.from(inputAsBn)
    //   const maxValueAsFn = FixedNumber.from(maxBalance)
    //   const hundredAsFn = FixedNumber.from(100)
    //   const percentage = inputAsFn.divUnsafe(maxValueAsFn).mulUnsafe(hundredAsFn)
    //   const percentageAsFloat = percentage.toUnsafeFloat()
    //
    //   setPercent(percentageAsFloat > 100 ? 100 : percentageAsFloat)
    // }
    setValue(input)
  }

  const handleDepositValueChange = (input: string) => {
    setDepositValue(input)
  }

  // useEffect(() => {
  //   const inputAmount = getValueAsEthersBn(value)
  // }, [value])

  const { key, disabled } = getButtonProps(valueAsBn, Zero, BigNumber.from(0))

  const handleEnterPosition = async () => {
    // const betMethod = position === BetPosition.BULL ? 'betBull' : 'betBear'
    // betMethod;
  }

  const handleBidding = async () => {
    await Moralis.enableWeb3();
    const ABI = [
      {
        "inputs": [
          {
            "internalType": "enum GameType",
            "name": "gameType",
            "type": "uint8"
          },
          {
            "internalType": "uint32",
            "name": "number",
            "type": "uint32"
          }
        ],
        "name": "bet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
    ];
    const options = {
      contractAddress: "0x3fC3bc57b2a799Defd0BD0d04D6dF24A661fCEb4",
      functionName: "bet",
      abi: ABI,
      params: {
        gameType: 0,
        number: 1,
      },
    };
    const result = await Moralis.executeFunction(options);
    console.log("bet result: ", result);
  }

  const handleGetOwner = async () => {
    await Moralis.enableWeb3();
    const ABI = [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ];
    const options = {
      contractAddress: "0x3fC3bc57b2a799Defd0BD0d04D6dF24A661fCEb4",
      functionName: "owner",
      abi: ABI,
      params: {},
    };
    const address = await Moralis.executeFunction(options);
    console.log("result: ", address);
  }

  const handleStartGame = async () => {
    await Moralis.enableWeb3();
    const ABI = [
      {
        "inputs": [
          {
            "internalType": "enum GameType",
            "name": "gameType",
            "type": "uint8"
          }
        ],
        "name": "startGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const options = {
      contractAddress: "0x3fC3bc57b2a799Defd0BD0d04D6dF24A661fCEb4",
      // functionName: "startGame",
      functionName: "startGame",
      abi: ABI,
      params: {
        gameType: 0,
      },
    };
    // const transaction = await Moralis.executeFunction(options);
    // const result = await transaction.value();
    // console.log("Result: ", result);
    const address = await Moralis.executeFunction(options);
    console.log("result: ", address);
  }

  const handleEndGame = async () => {
    await Moralis.enableWeb3()
    const ABI = [{
      inputs: [
        {
          internalType: "enum GameType",
          name: "gameType",
          type: "uint8"
        }
      ],
      name: "endGame",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }];
    const options = {
      contractAddress: "0x3fC3bc57b2a799Defd0BD0d04D6dF24A661fCEb4",
      functionName: "endGame",
      abi: ABI,
      params: {
        gameType: 0,
      },
    };
    const result = await Moralis.executeFunction(options);
    console.log("result: ", result);
  }

  const handleTransfer = async () => {

  }

  // const Logo = useMemo(() => {
  //   return LOGOS[token.symbol]
  // }, [token.symbol])

  // const getPrizeBalances = () => {
  //   if (status === LotteryStatus.CLOSE || status === LotteryStatus.CLAIMABLE) {
  //     return (
  //       <Heading scale="xl" color="secondary" textAlign={['center', null, null, 'left']}>
  //         {t('Calculating')}...
  //       </Heading>
  //     )
  //   }
  //   return (
  //     <>
  //       {prizeInBusd.isNaN() ? (
  //         <Skeleton my="7px" height={40} width={160} />
  //       ) : (
  //         <Balance
  //           fontSize="40px"
  //           color="secondary"
  //           textAlign={['center', null, null, 'left']}
  //           lineHeight="1"
  //           bold
  //           prefix="~$"
  //           value={getBalanceNumber(prizeInBusd)}
  //           decimals={0}
  //         />
  //       )}
  //       {prizeInBusd.isNaN() ? (
  //         <Skeleton my="2px" height={14} width={90} />
  //       ) : (
  //         <Balance
  //           fontSize="14px"
  //           color="textSubtle"
  //           textAlign={['center', null, null, 'left']}
  //           unit=" CAKE"
  //           value={getBalanceNumber(amountCollectedInCake)}
  //           decimals={0}
  //         />
  //       )}
  //     </>
  //   )
  // }

  // const getNextDrawId = () => {
  //   if (status === LotteryStatus.OPEN) {
  //     return `${currentLotteryId} |`
  //   }
  //   if (status === LotteryStatus.PENDING) {
  //     return ''
  //   }
  //   return parseInt(currentLotteryId, 10) + 1
  // }

  // const getNextDrawDateTime = () => {
  //   // if (status === LotteryStatus.OPEN) {
  //   //   return `${t('Draw')}: ${endDate.toLocaleString(locale, dateTimeOptions)}`
  //   // }
  //   return ''
  // }

  return (
    <StyledCard>
      <CardHeader p="16px 24px">
        <Flex justifyContent="space-between">
          <Heading mr="12px">{t('Floor Bidding')}</Heading>
          <Text>#001 / End at Aug 11, 2022, 00:01 AM</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Grid>
          <Flex justifyContent={['left', null, null, 'flex-start']}>
            <Text textAlign="left" color="textSubtle">
              {t('Prize Bucket')}
            </Text>
          </Flex>
          <Flex flexDirection="column" mb="18px">
            <Heading color="secondary">{bucketBalance}</Heading>
          </Flex>

          <Flex justifyContent={['left', null, null, 'flex-start']}>
            <Text textAlign="left" color="textsubtitle">
              {t('Status')}
            </Text>
          </Flex>
          <Flex flexDirection="column" mb="18px">
            <Heading color="green">{t('Winner')}</Heading>
          </Flex>

          <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text textAlign="left" color="textsubtitle">
              {t('Bet your unique lowest')}
            </Text>
          </Flex>
          <Flex flexDirection="column" mb="18px">
            <BalanceInput
              value={value}
              onUserInput={handleInputChange}
              isWarning={showFieldWarning}
              inputProps={{ disabled: !isAuthenticated || isTxPending }}
              className={!isAuthenticated || isTxPending ? '' : 'swiper-no-swiping'}
            />
          </Flex>
        </Grid>
        <Box mb="8px">
          <Button
            width="100%"
            disabled={!isAuthenticated}
            className={!isAuthenticated ? '' : 'swiper-no-swiping'}
            onClick={handleBidding}
            isLoading={isTxPending}
            endIcon={isTxPending ? <AutoRenewIcon color="currentColor" spin /> : null}
          >
            {t(key, { symbol: 'WINT' })}
          </Button>
        </Box>
        <Box mb="8px">
          <Button
            width="50%"
            disabled={!isAuthenticated && !isContractOwner}
            onClick={handleStartGame}
          >
            {"Start Game"}
          </Button>
          <Button
            width="50%"
            disabled={!isAuthenticated && !isContractOwner}
            onClick={handleEndGame}
          >
            {"End Game"}
          </Button>

          <Grid>
            <Flex alignItems="center" justifyContent="space-between" mb="8px">
              <Text textAlign="left" color="textsubtitle">
                {t('Deposit your coin')}
              </Text>
            </Flex>
            <Flex flexDirection="column" mb="18px">
              <BalanceInput
                value={depositValue}
                onUserInput={handleDepositValueChange}
                isWarning={showFieldWarning}
                inputProps={{ disabled: !isAuthenticated || isTxPending }}
                className={!isAuthenticated || isTxPending ? '' : 'swiper-no-swiping'}
              />
            </Flex>
            <Button
              width="50%"
              disabled={!isAuthenticated}
              onClick={handleTransfer}
            >
              {"Transfer to wallet"}
            </Button>
          </Grid>

        </Box>
      </CardBody>
      <CardFooter p="0">
        {isExpanded && <PreviousWrapper>Hello World!!!</PreviousWrapper>}
          <Flex p="8px 24px" alignItems="center" justifyContent="center">
            <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('Hide') : t('Your current round details')}
            </ExpandableLabel>
          </Flex>
      </CardFooter>
    </StyledCard>
  )
}

export default BidCard
