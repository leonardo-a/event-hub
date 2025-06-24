import { Injectable } from "@nestjs/common"

import { AdminsRepository } from "@/domains/events/application/repositories/admins-repository"
import type { User } from "@/domains/events/enterprise/entities/user"
import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper"

import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
	constructor(private prisma: PrismaService) {}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
				role: "ADMIN",
			},
		})

		if (!user) {
			return null
		}

		return PrismaAdminMapper.toDomain(user)
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
				role: "ADMIN",
			},
		})

		if (!user) {
			return null
		}

		return PrismaAdminMapper.toDomain(user)
	}

	async create(user: User): Promise<void> {
		const data = PrismaAdminMapper.toPrisma(user)

		await this.prisma.user.create({ data })
	}

	async save(user: User): Promise<void> {
		const data = PrismaAdminMapper.toPrisma(user)

		await this.prisma.user.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async delete(user: User): Promise<void> {
		await this.prisma.user.delete({
			where: {
				id: user.id.toString(),
			},
		})
	}
}
