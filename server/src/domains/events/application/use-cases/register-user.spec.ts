import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeUser } from "test/factories/make-user"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { RegisterUserUseCase } from "./register-user"

let inMemoryUsersRepository: InMemoryUsersRepository
let fakehasher: FakeHasher
let sut: RegisterUserUseCase

describe("Register User Use Case", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		fakehasher = new FakeHasher()

		sut = new RegisterUserUseCase(inMemoryUsersRepository, fakehasher)
	})

	it("should be able to register a user", async () => {
		const response = await sut.execute({
			fullName: "John Doe",
			email: "johndoe@email.com",
			password: "password123",
		})

		expect(response.isRight()).toBe(true)

		if (response.isRight()) {
			expect(response.value.user.fullName).toEqual("John Doe")
			expect(response.value.user.password).toEqual("password123-hashed")
		}
	})

	it("should not be able to register same user twice", async () => {
		inMemoryUsersRepository.items.push(
			makeUser({
				fullName: "John Doe",
				email: "johndoe@email.com",
			}),
		)

		const response = await sut.execute({
			fullName: "John Doe",
			email: "johndoe@email.com",
			password: "password123",
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(UserAlreadyExistsError)
	})
})
