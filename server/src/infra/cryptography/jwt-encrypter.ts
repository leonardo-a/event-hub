/** biome-ignore-all lint/style/useImportType: prevents injection */

import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { Encrypter } from "@/domains/events/application/cryptography/encrypter"

@Injectable()
export class JwtEncrypter implements Encrypter {
	constructor(private jwtService: JwtService) {}

	encrypt(payload: Record<string, unknown>): Promise<string> {
		return this.jwtService.signAsync(payload)
	}
}
