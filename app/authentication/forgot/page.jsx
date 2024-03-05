"use client";

import Image from "next/image"; 
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";  
import logo from "@/public/assets/logo.png"; 
import Loader from "@/app/components/Loader";
import styles from "@/app/style/connect.module.css";
import connectImage from "@/public/assets/connect.png";
import {
  KeyIcon as PasswordIcon,
  EnvelopeIcon as EmailIcon,
} from "@heroicons/react/24/outline";
import Connect from "../connect/page";
export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const handleTermsChange = (e) => setTerms(e.target.checked); 

  const Create = () => {
    router.push("create", { scroll: false });
  };

  const forgotPassword = () => {
    router.push("forgot", { scroll: false });

  };
  
  const Connect = () => {
    router.push("connect");
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target); 
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      toast.success("Account created successfully!  ");
      router.push("page/dashboard", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error("Create an account failed");
    } finally {
      setIsLoading(false);
    }

  }

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
              onClick={Connect}
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
            <form onSubmit={onSubmit} className={styles.formContainer}>
              {/* Email */}
                <div className={styles.authInput}>
                  <EmailIcon
                    className={styles.authIcon}
                    alt="email icon"
                    width={16}
                    height={16}
                  />
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter email to reset"
                  />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.loginButton}
              >
                {isLoading ? <Loader /> : "Reset"}
              </button>
              <p>
                Don&apos;t have an account? <span onClick={Create}>Create an account</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
