import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Brand configuration - update these when you verify your domain
const BRAND = {
  name: "Nova Stream Digital",
  // Change this to your verified domain email once verified in Resend
  fromEmail: "Nova Stream <onboarding@resend.dev>", 
  adminEmail: "novastreamdig@gmail.com",
  website: "https://novastreamdigital.lovable.app",
  primaryColor: "#8B5CF6",
  gradientStart: "#8B5CF6",
  gradientEnd: "#D946EF",
};

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: BRAND.fromEmail,
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
  
  return response.json();
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  name: string;
  email: string;
  company?: string;
  services?: string[];
  message?: string;
  budget?: string;
  timeline?: string;
}

const getAdminEmailTemplate = (lead: LeadNotificationRequest) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; background: linear-gradient(135deg, ${BRAND.gradientStart}, ${BRAND.gradientEnd}); padding: 16px 32px; border-radius: 12px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">🚀 New Lead Alert!</h1>
      </div>
    </div>
    
    <!-- Content Card -->
    <div style="background: linear-gradient(145deg, #1a1a2e, #16213e); border-radius: 16px; padding: 32px; border: 1px solid rgba(139, 92, 246, 0.2);">
      <h2 style="margin: 0 0 24px 0; font-size: 20px; color: ${BRAND.primaryColor};">Lead Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; font-size: 14px; width: 120px;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 14px; font-weight: 500;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; font-size: 14px;">Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);"><a href="mailto:${lead.email}" style="color: ${BRAND.primaryColor}; text-decoration: none;">${lead.email}</a></td>
        </tr>
        ${lead.company ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; font-size: 14px;">Company</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 14px;">${lead.company}</td>
        </tr>` : ''}
        ${lead.services?.length ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; font-size: 14px;">Services</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 14px;">${lead.services.join(', ')}</td>
        </tr>` : ''}
        ${lead.budget ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; font-size: 14px;">Budget</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #22c55e; font-size: 14px; font-weight: 600;">${lead.budget}</td>
        </tr>` : ''}
        ${lead.timeline ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; font-size: 14px;">Timeline</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 14px;">${lead.timeline}</td>
        </tr>` : ''}
      </table>
      
      ${lead.message ? `
      <div style="margin-top: 24px; padding: 20px; background: rgba(139, 92, 246, 0.1); border-radius: 12px; border-left: 4px solid ${BRAND.primaryColor};">
        <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Project Description</p>
        <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.6;">${lead.message}</p>
      </div>` : ''}
    </div>
    
    <!-- CTA -->
    <div style="text-align: center; margin-top: 32px;">
      <a href="mailto:${lead.email}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND.gradientStart}, ${BRAND.gradientEnd}); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${lead.name}</a>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="margin: 0; color: #71717a; font-size: 12px;">${BRAND.name} • Lead Management</p>
    </div>
  </div>
</body>
</html>
`;

const getConfirmationEmailTemplate = (lead: LeadNotificationRequest) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; background: linear-gradient(135deg, ${BRAND.gradientStart}, ${BRAND.gradientEnd}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${BRAND.name}</h1>
      </div>
    </div>
    
    <!-- Content Card -->
    <div style="background: linear-gradient(145deg, #1a1a2e, #16213e); border-radius: 16px; padding: 40px; border: 1px solid rgba(139, 92, 246, 0.2);">
      <!-- Checkmark Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, ${BRAND.gradientStart}, ${BRAND.gradientEnd}); border-radius: 50%; line-height: 64px; font-size: 28px;">✓</div>
      </div>
      
      <h2 style="margin: 0 0 16px 0; font-size: 24px; text-align: center; color: #ffffff;">Thank You, ${lead.name}!</h2>
      
      <p style="margin: 0 0 24px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6; text-align: center;">
        We've received your project inquiry and we're excited to learn more about what you're building.
      </p>
      
      <!-- What's Next -->
      <div style="background: rgba(139, 92, 246, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; font-size: 16px; color: ${BRAND.primaryColor};">What happens next?</h3>
        <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
          <span style="color: ${BRAND.primaryColor}; margin-right: 12px; font-size: 18px;">1.</span>
          <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.5;">Our team will review your project requirements</p>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
          <span style="color: ${BRAND.primaryColor}; margin-right: 12px; font-size: 18px;">2.</span>
          <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.5;">We'll reach out within 24-48 hours to discuss your vision</p>
        </div>
        <div style="display: flex; align-items: flex-start;">
          <span style="color: ${BRAND.primaryColor}; margin-right: 12px; font-size: 18px;">3.</span>
          <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.5;">Together, we'll create something extraordinary</p>
        </div>
      </div>
      
      <!-- CTA -->
      <div style="text-align: center;">
        <a href="${BRAND.website}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND.gradientStart}, ${BRAND.gradientEnd}); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Explore Our Work</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px;">
      <p style="margin: 0 0 8px 0; color: #71717a; font-size: 12px;">Questions? Reply to this email or visit our website.</p>
      <p style="margin: 0; color: #52525b; font-size: 12px;">© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lead: LeadNotificationRequest = await req.json();

    // Send notification to admin
    const adminEmail = await sendEmail(
      [BRAND.adminEmail],
      `🚀 New Lead: ${lead.name} from ${lead.company || 'Direct Inquiry'}`,
      getAdminEmailTemplate(lead)
    );

    // Send confirmation to the lead
    const confirmationEmail = await sendEmail(
      [lead.email],
      `Thanks for reaching out, ${lead.name}! - ${BRAND.name}`,
      getConfirmationEmailTemplate(lead)
    );

    console.log("Admin notification sent:", adminEmail);
    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ success: true, adminEmail, confirmationEmail }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-new-lead function:", error);
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
