function displayKey() {
    const numKey = document.querySelector('#numKeyboard');
    const otherKey = document.querySelector('#otherKeyboard');
    console.log(otherKey);
    if (numKey.style.display == 'none') {
        numKey.style.display = 'block';
        otherKey.style.display = 'none';
    } else {
        numKey.style.display = 'none';
        otherKey.style.display = 'block';
    }

}

function displayCitySelect() {
    const citySelector = document.querySelector('#citySelector');
    console.log(citySelector);
    if (citySelector.style.display != 'none') {
        citySelector.style.display = 'none';
    } else {
        citySelector.style.display = 'block';
    }
}