import { Resend } from 'resend';

// Initialize the Email Client using your API secret
const resend = new Resend(process.env.RESEND_API_KEY);

// Force this route to execute on the Vercel Edge Runtime
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // 1. Security Check: Only allow POST requests from your Log Drain
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 2. Parse the incoming real-time logs bundled by Vercel
    const logs = await request.json();
    
    // Vercel logs arrive as an array of log objects
    if (!Array.isArray(logs)) {
      return new Response('Invalid log payload structure', { status: 400 });
    }

    // 3. Filter for system crashes, uncaught exceptions, or deployment errors
    const errorLogs = logs.filter(log => {
      const message = log.message?.toLowerCase() || '';
      const isErrorLevel = log.level === 'error' || log.statusCode >= 500;
      
      return isErrorLevel || 
             message.includes('uncaught exception') || 
             message.includes('error:') || 
             message.includes('failed to load');
    });

    // 4. If critical errors are detected, dispatch an immediate email alert
    if (errorLogs.length > 0) {
      const errorDetailsHTML = errorLogs.map(log => `
        <div style="background: #fff5f5; border-left: 4px solid #e53e3e; padding: 12px; margin-bottom: 10px; font-family: monospace;">
          <strong>Timestamp:</strong> ${log.timestamp || new Date().toISOString()}<br/>
          <strong>Path:</strong> ${log.proxy?.path || 'N/A'}<br/>
          <strong>Message:</strong> <pre style="white-space: pre-wrap; margin: 4px 0 0 0;">${log.message}</pre>
        </div>
      `).join('');

      await resend.emails.send({
        from: 'ScriptureHub Monitor <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL, // Your email address configuration
        subject: `⚠️ Alert: Production Error Detected on scripture-hub`,
        html: `
          <h2>Critical Event Log Triggered</h2>
          <p>Your Vercel Edge Monitor has intercepted ${errorLogs.length} error state(s) in your live application logs.</p>
          <h3>Log Metadata Highlights:</h3>
          ${errorDetailsHTML}
          <br/>
          <p><a href="https://vercel.com/dashboard" style="background: #000; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Vercel Live Logs Dashboard</a></p>
        `,
      });
    }

    // 5. Always acknowledge receipt to Vercel promptly to prevent request timeouts
    return new Response(JSON.stringify({ processed: true, alertsSent: errorLogs.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Logging pipeline monitoring failure:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}