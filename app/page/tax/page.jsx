"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";
import styles from "@/app/style/dashboardpage.module.css";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf"; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import {
  ArrowDownTrayIcon as DownloadIcon,
} from "@heroicons/react/24/outline";

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
       display: false,
    },
    tooltips: {
      callbacks: {
         label: function(tooltipItem) {
                return tooltipItem.yLabel;
         }
      }
  },
    title: {
      display: false,
    },

  },
};

const labels = ["tax rate"];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [ethToUsdRate, setEthToUsdRate] = useState(0); 
  const [graphData, setGraphData] = useState({ labels, datasets: [] });

  useEffect(() => {
    const fetchGraphData = async () => {
      const ethToUsdRate = await fetchEthToUsdRate();
      setEthToUsdRate(ethToUsdRate);
      if (!ethToUsdRate) {
        toast.error("Failed to fetch Ethereum to USD rate");
        return;
      }

      const taxRate = 0.1;

      const updatedData = {
        labels: transactions.map((tx, index) => `T${index + 1}`),
        datasets: transactions.map((tx) => ({
          // label: `T ${tx.hash.substring(0, 6)}`,
          borderColor: "#8896bcff",
          data: [(parseFloat(tx.value) * taxRate) * ethToUsdRate], 
          backgroundColor: "#10bd9eff",
        })),
      };

      setGraphData(updatedData);
    };

    fetchGraphData();
  }, [transactions]);

  async function fetchTransactions(event) {
    event.preventDefault();
    setIsLoading(true);

    const address = event.currentTarget.address.value.trim();

    if (!address) {
      setIsLoading(false);
      toast.error("Please enter your address");
      return;
    }

    try {
      const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=92649034&sort=asc&apikey=${API_KEY}`;

      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }        

      const response = await fetch(apiUrl, requestData);
      const data = await response.json();
      toast.success("Transactions fetched successfully");
      if (data.result && Array.isArray(data.result)) {
        setIsLoading(false);
        setTransactions(data.result);
      } else {
        setIsLoading(false);
        console.error(
          "Error fetching transactions. Unexpected data format:",
          data
        );
        toast.error(
          "Error fetching transactions. Unexpected data format. Please try again later."
        );
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions. Please try again later.");
      setIsLoading(false);
      setTransactions([]);
    }
  }

  async function fetchEthToUsdRate() {
    try {
      const response = await fetch(
        " https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error("Error fetching Ethereum to USD rate:", error);
      return null;
    }
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
        <Line options={options} data={graphData} />
      </div>
      <div className={styles.barTransaction}>
        <h1>Get tax based on transactions</h1>
        <form onSubmit={fetchTransactions} className={styles.formContainer}>
          <div className={styles.authInputContainer}>
            <div className={styles.authInput}>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Enter your wallet address"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Calculate"}
            </button>
          </div>
        </form>
        <div className={styles.cardTransactionContainer}>
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <div key={index} className={styles.cardTransactionWrapper}>
                <div className={styles.cardTransaction}>
                <h1>USD {((parseFloat(tx.value) * ethToUsdRate * 0.1).toFixed(2)).substring(0, 6) + '.00'}</h1>
                  <h1>{(parseFloat(tx.value) * 0.1)}</h1>
                  <span>Tax:{calculateTax(tx.value, tx.gasPrice, tx.gasUsed)}</span>
                </div>
                <div className={styles.taxReport}>
                  <DownloadIcon
                    onClick={() => downloadPdf(index, tx)}
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
