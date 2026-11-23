// We don't know what promise is, but we use it anyway!!!
let cancelCurrentSleep = null;

function sleep(ms, cancellable = true) {
    return new Promise((resolve, reject) => {
        if (cancellable && !sorting) {
            reject(new Error('SORT_STOPPED'));
            return;
        }

        const timer = setTimeout(() => {
            if (cancellable) cancelCurrentSleep = null;
            resolve();
        }, ms);

        if (cancellable) {
            cancelCurrentSleep = () => {
                clearTimeout(timer);
                cancelCurrentSleep = null;
                reject(new Error('SORT_STOPPED'));
            };
        }
    });
}
let currentSortMethod = 'Selection Sort';
let arrayLength = document.getElementById('lengthInput');
let speedMs = document.getElementById('speedInput');

let swaps = 0;
let comparisons = 0;
let statusText = document.getElementById('allSortedValue');

let allSorted = false;
let sorting = false;
let waitOnComparison = true;

function initialiseArray(size = parseInt(arrayLength.value), containerId = 'visualizer-container') {
    statusText.textContent = '';
    allSorted = true;
    swaps = 0;
    comparisons = 0;
    const swapsEl = document.getElementById('swapsValue');
    if (swapsEl) swapsEl.textContent = '0';
    const compsEl = document.getElementById('comparisonsValue');
    if (compsEl) compsEl.textContent = '0';
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const array = [];
    const sticks = [];

    for (let i = 0; i < size; i++) {
        let value = i / size * 100;
        if (value === 0) value = (1 / size * 100) / 2;
        array.push(value);

        const stick = document.createElement('div');
        stick.classList.add('stick');
        stick.style.height = `${value}%`;

        container.appendChild(stick);
        sticks.push(stick);
    }

    return { array, sticks: sticks };
}
function randomiseArray(array, sticks) {

    if (!sticks && typeof currentData !== 'undefined' && currentData.sticks) {
        sticks = currentData.sticks;
    }

    allSorted = false;
    swaps = 0;
    comparisons = 0;
    const swapsText = document.getElementById('swapsValue');
    if (swapsText) swapsText.textContent = '0';
    const compsText = document.getElementById('comparisonsValue');
    if (compsText) compsText.textContent = '0';
    if (statusText) statusText.textContent = '';

    // Changes the array data
    for (let i = array.length - 1; i > 0; i--) {
        // TODO: Find out how this ensures no duplicates :(
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    // Applies said data to the heights of the sticks
    if (sticks) {
        for (let i = 0; i < sticks.length; i++) {
            sticks[i].classList.remove('sorted', 'comparing', 'swapping', 'sorted-all');
            sticks[i].style.height = `${array[i]}%`;
        }
    }
}

function shuffle(array, sticks) {

    if (!sticks && typeof currentData !== 'undefined' && currentData.sticks) {
        sticks = currentData.sticks;
    }

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    if (sticks) {
        for (let i = 0; i < sticks.length; i++) {
            sticks[i].classList.remove('sorted', 'comparing', 'swapping', 'sorted-all');
            sticks[i].style.height = `${array[i]}%`;
        }
    }
}


// sample from gemini
async function bubbleSort(array, sticks) {
    const n = array.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight active comparisons
            sticks[j].classList.add('comparing');
            sticks[j + 1].classList.add('comparing');
            comparisons++;
            await sleep(speedMs.value);

            if (array[j] > array[j + 1]) {
                // Highlight swap
                sticks[j].classList.add('swapping');
                sticks[j + 1].classList.add('swapping');
                swaps++;

                // Swap values in JS array
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                // Update DOM heights
                sticks[j].style.height = `${array[j]}%`;
                sticks[j + 1].style.height = `${array[j + 1]}%`;
                update(sticks);
                await sleep(speedMs.value);
                sticks[j].classList.remove('swapping');
                sticks[j + 1].classList.remove('swapping');
            }

            sticks[j].classList.remove('comparing');
            sticks[j + 1].classList.remove('comparing');
        }
        // Mark element as sorted
        sticks[n - i - 1].classList.add('sorted');
        update(sticks);
    }
}

