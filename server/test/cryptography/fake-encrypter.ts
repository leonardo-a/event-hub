import { Encrypter } from "@/domains/events/application/cryptography/encrypter"

export class FakeEncrypter implements Encrypter {
	async encrypt(payload: Record<string, unknown>) {
		return JSON.stringify(payload)
	}
}
