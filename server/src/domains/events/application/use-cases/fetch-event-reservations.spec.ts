import { makeEvent } from "test/factories/make-event"
import { makeReservation } from "test/factories/make-reservation"
import { makeUser } from "test/factories/make-user"
import { InMemoryReservationsRepository } from "test/repositories/in-memory-reservations-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { FetchEventReservationsUseCase } from "./fetch-event-reservations"

let inMemoryReservationsRepository: InMemoryReservationsRepository
let sut: FetchEventReservationsUseCase

describe("Fetch Event Reservations Use Case", () => {
	beforeEach(() => {
		inMemoryReservationsRepository = new InMemoryReservationsRepository()
		sut = new FetchEventReservationsUseCase(inMemoryReservationsRepository)
	})

	it("should be able to fetch user reservations", async () => {
		const event1 = makeEvent()
		const event2 = makeEvent()

		const user1 = makeUser()
		const user2 = makeUser()
		const user3 = makeUser()

		inMemoryReservationsRepository.items.push(
			makeReservation({
				userId: user1.id,
				eventId: event1.id,
			}),
			makeReservation({
				userId: user2.id,
				eventId: event1.id,
			}),
			makeReservation({
				userId: user3.id,
				eventId: event2.id,
			}),
		)

		const response = await sut.execute({
			eventId: event1.id.toString(),
			page: 1,
		})

		expect(response.isRight()).toBeTruthy()
		expect(response.value?.reservations).toHaveLength(2)
		expect(response.value?.reservations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ userId: user1.id, eventId: event1.id }),
				expect.objectContaining({ userId: user2.id, eventId: event1.id }),
			]),
		)
	})

	it("should be able to fetch paginated event reservations", async () => {
		const event = makeEvent()

		for (let i = 1; i <= 23; i++) {
			const user = makeUser(
				{ fullName: `User ${i}` },
				new UniqueEntityID(`user-${i}`),
			)

			inMemoryReservationsRepository.items.push(
				makeReservation({
					userId: user.id,
					eventId: event.id,
				}),
			)
		}

		const response = await sut.execute({
			eventId: event.id.toString(),
			page: 2,
		})

		expect(response.isRight()).toBeTruthy()
		expect(response.value?.reservations).toHaveLength(3)
		expect(response.value?.reservations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					eventId: event.id,
					userId: new UniqueEntityID(`user-21`),
				}),
				expect.objectContaining({
					eventId: event.id,
					userId: new UniqueEntityID(`user-22`),
				}),
				expect.objectContaining({
					eventId: event.id,
					userId: new UniqueEntityID(`user-23`),
				}),
			]),
		)
	})
})
