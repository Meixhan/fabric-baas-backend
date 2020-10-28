// const newTime = 100000;
// const newDate = new Date(newTime);

// console.log(newDate);
let a = [1, 2, 3];
let b = [1, 2, 4];
const c = a.filter(x => new Set(b).has(x));
console.log(c);
