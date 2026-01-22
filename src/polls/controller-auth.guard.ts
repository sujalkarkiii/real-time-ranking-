import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RequestWithAuth } from "./types";

@Injectable()
export class ControllerAuthGuard implements CanActivate{


  
private readonly logger=new Logger(ControllerAuthGuard.name)
constructor (private  readonly jwtservice:JwtService){}



canActivate(context: ExecutionContext): boolean  {
  
  

 const request: RequestWithAuth = context.switchToHttp().getRequest();
 this.logger.debug(`checking for auth token on request body`,request.body)
 
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



// without canactivaete guard cannt inspect the reqest guards cannot run automatically without this method, beause 
// nestjs calls canactivate to decide whether to allow the request



// canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
// used to give acces to the guardroute
// without using this => it will allow access to all route