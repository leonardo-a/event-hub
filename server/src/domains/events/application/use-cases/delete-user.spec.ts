import { makeUser } from "test/factories/make-user"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { DeleteUserUseCase } from "./delete-user"

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe("Delete User Use Case", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()

		sut = new DeleteUserUseCase(inMemoryUsersRepository)
	})

	it("should be able to delete a user", async () => {
		const user = makeUser()

		inMemoryUsersRepository.items.push(user)

		const response = await sut.execute({
			userId: user.id.toString(),
		})

		expect(response.isRight()).toBe(true)
		expect(inMemoryUsersRepository.items).toHaveLength(0)
	})

	it("should not be able to delete an user that doesnt exist", async () => {
		const response = await sut.execute({
			userId: "non-existing-user-id",
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
