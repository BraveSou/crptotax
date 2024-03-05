import { Web3ModalProvider } from "../context/Web3Modal";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import "@/app/style/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "crptotax",
  description: "Cryptocurrency tax reporting made easy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 8000,
            style: {
              background: "#09122eff",
              color: "#8896bcff",
            },
          }}
        />
      </body>
    </html>
  );
}
