import newStore from './store.js'
import newCache from './cache.js'

const cache = newCache()
const store = newStore()

export default async function weatherAPI(date){
  let cached = await cache.check(date)
  // if (cached) return cached

  let threshold = 1
  let coords = await store.cities(threshold)
  let result = await store.climate({ coords, date })
  //cache.insert(date, result)
  return Object.assign({date}, result)

}
