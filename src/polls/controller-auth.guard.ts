import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { RequestWithAuth } from "./types";

@Injectable()
export class ControllerAuthGuard implements CanActivate{
    constructor (private readonly jwtservice:JwtService){}
canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  
  

 const request: RequestWithAuth = context.switchToHttp().getRequest();
 
 
 const { accessToken } = request.body;
      try {
      const payload = this.jwtservice.verify(accessToken);
      // append user and poll to socket
      request.userID = payload.sub;
      request.pollID = payload.pollID;
      request.name = payload.name;
      return true;
    } catch {
      throw new ForbiddenException('Invalid authorization token');
    }


    
}
}