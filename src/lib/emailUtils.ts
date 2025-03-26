// lib/emailUtils.ts

import { NetworkingParticipant } from "@/models/NetworkParticipant";

/**
 * Utility functions for sending email notifications
 */

/**
 * Send an email notification about a business class registration update
 */
export async function sendBusinessClassUpdateEmail(formData: any, registrationId: string) {
    try {
      // Construct data for the participant level
      const levelDisplay = formData.participantLevel === 'BEGINNER' ? 'Beginner' : 'Advanced';
      
      // Construct data for information source
      let infoSource = formData.informationSource;
      if (formData.informationSource === 'OTHER' && formData.otherInformationSource) {
        infoSource = `Other: ${formData.otherInformationSource}`;
      }
      
      // Get the admin email from SMTP_USER environment variable
      const adminEmail = process.env.NEXT_PUBLIC_SMTP_USER || 'admin@hipmiui.org';
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: adminEmail,
          subject: `Business Class Registration Updated - ${formData.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #2a9d8f; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">Business Class Registration Updated</h2>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                A participant has updated their registration information for the HIPMI UI Business Class.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #264653; margin-top: 0;">Participant Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Name:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Institution:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.institution}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Level:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${levelDisplay}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Information Source:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${infoSource}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Registration ID:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${registrationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Updated At:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/participants" style="background-color: #2a9d8f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
                This is an automated notification from HIPMI UI Business Class system.
              </p>
            </div>
          `
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }
      
      return true;
    } catch (error) {
      console.error('Error sending update notification email:', error);
      return false;
    }
  }
  
  /**
   * Send an email notification about a new business class registration
   */
  export async function sendBusinessClassNewRegistrationEmail(formData: any, registrationId: string) {
    try {
      // Construct data for the participant level
      const levelDisplay = formData.participantLevel === 'BEGINNER' ? 'Beginner' : 'Advanced';
      
      // Construct data for information source
      let infoSource = formData.informationSource;
      if (formData.informationSource === 'OTHER' && formData.otherInformationSource) {
        infoSource = `Other: ${formData.otherInformationSource}`;
      }
      
      // Get the admin email from SMTP_USER environment variable
      const adminEmail = process.env.NEXT_PUBLIC_SMTP_USER || 'admin@hipmiui.org';
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: adminEmail,
          subject: `New Business Class Registration - ${formData.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #2a9d8f; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Business Class Registration</h2>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                A new participant has registered for the HIPMI UI Business Class.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #264653; margin-top: 0;">Participant Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Name:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Institution:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.institution}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Level:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${levelDisplay}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Information Source:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${infoSource}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Registration ID:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${registrationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Registered At:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/participants" style="background-color: #2a9d8f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
                This is an automated notification from HIPMI UI Business Class system.
              </p>
            </div>
          `
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }
      
      return true;
    } catch (error) {
      console.error('Error sending new registration notification email:', error);
      return false;
    }
  }

  export async function sendNetworkingEventUpdateEmail(formData: any, registrationId: string) {
    try {
      // Construct data for the membership status
      const membershipStatus = formData.membershipStatus === 'FUNGSIONARIS' ? 
        'HIPMI PT UI Fungsionaris' : 'Non-Fungsionaris';
      
      // Construct data for position
      let position;
      switch (formData.position) {
        case 'PENGURUS_INTI':
          position = 'Pengurus Inti';
          break;
        case 'KEPALA_WAKIL_KEPALA_BIDANG':
          position = 'Kepala/Wakil Kepala Bidang';
          break;
        case 'STAF':
          position = 'Staf';
          break;
        case 'ANGGOTA':
          position = 'Anggota';
          break;
        default:
          position = formData.position;
      }
      
      // Construct data for hipmi pt origin
      let hipmiPtOrigin = formData.hipmiPtOrigin;
      if (formData.hipmiPtOrigin === 'other' && formData.otherOrigin) {
        hipmiPtOrigin = `Other: ${formData.otherOrigin}`;
      }
      
      // Construct data for expectations
      const expectationsArray = formData.expectations.map((id: string) => {
        if (id === 'other') {
          return `Other: ${formData.otherExpectation || 'Other'}`;
        }
        switch (id) {
          case 'industry-insight':
            return 'Insight to the Industry';
          case 'networking':
            return 'Networking opportunities';
          case 'internship':
            return 'Internship opportunities';
          case 'mentor':
            return 'Finding a mentor';
          case 'promotion':
            return 'Promoting my business';
          default:
            return id;
        }
      }).join(', ');
      
      // Construct business data
      const businessInfo = formData.hasBusiness ? 
        `${formData.businessName || 'N/A'} (${formData.businessField || 'N/A'})` : 
        'No business';
      
      // Get the admin email from SMTP_USER environment variable
      const adminEmail = process.env.NEXT_PUBLIC_SMTP_USER || 'admin@hipmiui.org';
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: adminEmail,
          subject: `Networking Night Registration Updated - ${formData.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #2a9d8f; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">Networking Night Registration Updated</h2>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                A participant has updated their registration information for the Networking Night event.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #264653; margin-top: 0;">Participant Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Name:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>WhatsApp Number:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formData.whatsappNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Position:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${position}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Membership Status:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${membershipStatus}</td>
                  </tr>
                  ${formData.membershipStatus === 'NON_FUNGSIONARIS' ? `
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>HIPMI PT Origin:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${hipmiPtOrigin}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Expectations:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${expectationsArray}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Business:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${businessInfo}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Registration ID:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${registrationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Updated At:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/networking" style="background-color: #2a9d8f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
                This is an automated notification from HIPMI UI Networking Night system.
              </p>
            </div>
          `
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }
      
      return true;
    } catch (error) {
      console.error('Error sending update notification email:', error);
      return false;
    }
  }

  export async function sendNetworkingEventBulkEmail(
    recipients: NetworkingParticipant[],
    subject: string,
    htmlContent: string
  ): Promise<{ success: boolean; failedEmails: string[] }> {
    try {
      // Track failed emails
      const failedEmails: string[] = [];
      
      // Process the HTML content for each recipient and send individual emails
      for (const participant of recipients) {
        try {
          // Replace template variables with actual participant data
          let personalizedContent = htmlContent;
          
          // Replace known variables with participant data
          personalizedContent = personalizedContent
            .replace(/{{name}}/g, participant.name || '')
            .replace(/{{whatsappNumber}}/g, participant.whatsappNumber || '')
            .replace(/{{membershipStatus}}/g, 
              participant.membershipStatus === 'FUNGSIONARIS' ? 'Fungsionaris' : 'Non-Fungsionaris')
            .replace(/{{position}}/g, participant.position || '')
            .replace(/{{businessName}}/g, participant.business?.name || 'N/A')
            .replace(/{{registrationDate}}/g, 
              participant.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : 'N/A')
            .replace(/{{paymentAmount}}/g, 
              participant.paymentAmount ? participant.paymentAmount.toLocaleString() : 'N/A')
            .replace(/{{hipmiPtOrigin}}/g, participant.hipmiPtOrigin || 'N/A');
          
          // Call the email sending API
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: participant.whatsappNumber, // Using whatsappNumber as it's the contact method
              subject: subject,
              html: personalizedContent,
              // You could add CC or BCC here if needed
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to send email to ${participant.name}`);
          }
        } catch (emailError) {
          console.error(`Error sending email to ${participant.name}:`, emailError);
          failedEmails.push(participant.whatsappNumber);
        }
      }
      
      return {
        success: failedEmails.length === 0,
        failedEmails
      };
    } catch (error) {
      console.error('Error in bulk email sending:', error);
      throw new Error('Failed to send bulk emails');
    }
  }
  
  /**
   * Send a notification email to a specific networking event participant
   */
  export async function sendNetworkingParticipantEmail(
    participant: NetworkingParticipant,
    subject: string,
    htmlContent: string
  ): Promise<boolean> {
    try {
      // Replace template variables with actual participant data
      let personalizedContent = htmlContent;
      
      // Replace known variables with participant data
      personalizedContent = personalizedContent
        .replace(/{{name}}/g, participant.name || '')
        .replace(/{{whatsappNumber}}/g, participant.whatsappNumber || '')
        .replace(/{{membershipStatus}}/g, 
          participant.membershipStatus === 'FUNGSIONARIS' ? 'Fungsionaris' : 'Non-Fungsionaris')
        .replace(/{{position}}/g, participant.position || '')
        .replace(/{{businessName}}/g, participant.business?.name || 'N/A')
        .replace(/{{registrationDate}}/g, 
          participant.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : 'N/A')
        .replace(/{{paymentAmount}}/g, 
          participant.paymentAmount ? participant.paymentAmount.toLocaleString() : 'N/A')
        .replace(/{{hipmiPtOrigin}}/g, participant.hipmiPtOrigin || 'N/A');
      
      // Call the email sending API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: participant.whatsappNumber, // Using whatsappNumber as it's the contact method
          subject: subject,
          html: personalizedContent,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send email to ${participant.name}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error sending email to ${participant.name}:`, error);
      return false;
    }
  }
  
  /**
   * Send a payment verification email to a participant
   */
  export async function sendPaymentVerificationEmail(participant: NetworkingParticipant): Promise<boolean> {
    const subject = 'Payment Verification - HIPMI UI Networking Night';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #2a9d8f; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">Payment Verified</h2>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear ${participant.name},
        </p>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          We're pleased to confirm that your payment for the HIPMI UI Networking Night has been verified.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #264653; margin-top: 0;">Your Registration Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${participant.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>WhatsApp Number:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${participant.whatsappNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Membership Status:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                ${participant.membershipStatus === 'FUNGSIONARIS' ? 'Fungsionaris' : 'Non-Fungsionaris'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Amount:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">Rp ${participant.paymentAmount?.toLocaleString() || 'N/A'}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2e7d32;">
          <p style="font-size: 16px; color: #2e7d32; margin: 0;">
            <strong>Your participation is confirmed!</strong>
          </p>
          <p style="font-size: 14px; color: #333; margin-top: 10px;">
            Event details will be sent closer to the date. Please make sure to keep this email for your records.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
          This is an automated notification from HIPMI UI Networking Night system. If you have any questions, please reply to this email or contact us through our official channels.
        </p>
      </div>
    `;
    
    return await sendNetworkingParticipantEmail(participant, subject, htmlContent);
  }
  
  /**
   * Send a payment reminder email to a participant
   */
  export async function sendPaymentReminderEmail(participant: NetworkingParticipant): Promise<boolean> {
    const subject = 'Payment Reminder - HIPMI UI Networking Night';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #2a9d8f; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">Payment Reminder</h2>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear ${participant.name},
        </p>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          This is a friendly reminder that we haven't received your payment for the upcoming HIPMI UI Networking Night event.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #264653; margin-top: 0;">Your Registration Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${participant.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>WhatsApp Number:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${participant.whatsappNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Membership Status:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                ${participant.membershipStatus === 'FUNGSIONARIS' ? 'Fungsionaris' : 'Non-Fungsionaris'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Amount:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">Rp ${participant.paymentAmount?.toLocaleString() || 'N/A'}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #e65100;">
          <p style="font-size: 16px; color: #e65100; margin: 0;">
            <strong>Action Required: Please complete your payment</strong>
          </p>
          <p style="font-size: 14px; color: #333; margin-top: 10px;">
            To secure your spot, please make your payment and upload the payment proof through your participant dashboard as soon as possible.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/dashboard/networking" 
             style="background-color: #2a9d8f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Go to Participant Dashboard
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
          This is an automated notification from HIPMI UI Networking Night system. If you have any questions or have already made the payment, please reply to this email or contact us through our official channels.
        </p>
      </div>
    `;
    
    return await sendNetworkingParticipantEmail(participant, subject, htmlContent);
  }