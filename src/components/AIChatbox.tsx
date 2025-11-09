import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Target, Calendar, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIChatbox = () => {
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI assistant. Ask me anything - I can help with productivity, answer questions, have conversations, or just chat about whatever's on your mind!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.name);
          // Update welcome message with user's name
          setMessages([{
            id: '1',
            type: 'ai',
            content: `Hello ${profile.name}! I'm your AI assistant. Ask me anything - I can help with productivity, answer questions, have conversations, or just chat about whatever's on your mind!`,
            timestamp: new Date()
          }]);
        }
      }
    };
    fetchUserProfile();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare conversation history for AI
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: userMessage.content
      });

      console.log('Sending message to AI...');

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: conversationHistory }
      });

      if (error) {
        console.error('Error calling AI:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      let errorMessage = 'Failed to get AI response. Please try again.';
      
      if (error.message?.includes('Rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message?.includes('Payment required')) {
        errorMessage = 'AI service requires credits. Please contact support.';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Add error message to chat
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { icon: Target, text: "Tell me a joke", prompt: "Tell me a funny joke" },
    { icon: Calendar, text: "Explain quantum physics", prompt: "Can you explain quantum physics in simple terms?" },
    { icon: Lightbulb, text: "Creative ideas", prompt: "Give me some creative project ideas" },
    { icon: Sparkles, text: "Just chat", prompt: "What's the most interesting thing you know?" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-elevated card-3d h-[600px] flex flex-col">
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {userName ? `Chat with AI - ${userName}` : "AI Productivity Assistant"}
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