async function selectionSort(array, sticks) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++){
        // assumes the first element is the smallest
        let min = i;
        sticks[min].classList.add('smallest');

        for (let j = i + 1; j < n; j++){
            sticks[j].classList.add('comparing');
            comparisons++;
            if (waitOnComparison) await sleep(speedMs.value);
            // if we find a smaller element, change the min variable
            if (array[j] < array[min]){
                sticks[min].classList.remove('smallest');
                min = j;
                sticks[min].classList.add('smallest');
            }
            sticks[j].classList.remove('comparing');
            update(sticks);
        }

        if (min !== i){
            sticks[min].classList.add('swapping');
            sticks[i].classList.add('swapping');
            swaps++;
            await sleep(speedMs.value);
            const temp = array[i];
            array[i] = array[min];
            array[min] = temp;

            sticks[i].style.height = `${array[i]}%`;
            sticks[min].style.height = `${array[min]}%`;
            sticks[i].classList.remove('swapping');
            sticks[min].classList.remove('swapping');
            sticks[i].classList.add('sorted');
        }
        else sticks[min].classList.add('sorted');
        sticks[min].classList.remove('smallest');
        update(sticks);
    }
    sticks[n - 1].classList.remove('comparing');
    sticks[n - 1].classList.add('sorted');
    update(sticks);
}

async function insertionSort(array, sticks) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let j = i;

        while (j > 0) {
            sticks[j].classList.add('comparing');
            sticks[j - 1].classList.add('comparing');
            comparisons++;
            if (waitOnComparison) await sleep(speedMs.value);

            if (array[j - 1] > array[j]) {
                sticks[j].classList.remove('comparing');
                sticks[j - 1].classList.remove('comparing');

                sticks[j].classList.add('swapping');
                sticks[j - 1].classList.add('swapping');
                swaps++;

                [array[j], array[j - 1]] = [array[j - 1], array[j]];

                sticks[j].style.height = `${array[j]}%`;
                sticks[j - 1].style.height = `${array[j - 1]}%`;
                update(sticks);
                await sleep(speedMs.value);

                sticks[j].classList.remove('swapping');
                sticks[j - 1].classList.remove('swapping');

                // Decrement j to step backwards through the sorted sub-array
                j--;
            } else {
                sticks[j].classList.remove('comparing');
                sticks[j - 1].classList.remove('comparing');
                break;
            }
        }
    }

    // Mark all elements as sorted at the end
    for (let i = 0; i < n; i++) {
        sticks[i].classList.add('sorted');
    }
    update(sticks);
}

async function shakerSort(array, sticks) {
    const n = array.length;
    let left = 0;
    let right = n - 1;
    let swapped = false;
    while (left < right) {
        swapped = false;
        for (let j = left; j < right; j++) {
            sticks[j].classList.add('comparing');
            sticks[j + 1].classList.add('comparing');
            comparisons++;
            await sleep(speedMs.value);

            if (array[j] > array[j + 1]) {
                sticks[j].classList.add('swapping');
                sticks[j + 1].classList.add('swapping');
                swaps++;

                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                sticks[j].style.height = `${array[j]}%`;
                sticks[j + 1].style.height = `${array[j + 1]}%`;
                update(sticks);
                await sleep(speedMs.value);
                sticks[j].classList.remove('swapping');
                sticks[j + 1].classList.remove('swapping');
                swapped = true;
            }
            sticks[j].classList.remove('comparing');
            sticks[j + 1].classList.remove('comparing');
        }
        if (!swapped) {
            forceAllSorted(sticks);
            break;
        }
        sticks[right].classList.add('sorted');
        right--;
        for (let j = right; j > left; j--) {
            sticks[j].classList.add('comparing');
            sticks[j - 1].classList.add('comparing');
            comparisons++;
            await sleep(speedMs.value);

            if (array[j] < array[j - 1]){
                sticks[j].classList.add('swapping');
                sticks[j - 1].classList.add('swapping');
                swaps++;

                [array[j], array[j - 1]] = [array[j - 1], array[j]];

                sticks[j].style.height = `${array[j]}%`;
                sticks[j - 1].style.height = `${array[j - 1]}%`;
                update(sticks);
                await sleep(speedMs.value);
                sticks[j].classList.remove('swapping');
                sticks[j - 1].classList.remove('swapping');
            }
            sticks[j].classList.remove('comparing');
            sticks[j - 1].classList.remove('comparing');
        }
        sticks[left].classList.add('sorted');
        left++;
        update(sticks);
    }
}

