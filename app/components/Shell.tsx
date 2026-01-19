"use client";

import { useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";

export function Shell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const navigateToDays = () => {
        router.push("/days");
        setIsSidebarOpen(false);
    };

    const navigateToHome = () => {
        router.push("/home");
        setIsSidebarOpen(false);
    };

    const navigateToAccount = () => {
        router.push("/account");
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNavigateToDays={navigateToDays}
                onNavigateToHome={navigateToHome}
                onNavigateToAccount={navigateToAccount}
            />
            <main className="pt-20 pb-12 px-4">
                {children}
            </main>
        </div>
    );
}
