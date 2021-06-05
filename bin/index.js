import weatherAPI from '../dist/index.js'


async function run(){

  if(process.argv.length <= 2){
    console.error('Enter a date to query.')
    console.error('Please use the following format: YYYY-MM-DD')
    process.exit()
  } else if(process.argv.length >= 4){
    console.error("Too many arguments given")
    process.exit()
  }

  try{
    var input = process.argv[2]
    let res = await weatherAPI(input)
    console.log('date:', res.date)
    console.log('mean:', res.mean)
    console.log('median:', res.median)
  } catch(e){
    console.error("Error:", e.message)
  }
}

run()
