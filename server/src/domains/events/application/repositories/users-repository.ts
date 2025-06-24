import type { FilterParams } from "@/core/repositories/filter-params"
import type { User } from "../../enterprise/entities/user"

export abstract class UsersRepository {
	abstract findByEmail(email: string): Promise<User | null>

	abstract findById(id: string): Promise<User | null>

	abstract findMany(params: FilterParams): Promise<User[]>

	abstract create(user: User): Promise<void>

	abstract save(user: User): Promise<void>

	abstract delete(user: User): Promise<void>
}
