import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ClientInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();

        const clientIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const userAgent = request.headers['user-agent'];

        return {
            ip: clientIp,
            browser: userAgent,
        };
    },
);
