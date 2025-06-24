import { Module } from "@nestjs/common"

import { AdminsRepository } from "@/domains/events/application/repositories/admins-repository"
import { EventsRepository } from "@/domains/events/application/repositories/events-repository"
import { ReservationsRepository } from "@/domains/events/application/repositories/reservations-repository"
import { UsersRepository } from "@/domains/events/application/repositories/users-repository"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaAdminsRepository } from "./prisma/repositories/prisma-admins-repository"
import { PrismaEventsRepository } from "./prisma/repositories/prisma-events-repository"
import { PrismaReservationsRepository } from "./prisma/repositories/prisma-reservations-repository"
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository"

@Module({
	providers: [
		PrismaService,
		{
			provide: UsersRepository,
			useClass: PrismaUsersRepository,
		},
		{
			provide: AdminsRepository,
			useClass: PrismaAdminsRepository,
		},
		{
			provide: EventsRepository,
			useClass: PrismaEventsRepository,
		},
		{
			provide: ReservationsRepository,
			useClass: PrismaReservationsRepository,
		},
	],
	exports: [
		PrismaService,
		UsersRepository,
		AdminsRepository,
		EventsRepository,
		ReservationsRepository,
	],
})
export class DatabaseModule {}
