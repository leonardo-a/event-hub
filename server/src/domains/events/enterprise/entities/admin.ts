import { Entity } from "@/core/entities/entity"
import type { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface AdminProps {
	fullName: string
	email: string
	password: string
}

export class Admin extends Entity<AdminProps> {
	get fullName() {
		return this.props.fullName
	}

	set fullName(value: string) {
		this.props.fullName = value
	}

	get email() {
		return this.props.email
	}

	set email(value: string) {
		this.props.email = value
	}

	get password() {
		return this.props.password
	}

	set password(value: string) {
		this.props.password = value
	}

	static create(props: AdminProps, id?: UniqueEntityID): Admin {
		const admin = new Admin(props, id)

		return admin
	}
}
