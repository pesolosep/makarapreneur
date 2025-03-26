// lib/emailUtils.ts

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