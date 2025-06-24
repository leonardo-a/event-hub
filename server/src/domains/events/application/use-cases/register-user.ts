import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { User } from "../../enterprise/entities/user"
import { HashGenerator } from "../cryptography/hash-generator"
import { UsersRepository } from "../repositories/users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

interface RegisterUserUseCaseRequest {
	fullName: string
	email: string
	password: string
}

type RegisterUserUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		user: User
	}
>

@Injectable()
export class RegisterUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		fullName,
		email,
		password,
	}: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			return left(new UserAlreadyExistsError(email))
		}

		const hashedPassword = await this.hashGenerator.hash(password)

		const user = User.create({
			fullName,
			email,
			password: hashedPassword,
		})

		await this.usersRepository.create(user)

		return right({
			user,
		})
	}
}
