import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from './guards';
import { Token, User } from './decorators';
import type { CurrentUser } from './interface/current-usert.interface';


@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
  }

  /*
    foo.* - matches any pattern that starts with foo. and has one more segment (e.g., foo.bar, foo.baz)
    *.bar - matches any pattern that ends with .bar and has one more segment (e.g., foo.bar, baz.bar)
    foo.> - matches any pattern that starts with foo. and has zero or more segments (e.g., foo, foo.bar, foo.bar.baz)
    >.bar - matches any pattern that ends with .bar and has zero or more segments (e.g., bar, foo.bar, baz.foo.bar)
   */

  /**
   * it sends a message to the microservice with the pattern "auth.register.user" and the data { email: "
   * @returns the response of the microservice 
   */
  @Post('/register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto
  ) {
    try {
      const result = await firstValueFrom(
        this.client.send(
          "auth.register.user",
          registerUserDto
        )
      );
      return result;
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Post('/login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto
  ) {
    return this.client.send(
      "auth.login.user",
      loginUserDto
    );
  }

  @UseGuards(AuthGuard)
  @Post('/verify')
  async verifyToken(
    @User() user: CurrentUser,
    @Token() token: string,
  ) {

    // return this.client.send(
    //   "auth.verify.user",
    //   { "email": user.email, "password": "password" }
    // );
    return { user, token };
  }
}
