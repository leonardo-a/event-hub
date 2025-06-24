import { makeUser } from "test/factories/make-user"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { FetchUsersUseCase } from "./fetch-users"

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchUsersUseCase

describe("Fetch Users Use Case", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new FetchUsersUseCase(inMemoryUsersRepository)
	})

	it("should be able to fetch users", async () => {
		inMemoryUsersRepository.items.push(
			makeUser({
				fullName: "John Doe",
			}),
			makeUser({
				fullName: "Jane Doe",
			}),
			makeUser({
				fullName: "Jim Johnson",
			}),
		)

		const response = await sut.execute({
			page: 1,
			query: "Doe",
		})

		expect(response.isRight()).toBe(true)
		expect(response.value?.users).toHaveLength(2)
		expect(response.value?.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ fullName: "John Doe" }),
				expect.objectContaining({ fullName: "Jane Doe" }),
			]),
		)
	})

	it("should be able to fetch users with pagination", async () => {
		for (let i = 1; i <= 23; i++) {
			inMemoryUsersRepository.items.push(
				makeUser({
					fullName: `User ${i}`,
				}),
			)
		}

		const response = await sut.execute({
			page: 2,
		})

		expect(response.isRight()).toBe(true)
		expect(response.value?.users).toHaveLength(3)
		expect(response.value?.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ fullName: "User 21" }),
				expect.objectContaining({ fullName: "User 22" }),
				expect.objectContaining({ fullName: "User 23" }),
			]),
		)
	})
})
