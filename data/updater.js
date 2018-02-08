const standards = require('./standards.json');
const newStandards = require('./new-ela.json');
const fs = require('fs');
import {bloomLevels} from '../src/data';

const updated = standards.map(update)

const unex = [];
newStandards.forEach(s => {
  if (!!s.id) {
    if (!standards.find(d => d.title === s.id)) {
      unex.push(s.id);
    }
  }
});

console.log('U', unex);

fs.writeFileSync('./data/standards.json', JSON.stringify(updated, null, 2), 'utf8');

function update(standard) {
  const newStandard = newStandards.find(s => s.id === standard.title);
  if (newStandard) {
    const keywords = newStandard["Key Vocabulary"]
      ? newStandard["Key Vocabulary"].split(', ').map(i => i.trim()).filter(k => !!k)
      : [];
    return {
      ...standard,
      keywords,
    }
  }
  return standard;
}

function flatMap(arr, fn) {
  let newArr = [];
  arr.forEach(i => {
    if (Array.isArray(i)) {
      newArr = [...newArr, ...flatMap(i, fn)];
    }
    else {
      const r = fn(i);
      if (Array.isArray(r)) {
        newArr = [...newArr, ...r];
      }
      else {
        newArr = [...newArr, r];
      }
    }
  })
  return newArr;
}

function split(divider) {
  return function (item) {
    return item.split(divider);
  }
}
