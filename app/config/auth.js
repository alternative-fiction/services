import crypto from "crypto"
import {fromPairs, toPairs} from "lodash"
import uniqueId from "../lib/unique-id"

const {env} = process

if (env.NODE_ENV === "production" && !env.AUTH_SECRET) throw new Error("Missing AUTH_SECRET Env")

const ALGORITHM = "aes-256-gcm"
const AUTH_SECRET = env.AUTH_SECRET || `development_${new Date().getUTCFullYear()}`
const CLIENT_ENCODING = "base64"
const SOURCE_ENCODING = "utf8"
const EXPIRATION = 30 * 86400000

export function createAuth(user) {
  const segments = toPairs({
    createdAt: (new Date()).toISOString(),
    username: user.get("username"),
    userRole: user.get("role"),
    userUuid: user.get("uuid"),
    uuid: uniqueId(12)
  })

  const initializationVector = uniqueId(12)
  const cipher = crypto.createCipher(ALGORITHM, AUTH_SECRET, initializationVector)
  let crypted = cipher.update(JSON.stringify(segments), SOURCE_ENCODING, CLIENT_ENCODING)

  crypted += cipher.final(CLIENT_ENCODING)

  return `${crypted}-${cipher.getAuthTag().toString(CLIENT_ENCODING)}`
}

function authenticate({raw: {req}}, reply) {
  const {authorization} = req.headers

  if (!authorization) return reply.unauthorized("Expected authorization header")

  const [content, tag] = authorization.split("-")
  const decipher = crypto.createDecipher(ALGORITHM, AUTH_SECRET)

  decipher.setAuthTag(new Buffer(tag, CLIENT_ENCODING))

  let decrpyted = decipher.update(content, CLIENT_ENCODING, SOURCE_ENCODING)
  let credentials

  try {
    decrpyted += decipher.final(SOURCE_ENCODING)

    credentials = fromPairs(JSON.parse(decrpyted))
    credentials.createdAt = new Date(credentials.createdAt)
  }
  catch (error) {
    return reply.unauthorized(error.message)
  }

  if (credentials.createdAt.getTime() + EXPIRATION < new Date().getTime())
    return reply.unauthorized("Credentials are expired")

  return reply.continue({credentials})
}

export default function authScheme() {
  return {authenticate}
}
