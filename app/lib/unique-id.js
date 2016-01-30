import Chance from "chance"

const chance = new Chance()
const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export default function uniqueId(length = 12) {
  return chance.string({length, pool})
}
