import { ThirdwebNftMedia, Web3Button, useAddress, useContract, useNFTs, useOwnedNFTs, useTokenBalance } from "@thirdweb-dev/react";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { MONSTER_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../const/addresses";

export default function UserProfile() {
    const address = useAddress();
    const {
        contract: monsterContract
    } = useContract(MONSTER_CONTRACT_ADDRESS);
    const {
        contract: tokenContract
    } = useContract(TOKEN_CONTRACT_ADDRESS);

    const {
        data: ownedMonsters,
        isLoading: isOwnedMonstersLoading,
    } = useOwnedNFTs(monsterContract, address);
    const {
        data: tokenBalance,
        isLoading: isTokenBalanceLoading,
    } = useTokenBalance(tokenContract, address);
    const {
        data: nfts,
        isLoading: isNFTsLoading,
    } = useNFTs(monsterContract);

    function truncateAddress(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    const [isShopModalOpen, setIsShopModalOpen] = useState(false);
    const [selectedMonster, setSelectedMonster] = useState<boolean>(false);
    const [monsterTokenId, setMonsterTokenId] = useState<string>();

    return (
        <div className={styles.container}>
            {address && (
                <>
                    <h1>Trainer Profile</h1>
                    <h3>Welcome back <span>{truncateAddress(address!)}</span></h3>
                    <div className={styles.tokenBalance}>
                        {!isTokenBalanceLoading && (
                            <p>Token Balance: {tokenBalance?.displayValue}</p>
                        )}
                        <button
                            className={styles.shopButton}
                            onClick={() => setIsShopModalOpen(true)}
                        >Shop Monsters</button>
                    </div>
                    <h3>Your monsters:</h3>
                    <div className={styles.monsterGrid}>
                        {!isOwnedMonstersLoading && (
                            ownedMonsters && ownedMonsters.length > 0 ? (
                                ownedMonsters.map((monster: any, index: number) => (
                                    <div 
                                        key={index}
                                        className={styles.monsterCard}
                                    >
                                        <ThirdwebNftMedia
                                            metadata={monster.metadata}
                                            style={{
                                                overflow: "hidden",
                                                borderRadius: "6px",
                                            }}
                                        />
                                        <p>{monster.metadata.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No Monsters</p>
                            )
                        )}
                    </div>
                    {isShopModalOpen && (
                        <div 
                            className={styles.modalContainer}
                        >
                            <div className={styles.shopModal}>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setIsShopModalOpen(false)}
                                >X</button>
                                <div>
                                    <h1>Shop Monsters</h1>
                                    <h3>Select monster to buy:</h3>
                                </div>
                                <div className={styles.monsterGrid}>
                                    {!isNFTsLoading && (
                                        nfts && nfts.slice(1).map((monster: any, index: number) => (
                                            <div 
                                                key={index}
                                                className={styles.monsterCard}
                                                onClick={() => {
                                                    setSelectedMonster(true);
                                                    setMonsterTokenId(monster.metadata.id);
                                                    console.log(monster.metadata.id);
                                                }}
                                                style={{
                                                    backgroundColor: selectedMonster && monsterTokenId === monster.metadata.id ? "#333" : "#1b1b1b",
                                                }}
                                            >
                                                <ThirdwebNftMedia
                                                    metadata={monster.metadata}
                                                    style={{
                                                        overflow: "hidden",
                                                        borderRadius: "6px",
                                                    }}
                                                />
                                                <p
                                                    style={{
                                                        backgroundColor: selectedMonster && monsterTokenId === monster.metadata.id ? "#333" : "#1b1b1b",
                                                    }} 
                                                >{monster.metadata.name}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className={styles.claimButton}>
                                    <Web3Button
                                        contractAddress={MONSTER_CONTRACT_ADDRESS}
                                        action={(contract) => contract.erc1155.claim(parseInt(monsterTokenId!), 1)}
                                        onSuccess={() => {
                                            setSelectedMonster(false);
                                            setMonsterTokenId(undefined);
                                            setIsShopModalOpen(false);
                                        }}
                                    >Claim Monster</Web3Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
};