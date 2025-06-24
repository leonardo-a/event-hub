import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeAdmin } from "test/factories/make-admin"
import { makeUser } from "test/factories/make-user"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { AuthenticateUseCase } from "./authenticate"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe("Authenticate Use Case", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		inMemoryAdminsRepository = new InMemoryAdminsRepository()
		fakeHasher = new FakeHasher()
		fakeEncrypter = new FakeEncrypter()

		sut = new AuthenticateUseCase(
			inMemoryUsersRepository,
			inMemoryAdminsRepository,
			fakeHasher,
			fakeEncrypter,
		)
	})

	it("should be able to authenticate as an user", async () => {
		const user = makeUser({
			fullName: "John Doe",
			email: "johndoe@email.com",
			password: "123456-hashed",
		})

		inMemoryUsersRepository.items.push(user)

		const result = await sut.execute({
			email: "johndoe@email.com",
			password: "123456",
		})

		expect(result.isRight()).toBeTruthy()
		if (result.isRight()) {
			expect(JSON.parse(result.value.accessToken)).toEqual(
				expect.objectContaining({
					sub: user.id.toString(),
					email: user.email,
					role: "USER",
				}),
			)
		}
	})

	it("should be able to authenticate as an admin", async () => {
		const admin = makeAdmin({
			fullName: "Jane Doe",
			email: "janedoe@email.com",
			password: "123456-hashed",
		})

		inMemoryAdminsRepository.items.push(admin)

		const result = await sut.execute({
			email: "janedoe@email.com",
			password: "123456",
		})

		expect(result.isRight()).toBeTruthy()
		if (result.isRight()) {
			expect(JSON.parse(result.value.accessToken)).toEqual(
				expect.objectContaining({
					sub: admin.id.toString(),
					email: admin.email,
					role: "ADMIN",
				}),
			)
		}
	})

	it("should not be able to authenticate with wrong password", async () => {
		const admin = makeAdmin({
			fullName: "Jane Doe",
			email: "janedoe@email.com",
			password: "123456-hashed",
		})

		inMemoryAdminsRepository.items.push(admin)

		const result = await sut.execute({
			email: "janedoe@email.com",
			password: "wrong-password",
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(InvalidCredentialsError)
	})

	it("should not be able to authenticate unexisting user", async () => {
		const result = await sut.execute({
			email: "janedoe@email.com",
			password: "123456",
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(InvalidCredentialsError)
	})
})
