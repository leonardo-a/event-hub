import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { Admin } from "../../enterprise/entities/admin"
import { HashGenerator } from "../cryptography/hash-generator"
import { AdminsRepository } from "../repositories/admins-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

interface RegisterAdminUseCaseRequest {
	fullName: string
	email: string
	password: string
}

type RegisterAdminUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		admin: Admin
	}
>

@Injectable()
export class RegisterAdminUseCase {
	constructor(
		private adminsRepository: AdminsRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		fullName,
		email,
		password,
	}: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
		const adminWithSameEmail = await this.adminsRepository.findByEmail(email)

		if (adminWithSameEmail) {
			return left(new UserAlreadyExistsError(email))
		}

		const hashedPassword = await this.hashGenerator.hash(password)

		const admin = Admin.create({
			fullName,
			email,
			password: hashedPassword,
		})

		await this.adminsRepository.create(admin)

		return right({
			admin,
		})
	}
}
