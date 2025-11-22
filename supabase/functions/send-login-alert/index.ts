import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LoginAlertRequest {
  email: string;
  deviceInfo: string;
  location: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, deviceInfo, location, timestamp }: LoginAlertRequest = await req.json();

    console.log("Sending login alert to:", email);

    const emailResponse = await resend.emails.send({
      from: "Security <onboarding@resend.dev>",
      to: [email],
      subject: "New Login Detected - Security Alert",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .info-item { margin: 10px 0; }
            .label { font-weight: bold; color: #667eea; }
            .warning { background: #fef2f2; border-left-color: #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔒 New Login Detected</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We detected a new login to your account. If this was you, you can safely ignore this email.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0;">Login Details:</h3>
                <div class="info-item">
                  <span class="label">Time:</span> ${timestamp}
                </div>
                <div class="info-item">
                  <span class="label">Device:</span> ${deviceInfo}
                </div>
                <div class="info-item">
                  <span class="label">Location:</span> ${location}
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Didn't recognize this activity?</strong>
                <p style="margin: 10px 0 0 0;">If this wasn't you, please change your password immediately and review your account security settings.</p>
              </div>

              <div class="footer">
                <p>This is an automated security alert from your account.</p>
                <p>If you have any concerns, please contact support immediately.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Login alert sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending login alert:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
