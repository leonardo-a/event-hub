import { makeReservation } from "test/factories/make-reservation"
import { InMemoryReservationsRepository } from "test/repositories/in-memory-reservations-repository"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { CancelReservationUseCase } from "./cancel-reservation"

let inMemoryReservationsRepository: InMemoryReservationsRepository
let sut: CancelReservationUseCase

describe("Cancel Reservation Use Case", () => {
	beforeEach(() => {
		inMemoryReservationsRepository = new InMemoryReservationsRepository()
		sut = new CancelReservationUseCase(inMemoryReservationsRepository)
	})

	it("should be able to cancel a reservation", async () => {
		const reservation = makeReservation()

		inMemoryReservationsRepository.items.push(reservation)

		const response = await sut.execute({
			reservationId: reservation.id.toString(),
			userId: reservation.userId.toString(),
		})

		expect(response.isRight()).toBe(true)
		expect(inMemoryReservationsRepository.items[0].status).toEqual("CANCELED")
	})

	it("should not be able to not allowed user cancel a reservation", async () => {
		const reservation = makeReservation()

		inMemoryReservationsRepository.items.push(reservation)

		const response = await sut.execute({
			reservationId: reservation.id.toString(),
			userId: "not-allowed-user",
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(NotAllowedError)
	})

	it("should not be able to cancel a non-existing reservation", async () => {
		const response = await sut.execute({
			reservationId: "non-existing-reservation-id",
			userId: "user-1",
		})

		expect(response.isLeft()).toBe(true)
	})
})
