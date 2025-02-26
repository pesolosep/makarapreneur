// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL,
      to,
      subject,
      html,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending email', error: (error as Error).message },
      { status: 500 }
    );
  }
}