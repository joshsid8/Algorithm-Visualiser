// We don't know what promise is, but we use it anyway!!!
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let arrayLength = document.getElementById('lengthInput');
let speedMs = document.getElementById('speedInput');
let swaps = 0;
let comparisons = 0;
let allSortedText = document.getElementById('allSortedValue');
let allSorted = false;
let sorting = false;

function initialiseArray(size = parseInt(arrayLength.value), containerId = 'visualizer-container') {
    allSortedText.textContent = '';
    allSorted = false; //TODO: once the randomise function is implemented, this should be true
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

    return { array, bars: sticks };
}

// TODO: Instead of generating a whole array, there should already be an initialised list, and the button should randomise it
function randomiseArray(array, sticks) {
    allSorted = false;
    for (let i = 0; i < array.length; i++) {
        sticks[i].classList.remove('sorted');
        sticks[i].classList.remove('comparing');
        sticks[i].classList.remove('swapping');
    }
}

// sample from gemini
async function bubbleSort(array, sticks) {
    if (allSorted === true)
        throw new Error(allSortedText.textContent = 'Randomise the sorted list first >:(');
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
                await sleep(speedMs);
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
    allSortedText.textContent = check === false ? 'Sorting...' : 'Everything is sorted!';
}


function checkAllSorted(sticks) {
    for (let i = 0; i < sticks.length - 1; i++) {
        if (!sticks[i].classList.contains('sorted')) {
            allSorted = false;
            return false;
        }
    }
    sorting = false;
    allSorted = true;
    return true;
}