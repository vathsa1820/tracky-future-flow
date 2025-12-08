import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  token: string;
  type: "signup" | "magiclink" | "recovery";
  name?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, type, name }: AuthEmailRequest = await req.json();

    console.log(`Sending ${type} email to ${email}`);

    // Validate inputs
    if (!email || !token) {
      throw new Error("Email and token are required");
    }

    const userName = name || email.split("@")[0];
    
    let subject = "Your Tracky verification code";
    let heading = "Welcome to Tracky!";
    let message = "Use this code to sign in:";

    if (type === "recovery") {
      subject = "Reset your Tracky password";
      heading = "Password Reset";
      message = "Use this code to reset your password:";
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f; color: #ffffff; padding: 40px 20px; margin: 0;">
          <div style="max-width: 400px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(139, 92, 246, 0.2);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">✨</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                ${heading}
              </h1>
            </div>
            
            <p style="color: #a1a1aa; text-align: center; margin-bottom: 24px; font-size: 16px;">
              Hey ${userName}! ${message}
            </p>
            
            <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: monospace;">
                ${token}
              </div>
            </div>
            
            <p style="color: #71717a; text-align: center; font-size: 14px; margin-bottom: 0;">
              This code expires in 10 minutes.<br>
              If you didn't request this, you can safely ignore it.
            </p>
          </div>
          
          <p style="text-align: center; color: #52525b; font-size: 12px; margin-top: 24px;">
            Sent by Tracky • Your productivity companion
          </p>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Tracky <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
