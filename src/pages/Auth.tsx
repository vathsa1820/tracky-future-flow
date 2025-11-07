import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { z } from "zod";

const emailSchema = z.string().email("Invalid email address");
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. Use international format (e.g., +1234567890)");

const Auth = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
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

  const handleSendEmailOTP = async () => {
    try {
      emailSchema.parse(email);
    } catch (error) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
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
        },
      });

      if (error) throw error;

      setIsOtpSent(true);
      setAuthMethod("email");
      toast({
        title: "OTP Sent",
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

  const handleSendPhoneOTP = async () => {
    try {
      phoneSchema.parse(phone);
    } catch (error) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number in international format (e.g., +1234567890)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setIsOtpSent(true);
      setAuthMethod("phone");
      toast({
        title: "OTP Sent",
        description: "Check your phone for the verification code",
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
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const verifyParams = authMethod === "email"
        ? { email, token: otp, type: "email" as const }
        : { phone, token: otp, type: "sms" as const };

      const { error } = await supabase.auth.verifyOtp(verifyParams);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully authenticated!",
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
    if (authMethod === "email") {
      await handleSendEmailOTP();
    } else {
      await handleSendPhoneOTP();
    }
  };

  if (isOtpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code sent to your {authMethod}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center space-y-2">
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm"
              >
                Resend OTP
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp("");
                }}
                disabled={loading}
                className="text-sm w-full"
              >
                Use different {authMethod}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Tracky</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account using OTP verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email and Phone Tabs */}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendEmailOTP()}
                />
              </div>
              <Button
                onClick={handleSendEmailOTP}
                disabled={loading || !email}
                className="w-full"
              >
                {loading ? "Sending..." : "Send OTP via Email"}
              </Button>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendPhoneOTP()}
                />
                <p className="text-xs text-muted-foreground">
                  Use international format (e.g., +1234567890)
                </p>
              </div>
              <Button
                onClick={handleSendPhoneOTP}
                disabled={loading || !phone}
                className="w-full"
              >
                {loading ? "Sending..." : "Send OTP via SMS"}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Secure authentication with multiple options</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
