import { Injectable } from "@nestjs/common"

import type { FilterParams } from "@/core/repositories/filter-params"
import { UsersRepository } from "@/domains/events/application/repositories/users-repository"
import type { User } from "@/domains/events/enterprise/entities/user"
import { PrismaUserMapper } from "../mappers/prisma-user-mapper"

import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
	constructor(private prisma: PrismaService) {}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
				role: "USER",
			},
		})

		if (!user) {
			return null
		}

		return PrismaUserMapper.toDomain(user)
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
				role: "USER",
			},
		})

		if (!user) {
			return null
		}

		return PrismaUserMapper.toDomain(user)
	}

	async findMany({ page, query }: FilterParams): Promise<User[]> {
		const users = await this.prisma.user.findMany({
			where: {
				role: "USER",
				OR: [
					{
						fullName: {
							contains: query ?? "",
							mode: "insensitive",
						},
					},
					{
						email: {
							contains: query ?? "",
							mode: "insensitive",
						},
					},
				],
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return users.map(PrismaUserMapper.toDomain)
	}

	async create(user: User): Promise<void> {
		const data = PrismaUserMapper.toPrisma(user)

		await this.prisma.user.create({ data })
	}

	async save(user: User): Promise<void> {
		const data = PrismaUserMapper.toPrisma(user)

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
