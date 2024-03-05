"use client";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import connectImage from "@/public/assets/connect.png";
import styles from "@/app/style/connect.module.css";
import { useRouter } from "next/navigation";
import logo from "@/public/assets/logo.png";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Image from "next/image";

export default function Connect() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    if (isConnected) {
      router.push("/page/dashboard");
      toast.success("Connected!");
    } else {
      toast.error("Connection failed, try again!");
    }
  }, [isConnected, router]);

  const handleSignin = () => {
    router.push("create");
  };

  return (
    <div className={styles.connectContainer}>
      <div className={styles.connectImgWrapper}>
        <Image
          className={styles.connectImg}
          src={connectImage}
          alt="Web3 tax"
          layout="fill"
          quality={100}
          objectFit="contain"
          priority
        />
      </div>
      <div className={styles.connectInfo}>
        <div className={styles.connectInfoWrap}>
          <div className={styles.profileConnect}>
            <Image
              className={styles.profileImage}
              src={logo}
              alt="profile image"
              width={50}
              height={50}
              priority
            />
            <div className={styles.profileInfo}>
              <h1>Crypto tax</h1>
              <span>Taxation made easier</span>
            </div>
          </div>
          <h1>
            Welcome to crypto tax, <br /> a <span>taxation solution</span> for
            your crypto transactions
          </h1>
          <div className={styles.ConnectButtonWrapper}>
            <h2>Connect your wallet to login</h2>
            <div className={styles.ConnectButtonContain}>
              <button
                className={styles.connectButton}
                onClick={() => open()}
              >
                {isConnected ? "Connected" : "Connect Wallet"}
              </button>

              <h2>or</h2>
              <button className={styles.loginButton} onClick={handleSignin}>
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
