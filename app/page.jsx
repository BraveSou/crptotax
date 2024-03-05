"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   if (localStorage.getItem("token") !== null || localStorage.getItem("token") !== undefined || localStorage.getItem("token") !== ""){
  //     router.push("/page/dashboard");
  //   } else {
  //     router.push("/authentication/connect");
  //   }
  // });

  useEffect(() => {
      router.push("/authentication/connect");
  });

  return <></>;
}
