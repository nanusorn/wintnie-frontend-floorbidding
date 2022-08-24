import {useApiContract, useMoralis} from "react-moralis";
import {getFloorBiddingAddress} from "../../../utils/addressHelpers";
import floorBiddingAbi from "../../../config/abi/floorBidding.json";
import {useEffect, useState} from "react";
import {GameStruct} from "../../../config/abi/types/FloorBidding";
import {BigNumber, BigNumberish} from "ethers";

export const useBiddingStatus = (gameType: string) => {
    const chainId = 97;
    const {isInitialized} = useMoralis();
    const [gameStatus, setGameStatus] = useState<GameStruct | null>(null);
    const {runContractFunction: fetchGameStatus, data, isFetching} = useApiContract({
        address: getFloorBiddingAddress(chainId),
        functionName: "getGame",
        abi: floorBiddingAbi,
        chain: "bsc testnet",
        params: {
            gameType: BigNumber.from(gameType),
        },
    });

    useEffect(() => {
        if (isInitialized) {
            fetchGameStatus();
        }
    }, [isInitialized]);

    useEffect(() => {
        if (isFetching) {
            if (data!=null) {
                setGameStatus({
                    gameType: BigNumber.from(data[0]),
                    gameId: BigNumber.from(data[1]),
                    price: BigNumber.from(data[2]),
                    startedAt: BigNumber.from(data[3]),
                    duration: BigNumber.from(data[4]),
                    prize: BigNumber.from(data[5]),
                    status: BigNumber.from(data[6]),
                });
            }
        }
    }, [data, isFetching]);

    return {gameStatus: gameStatus};
}
