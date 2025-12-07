import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Target, Calendar, Lightbulb, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIChatbox = () => {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hey there! 👋 I'm Tracky, your study buddy. Whether you need help crushing that exam, planning your week, or just wanna chat—I'm here for you. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication status
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      setIsAuthenticated(!!session);
      setCheckingAuth(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      setIsAuthenticated(!!session);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    if (!isAuthenticated) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to chat with Tracky.",
        variant: "destructive"
      });
      return;
    }

    // Validate message length
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage.length > 4000) {
      toast({
        title: "Message Too Long",
        description: "Please keep your message under 4000 characters.",
        variant: "destructive"
      });
      return;
    }

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
        content: "Oops, my brain glitched for a sec 😅 Mind trying that again?",
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
    { icon: Target, text: "Study hacks", prompt: "Hey Tracky, what's your favorite study technique that actually works?" },
    { icon: Calendar, text: "Plan my day", prompt: "I've got a lot to do today—can you help me figure out a game plan?" },
    { icon: Lightbulb, text: "Feeling stuck", prompt: "I'm feeling unmotivated and stuck. Any advice?" },
    { icon: Sparkles, text: "Let's chat", prompt: "What's up Tracky? Tell me something interesting!" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-elevated card-3d h-[600px] flex flex-col">
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">Tracky</span>
            <span className="text-xs text-muted-foreground font-normal">• your study buddy</span>
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
          
          {/* Auth prompt or Input */}
          {!checkingAuth && !isAuthenticated ? (
            <div className="mt-auto p-4 glass rounded-lg border border-glass-border text-center">
              <p className="text-muted-foreground mb-3">Sign in to chat with Tracky</p>
              <Link to="/auth">
                <Button className="bg-gradient-primary hover:glow-primary">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2 mt-auto">
              <Input
                placeholder="Talk to Tracky..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
                className="flex-1 bg-surface/50 border-glass-border"
                disabled={isTyping || checkingAuth}
                maxLength={4000}
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping || checkingAuth}
                className="bg-gradient-primary hover:glow-primary transition-all duration-smooth"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
