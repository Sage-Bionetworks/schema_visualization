$.get('files/config.yml').done(function (data) {
    //loading content of the config file
    var config_content = jsyaml.load(data)

    //check the schema name
    var schema = config_content["schema"]

    //////////////////for using schematic API
    getRequestedJson(schema).then(tangled_tree_data => {
        var chart_dta = chart(tangled_tree_data);
        createCollapsibleTree(chart_dta, schema)
    })

    //////////////////for using static files
    // if (schema == "HTAN") {
    //     var tangled_tree_data = parseJSON('files/JSON/HTAN_tangled_tree.json');
    // }

    // tangled_tree_data.then(tangled_tree_dta => {
    //     //get tangle tree layout
    //     var chart_dta = chart(tangled_tree_dta);

    //     //draw collapsible tree
    //     createCollapsibleTree(chart_dta, schema);
    // })

})