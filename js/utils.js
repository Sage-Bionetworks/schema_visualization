//parse CSV file and return an array (from d3-fetch library)
function parseCSVFiles(file_name) {
    const merged_data_2 = d3.csv(file_name).then((data) => {
        return data
    })
    return merged_data_2
}

//parse json file
function parseJSON(file_name) {
    const json_data = d3.json(file_name).then((data) => {
        return data
    })
    return json_data
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function createNewOptions(selectElement, array) {
    for (var i = 0; i < array.length; i++) {
        var opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        selectElement.appendChild(opt);
    }
}

function GroupDependencies(dependencies) {
    const group_data = d3.group(dependencies, (d) => d.Component)

    return group_data
}


function onlyUniqueFromArray(arr) {
    var unique = arr.filter(function (item, pos) {
        return arr.indexOf(item) == pos;
    });

    console.log('unique', unique)
    return unique
}

function RemoveEmptyFromArray(array) {
    var filterd = array.filter(item => item)

    return filterd
}