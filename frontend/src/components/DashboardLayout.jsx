import React from "react";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";

const DashboardLayout = ({ children }) => {
    const { logout } = useAuth();
    return (
        <div className="flex h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">

                {/* Topbar */}
                <header className="flex items-center justify-between bg-white shadow px-6 py-4">
                    <h1 className="text-xl font-bold text-indigo-600">
                        Nexus Dashboard
                    </h1>

                    <div className="flex items-center gap-4">
                        <Button variant="outline">
                            Notifications
                        </Button>

                        <Button onClick={logout}>
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;