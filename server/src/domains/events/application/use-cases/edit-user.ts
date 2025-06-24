import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { HashGenerator } from "../cryptography/hash-generator"
import { UsersRepository } from "../repositories/users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

interface EditUserUseCaseRequest {
	id: string
	fullName: string
	email: string
	password: string
}

type EditUserUseCaseResponse = Either<
	ResourceNotFoundError | UserAlreadyExistsError,
	null
>

@Injectable()
export class EditUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		id,
		fullName,
		email,
		password,
	}: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			return left(new ResourceNotFoundError())
		}

		const userWithEmail = await this.usersRepository.findByEmail(email)

		if (userWithEmail) {
			return left(new UserAlreadyExistsError(email))
		}

		user.fullName = fullName
		user.email = email
		user.password = await this.hashGenerator.hash(password)

		await this.usersRepository.save(user)

		return right(null)
	}
}
