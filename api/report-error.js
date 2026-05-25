import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Handle cross-origin preflight requests natively
  if (request.method === 'OPTIONS') {
    return new Response('OK', { 
      status: 200, 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      } 
    });
  }
  
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { message, stack, url } = body;

    const recipient = "silasclergy697@gmail.com";

    const emailResponse = await resend.emails.send({
      from: 'ScriptureHub Guard <onboarding@resend.dev>',
      to: recipient,
      subject: `⚠️ Live Crash Alert: scripture-hub`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h2 style="color: #e53e3e; margin-top: 0; font-size: 20px; border-bottom: 2px solid #fed7d7; padding-bottom: 10px;">An uncaught application exception occurred!</h2>
          <p style="margin-top: 15px;"><strong>Page URL:</strong> <a href="${url}" target="_blank" style="color: #3182ce; text-decoration: none;">${url || 'Unknown'}</a></p>
          <p><strong>Error Message:</strong> <span style="color: #c53030; font-weight: bold; background: #fff5f5; padding: 2px 6px; border-radius: 4px;">${message}</span></p>
          <p style="margin-bottom: 5px;"><strong>Stack Trace:</strong></p>
          <pre style="background: #f7fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto; color: #4a5568; line-height: 1.5;">${stack || 'No trace available'}</pre>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0 15px 0;" />
          <p style="font-size: 11px; color: #a0aec0; text-align: center; margin: 0;">ScriptureHub Guard Infrastructure • Automated Diagnostic Monitor</p>
        </div>
      `,
    });

    // Production Rule: Return hard errors if Resend fails internally
    if (emailResponse.error) {
      console.error("Resend delivery failed:", emailResponse.error);
      return new Response(JSON.stringify({ success: false, error: emailResponse.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Critical monitor crash handler failure:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}