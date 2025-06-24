import { makeAdmin } from "test/factories/make-admin"
import { makeUser } from "test/factories/make-user"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { GetProfileUseCase } from "./get-profile"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetProfileUseCase

describe("Get Profile Use Case", () => {
	beforeEach(() => {
		inMemoryAdminsRepository = new InMemoryAdminsRepository()
		inMemoryUsersRepository = new InMemoryUsersRepository()

		sut = new GetProfileUseCase(
			inMemoryUsersRepository,
			inMemoryAdminsRepository,
		)
	})

	it("should be able to get a user profile", async () => {
		const user = makeUser()

		inMemoryUsersRepository.items.push(user)

		const response = await sut.execute({
			profileId: user.id.toString(),
		})

		expect(response.isRight()).toBe(true)

		if (response.isRight()) {
			expect(response.value.profile).toEqual(user)
		}
	})

	it("should be able to get an admin profile", async () => {
		const admin = makeAdmin()

		inMemoryAdminsRepository.items.push(admin)

		const response = await sut.execute({
			profileId: admin.id.toString(),
		})

		expect(response.isRight()).toBe(true)

		if (response.isRight()) {
			expect(response.value.profile).toEqual(admin)
		}
	})

	it("should not be able to get a profile that does not exist", async () => {
		const response = await sut.execute({
			profileId: "non-existing-id",
		})

		expect(response.isLeft()).toBe(true)

		if (response.isLeft()) {
			expect(response.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
