import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Nexus
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Manage your projects and tasks efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="w-full sm:w-auto px-8"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto px-8"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;