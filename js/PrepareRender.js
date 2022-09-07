//return an array based on user selection 
function selectSchema() {
    var selectedSchemaOption = document.getElementById("schema").value;

    if (selectedSchemaOption == "HTAN" || selectedSchemaOption == "HTAN RequiresDependency" || selectedSchemaOption == "HTAN Component RequiresDependency") {
        //var tangled_tree_data = parseJSON('files/JSON/HTAN_tangled_tree_new.json');
        var schemaName = 'HTAN'

    } else if (selectedSchemaOption == "NF Tools Registry") {
        //var tangled_tree_data = parseJSON('files/JSON/nf_tangled_tree.json');
        var schemaName = 'NF'
    } else if (selectedSchemaOption == "AmpAD" || selectedSchemaOption == "AmpAD view Dependencies") {
        var tangled_tree_data = parseJSON('files/JSON/ampad_tangled_tree.json');
    }

    getRequestedJson(schemaName).then(tangled_tree_data => {
        var chart_dta = chart(tangled_tree_data);
        createCollapsibleTree(chart_dta, selectedSchemaOption);
    })



}