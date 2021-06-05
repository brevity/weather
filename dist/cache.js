import { readFile } from 'fs/promises';

const data = JSON.parse(
  await readFile(
    new URL('./cache.json', import.meta.url)
  )
);

const cache = {
  data,
  check: checkCache
}

export function checkCache (date){
  let cached = data[date]
  return cached == undefined ? false : cached
}

export default function newCache(){
  return cache
}
