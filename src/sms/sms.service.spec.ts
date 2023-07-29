import { HttpException, HttpStatus } from '@nestjs/common';
import { SmsService } from './sms.service';
import fetch from 'node-fetch';

jest.mock('node-fetch');

describe('SmsService', () => {
    let smsService: SmsService;

    beforeEach(() => {
        smsService = new SmsService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send SMS successfully', async () => {
        // Arrange
        const phoneNumber = '1234567890';
        const message = 'Test message';
        const responseBody = { success: true };

        (fetch as unknown as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => responseBody,
        });

        // Act
        await smsService.sendSms(phoneNumber, message);

        // Assert
        expect(fetch).toHaveBeenCalledWith('https://simplesms.co.il/webservice/json/smsv2.aspx', {
            method: 'POST',
            body: JSON.stringify({
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
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    it('should throw an HttpException with HttpStatus.NOT_FOUND if phoneNumber or message is null', async () => {
        // Arrange
        const phoneNumber = null;
        const message = 'Test message';

        // Act + Assert
        try {
            await smsService.sendSms(phoneNumber, message);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.response).toBe('phoneNumber or message not correct');
            expect(error.status).toBe(HttpStatus.NOT_FOUND);
        }
    });

    it('should throw an HttpException with HttpStatus.INTERNAL_SERVER_ERROR if the SMS sending fails', async () => {
        // Arrange
        const phoneNumber = '1234567890';
        const message = 'Test message';

        (fetch as unknown as jest.Mock).mockResolvedValue({
            ok: false,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        });

        // Act + Assert
        try {
            await smsService.sendSms(phoneNumber, message);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.response).toBeInstanceOf(Error);
            expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    });
});