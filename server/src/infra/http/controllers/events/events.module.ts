import { Module } from "@nestjs/common"

import { CreateEventUseCase } from "@/domains/events/application/use-cases/create-event"
import { DeleteEventUseCase } from "@/domains/events/application/use-cases/delete-event"
import { EditEventUseCase } from "@/domains/events/application/use-cases/edit-event"
import { FetchEventsUseCase } from "@/domains/events/application/use-cases/fetch-events"
import { GetEventUseCase } from "@/domains/events/application/use-cases/get-event"
import { DatabaseModule } from "@/infra/database/database.module"
import { CreateEventController } from "./router/create-event.controller"
import { DeleteEventController } from "./router/delete-event.controller"
import { EditEventController } from "./router/edit-event.controller"
import { FetchEventsController } from "./router/fetch-events.controller"
import { GetEventController } from "./router/get-event.controller"

@Module({
	imports: [DatabaseModule],
	controllers: [
		GetEventController,
		FetchEventsController,
		CreateEventController,
		EditEventController,
		DeleteEventController,
	],
	providers: [
		GetEventUseCase,
		FetchEventsUseCase,
		CreateEventUseCase,
		EditEventUseCase,
		DeleteEventUseCase,
	],
})
export class EventsModule {}
