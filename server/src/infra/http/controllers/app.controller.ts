import { Controller, Get } from '@nestjs/common'

import { Public } from '@/infra/auth/public'

@Public()
@Controller('/')
export class AppController {
  @Get()
  handle() {
    return {
      message: 'Hello World!',
      timestamp: Date.now(),
    }
  }
}
