import { Flex, Heading } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { PageMeta } from '../../components/Layout/Page'
import PageSection from '../../components/PageSection'
import { GET_TICKETS_BG, TITLE_BG } from '../Lottery/pageSectionStyles'
import Hero from './components/Hero'
import { useTranslation } from '@pancakeswap/localization'
import BidCard from './components/BidCard'

const FloorBiddingPage = styled.div`
  min-height: calc(100vh - 64px);
`

const FloorBidding = () => {
  // const {isDark} = useTheme()
  const { t } = useTranslation()
  // const {isDesktop} = useMatchBreakpointsContext()
  // const {
  //   currentRound: { status, endTime },
  // } = useLottery()
  // const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  // const endTimeAsInt = parseInt(endTime, 10)
  // const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)

  // @ts-ignore
  return (
    <>
      <PageMeta />
      <FloorBiddingPage>
        <PageSection background={TITLE_BG} index={1} hasCurvedDivider={false}>
          <Hero />
        </PageSection>
        <PageSection
          containerProps={{ style: { marginTop: '-30px' } }}
          background={GET_TICKETS_BG}
          concaveDivider
          clipFill={{ light: '#7645D9' }}
          dividerPosition="top"
          index={2}
        >
          <Flex alignItems="center" justifyContent="center" flexDirection="column" pt="24px">
            <Heading scale="xl" color="#ffffff" mb="24px" textAlign="center">
              {t('Bid to win now!')}
            </Heading>
            <BidCard />
          </Flex>
        </PageSection>
      </FloorBiddingPage>
    </>
  )
}

export default FloorBidding
