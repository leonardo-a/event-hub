import { makeEvent } from "test/factories/make-event"
import { makeReservation } from "test/factories/make-reservation"
import { makeUser } from "test/factories/make-user"
import { InMemoryReservationsRepository } from "test/repositories/in-memory-reservations-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { FetchUserReservationsUseCase } from "./fetch-user-reservations"

let inMemoryReservationsRepository: InMemoryReservationsRepository
let sut: FetchUserReservationsUseCase

describe("Fetch User Reservations Use Case", () => {
	beforeEach(() => {
		inMemoryReservationsRepository = new InMemoryReservationsRepository()
		sut = new FetchUserReservationsUseCase(inMemoryReservationsRepository)
	})

	it("should be able to fetch user reservations", async () => {
		const user1 = makeUser()
		const user2 = makeUser()

		const event1 = makeEvent()
		const event2 = makeEvent()
		const event3 = makeEvent()

		inMemoryReservationsRepository.items.push(
			makeReservation({
				userId: user1.id,
				eventId: event1.id,
			}),
			makeReservation({
				userId: user1.id,
				eventId: event2.id,
			}),
			makeReservation({
				userId: user2.id,
				eventId: event3.id,
			}),
		)

		const response = await sut.execute({
			userId: user1.id.toString(),
			page: 1,
		})

		expect(response.isRight()).toBeTruthy()
		expect(response.value?.reservations).toHaveLength(2)
		expect(response.value?.reservations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ userId: user1.id, eventId: event1.id }),
				expect.objectContaining({ userId: user1.id, eventId: event2.id }),
			]),
		)
	})

	it("should be able to fetch paginated user reservations", async () => {
		const user = makeUser()

		for (let i = 1; i <= 23; i++) {
			const event = makeEvent(
				{ name: `Event ${i}` },
				new UniqueEntityID(`event-${i}`),
			)
			inMemoryReservationsRepository.items.push(
				makeReservation({
					userId: user.id,
					eventId: event.id,
				}),
			)
		}

		const response = await sut.execute({
			userId: user.id.toString(),
			page: 2,
		})

		expect(response.isRight()).toBeTruthy()
		expect(response.value?.reservations).toHaveLength(3)
		expect(response.value?.reservations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					userId: user.id,
					eventId: new UniqueEntityID(`event-21`),
				}),
				expect.objectContaining({
					userId: user.id,
					eventId: new UniqueEntityID(`event-22`),
				}),
				expect.objectContaining({
					userId: user.id,
					eventId: new UniqueEntityID(`event-23`),
				}),
			]),
		)
	})
})