async function mergeSort(array, sticks) {
    async function sortRange(start, end) {
        if (end - start < 2) return;

        const middle = Math.floor((start + end) / 2);
        await sortRange(start, middle);
        await sortRange(middle, end);

        const left = array.slice(start, middle);
        const right = array.slice(middle, end);
        let i = 0;
        let j = 0;

        for (let position = start; position < end; position++) {
            let value;
            if (i < left.length && j < right.length) {
                comparisons++;
                sticks[start + i].classList.add('comparing');
                sticks[middle + j].classList.add('comparing');
                update(sticks);
                if (waitOnComparison) await sleep(speedMs.value);
                sticks[start + i].classList.remove('comparing');
                sticks[middle + j].classList.remove('comparing');
                value = left[i] <= right[j] ? left[i++] : right[j++];
            }
            else value = i < left.length ? left[i++] : right[j++];

            sticks[position].classList.add('swapping');
            array[position] = value;
            sticks[position].style.height = `${value}%`;
            swaps++;
            update(sticks);
            await sleep(speedMs.value);
            sticks[position].classList.remove('swapping');
        }
    }

    await sortRange(0, array.length);
    forceAllSorted(sticks);
}

// TODO: Get this... accursed sort done... eugh! WE DONT LIKE QUICK SORRTTT D:<
async function quickSort(array, sticks){
    message("[Enter DISGUSTING quick sort algorithm here]")
}

async function bogoSort(array, sticks){
    while (!checkAllSortedRaw(array, sticks)) {
        shuffle(array);
        await sleep(speedMs.value);
        swaps += sticks.length - 1;
        comparisons++;
        update(sticks);
    }
}

function update(sticks) {
    const check = checkAllSorted(sticks)
    document.getElementById('swapsValue').textContent = swaps.toString();
    document.getElementById('comparisonsValue').textContent = comparisons.toString();
    statusText.textContent = check === false ? 'Sorting...' : 'Everything is sorted!';
}

// this is used to assume all elements are sorted, even when all bars havent been highlighted
function forceAllSorted(sticks) {
    for (let i = 0; i < sticks.length; i++)
        sticks[i].classList.add('sorted');
    update(sticks);
}

function checkAllSorted(sticks) {
    for (let i = 0; i < sticks.length; i++) {
        if (!sticks[i].classList.contains('sorted')) {
            allSorted = false;
            return false;
        }
    }
    if (!allSorted) {
        allSorted = true;
        sorting = false;
        allSortedCue(sticks);
    }
    return true;
}

function checkAllSortedRaw(array, sticks) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            return false;
        }
    }
    forceAllSorted(sticks);
    return true;
}

async function allSortedCue(sticks) {
    for (let i = 0; i < sticks.length; i++) {
        if (!sticks[i].classList.contains('sorted') || sticks[i].classList.contains('sorted-all')) {
            return;
        }
    }
    const waveWidth = Math.floor(sticks.length * 0.3);
    const stepDelay = clamp(20, 100 / sticks.length, 100);

    for (let i = 0; i < sticks.length + waveWidth; i++) {
        if (i < sticks.length) {
            sticks[i].classList.add('sorted-all');
        }
        if (i - waveWidth >= 0 && i - waveWidth < sticks.length) {
            sticks[i - waveWidth].classList.remove('sorted-all');
        }
        await sleep(clamp(stepDelay, 10, 100), false);
    }

    for (let i = 0; i < sticks.length; i++) {
        sticks[i].classList.remove('sorted-all');
    }
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
