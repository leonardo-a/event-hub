import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeAdmin } from "test/factories/make-admin"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { RegisterAdminUseCase } from "./register-admin"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakehasher: FakeHasher
let sut: RegisterAdminUseCase

describe("Register Admin Use Case", () => {
	beforeEach(() => {
		inMemoryAdminsRepository = new InMemoryAdminsRepository()
		fakehasher = new FakeHasher()

		sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakehasher)
	})

	it("should be able to register a admin", async () => {
		const response = await sut.execute({
			fullName: "John Doe",
			email: "johndoe@email.com",
			password: "password123",
		})

		expect(response.isRight()).toBe(true)

		if (response.isRight()) {
			expect(response.value.admin.fullName).toEqual("John Doe")
			expect(response.value.admin.password).toEqual("password123-hashed")
		}
	})

	it("should not be able to register same admin twice", async () => {
		inMemoryAdminsRepository.items.push(
			makeAdmin({
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
