import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, CheckCircle, BookOpen, Brain, Sparkles } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/tasks", icon: CheckCircle, label: "Tasks" },
    { path: "/study-planner", icon: Brain, label: "Study Planner" },
    { path: "/journal", icon: BookOpen, label: "Journal" },
    { path: "/chat", icon: Sparkles, label: "Tracky AI" }
  ];

  return (
    <div className="sticky top-4 z-50 container mx-auto px-4 pt-4">
      <Card className="glass-elevated">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div 
                className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tracky
              </motion.div>
            </Link>
            
            {/* Navigation Items */}
            <div className="flex gap-2 items-center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      asChild
                      className={`flex items-center gap-2 transition-all duration-200 ${
                        !isActive && "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </Link>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
