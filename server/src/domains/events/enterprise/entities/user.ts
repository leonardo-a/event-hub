import { Entity } from "@/core/entities/entity"
import type { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface UserProps {
	fullName: string
	email: string
	password: string
}

export class User extends Entity<UserProps> {
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

	static create(props: UserProps, id?: UniqueEntityID): User {
		const user = new User(props, id)

		return user
	}
}
