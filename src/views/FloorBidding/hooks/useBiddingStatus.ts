import {useApiContract, useMoralis} from "react-moralis";
import {getFloorBiddingAddress} from "../../../utils/addressHelpers";
import floorBiddingAbi from "../../../config/abi/floorBidding.json";
import {useCallback, useEffect, useRef, useState} from "react";
import {GameStruct, GameStructOutput} from "../../../config/abi/types/FloorBidding";
import {BigNumber, BigNumberish} from "ethers";
import refresh from "@pancakeswap/uikit/src/components/Svg/Icons/Refresh";

export const useBiddingStatus = (gameType: string) => {
    const chainId = 97;
    const {isInitialized} = useMoralis();
    const [activateTimer, setActivateTimer] = useState(true)
    const [gameStatus, setGameStatus] = useState<GameStructOutput | null>({
        gameType: 0,
        gameId: 0,
        duration: 0,
        price: BigNumber.from('0'),
        startedAt: BigNumber.from('0'),
        prize: BigNumber.from('0'),
        gameStatus: BigNumber.from('0'),
    });
    const [refreshStatus, setRefreshStatus] = useState(true);
    const {runContractFunction: fetchGameStatus, data, isFetching} = useApiContract({
        address: getFloorBiddingAddress(chainId),
        functionName: "getGame",
        abi: floorBiddingAbi,
        chain: "bsc testnet",
        params: {
            gameType: BigNumber.from(gameType),
        },
    });
    const timer = useRef<ReturnType<typeof setTimeout>>(null)

    const startTimer = useCallback(() => {
        timer.current = setInterval(() => {
            setRefreshStatus(true);
        }, 30000)
    }, [timer])

    useEffect(() => {
        if (isInitialized && refreshStatus) {
            setRefreshStatus(false)
            fetchGameStatus();
        }
        if (activateTimer) {
            startTimer();
            setActivateTimer(false);
        }
    }, [isInitialized, refreshStatus, activateTimer]);

    useEffect(() => {
        if (isFetching) {
            if (data!=null) {
                setGameStatus({
                    gameType: +data[0],
                    gameId: +data[1],
                    duration: +data[2],
                    price: BigNumber.from(data[3]),
                    startedAt: BigNumber.from(data[4]),
                    prize: BigNumber.from(data[5]),
                    gameStatus: +data[6],
                });
            }
        }
    }, [data, isFetching]);

    return {gameStatus: gameStatus};
}
