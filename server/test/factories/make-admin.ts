import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import type { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
	Admin,
	type AdminProps,
} from "@/domains/events/enterprise/entities/admin"
import { PrismaAdminMapper } from "@/infra/database/prisma/mappers/prisma-admin-mapper"
import type { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeAdmin(props?: Partial<AdminProps>, id?: UniqueEntityID) {
	const admin = Admin.create(
		{
			email: faker.internet.email(),
			fullName: faker.person.fullName(),
			password: faker.internet.password(),
			...props,
		},
		id,
	)

	return admin
}

@Injectable()
export class AdminsFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
		const admin = makeAdmin(data)

		await this.prisma.user.create({
			data: PrismaAdminMapper.toPrisma(admin),
		})

		return admin
	}
}
