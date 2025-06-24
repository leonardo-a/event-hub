import { HashComparer } from "@/domains/events/application/cryptography/hash-comparer"
import { HashGenerator } from "@/domains/events/application/cryptography/hash-generator"

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string) {
		return plain.concat("-hashed")
	}

	async compare(plain: string, hash: string) {
		return plain.concat("-hashed") === hash
	}
}
