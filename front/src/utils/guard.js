const guard = {}

const authSubscribers = []

guard.onUnauthorized = (callback) => {
  authSubscribers.push(callback)
}

guard.unauthorized = () => {
  authSubscribers.forEach((callback) => callback())
}

const errSubscribers = []

guard.onError = (callback) => {
  errSubscribers.push(callback)
}

guard.error = (err) => {
  errSubscribers.forEach((callback) => callback(err))
}

export default guard;