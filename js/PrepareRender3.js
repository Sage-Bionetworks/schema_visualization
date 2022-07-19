//return an array based on user selection 
function selectSchema() {
    var selectedSchemaOption = document.getElementById("schema").value;

    if (selectedSchemaOption == "HTAN" || selectedSchemaOption == "HTAN RequiresDependency" || selectedSchemaOption == "HTAN Component RequiresDependency") {
        var schemaName = 'HTAN'
    } else if (selectedSchemaOption == "NF Tools Registry") {
        var schemaName = 'NF'
    }

    getRequestedCSV(schemaName).then(data => {
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




function selectDataset() {
    var selectedSchemaOption = document.getElementById("schema").value;
    var selectedDatasetOption = document.getElementById("dataset").value;

    console.log(selectedSchemaOption);
    console.log(selectedDatasetOption);

    if (selectedSchemaOption === "HTAN") {
        var schemaName = "HTAN"
    } else if (selectedSchemaOption === "NF Tools Registry") {
        var schemaName = "NF"
    }

    getRequestedJson(schemaName).then(tangled_tree_data => {
        var chart_dta = chart(tangled_tree_data);
        createCollapsibleTree(chart_dta);
    })

}