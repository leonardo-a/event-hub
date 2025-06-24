import { AdminsRepository } from "@/domains/events/application/repositories/admins-repository"
import type { Admin } from "@/domains/events/enterprise/entities/admin"

export class InMemoryAdminsRepository implements AdminsRepository {
	public items: Admin[] = []

	async findByEmail(email: string): Promise<Admin | null> {
		const admin = this.items.find((admin) => admin.email === email)

		if (!admin) {
			return null
		}

		return admin
	}

	async findById(id: string): Promise<Admin | null> {
		const admin = this.items.find((admin) => admin.id.toString() === id)

		if (!admin) {
			return null
		}

		return admin
	}

	async create(admin: Admin): Promise<void> {
		this.items.push(admin)
	}

	async save(admin: Admin): Promise<void> {
		const adminIndex = this.items.findIndex((item) => item.id === admin.id)

		this.items[adminIndex] = admin
	}

	async delete(admin: Admin): Promise<void> {
		this.items = this.items.filter((i) => i.id !== admin.id)
	}
}
