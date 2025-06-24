import type { Admin } from "../../enterprise/entities/admin"

export abstract class AdminsRepository {
	abstract findByEmail(email: string): Promise<Admin | null>

	abstract findById(id: string): Promise<Admin | null>

	abstract create(admin: Admin): Promise<void>

	abstract save(admin: Admin): Promise<void>

	abstract delete(admin: Admin): Promise<void>
}
