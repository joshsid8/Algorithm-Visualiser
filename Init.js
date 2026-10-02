let currentData = { array: [], sticks: [] };

document.addEventListener('DOMContentLoaded', () => {
    currentData = initialiseArray(parseInt(arrayLength.value));

    const randomiseBtn = document.getElementById('randomiseBtn');
    const sortBtn = document.getElementById('sortBtn');
    const speedValue = document.getElementById('speedValue');

    if (randomiseBtn) {
        randomiseBtn.addEventListener('click', () => {
            randomiseArray(currentData.array, currentData.sticks);
        });
    }

    // Sort button functionality
    // TODO: Once more sorts are implemented, make this handle child sort buttons instead of defaulting to bubble sort
    if (sortBtn) {
        sortBtn.addEventListener('click', async () => {
            sortBtn.disabled = true;
            randomiseBtn.disabled = true;
            await bubbleSort(currentData.array, currentData.sticks, parseInt(speedMs.value));
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