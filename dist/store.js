import fs from 'fs'
import xlsx from 'xlsx-parse-stream'
import { Transform } from 'readable-stream'

const store = {
  cities:  queryCitiesStore,
  climate: queryClimateStore
}

export async function queryClimateStore (q){
  var results = {
    mean:null,
    median:null,
  }
  return new Promise((resolve,reject) => {
  var temps = []
  fs.createReadStream('./data/climate.xlsx')
    .pipe(xlsx())
    .pipe(new Transform({ objectMode: true, transform(obj, enc, cb) {

      let [ year, month, day ] = q.date.split('-')

      if( obj.LOCAL_YEAR == parseInt(year) && obj.LOCAL_MONTH == parseInt(month) && obj.LOCAL_DAY == parseInt(day) && obj.MEAN_TEMPERATURE != undefined) {
        if( coordsContains(q.coords, obj.lat, obj.lng)) {
          temps.push(obj.MEAN_TEMPERATURE)
        }
      }
      cb()

    }}))
    .on('finish', () => {
      if(temps.length == 0) {
        return reject(new Error("Query returned no results"))
      }

      return resolve({
        mean: getMean(temps),
        median: getMedian(temps),
      })
    })
  })
}


function getMedian(vals){
  let l = vals.length
  return l%2 == 0
    ? vals[l/2]
    : ((vals[Math.floor(l/2)] + vals[Math.ceil(l/2)])/2)
}

function getMean(vals){
  return vals.reduce((m,c,i,a)=>{
    m += c
    if(i == a.length) return (m / a.length).toPrecision(1)
    return m
  })
}


function coordsContains(coords, x,y){
  var f = x => Math.floor(x *10)
  for(let i = 0; i < coords.length; i++){

    if(f(coords[i][0]) == f(x) && f(coords[i][1]) == f(y)){
      return true
    }
  }
  return false
}

export async function queryCitiesStore (populationThreshold){
  return new Promise((resolve,reject) => {
  var coords = []
  fs.createReadStream('./data/cities.xlsx')
    .pipe(xlsx())
    .pipe(new Transform({ objectMode: true, transform(obj, enc, cb) {
      if(obj.population > populationThreshold && obj.iso2 == 'CA'){
        coords.push([obj.lat, obj.lng])
      }
      cb()
    }}))
    .on('finish', () => resolve(coords))
  })
}

export default function newStore(){
  return store
}

// EXEMPLAR
// {
//   lng: -89.32166667,
//   lat: 48.37194444,
//   STATION_NAME: 'THUNDER BAY A',
//   CLIMATE_IDENTIFIER: 6048262,
//   ID: '6048262.2020.1.9',
//   LOCAL_DATE: 2021-01-09T00:00:00.000Z,
//   PROVINCE_CODE: 'ON',
//   LOCAL_YEAR: 2021,
//   LOCAL_MONTH: 1,
//   LOCAL_DAY: 9,
//   MEAN_TEMPERATURE: -8.2,
//   MIN_TEMPERATU^CM',
//   SPEED_MAX_GUST_FLAG: 'M',
//   COOLING_DEGREE_DAYS: 0,
//   HEATING_DEGREE_DAYS: 28.9,
//   MIN_REL_HUMIDITY: 61,
//   MAX_REL_HUMIDITY: 84
// }

// cities record
// {
//   city: 'Ennadai',
//   lat: 61.133333,
//   lng: -100.883333,
//   country: 'Canada',
//   iso2: 'CA',
//   admin: 'Nunavut',
//   population: 0,
//   population_proper: 0
// }
