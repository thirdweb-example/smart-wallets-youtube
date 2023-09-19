import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
import { Signer } from "ethers";
import Navbar from "./navbar";
import UserProfile from "./profile";

export const Connected = ({
    signer,
}: {
    signer: Signer;
}) => {
    return (
        <ThirdwebSDKProvider
            signer={signer}
            activeChain={"mumbai"}
            clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        >
            <ConnectedComponents />
        </ThirdwebSDKProvider>
    )
};

const ConnectedComponents = () => {
    return (
        <div>
            <Navbar />
            <UserProfile />
        </div>
    )
};