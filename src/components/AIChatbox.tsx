import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Target, Calendar, Lightbulb } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIChatbox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI productivity assistant. I can help you organize tasks, create study plans, provide motivation, and optimize your daily schedule. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('task') || input.includes('todo')) {
      return "I can help you manage your tasks! Here are some suggestions:\n\n• Break large tasks into smaller, manageable steps\n• Set specific deadlines for each task\n• Prioritize based on urgency and importance\n• Use the Pomodoro technique for focused work sessions\n\nWould you like me to help you create a specific task or study plan?";
    }
    
    if (input.includes('study') || input.includes('exam')) {
      return "Great! Let's create an effective study plan:\n\n📚 **Study Strategy:**\n• Active recall: Test yourself regularly\n• Spaced repetition: Review material at increasing intervals\n• Pomodoro sessions: 25 min focus + 5 min break\n• Practice problems: Apply concepts actively\n\nWhat subject are you studying for? I can create a personalized schedule!";
    }
    
    if (input.includes('motivat') || input.includes('help') || input.includes('stuck')) {
      return "I believe in you! 🌟 Remember:\n\n• Every expert was once a beginner\n• Progress > Perfection\n• Small consistent steps lead to big results\n• You've overcome challenges before, you can do it again\n\n**Quick motivation boost:**\nThink about why you started this journey. Your future self will thank you for the effort you put in today. What's one small step you can take right now?";
    }
    
    if (input.includes('schedule') || input.includes('time') || input.includes('plan')) {
      return "Let's optimize your schedule! 🗓️\n\n**Productivity Framework:**\n• Morning: Deep work on important tasks\n• Afternoon: Meetings, lighter tasks\n• Evening: Review, plan tomorrow\n\n**Energy management:**\n• Track your peak energy hours\n• Schedule difficult tasks during high-energy periods\n• Include breaks and buffer time\n\nWhat's your current biggest scheduling challenge?";
    }
    
    return "That's an interesting question! As your AI productivity assistant, I'm here to help you with:\n\n✨ Task management and organization\n📅 Study planning and scheduling\n🎯 Goal setting and tracking\n💪 Motivation and productivity tips\n🧠 Learning strategies\n\nCould you be more specific about what you'd like help with? I'm here to support your success!";
  };

  const quickPrompts = [
    { icon: Target, text: "Help me prioritize my tasks", prompt: "Help me prioritize my tasks for today" },
    { icon: Calendar, text: "Create a study schedule", prompt: "Can you help me create a study schedule for my upcoming exams?" },
    { icon: Lightbulb, text: "Productivity tips", prompt: "What are some productivity tips for engineering students?" },
    { icon: Sparkles, text: "Motivate me", prompt: "I'm feeling unmotivated, can you help?" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-elevated card-3d h-[600px] flex flex-col">
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Productivity Assistant
            <Sparkles className="h-4 w-4 text-accent" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'glass border border-glass-border'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="glass border border-glass-border p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 my-4">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(prompt.prompt)}
                className="flex items-center gap-2 text-xs glass border-glass-border hover:bg-primary/20"
              >
                <prompt.icon className="h-3 w-3" />
                {prompt.text}
              </Button>
            ))}
          </div>
          
          {/* Input */}
          <div className="flex gap-2 mt-auto">
            <Input
              placeholder="Ask me anything about productivity, tasks, or study planning..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-surface/50 border-glass-border"
              disabled={isTyping}
            />
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-primary hover:glow-primary transition-all duration-smooth"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};