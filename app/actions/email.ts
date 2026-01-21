"use server";

import { prisma } from "@/lib/db";
import { EmailType } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export async function createEmailTemplate(data: {
  name: string;
  type: EmailType;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
}) {
  try {
    await prisma.emailTemplate.create({
      data: {
        name: data.name,
        type: data.type,
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent,
        variables: data.variables,
      },
    });

    revalidatePath('/admin/email-templates');
    return { success: true };
  } catch (error) {
    console.error('Failed to create email template:', error);
    return { success: false, error: 'Failed to create email template' };
  }
}

export async function updateEmailTemplate(id: string, data: {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  isActive: boolean;
}) {
  try {
    await prisma.emailTemplate.update({
      where: { id },
      data: {
        name: data.name,
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent,
        variables: data.variables,
        isActive: data.isActive,
      },
    });

    revalidatePath('/admin/email-templates');
    revalidatePath(`/admin/email-templates/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update email template:', error);
    return { success: false, error: 'Failed to update email template' };
  }
}

export async function seedEmailTemplates() {
  const templates = [
    {
      name: "Order Confirmation",
      type: EmailType.ORDER_CONFIRMATION,
      subject: "Order Confirmation - Order #{{orderNumber}}",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #FB2E86; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Hekto</h1>
            <p style="margin: 10px 0 0 0;">Thank you for your order!</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #151875; margin-bottom: 20px;">Hi {{customerName}},</h2>
            
            <p>We've received your order and are preparing it for shipment. Here are your order details:</p>
            
            <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="color: #151875; margin-top: 0;">Order #{{orderNumber}}</h3>
              <div style="margin: 15px 0;">
                <strong>Items:</strong><br>
                {{orderItems}}
              </div>
              <div style="margin: 15px 0;">
                <strong>Total:</strong> {{orderTotal}}
              </div>
              <div style="margin: 15px 0;">
                <strong>Shipping Address:</strong><br>
                {{shippingAddress}}
              </div>
            </div>
            
            <p>We'll send you another email when your order ships with tracking information.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hekto.com/account/orders" style="background: #FB2E86; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Track Your Order</a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p>Questions? Contact us at support@hekto.com</p>
            <p>&copy; 2024 Hekto. All rights reserved.</p>
          </div>
        </div>
      `,
      variables: ["customerName", "orderNumber", "orderTotal", "orderItems", "shippingAddress"],
    },
    {
      name: "Order Status Update",
      type: EmailType.ORDER_STATUS_UPDATE,
      subject: "Order Update - Order #{{orderNumber}}",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #FB2E86; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Hekto</h1>
            <p style="margin: 10px 0 0 0;">Order Status Update</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #151875; margin-bottom: 20px;">Hi {{customerName}},</h2>
            
            <p>Your order status has been updated:</p>
            
            <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="color: #151875; margin-top: 0;">Order #{{orderNumber}}</h3>
              <div style="margin: 15px 0;">
                <strong>Status:</strong> <span style="color: #28a745;">{{orderStatus}}</span>
              </div>
              <div style="margin: 15px 0;">
                <strong>Tracking Number:</strong> {{trackingNumber}}
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hekto.com/account/orders" style="background: #FB2E86; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View Order Details</a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p>Questions? Contact us at support@hekto.com</p>
            <p>&copy; 2024 Hekto. All rights reserved.</p>
          </div>
        </div>
      `,
      variables: ["customerName", "orderNumber", "orderStatus", "trackingNumber"],
    },
  ];

  try {
    for (const template of templates) {
      await prisma.emailTemplate.upsert({
        where: { name: template.name },
        update: template,
        create: template,
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to seed email templates:', error);
    return { success: false };
  }
}