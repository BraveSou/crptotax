"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  KeyIcon as PasswordIcon,
  EnvelopeIcon as EmailIcon,
} from "@heroicons/react/24/outline";
import Loader from "@/app/components/Loader";
import styles from "@/app/style/connect.module.css";
import connectImage from "@/public/assets/connect.png";
import logo from "@/public/assets/logo.png";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);


    try {
      const response = await fetch(`${SERVER_API}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      router.push("/page/dashboard");
      toast.success("Welcome back! ");
      setFormData({
        email: "",
        password: "",
      });
      setTerms(false);
    } catch (error) {
      if (error.response === 400) {
        toast.error(error.message);
      } else if (error.response === 404) {
        toast.error("User not found");
      } else {
        toast.error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Password */}
              <div className={styles.authInput}>
                <PasswordIcon
                  className={styles.authIcon}
                  alt="new password icon"
                  width={16}
                  height={16}
                />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formChange}>
                <div className={styles.termsContainer}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={terms}
                    onChange={handleTermsChange}
                    required
                  />
                  <label htmlFor="terms">Accept terms and condition</label>
                </div>
                <span onClick={forgotPassword}>Forgot Password</span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.loginButton}
              >
                {isLoading ? <Loader /> : "Login"}
              </button>
              <p>
                Don&apos;t have an account?{" "}
                <span onClick={Create}>Create an account</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
