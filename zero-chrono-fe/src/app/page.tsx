"use client"
import dynamic from "next/dynamic";

// make the dashboard a client component via dynamic import (no SSR flicker)
const Dashboard = dynamic(() => import("../components/Dashboard"), { ssr: false });

export default function Page() {
  return <Dashboard />;
}
