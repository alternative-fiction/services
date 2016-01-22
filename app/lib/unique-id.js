const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export default function uniqueId(length = 12) {
  let guid = ""

  for (let i = 0; i < length; i++) {
    guid += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return guid
}
