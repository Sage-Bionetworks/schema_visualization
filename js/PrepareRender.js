//return an array based on user selection 
function selectSchema() {
    var selectedSchemaOption = document.getElementById("schema").value;

    if (selectedSchemaOption == "HTAN" || selectedSchemaOption == "HTAN RequiresDependency" || selectedSchemaOption == "HTAN Component RequiresDependency") {
        var tangled_tree_data = parseJSON('files/JSON/HTAN_tangled_tree.json');

    } else if (selectedSchemaOption == "NF Tools Registry") {
        var tangled_tree_data = parseJSON('files/JSON/nf_tangled_tree.json');
    } else if (selectedSchemaOption == "AmpAD" || selectedSchemaOption == "AmpAD view Dependencies") {
        var tangled_tree_data = parseJSON('files/JSON/ampad_tangled_tree.json');
    }

    tangled_tree_data.then(tangled_tree_dta => {
        //get tangle tree layout
        var chart_dta = chart(tangled_tree_dta);

        //draw collapsible tree
        createCollapsibleTree(chart_dta, selectedSchemaOption);
    })



}