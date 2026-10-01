let currentData = { array: [], bars: [] };

// Generate array when the page loads
document.addEventListener('DOMContentLoaded', () => {
    currentData = initialiseArray(parseInt(arrayLength.value));

    const randomiseBtn = document.getElementById('randomiseBtn');
    const sortBtn = document.getElementById('sortBtn');
    const speedValue = document.getElementById('speedValue');

    if (randomiseBtn) {
        randomiseBtn.addEventListener('click', () => {
            // TODO: Add a randomise array function, replacing below
            currentData = initialiseArray(parseInt(arrayLength.value)); // TODO: this function should be called once the array length changes instead
            randomiseArray(currentData.array);
        });
    }

    // Sort button functionality
    // TODO: Once more sorts are implemented, make this handle child sort buttons instead of defaulting to bubble sort
    if (sortBtn) {
        sortBtn.addEventListener('click', async () => {
            sortBtn.disabled = true;
            randomiseBtn.disabled = true;
            await bubbleSort(currentData.array, currentData.bars, parseInt(speedMs.value));
            sortBtn.disabled = false;
            randomiseBtn.disabled = false;
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