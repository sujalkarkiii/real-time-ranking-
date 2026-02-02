import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()

export class websocketguard implements CanActivate {
    private readonly logger = new Logger(websocketguard.name)
    constructor(private readonly jwtservice: JwtService) { }
    canActivate(context: ExecutionContext): boolean {

        const client = context.switchToWs().getClient()

        const  accessToken:string = client.handshake?.auth?.token || client.handshake?.headers['token'];
        this.logger.debug(`Checking WebSocket auth token: ${accessToken}`);

        try {
            const payload = this.jwtservice.verify(accessToken);
            client.userID = payload.sub;
            client.pollID = payload.pollID;
            client.name = payload.name;
            console.log("I am here in websocket")
            return true
        } catch {
            console.log("I am here in websocket")
            throw new ForbiddenException('Invalid authorization token');
        }

    }
}
