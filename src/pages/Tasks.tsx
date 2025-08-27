import { TodoList } from "@/components/TodoList";
import { Navigation } from "@/components/Navigation";
import { CheckCircle } from "lucide-react";

const Tasks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Navigation */}
      <Navigation />
      
      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Task Manager
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Organize your daily tasks and boost your productivity with our intelligent task management system
          </p>
        </div>
        
        {/* Todo List Component */}
        <TodoList />
      </div>
    </div>
  );
};

export default Tasks;