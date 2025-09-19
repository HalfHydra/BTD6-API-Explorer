function generateCheckbox(label, value, callback) {
    let checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add('checkbox-div');

    let labelText = document.createElement('p');
    labelText.classList.add('checkbox-label', 'black-outline');
    labelText.innerHTML = label;
    checkboxDiv.appendChild(labelText);

    let input = document.createElement('input');
    input.classList.add('checkbox-input');
    input.type = 'checkbox';
    input.checked = value;
    if(callback) {
        input.addEventListener('change', () => {
            callback(input.checked)
        })
    }
    checkboxDiv.appendChild(input);

    return checkboxDiv
}

function generateDropdown(label, options, value, callback) {
    let dropdownDiv = document.createElement('div');
    dropdownDiv.classList.add('d-flex', 'ai-center');

    let labelText = document.createElement('p');
    labelText.classList.add('dropdown-label', 'black-outline');
    labelText.innerHTML = label;
    dropdownDiv.appendChild(labelText);

    let select = document.createElement('select');
    select.classList.add('dropdown-select');
    options.forEach((option) => {
        let selectOption = document.createElement('option');
        selectOption.value = option;
        selectOption.innerHTML = option;
        select.appendChild(selectOption);
    })
    dropdownDiv.appendChild(select);

    select.value = value;

    select.addEventListener('change', () => {
        callback(select.value)
    })

    dropdownDiv.appendChild(select);
    return dropdownDiv
}

function generateToggle(initial = false, onChange){
    let settingInputDiv = document.createElement('label');
    settingInputDiv.classList.add('setting-input-label','switch');

    let settingInput = document.createElement('input');
    settingInput.classList.add('setting-input');
    settingInput.type = "checkbox";
    settingInput.checked = initial;
    settingInputDiv.appendChild(settingInput);

    let toggleImg = document.createElement('span');
    toggleImg.classList.add('toggle-img', 'slider');
    settingInputDiv.appendChild(toggleImg);

    settingInput.addEventListener('change', () => {
        if(onChange) onChange(settingInput.checked);
    });

    return settingInputDiv;
}

function generateButton(label, width, callback) {
    let button = document.createElement('button');
    button.classList.add('where-button', 'black-outline');
    button.style.width = width;
    button.innerHTML = label;
    button.addEventListener('click', callback);
    return button;
}

function generateNumberInput(label, value, min, max, step, callback) {
    let numberDiv = document.createElement('div');
    numberDiv.classList.add('d-flex', 'ai-center', 'jc-between');
    numberDiv.style.gap = '10px';
    numberDiv.style.flexWrap = 'wrap';

    let labelText = document.createElement('p');
    labelText.classList.add('black-outline');
    labelText.style.fontSize = '24px';
    labelText.innerHTML = label;
    numberDiv.appendChild(labelText);

    let input = document.createElement('input');
    // input.type = 'number';
    input.classList.add('font-gardenia', 'ta-center');
    input.value = value;
    input.min = min;
    input.max = max;
    input.step = step;
    input.style.width = '80px';
    input.style.height = '30px';
    input.style.color = 'white';
    input.style.fontSize = '24px';
    input.style.backgroundColor = 'var(--profile-tertiary)';
    input.addEventListener('change', () => {
        let val = parseFloat(input.value);
        if (isNaN(val)) return;
        if (val < min) val = min;
        if (val > max) val = max;
        input.value = val;
        callback(val);
    });
    numberDiv.appendChild(input);

    return numberDiv;
}

function generateSelectorTab(label, active = false) {
    const div = document.createElement('div');
    div.classList.add('maps-progress-view', 'black-outline');
    if (active) div.classList.add('stats-tab-yellow');
    div.textContent = label;
    return div;
}