"use client";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Logo from "@/public/assets/logo.png";
import { useWeb3Modal, useDisconnect } from "@web3modal/ethers/react";
import styles from "@/app/style/dashboard.module.css";
import { usePathname, useRouter } from "next/navigation";

import {
  CreditCardIcon as TransactionIcon,
  RectangleGroupIcon as DashboardIcon,
  ArrowLeftEndOnRectangleIcon as LogoutIcon,
} from "@heroicons/react/24/outline";

export default function DashboardComponent() {
  const { disconnect } = useDisconnect();
  const { close } = useWeb3Modal();
  const pathname = usePathname();
  const router = useRouter();

  const SignOut = () => {
    toast.success("Disconnected");
    localStorage.removeItem("token");
    router.push("/authentication/connect", { scroll: false });
  };

  return (
    <div className={styles.dashContainer}>
      <Image
        className={styles.logo}
        src={Logo}
        alt="logo icon"
        height={80}
        priority
      />
      <Link href="/page/dashboard" className={styles.dashLinkContainer}>
        <div
          className={`${styles.innerDashLink} ${
            pathname === "/page/dashboard" || pathname === "/"
              ? styles.activeDash
              : ""
          }`}
        >
          <DashboardIcon className={styles.dashIcon} alt="dashboard icon" />
          <h1>Dashboard</h1>
        </div>
      </Link>
      <Link
        href="/page/tax"
        className={styles.dashLinkContainer}
      >
        <div
          className={`${styles.innerDashLink} ${
            pathname === "/page/tax" ? styles.activeDash : ""
          }`}
        >
          <TransactionIcon className={styles.dashIcon} alt="calculated icon" />
          <h1>calculate tax</h1>
        </div>
      </Link>

      <div
        className={`${styles.innerDashLink} ${styles.logOutLink}`}
        onClick={() =>
          close()
            .then(() => disconnect())
            .then(() => SignOut())
        }
        
      >
        <LogoutIcon className={styles.dashIcon} alt="logout icon" />
        <h1>Logout</h1>
      </div>
    </div>
  );
}
