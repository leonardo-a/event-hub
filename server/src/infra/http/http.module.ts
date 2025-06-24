import { Module } from "@nestjs/common"

import { EventsModule } from "./controllers/events/events.module"
import { ReservationsModule } from "./controllers/reservations/reservations.module"
import { UsersModule } from "./controllers/users/users.module"

@Module({
	imports: [UsersModule, ReservationsModule, EventsModule],
	controllers: [],
	providers: [],
})
export class HttpModule {}
