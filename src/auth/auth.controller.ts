import { LocalAuthGuard } from './shared/local-auth.guard';
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './shared/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post()
    async authenticate(@Request() req: any){
        return this.authService.login(req.user);
    }

}
