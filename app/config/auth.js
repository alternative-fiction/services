import crypto from "crypto"
import log from "../lib/log"
import {fromPairs, toPairs} from "lodash"
import uniqueId from "../lib/unique-id"

const ALGORITHM = "aes-256-gcm"
const AUTH_SECRET = process.env.AUTH_SECRET || `development_${new Date().getUTCFullYear()}`
const ENCRYPTED_ENCODING = "base64"
const SOURCE_ENCODING = "utf8"

export function createAuth(user) {
  const segments = toPairs({
    createdAt: (new Date()).toISOString(),
    userRole: user.get("role"),
    userUuid: user.get("uuid")
  })

  const initializationVector = uniqueId(12)
  const cipher = crypto.createCipher(ALGORITHM, AUTH_SECRET, initializationVector)
  let crypted = cipher.update(JSON.stringify(segments), SOURCE_ENCODING, ENCRYPTED_ENCODING)

  crypted += cipher.final(ENCRYPTED_ENCODING)

  return crypted + ":" + cipher.getAuthTag().toString(ENCRYPTED_ENCODING)
}

function authenticate({raw: {req}}, reply) {
  const {authorization} = req.headers

  if (!authorization) return reply.unauthorized()

  const [content, tag] = authorization.split(":")
  const decipher = crypto.createDecipher(ALGORITHM, AUTH_SECRET)

  decipher.setAuthTag(new Buffer(tag, ENCRYPTED_ENCODING))

  let decrpyted = decipher.update(content, ENCRYPTED_ENCODING, SOURCE_ENCODING)
  let credentials

  try {
    decrpyted += decipher.final(SOURCE_ENCODING)
    credentials = fromPairs(JSON.parse(decrpyted))
  }
  catch (error) {
    log("Error while decrpyting auth header", error)

    return reply.unauthorized()
  }

  // TODO: Check createdAt

  return reply.continue({credentials})
}

export default function authScheme() {
  return {authenticate}
}
