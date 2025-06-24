import type { FilterParams } from "@/core/repositories/filter-params"
import { UsersRepository } from "@/domains/events/application/repositories/users-repository"
import type { User } from "@/domains/events/enterprise/entities/user"

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async findByEmail(email: string): Promise<User | null> {
		const user = this.items.find((user) => user.email === email)

		if (!user) {
			return null
		}

		return user
	}

	async findById(id: string): Promise<User | null> {
		const user = this.items.find((user) => user.id.toString() === id)

		if (!user) {
			return null
		}

		return user
	}

	async findMany({ page, query }: FilterParams): Promise<User[]> {
		const users = this.items
			.filter((user) => {
				if (query) {
					return (
						user.fullName.toLowerCase().includes(query.toLowerCase()) ||
						user.email.toLowerCase().includes(query.toLowerCase())
					)
				}

				return true
			})
			.slice((page - 1) * 20, page * 20)

		return users
	}

	async create(user: User): Promise<void> {
		this.items.push(user)
	}

	async save(user: User): Promise<void> {
		const userIndex = this.items.findIndex((item) => item.id === user.id)

		this.items[userIndex] = user
	}

	async delete(user: User): Promise<void> {
		this.items = this.items.filter((i) => i.id !== user.id)
	}
}
