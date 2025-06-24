import { Controller, Get, HttpCode, Query } from "@nestjs/common"

import { FetchUsersUseCase } from "@/domains/events/application/use-cases/fetch-users"
import { Roles } from "@/infra/auth/roles.decorator"
import { ProfilePresenter } from "@/infra/http/presenters/profile-presenter"

@Controller("/users")
export class FetchUsersController {
	constructor(private fetchUsersUseCase: FetchUsersUseCase) {}

	@Get()
	@Roles(["ADMIN"])
	@HttpCode(200)
	async handle(@Query("page") page: number, @Query("query") query?: string) {
		const result = await this.fetchUsersUseCase.execute({
			page,
			query,
		})

		return {
			users: result.value?.users.map(ProfilePresenter.toHTTP),
		}
	}
}
