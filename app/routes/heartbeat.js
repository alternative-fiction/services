import User from "../models/user"

const heartbeat = {
  config: {auth: false},
  handler(request, reply) {
    return reply({
      message: `${(new Date()).toLocaleTimeString()}: Still alive :)`,
      statusCode: 200
    })
  },
  method: "GET",
  path: "/"
}

const authorizedHeartbeat = {
  handler({auth: {credentials}}, reply) {
    const uuid = credentials.userUuid

    new User({uuid})
      .fetch({require: true})
      .then(user => {
        return reply({
          message: `${(new Date()).toLocaleTimeString()}: Hello there, ${user.get("displayName")}, ${user.get("uuid")}`,
          statusCode: 200
        })
      })
      .catch(User.NotFoundError, () => reply.notFound(`User ID ${uuid} not found.`))
  },
  method: "GET",
  path: "/secure-heartbeat"
}

export default [
  authorizedHeartbeat,
  heartbeat
]
