import type { User as PrismaUser } from "generated/prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User } from "@/domains/events/enterprise/entities/user"

export class PrismaUserMapper {
	static toDomain(raw: PrismaUser): User {
		return User.create(
			{
				email: raw.email,
				fullName: raw.fullName,
				password: raw.password,
			},
			new UniqueEntityID(raw.id),
		)
	}

	static toPrisma(user: User): PrismaUser {
		return {
			id: user.id.toString(),
			fullName: user.fullName,
			email: user.email,
			password: user.password,
			role: "USER",
		}
	}
}
