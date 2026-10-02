// We don't know what promise is, but we use it anyway!!!
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let arrayLength = document.getElementById('lengthInput');
let speedMs = document.getElementById('speedInput');
let swaps = 0;
let comparisons = 0;
let statusText = document.getElementById('allSortedValue');
let allSorted = false;
let sorting = false;

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
// TODO: Array length changing isnt being used. find a fix
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
            sticks[i].classList.remove('sorted', 'comparing', 'swapping');
            sticks[i].style.height = `${array[i]}%`;
        }
    }
}

// sample from gemini
async function bubbleSort(array, sticks) {
    if (allSorted === true)
        throw new Error(statusText.textContent = 'Randomise the sorted list first >:(');
    sorting = true;
    const n = array.length;
    update(sticks);
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

function update(sticks) {
    const check = checkAllSorted(sticks)
    document.getElementById('swapsValue').textContent = swaps.toString();
    document.getElementById('comparisonsValue').textContent = comparisons.toString();
    statusText.textContent = check === false ? 'Sorting...' : 'Everything is sorted!';
}


function checkAllSorted(sticks) {
    for (let i = 0; i < sticks.length; i++) {
        if (!sticks[i].classList.contains('sorted')) {
            allSorted = false;
            return false;
        }
    }
    sorting = false;
    allSorted = true;
    return true;
}