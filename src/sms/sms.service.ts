import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import fetch from 'node-fetch';
import { Twilio } from 'twilio';


@Injectable()
export class SmsService {
    constructor(
    ) {  }

    public async sendSms(phoneNumber: string, message: string) {
        if (phoneNumber == null || message == null) {
            throw new HttpException("phoneNumber or message not correct", HttpStatus.NOT_FOUND);
        }
        try {
            const body = {
                "Credentials": {
                    "UserName": "csprog",
                    "EncryptPassword": "19a72191ea274433867972386710c4cd"
                },
                "SenderName": "CSCODE",
                "DeliveryDelayInMinutes": 0,
                "ExpirationDelayInMinutes": 300,
                "messages": [
                    {
                        "Cli": phoneNumber,
                        "Text": message
                    }
                ]
            }
            await fetch('https://simplesms.co.il/webservice/json/smsv2.aspx', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                }
            })
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async sendWhatsAppMessage(phoneNumber: string, message: string){
        const accountSid = 'AC50d05de9a73212838c6579b9c014be72';
        const authToken = 'e96ddb04f1c4e04546078e67808941c9';
        const client: Twilio = new Twilio(accountSid, authToken);
        client.messages
            .create({
                body: message,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+972${phoneNumber}`
            })
            .then(message => console.log(message.sid))
            
    }

    
}

