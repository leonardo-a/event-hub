import { Module } from "@nestjs/common"

import { AuthenticateUseCase } from "@/domains/events/application/use-cases/authenticate"
import { DeleteUserUseCase } from "@/domains/events/application/use-cases/delete-user"
import { EditUserUseCase } from "@/domains/events/application/use-cases/edit-user"
import { FetchUsersUseCase } from "@/domains/events/application/use-cases/fetch-users"
import { GetProfileUseCase } from "@/domains/events/application/use-cases/get-profile"
import { RegisterAdminUseCase } from "@/domains/events/application/use-cases/register-admin"
import { RegisterUserUseCase } from "@/domains/events/application/use-cases/register-user"
import { CryptographyModule } from "@/infra/cryptography/cryptography.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { AuthenticateController } from "./routes/authenticate.controller"
import { DeleteUserController } from "./routes/delete-user.controller"
import { EditUserController } from "./routes/edit-user.controller"
import { FetchUsersController } from "./routes/fetch-users.controller"
import { GetProfileController } from "./routes/get-profile.controller"
import { RegisterAsAdminController } from "./routes/register-as-admin.controller"
import { RegisterAsUserController } from "./routes/register-as-user.controller"

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		RegisterAsAdminController,
		RegisterAsUserController,
		AuthenticateController,
		FetchUsersController,
		GetProfileController,
		EditUserController,
		DeleteUserController,
	],
	providers: [
		RegisterAdminUseCase,
		RegisterUserUseCase,
		AuthenticateUseCase,
		FetchUsersUseCase,
		GetProfileUseCase,
		EditUserUseCase,
		DeleteUserUseCase,
	],
})
export class UsersModule {}
