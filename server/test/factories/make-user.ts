import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"
import type { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User, type UserProps } from "@/domains/events/enterprise/entities/user"
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user-mapper"
import type { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeUser(props?: Partial<UserProps>, id?: UniqueEntityID) {
	const user = User.create(
		{
			email: faker.internet.email(),
			fullName: faker.person.fullName(),
			password: faker.internet.password(),
			...props,
		},
		id,
	)

	return user
}

@Injectable()
export class UsersFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
		const user = makeUser(data)

		await this.prisma.user.create({
			data: PrismaUserMapper.toPrisma(user),
		})

		return user
	}
}
