  "use client";
  import Image from "next/image";
  import toast from "react-hot-toast";
  import { BrowserProvider } from "ethers";
  import { useEffect, useState } from "react";
  import EtheriumLogo from "@/public/assets/etherium.png";
  import styles from "@/app/style/dashboardpage.module.css";
  import {
    useWeb3ModalProvider,
    useWeb3ModalAccount,
  } from "@web3modal/ethers/react";

  import {
    ClipboardIcon as CopyIcon,
    ArrowDownTrayIcon as DownloadIcon,
  } from "@heroicons/react/24/outline";

  export default function DashboardPage() {
    const [truncatedAddress, setTruncatedAddress] = useState("");
    const [transactions, setTransactions] = useState([]);
    const { walletProvider } = useWeb3ModalProvider();
    const [balance, setBalance] = useState(0);
    const { address } = useWeb3ModalAccount();

    useEffect(() => {
      if (address) {
        fetchTransactions(address);
        getBalance(address);
        const truncated = `${address.substring(0, 9)}...${address.substring(
          address.length - 4
        )}`;
        setTruncatedAddress(truncated);
      }
    }, [address]);

    async function onSignMessage() {
      try {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        const signature = await signer?.signMessage('Sign this message');
      } catch (error) {
        if (error.code === 'ACTION_REJECTED' && error.version === '6.11.1') {
          toast.error('Message signing was rejected by the user.');
        } else {
          toast.error('An error occurred while signing the message.');
        }
      }
    }
    
    async function getBalance(address) {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`;
        const requestData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
        console.log(API_KEY, apiUrl)
        const response = await fetch(apiUrl, requestData);
        const data = await response.json();
        setBalance(data.result);
      } catch (error) {
        toast.error("Error fetching transactions. Please try again later.");
      }
    }

    async function fetchTransactions(address) {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=92649034&sort=asc&apikey=${API_KEY}`;
        const requestData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(apiUrl, requestData);
        const data = await response.json();
        if (data.result && Array.isArray(data.result)) {
          setTransactions(data.result);
        } else {
          toast.error(
            "Error fetching transactions. Unexpected data format. Please try again later."
          );
          setTransactions([]);
        }
      } catch (error) {
        toast.error("Error fetching transactions. Please try again later.");
      }
    }

    function copyToClipboard() {
      toast.success("Copied to clipboard");
      navigator.clipboard.writeText(address);
    }

    const calculateTax = (value, gasPrice, gasUsed) => {
      const taxValue = (parseFloat(value) * 0.1) / (parseFloat(gasPrice) * parseFloat(gasUsed));
      return taxValue.toFixed(2);
    };

    const downloadPdf = () => {
      const doc = new jsPDF();
      doc.text("Transactions", 10, 10);
      let yPos = 20;
      transactions.forEach((tx, index) => {
        const tax = calculateTax(tx.value, tx.gasPrice, tx.gasUsed);
        
        doc.text(`Transaction ${index + 1}: ${tx.value} | Tax: ${tax}`, 10, yPos);
        yPos += 10;
      });
      doc.setFont("helvetica");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
    
      doc.save("tax.pdf");
    };

    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardBar}>
          <div className={styles.dashboardAmount}>
            <h4>Wallet balance</h4>
            <h1>{balance}</h1>
          </div>
          <div className={styles.AccountDetails}>
            <Image
              className={styles.logo}
              src={EtheriumLogo}
              alt="logo icon"
              height={30}
              priority
            />
            {truncatedAddress && (
              <div className={styles.AccountDetailsInfo}>
                <h5>{truncatedAddress}</h5>
                <CopyIcon
                  onClick={copyToClipboard}
                  className={styles.copyIcon}
                  alt="tax icon"
                />
              </div>
            )}
          </div>
          <button className={styles.signBtn} onClick={() => onSignMessage()}>
            Sign Message
          </button>
        </div>
        <div className={styles.barTransaction}>
          <h1>Transactions</h1>

          <div className={styles.cardTransactionContainer}>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <div key={index} className={styles.cardTransactionWrapper}>
                  <div className={styles.cardTransaction}>
                    <h1>{tx.value}</h1>
                    <span>Tax:  {calculateTax(tx.value, tx.gasPrice, tx.gasUsed)}</span>
                  </div>
                  <div
                    className={styles.taxReport}
                    onClick={() => onSignMessage()}
                  >
                    <DownloadIcon
                      onClick={() => downloadPdf()}
                      className={styles.taxReportIcon}
                      alt="tax icon"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.cardNoTransactionWrapper}>
                <div className={styles.taxNoReport}>0</div>
                <div className={styles.cardNoTransaction}>
                  <span>No transactions available</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
