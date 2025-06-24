import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import type { Admin } from "../../enterprise/entities/admin"
import type { User } from "../../enterprise/entities/user"
import { AdminsRepository } from "../repositories/admins-repository"
import { UsersRepository } from "../repositories/users-repository"

interface GetProfileUseCaseRequest {
	profileId: string
}

type GetProfileUseCaseResponse = Either<
	ResourceNotFoundError,
	{ profile: User | Admin }
>

@Injectable()
export class GetProfileUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private adminsRepository: AdminsRepository,
	) {}

	async execute({
		profileId,
	}: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
		let profile: User | Admin | null = null

		profile = await this.usersRepository.findById(profileId)

		if (!profile) {
			profile = await this.adminsRepository.findById(profileId)
		}

		if (!profile) {
			return left(new ResourceNotFoundError())
		}

		return right({ profile })
	}
}
