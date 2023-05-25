import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { httpService } from '@nestjs/axios';
import { SendSmsParams } from '@checkout/types';




@Injectable()
export class SmsService {
    constructor(
    ) { }

    public async sendSms(smsParams : SendSmsParams) {
        if (smsParams.phoneNumber == null || smsParams.message == null) {
            throw new HttpException("phoneNumber or message not correct", HttpStatus.NOT_FOUND);
        }
        try {
            return this.httpService.post('https://simplesms.co.il/webservice/json/smsv2.aspx',
            {
                "Credentials": {
                    "UserName": "csprog",
                    "EncryptPassword": "19a72191ea274433867972386710c4cd"
                },
                "SenderName": "CSCODE",
                "DeliveryDelayInMinutes": 0,
                "ExpirationDelayInMinutes": 300,
                "messages": [
                    {
                        "Cli": {phoneNumber},
                        "Text": {message}
                    }
                ]
            }
            ).toPromise();
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

