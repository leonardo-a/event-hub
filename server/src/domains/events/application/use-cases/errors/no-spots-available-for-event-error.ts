import type { UseCaseError } from "@/core/errors/use-case-error"

export class NoSpotsAvailableForEventError
	extends Error
	implements UseCaseError
{
	constructor() {
		super("No spots available for this event.")
	}
}
