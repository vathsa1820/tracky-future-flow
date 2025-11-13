import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, CheckCircle, BookOpen, MessageSquare, Brain } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/tasks", icon: CheckCircle, label: "Tasks" },
    { path: "/study-planner", icon: Brain, label: "Study Planner" },
    { path: "/journal", icon: BookOpen, label: "Journal" },
    { path: "/chat", icon: MessageSquare, label: "AI Assistant" }
  ];

  return (
    <div className="sticky top-4 z-50 container mx-auto px-4 pt-4">
      <Card className="glass-elevated">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Tracky
              </div>
            </Link>
            
            {/* Navigation Items */}
            <div className="flex gap-2 items-center">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link to={item.path}>
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};