import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeUser } from "test/factories/make-user"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { EditUserUseCase } from "./edit-user"

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: EditUserUseCase

describe("Edit User Use Case", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		fakeHasher = new FakeHasher()

		sut = new EditUserUseCase(inMemoryUsersRepository, fakeHasher)
	})

	it("should be able to edit an user", async () => {
		const user = makeUser({
			fullName: "John Doe",
			email: "johndoe@email.com",
			password: "password123",
		})

		inMemoryUsersRepository.items.push(user)

		const response = await sut.execute({
			id: user.id.toString(),
			fullName: "Jane Doe",
			email: "janedoe@email.com",
			password: "newpassword123",
		})

		expect(response.isRight()).toBe(true)
		expect(inMemoryUsersRepository.items).toHaveLength(1)
		expect(inMemoryUsersRepository.items[0]).toEqual(
			expect.objectContaining({
				fullName: "Jane Doe",
				email: "janedoe@email.com",
				password: "newpassword123-hashed",
			}),
		)
	})

	it("should not be able to edit an user that doesnt exist", async () => {
		const response = await sut.execute({
			id: "non-existing-user-id",
			fullName: "Jane Doe",
			email: "janedoe@email.com",
			password: "newpassword123",
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
