const guard = {}

const subscribers = []

guard.onUnauthorized = (callback) => {
  subscribers.push(callback)
}

guard.unauthorized = () => {
  subscribers.forEach((callback) => callback())
}

export default guard;