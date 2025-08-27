import { AIChatbox } from "@/components/AIChatbox";
import { Navigation } from "@/components/Navigation";
import { MessageSquare, Sparkles } from "lucide-react";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Navigation */}
      <Navigation />
      
      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="h-8 w-8 text-secondary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal productivity coach powered by AI - get personalized advice and support
          </p>
        </div>
        
        {/* AI Chatbox Component */}
        <AIChatbox />
      </div>
    </div>
  );
};

export default Chat;