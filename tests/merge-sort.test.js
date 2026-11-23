const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

function setup(values) {
    const elements = {
        lengthInput: { value: values.length },
        speedInput: { value: 0 },
        allSortedValue: { textContent: '' },
        swapsValue: { textContent: '' },
        comparisonsValue: { textContent: '' }
    };
    const context = vm.createContext({
        document: { getElementById: (id) => elements[id] },
        setTimeout: (callback) => callback()
    });
    vm.runInContext(fs.readFileSync('Backend.js', 'utf8'), context);
    const sticks = values.map((value) => {
        const classes = new Set();
        return {
            style: { height: `${value}%` },
            classList: {
                add: (...names) => names.forEach((name) => classes.add(name)),
                remove: (...names) => names.forEach((name) => classes.delete(name)),
                contains: (name) => classes.has(name)
            }
        };
    });
    return { context, elements, sticks };
}

for (const input of [[], [3], [2, 1], [5, 1, 4, 2, 3], [4, 4, 1, 2, 1], [1, 2, 3], [5, 4, 3, 2, 1]]) {
    test(`merge sort: ${JSON.stringify(input)}`, async () => {
        const array = [...input];
        const { context, elements, sticks } = setup(array);
        await context.mergeSort(array, sticks);
        assert.deepEqual(array, [...input].sort((a, b) => a - b));
        assert.deepEqual(sticks.map((stick) => stick.style.height), array.map((value) => `${value}%`));
        assert.ok(sticks.every((stick) => stick.classList.contains('sorted')));
        assert.ok(sticks.every((stick) => !stick.classList.contains('comparing') && !stick.classList.contains('swapping')));
        assert.equal(elements.allSortedValue.textContent, 'Everything is sorted!');
    });
}