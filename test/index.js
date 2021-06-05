import a from 'assert'
import weatherAPI from '../dist/index.js'
import cacheTests from './cache.js'

async function t(){

  let input = '2021-01-01'
  let expected = {
    date: input,
    mean: -700.7,
    median: -22.55,
  }

  let output = await weatherAPI(input)
  a.deepEqual(output, expected, 'Not the output we were expecting')
}

cacheTests()
t()
