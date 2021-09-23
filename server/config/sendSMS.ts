import { Twilio } from 'twilio';

export const sendSms = (to: string, body: string, txt: string) => {

    const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
    const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
    const from = `${process.env.TWILIO_PHONE_NUMBER}`;

    const client = new Twilio(accountSid, authToken);

    try {
        client.messages
            .create({
                body: `Blog App ${txt} - ${body}`,
                from,
                to
            })
            .then(message => console.log(message.sid));

    } catch (err) {
        console.log(err);
    }
}

export const sendOTP = async (to: string, channel: string) => {
    try {
        const serviceID = `${process.env.TWILIO_SERVICE_ID}`;
        const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
        const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;

        const client = new Twilio(accountSid, authToken);

        const data = await client.verify.services(serviceID).verifications.create({
            to,
            channel
        });

        return data;
    } catch (err) {
        console.log(err);
    }
}

export const smsVerify = async (to: string, code: string) => {
    try {
        const serviceID = `${process.env.TWILIO_SERVICE_ID}`;
        const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
        const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;

        const client = new Twilio(accountSid, authToken);

        const data = await client.verify.services(serviceID).verificationChecks.create({
            to,
            code
        });

        return data;
    } catch (err) {
        console.log(err);
    }
}

