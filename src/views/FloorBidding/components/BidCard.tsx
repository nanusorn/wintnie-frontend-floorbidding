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
    ExpandableLabel, BalanceInput,
} from '@pancakeswap/uikit'
import {useTranslation} from '@pancakeswap/localization'
import {BigNumber} from '@ethersproject/bignumber'
import {Zero} from '@ethersproject/constants'
import {parseUnits} from '@ethersproject/units'
// import {useApiContract, useMoralis} from "react-moralis";
import useCatchTxError from "../../../hooks/useCatchTxError";
import {useGetTestOwner} from "../hooks/useGetTestOwner";
import {getFloorBiddingAddress} from "../../../utils/addressHelpers";
import floorBiddingAbi from "../../../config/abi/floorBidding.json";
import Moralis from "moralis";

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({theme}) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-template-columns: auto 1fr;
  }
`

const StyledCard = styled(Card)`
  width: 100%;

  ${({theme}) => theme.mediaQueries.sm} {
    width: 520px;
  }

  ${({theme}) => theme.mediaQueries.md} {
    width: 500px;
  }
`

const PreviousWrapper = styled.div`
  background: ${({theme}) => theme.colors.background};
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
        return {key: 'Insufficient %symbol% balance', disabled: true}
    }

    if (value.eq(0)) {
        return {key: 'Enter an amount', disabled: true}
    }

    return {key: 'Confirm', disabled: value.lt(minBetAmountBalance)}
}

const BidCard = () => {
    const chainId = 97;
    const {t} = useTranslation();
    // const {isAuthenticated} = useMoralis();
    const [bucketBalance, setBucketBalance] = useState('0');
    const [bidValue, setBidValue] = useState('');
    const [errorMessage] = useState(null);
    const valueAsBn = getValueAsEthersBn(bidValue);
    const {key, disabled} = getButtonProps(valueAsBn, Zero, BigNumber.from(0));
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);
    // const showFieldWarning = isAuthenticated && valueAsBn.gt(0) && errorMessage !== null;
    const {loading: isTxPending} = useCatchTxError()
    const {isContractOwner} = useGetTestOwner();

    const handleInputChange = () => {

    }

    const handleBidding = async () => {
        console.log("submit Bidding called");
        // setIsSubmittingBid(true);
        // await Moralis.enableWeb3()
        // const options = {
        //     contractAddress: getFloorBiddingAddress(chainId),
        //     functionName: "bet",
        //     abi: floorBiddingAbi,
        //     chain: "bsc testnet",
        //     params: {
        //         // gameType: BigNumber.from(0),
        //         // number: BigNumber.from(3),
        //         gameType: 0,
        //         number: 4,
        //     }
        // };
        // await Moralis.executeFunction(options);
        // setIsSubmittingBid(false);
    }

    return (
        <StyledCard>
            <CardHeader p="16px 24px">
                <Flex justifyContent="space-between">
                    <Heading mr="12px">{t('Floor Bidding')}</Heading>
                    <Text>Game type: 0, </Text>
                </Flex>
            </CardHeader>
            <CardBody>
                <Grid>

                    <Flex justifyContent={['left', null, null, 'flex-start']}>
                        <Text textAlign="left" color="textSubtle">
                            {t('Session ID')}
                        </Text>
                    </Flex>
                    <Flex flexDirection="column" mb="18px">
                        <Heading color="secondary">{bucketBalance}</Heading>
                    </Flex>

                    <Flex justifyContent={['left', null, null, 'flex-start']}>
                        <Text textAlign="left" color="textSubtle">
                            {t('Session End At')}
                        </Text>
                    </Flex>
                    <Flex flexDirection="column" mb="18px">
                        <Heading color="secondary">Aug 11, 2022 00:00 AM</Heading>
                    </Flex>

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
                            value={bidValue}
                            onUserInput={handleInputChange}
                            // isWarning={showFieldWarning}
                            // inputProps={{disabled: !isAuthenticated || isTxPending}}
                            // className={!isAuthenticated || isTxPending ? '' : 'swiper-no-swiping'}
                        />
                    </Flex>
                </Grid>
                <Box mb="8px">
                    <Button
                        width="100%"
                        disabled={isContractOwner}
                        // className={!isAuthenticated ? '' : 'swiper-no-swiping'}
                        onClick={handleBidding}
                        // isLoading={isTxPending}
                        isLoading={isSubmittingBid}
                        // endIcon={isTxPending ? <AutoRenewIcon color="currentColor" spin /> : null}
                    >
                        {t('Submit Your Bid')}
                    </Button>
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
