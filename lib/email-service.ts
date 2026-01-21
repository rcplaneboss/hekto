import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';
import { EmailType, EmailStatus } from '@/lib/prisma/client';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  orderId?: string;
  templateId?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // Log email attempt
      const emailLog = await prisma.emailLog.create({
        data: {
          templateId: data.templateId,
          orderId: data.orderId,
          recipient: data.to,
          subject: data.subject,
          content: data.html,
          status: EmailStatus.PENDING,
        },
      });

      // Send email
      const result = await this.transporter.sendMail({
        from: `"Hekto Store" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      });

      // Update log on success
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: EmailStatus.SENT,
          sentAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      
      // Update log on failure
      if (data.orderId || data.templateId) {
        await prisma.emailLog.updateMany({
          where: {
            recipient: data.to,
            subject: data.subject,
            status: EmailStatus.PENDING,
          },
          data: {
            status: EmailStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
      
      return false;
    }
  }

  async sendOrderConfirmation(orderId: string): Promise<boolean> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    if (!order) return false;

    const template = await prisma.emailTemplate.findFirst({
      where: { type: EmailType.ORDER_CONFIRMATION, isActive: true },
    });

    if (!template) return false;

    const html = this.replaceVariables(template.htmlContent, {
      customerName: order.firstName,
      orderNumber: order.orderNumber.toString(),
      orderTotal: `₦${order.totalAmount.toFixed(2)}`,
      orderItems: order.items.map(item => 
        `${item.product.name} x${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}`
      ).join('<br>'),
      shippingAddress: `${order.address}, ${order.city}, ${order.country}`,
    });

    return this.sendEmail({
      to: order.customerEmail,
      subject: template.subject.replace('{{orderNumber}}', order.orderNumber.toString()),
      html,
      orderId,
      templateId: template.id,
    });
  }

  async sendOrderStatusUpdate(orderId: string, newStatus: string): Promise<boolean> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return false;

    const template = await prisma.emailTemplate.findFirst({
      where: { type: EmailType.ORDER_STATUS_UPDATE, isActive: true },
    });

    if (!template) return false;

    const html = this.replaceVariables(template.htmlContent, {
      customerName: order.firstName,
      orderNumber: order.orderNumber.toString(),
      orderStatus: newStatus,
      trackingNumber: order.trackingNumber || 'Not available yet',
    });

    return this.sendEmail({
      to: order.customerEmail,
      subject: template.subject.replace('{{orderNumber}}', order.orderNumber.toString()),
      html,
      orderId,
      templateId: template.id,
    });
  }

  private replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return result;
  }
}

export const emailService = new EmailService();