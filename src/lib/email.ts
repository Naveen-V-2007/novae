import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: "NOVAÉ <onboarding@resend.dev>",
    to,
    subject: "Reset your NOVAÉ password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="letter-spacing: 1px;">RESET YOUR PASSWORD</h2>
        <p>We received a request to reset your NOVAÉ account password. This link expires in 30 minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #1a1a1a; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
