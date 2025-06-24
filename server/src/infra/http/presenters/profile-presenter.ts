import { Admin } from "@/domains/events/enterprise/entities/admin"
import { User } from "@/domains/events/enterprise/entities/user"

export class ProfilePresenter {
	static toHTTP(profile: Admin | User) {
		return {
			id: profile.id.toString(),
			fullName: profile.fullName,
			email: profile.email,
			role: profile instanceof User ? "USER" : "ADMIN",
		}
	}
}
