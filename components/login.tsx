import { useState } from "react";
import styles from "../styles/Home.module.css";
import { connectSmartWallet } from "../lib/wallet";
import { Connected } from "./connected";

export const Login = () => {
    const [signer, setSigner] = useState<any>(undefined);
    const [password, setPassword] = useState<string>("");
    const [loadingStatus, setLoadingStatus] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const connectWallet = async () => {
        try {
            setIsLoading(true);
            const wallet = await connectSmartWallet(password, (status) => setLoadingStatus(status));

            const s = await wallet.getSigner();
            setSigner(s);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    
    return signer ? (
        <div>
            <Connected signer={signer} />
        </div>
    ) : isLoading ? (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <p>{loadingStatus}</p>
            </div>
        </div>
    ) : (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1>Login</h1>
                <div>
                    <p>Enter password to access/create account</p>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => connectWallet()}
                >Login</button>
            </div>
        </div>
    )
};