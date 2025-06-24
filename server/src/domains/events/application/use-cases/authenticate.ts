import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import type { Admin } from "../../enterprise/entities/admin"
import { User } from "../../enterprise/entities/user"
import { Encrypter } from "../cryptography/encrypter"
import { HashComparer } from "../cryptography/hash-comparer"
import { AdminsRepository } from "../repositories/admins-repository"
import { UsersRepository } from "../repositories/users-repository"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}

type AuthenticateUseCaseResponse = Either<
	InvalidCredentialsError,
	{ accessToken: string }
>

@Injectable()
export class AuthenticateUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private adminsRepository: AdminsRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		let profile: User | Admin | null = null

		profile = await this.usersRepository.findByEmail(email)

		if (!profile) {
			profile = await this.adminsRepository.findByEmail(email)
		}

		if (!profile) {
			return left(new InvalidCredentialsError())
		}

		const passwordMatches = await this.hashComparer.compare(
			password,
			profile.password,
		)

		if (!passwordMatches) {
			return left(new InvalidCredentialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			sub: profile.id.toString(),
			name: profile.fullName,
			role: profile instanceof User ? "USER" : "ADMIN",
		})

		return right({ accessToken })
	}
}
