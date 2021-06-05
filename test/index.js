import a from 'assert'
import weatherAPI from '../dist/index.js'
import cacheTests from './cache.js'

async function t(){

  let date = '2021-06-05'
  let expected = {
    date,
    median:0,
    mean:0,
  }

  let output = await weatherAPI(date)

  a.deepEqual(output, expected, 'nope')
}

cacheTests()
t()
