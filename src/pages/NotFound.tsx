import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-surface-elevated">
      <div className="text-center glass-elevated p-8 rounded-xl max-w-md">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg hover:glow-primary transition-all duration-smooth"
        >
          Return to Tracky
        </a>
      </div>
    </div>
  );
};

export default NotFound;
