//get CSV file by using flask API
function getRequestedCSV(schema_name) {
    if (schema_name == 'HTAN') {
        fetch('http://localhost:3001/v1/visualize/tangled_tree/layers?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fmialy-defelice%2Fdata_models%2Fmain%2FHTAN%2FHTAN_schema_v21_10.model.jsonld&figure_type=component')
            .then(response => response.json())
            .then(data => console.log(data))

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




// function normaltext_to_load(normal_dependencies_grouped) {
//     return normal_dependencies_grouped.get(datatype);
// }