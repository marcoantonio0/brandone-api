import { CanActivate, ExecutionContext, Injectable, Request } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/shared/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService?: UserService
    ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if(!roles){
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    

    return this.userService.getById(user.sub).then(r => {
      function hasRole() {
        let has: boolean;
        roles.forEach(value => { has = r.roles.indexOf(value) > -1 });
        return has;
      }
      let hasPermission: boolean = false;
      if(hasRole()) { hasPermission = true };
      return hasPermission;
    })
  }
}
