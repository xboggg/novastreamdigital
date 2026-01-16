import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Nova Stream <onboarding@resend.dev>",
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lead: LeadNotificationRequest = await req.json();

    // Build admin email HTML
    const adminHtml = `
      <h1>New Lead Submission</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.email}</td>
        </tr>
        ${lead.company ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.company}</td>
        </tr>` : ''}
        ${lead.services?.length ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Services</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.services.join(', ')}</td>
        </tr>` : ''}
        ${lead.budget ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Budget</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.budget}</td>
        </tr>` : ''}
        ${lead.timeline ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Timeline</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.timeline}</td>
        </tr>` : ''}
        ${lead.message ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.message}</td>
        </tr>` : ''}
      </table>
    `;

    // Build confirmation email HTML
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Thank you, ${lead.name}!</h1>
        <p>We've received your inquiry and are excited to learn more about your project.</p>
        <p>Our team will review your requirements and get back to you within 24-48 hours.</p>
        <p>In the meantime, feel free to explore our portfolio and insights on our website.</p>
        <br>
        <p>Best regards,<br>The Nova Stream Digital Team</p>
      </div>
    `;

    // Send notification to admin
    const adminEmail = await sendEmail(
      ["admin@novastreamdigital.com"], // Replace with actual admin email
      `New Lead: ${lead.name} from ${lead.company || 'Unknown Company'}`,
      adminHtml
    );

    // Send confirmation to the lead
    const confirmationEmail = await sendEmail(
      [lead.email],
      "Thanks for reaching out!",
      confirmationHtml
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
