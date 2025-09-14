"use client"
import dynamic from "next/dynamic";

// make the enhanced dashboard a client component via dynamic import (no SSR flicker)
const EnhancedDashboard = dynamic(() => import("../components/EnhancedDashboard"), { ssr: false });

export default function Page() {
  return <EnhancedDashboard />;
}
