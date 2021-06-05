import newStore from './store.js'
import newCache from './cache.js'

const cache = newCache()
const store = newStore()

// Lots of room for caching here... results... coords...
export default async function weatherAPI(date){
    if(!valid(date)) throw(new Error("Date does not conform to format"))
    let cached = await cache.check(date)
    // if (cached) return cached

    let threshold = 1
    let coords = await store.cities(threshold)
    let result = await store.climate({ coords, date })
    //cache.insert(date, result)
    return Object.assign({date}, result)

}

function valid(d){
  try{
    let p = d.split('-')
    if(
      p.length != 3
      || p[0].length != 4
      || parseInt(p[1]) > 12
      || parseInt(p[2]) > 31
    ){
      return false
    }else{
      return true
    }
  } catch(e){
    return false
  }
}
