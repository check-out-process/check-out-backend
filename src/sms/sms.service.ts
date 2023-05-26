import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import fetch from 'node-fetch';


@Injectable()
export class SmsService {
    constructor(
    ) { }

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
}

