//get CSV file by using flask API
async function getRequestedCSV(schema_name) {
    if (schema_name == 'HTAN') {
        let data = await fetch('http://localhost:3001/v1/visualize/attributes?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fncihtan%2Fdata-models%2Fmain%2FHTAN.model.jsonld')
            .then(response => response.text())
            .then(data => {
                var data = d3.csvParse(data)
                return data
            })
        return data
    } else if (schema_name = 'NF') {
        let data = await fetch('http://localhost:3001/v1/visualize/attributes?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fnf-osi%2Fnf-research-tools-schema%2Fmain%2Fnf-research-tools.jsonld')
            .then(response => response.text())
            .then(data => {
                var data = d3.csvParse(data)
                return data
            })
        return data
    }

}

//get JSON file by flask API
async function getRequestedJson(schema_name) {
    if (schema_name == 'HTAN') {
        let data = await fetch('http://localhost:3001/v1/visualize/tangled_tree/layers?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fncihtan%2Fdata-models%2Fmain%2FHTAN.model.jsonld&figure_type=component')
            .then(response => response.json())
            .then(data => { return data })
        return data
    } else if (schema_name == 'NF') {
        let data = await fetch('http://localhost:3001/v1/visualize/tangled_tree/layers?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fnf-osi%2Fnf-research-tools-schema%2Fmain%2Fnf-research-tools.jsonld&figure_type=component')
            .then(response => response.json())
            .then(data => { return data })
        return data
    }


}


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

function WordCount(str) {
    return str.split(' ')
        .filter(function (n) { return n != '' })
        .length;
}