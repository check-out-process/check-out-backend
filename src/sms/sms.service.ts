import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import fetch from 'node-fetch';
import { Twilio } from 'twilio';
import Config from 'src/config';

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
        const accountSid = Config.whatsAppAccountSeed;
        const authToken = Config.whatsAppAuthToken;

        if (phoneNumber.length == 10 && phoneNumber[0] =='0'){
            phoneNumber = phoneNumber.substring(1);
        }
        if (!phoneNumber.includes("+972")){
            phoneNumber = `+972${phoneNumber}`;
        }
        const client: Twilio = new Twilio(accountSid, authToken);
        client.messages
            .create({
                body: message,
                from: 'whatsapp:+16476920843',
                to: `whatsapp:${phoneNumber}`
            })
            .then(message => console.log(message.sid))
            
    }

    
}

