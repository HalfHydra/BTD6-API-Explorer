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

function generateToggle(){
    let toggle = document.createElement('div');
    toggle.classList.add('switch');
    
    let input = document.createElement('input');
    input.type = "checkbox";
    input.checked = true;
    toggle.appendChild(input);

    let span = document.createElement('span');
    span.classList.add('slider', 'round');
    toggle.appendChild(span);

    return toggle;
}

function generateButton(label, width, callback) {
    let button = document.createElement('button');
    button.classList.add('where-button', 'black-outline');
    button.style.width = width;
    button.innerHTML = label;
    button.addEventListener('click', callback);
    return button;
}