import { SESClient, CloneReceiptRuleSetCommand, SendEmailCommand } from "@aws-sdk/client-ses";

const REGION = 'us-east-2'; // e.g. 'us-east-1'
const client = new SESClient({ region: REGION });


export const send_email = async function(email_from, email_to, subject, html, text) {
    if (!email_from || !email_to || !subject || !html || !text) { 
        return;
    }

    if (!Array.isArray(email_to)) {
      email_to = [email_to];
    }

    const params = {
        Destination: {
          /* required */
          CcAddresses: [
            /* more items */
          ],
          ToAddresses: email_to
          /* more To-email addresses */,
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: "UTF-8",
              Data: html,
            },
            Text: {
              Charset: "UTF-8",
              Data: text,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject
          },
        },
        Source: email_from, // SENDER_ADDRESS
        ReplyToAddresses: [
          /* more items */
        ],
      };
    
    await client.send(new SendEmailCommand(params));
}

