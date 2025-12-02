import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";
import { Navigation } from "@/components/Navigation";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Navigation */}
      <Navigation />
      
      {/* Animated AI Chat */}
      <AnimatedAIChat />
    </div>
  );
};

export default Chat;