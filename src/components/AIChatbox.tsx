import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Target, Calendar, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIChatbox = () => {
  const { toast } = useToast();
  const userName = "User";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI assistant powered by Tracky. Ask me anything - I can help with productivity, answer questions, suggest study plans, or just chat about whatever's on your mind!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(m => m.id !== '1') // Skip initial greeting
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        }));

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: messageText
      });

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: conversationHistory }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data?.error) {
        // Handle specific error cases
        if (data.error.includes('Rate limit')) {
          toast({
            title: "Too many requests",
            description: "Please wait a moment before sending another message.",
            variant: "destructive"
          });
        } else if (data.error.includes('Payment required')) {
          toast({
            title: "Credits needed",
            description: "Please add credits to continue using AI features.",
            variant: "destructive"
          });
        }
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.message || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      if (!error.message?.includes('Rate limit') && !error.message?.includes('Payment required')) {
        toast({
          title: "Connection issue",
          description: "Could not reach the AI service. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { icon: Target, text: "Study tips", prompt: "What are the best study techniques for engineering students?" },
    { icon: Calendar, text: "Plan my day", prompt: "Help me create an effective daily study schedule" },
    { icon: Lightbulb, text: "Stay motivated", prompt: "Give me some motivation to keep studying" },
    { icon: Sparkles, text: "Just chat", prompt: "What's the most interesting thing you know?" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-elevated card-3d h-[600px] flex flex-col">
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {userName ? `Chat with AI - ${userName}` : "AI Assistant"}
            <Sparkles className="h-4 w-4 text-accent" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
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
              <div ref={scrollRef} />
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
              placeholder="Ask me anything - I'm here to chat and help!"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
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
