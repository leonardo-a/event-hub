import { Injectable } from "@nestjs/common"

import { type Either, right } from "@/core/either"
import type { User } from "../../enterprise/entities/user"
import { UsersRepository } from "../repositories/users-repository"

interface FetchUsersUseCaseRequest {
	page: number
	query?: string
}

type FetchUsersUseCaseResponse = Either<null, { users: User[] }>

@Injectable()
export class FetchUsersUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		page,
		query,
	}: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
		const users = await this.usersRepository.findMany({
			page,
			query,
		})

		return right({
			users,
		})
	}
}
