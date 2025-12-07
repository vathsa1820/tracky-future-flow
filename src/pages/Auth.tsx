import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { z } from "zod";
import { Mail } from "lucide-react";

const emailSchema = z.string().email("Invalid email address");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSendOTP = async () => {
    try {
      emailSchema.parse(email);
      nameSchema.parse(name);
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.message || "Please check your inputs",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            name: name
          }
        },
      });

      if (error) throw error;

      setIsOtpSent(true);
      toast({
        title: "Code Sent",
        description: "Check your email for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ 
        email, 
        token: otp, 
        type: "email" 
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    await handleSendOTP();
  };

  if (isOtpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-surface-elevated p-4">
        <Card className="w-full max-w-sm border-0 shadow-lg">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We sent a login link to <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Click the link in your email to sign in.</p>
              <p className="mt-2">You can close this page after clicking the link.</p>
            </div>

            <div className="text-center space-y-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Resend Email"}
              </Button>
              <Button
                variant="link"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp("");
                }}
                disabled={loading}
                className="text-sm"
              >
                Use a different email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-surface-elevated p-4">
      <Card className="w-full max-w-sm border-0 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Tracky</CardTitle>
          <CardDescription>
            Sign up or sign in to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
              className="h-11"
            />
          </div>
          <Button
            onClick={handleSendOTP}
            disabled={loading || !email || !name}
            className="w-full h-11"
          >
            {loading ? "Sending..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
