import a from 'assert'
import newCache from '../dist/cache.js'


export default async function cacheTests(){
  const cache = await newCache()

  let in1 = '2021-06-05'
  let in2 = '2021-06-04'

  let results = {
    out1: cache.check(in1),
    out2: cache.check(in2),
  }

  let expectations = {
    out1: { date: '2021-06-05' },
    out2: false,
  }

  a.deepEqual(results, expectations, 'Cache not operating as expected.')
}
