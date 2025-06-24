import type { User as PrismaAdmin } from "generated/prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Admin } from "@/domains/events/enterprise/entities/admin"

export class PrismaAdminMapper {
	static toDomain(raw: PrismaAdmin): Admin {
		return Admin.create(
			{
				email: raw.email,
				fullName: raw.fullName,
				password: raw.password,
			},
			new UniqueEntityID(raw.id),
		)
	}

	static toPrisma(admin: Admin): PrismaAdmin {
		return {
			id: admin.id.toString(),
			fullName: admin.fullName,
			email: admin.email,
			password: admin.password,
			role: "ADMIN",
		}
	}
}
