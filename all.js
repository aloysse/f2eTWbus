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