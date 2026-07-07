type ContactEmailPayload = {
  name: string;
  phone: string;
  email?: string;
  message: string;
  recipientEmail: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const sendContactEnquiryEmail = async (payload: ContactEmailPayload) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return { sent: false, reason: "Email provider is not configured" };
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#25222a">
      <h2>New Siyu Creativity Enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email || "Not provided")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [payload.recipientEmail],
      reply_to: payload.email || undefined,
      subject: `New enquiry from ${payload.name}`,
      html
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email send failed: ${detail}`);
  }

  return { sent: true };
};
