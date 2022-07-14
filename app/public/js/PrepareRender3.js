//return an array based on user selection 
function selectSchema() {
    var selectedSchemaOption = document.getElementById("schema").value;

    if (selectedSchemaOption == "HTAN" || selectedSchemaOption == "HTAN RequiresDependency" || selectedSchemaOption == "HTAN Component RequiresDependency") {
        var url = "http://localhost:8000/visualize/attributes?schema=HTAN"

    } else if (selectedSchemaOption == "NF Tools Registry") {
        // var merged_data_2 = parseCSVFiles('files/NF_merged.vis_data.csv')
        var url = "http://localhost:8000/visualize/attributes?schema=NF"
    }

    getRequestedCSV(url).then(data => {
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
        var url = "http://localhost:8000/visualize/tangled_tree/layers?schema=HTAN"
        //var tangled_tree_data = parseJSON('files/JSON/HTAN_tangled_tree@2.json');
        var normal_dependencies = parseCSVFiles('files/NormalDependencies/normal_dependencies@1.csv');
        var highlight_dependencies = parseCSVFiles('files/HighlighDepedencies/highlight_dependencies@1.csv');
    }

    else if (selectedSchemaOption === "NF Tools Registry") {
        // var tangled_tree_data = parseJSON('files/JSON/nf_tangled_tree.json');
        // tangled_tree_data.then(data => {
        //     console.log('correct format', data)
        // })
        var url = "http://localhost:8000/visualize/tangled_tree/layers?schema=NF"
        var normal_dependencies = parseCSVFiles('files/NormalDependencies/nf_normal_dependencies.csv');
        var highlight_dependencies = parseCSVFiles('files/HighlighDepedencies/nf_highlight_dependencies.csv');
    }

    var tangled_tree_data_arr = [];


    getRequestedJSON(url).then(tangled_tree_data => {
        //var tangled_tree_data_obj = JSON.parse(JSON.stringify(tangled_tree_data));
        //var tangled_tree_data_str = tangled_tree_data.replace(/\\/g, '');
        //console.log('tangled_tree_data_str', eval("(" + tangled_tree_data_str + ")"))
        console.log('parsed json', $.parseJSON(tangled_tree_data))
        var parsed_tangled_tree_data_arr1 = $.parseJSON(tangled_tree_data)
        var count = 0

        parsed_tangled_tree_data_arr1.forEach(elem => {
            parsed_elem = $.parseJSON(elem)
            console.log(parsed_elem)
            //count = count + 1
            tangled_tree_data_arr.push(parsed_elem)
        })

        console.log(count, 'count')


        //console.log(tangled_tree_data_arr)
        //console.log('tangled_tree_data', JSON.parse(tangled_tree_data))
        var chart_dta = chart(tangled_tree_data_arr);
        console.log('chart_dta', chart_dta)
        //var normal_data = chart_dta.nodes.filter(filter_normal_nodes);
        //var highlight_data = chart_dta.nodes.filter(filter_highlight_nodes);
        createCollapsibleTree(chart_dta);

        // tangled_tree_data.then(tangled_tree_dta => {
        //     //get tangle tree layout, normal data, and highlight data
        //     var chart_dta = chart(tangled_tree_dta);
        //     var normal_data = chart_dta.nodes.filter(filter_normal_nodes);
        //     var highlight_data = chart_dta.nodes.filter(filter_highlight_nodes);
        //     //draw(chart_dta, highlight_data, normal_data);
        //     createCollapsibleTree(chart_dta);
        // })

    })
}