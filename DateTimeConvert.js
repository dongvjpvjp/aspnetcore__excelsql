const a = new Date('2021-9-4  5:5:5');
const temp2 = x=> (`${x.getFullYear()}-${ a.getMonth().toString().padStart(2,'0') +1 }-${ a.getDate().toString().padStart(2,'0') } ${x.toTimeString().slice(0,8)}`)
console.log(temp2(a))
    

