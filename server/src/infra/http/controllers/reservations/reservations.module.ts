import { Module } from "@nestjs/common"

import { CancelReservationUseCase } from "@/domains/events/application/use-cases/cancel-reservation"
import { FetchEventReservationsUseCase } from "@/domains/events/application/use-cases/fetch-event-reservations"
import { FetchUserReservationsUseCase } from "@/domains/events/application/use-cases/fetch-user-reservations"
import { ReserveEventSpotUseCase } from "@/domains/events/application/use-cases/reserve-event-spot"
import { DatabaseModule } from "@/infra/database/database.module"
import { CancelEventReservationController } from "./routes/cancel-event-reservation.controller"
import { FetchEventReservationsController } from "./routes/fetch-event-reservations.controller"
import { FetchUserReservationsController } from "./routes/fetch-user-reservations.controller"
import { ReserveSpotForEventController } from "./routes/reserve-spot-for-event.controller"

@Module({
	imports: [DatabaseModule],
	controllers: [
		ReserveSpotForEventController,
		CancelEventReservationController,
		FetchUserReservationsController,
		FetchEventReservationsController,
	],
	providers: [
		ReserveEventSpotUseCase,
		CancelReservationUseCase,
		FetchUserReservationsUseCase,
		FetchEventReservationsUseCase,
	],
})
export class ReservationsModule {}
