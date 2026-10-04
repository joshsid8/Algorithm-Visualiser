let currentData = { array: [], sticks: [] };

// We dont worry about the variables below:
let randomiseArrayPrompt = [
    "Randomise the sorted list first >:(", "We need the list shuffled bro",
    "Please shuffle the list.","The list needs to be randomised...",
    "SHUFFLE THE GYADAMN LIST!!!", "Son 😭",
    "The mere incapability to efficiently utilise His blessing of sight deems you unworthy of ever being granted the opportunity to experience this simulation before you."
]

document.addEventListener('DOMContentLoaded', () => {
    currentData = initialiseArray(parseInt(arrayLength.value));
    randomiseArray(currentData.array, currentData.sticks);

    const sortSettingsBtn = document.getElementById('sortSettingsBtn') || document.querySelector('.sortSettingsDropdown');
    const sortDropdownMenu = document.getElementById('sortDropdownMenu');
    const bubbleSortBtn = document.getElementById('bubbleSortDD');
    const selectionSortBtn = document.getElementById('selectionSortDD');
    const insertionSortBtn = document.getElementById('insertionSortDD');

    if (sortSettingsBtn && sortDropdownMenu) {
        sortSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sortDropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!sortSettingsBtn.contains(e.target) && !sortDropdownMenu.contains(e.target)) {
                sortDropdownMenu.classList.remove('show');
            }
        });
    }

    const randomiseBtn = document.getElementById('randomiseBtn');
    const speedValue = document.getElementById('speedValue');
    const sortBtn = document.getElementById('sortBtn');

    if (bubbleSortBtn){
        bubbleSortBtn.addEventListener('click', () => {
            currentSortMethod = 'Bubble Sort';
            if (sortSettingsBtn) sortSettingsBtn.textContent = 'Bubble Sort';
            if (sortDropdownMenu) sortDropdownMenu.classList.remove('show');
        });
    }

    if (selectionSortBtn){
        selectionSortBtn.addEventListener('click', () => {
            currentSortMethod = 'Selection Sort';
            if (sortSettingsBtn) sortSettingsBtn.textContent = 'Selection Sort';
            if (sortDropdownMenu) sortDropdownMenu.classList.remove('show');
        });
    }

    if (insertionSortBtn){
        insertionSortBtn.addEventListener('click', () => {
            currentSortMethod = 'Insertion Sort';
            if (sortSettingsBtn) sortSettingsBtn.textContent = 'Insertion Sort';
            if (sortDropdownMenu) sortDropdownMenu.classList.remove('show');
        });
    }

    if (randomiseBtn) {
        randomiseBtn.addEventListener('click', () => {
            randomiseArray(currentData.array, currentData.sticks);
        });
    }

    // Sort button functionality
    if (sortBtn) {
        sortBtn.addEventListener('click', async () => {
            if (allSorted === true) statusText.textContent = randomiseArrayPrompt[random(0, randomiseArrayPrompt.length - 1)];
            else {
                sorting = true;
                sortBtn.disabled = true;
                randomiseBtn.disabled = true;
                // TODO: We need a dropdown to select the sort algorithm
                switch (currentSortMethod) {
                    case 'Selection Sort':
                        await selectionSort(currentData.array, currentData.sticks, parseInt(speedMs.value));
                        break;
                    case 'Bubble Sort':
                        await bubbleSort(currentData.array, currentData.sticks, parseInt(speedMs.value));
                        break;
                    case 'Insertion Sort':
                        await insertionSort(currentData.array, currentData.sticks, parseInt(speedMs.value));
                        break;
                    default:
                        console.error('Invalid sort method selected');
                }
                sortBtn.disabled = false;
                randomiseBtn.disabled = false;
            }
        });
    }

    // Updating the speed value display
    if (speedValue) {
        speedValue.textContent = speedMs.value;
        speedMs.addEventListener('input', () => {
            speedValue.textContent = speedMs.value;
        });
    }
});

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}