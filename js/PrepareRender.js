//return an array based on user selection 
function selectSchema() {
    var selectedSchemaOption = document.getElementById("schema").value;

    if (selectedSchemaOption == "HTAN" || selectedSchemaOption == "HTAN RequiresDependency" || selectedSchemaOption == "HTAN Component RequiresDependency") {
        var merged_data_2 = parseCSVFiles('files/merged@20.vis_data.csv')

    } else if (selectedSchemaOption == "NF Tools Registry") {
        var merged_data_2 = parseCSVFiles('files/NF_merged.vis_data.csv')
    } else if (selectedSchemaOption == "AmpAD" || selectedSchemaOption == "AmpAD view Dependencies") {
        var merged_data_2 = parseCSVFiles('files/ampad_merged@3.vis_data.csv')
    }

    //get all_attribute_info
    merged_data_2.then(data => {
        var merged_data = data

        var all_attribute_info = d3.group(merged_data, (d) => d.Component)

        var keys = Array.from(all_attribute_info.keys())

        var keys_sorted = keys.sort();

        //dynamically create option 
        var dataSetSelect = document.getElementById('dataset');

        //remove previous options and create dropdown list
        removeOptions(dataSetSelect);
        createNewOptions(dataSetSelect, keys_sorted);

    })


}

// function normaltext_to_load(normal_dependencies_grouped) {
//     return normal_dependencies_grouped.get(datatype);
// }

function selectDataset() {
    var selectedSchemaOption = document.getElementById("schema").value;
    var selectedDatasetOption = document.getElementById("dataset").value;

    console.log(selectedSchemaOption);
    console.log(selectedDatasetOption);

    if (selectedSchemaOption === "HTAN") {
        var tangled_tree_data = parseJSON('files/JSON/HTAN_tangled_tree@2.json');
        var normal_dependencies = parseCSVFiles('files/NormalDependencies/normal_dependencies@1.csv');

    }

    normal_dependencies.then(data => {
        console.log('csv data', data);
        const normalDependenciesGrouped = GroupDependencies(data);
        console.log('normal dependencies grouped', normalDependenciesGrouped);

        tangled_tree_data.then(data => {
            console.log('this is json data', data)

            renderChart(data, normalDependenciesGrouped);
        })

    })

    // tangled_tree_data.then(data => {
    //     console.log('this is json data', data)

    //     renderChart(data, normalDependenciesGrouped);
    // })
}