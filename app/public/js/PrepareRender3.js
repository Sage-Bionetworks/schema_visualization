//return an array based on user selection 
function selectSchema() {
    var selectedSchemaOption = document.getElementById("schema").value;

    if (selectedSchemaOption == "HTAN" || selectedSchemaOption == "HTAN RequiresDependency" || selectedSchemaOption == "HTAN Component RequiresDependency") {
        const url = "http://localhost:8000/attribute/visualization?schema=HTAN"
        var merged_data_2 = fetch(url)
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch(err => console.error(err));

    } else if (selectedSchemaOption == "NF Tools Registry") {
        const url = "http://localhost:8000/attribute/visualization?schema=NF"
        //var merged_data_2 = parseCSVFiles('files/NF_merged.vis_data.csv')
    } else if (selectedSchemaOption == "AmpAD" || selectedSchemaOption == "AmpAD view Dependencies") {
        const url = "http://localhost:8000/attribute/visualization?schema=AmpAD"
        //var merged_data_2 = parseCSVFiles('files/ampad_merged@3.vis_data.csv')
    }

    var merged_data_2 = fetch(url)
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(err => console.error(err));

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




function selectDataset() {
    var selectedSchemaOption = document.getElementById("schema").value;
    var selectedDatasetOption = document.getElementById("dataset").value;

    console.log(selectedSchemaOption);
    console.log(selectedDatasetOption);

    if (selectedSchemaOption === "HTAN") {
        var tangled_tree_data = parseJSON('files/JSON/HTAN_tangled_tree@2.json');
        var normal_dependencies = parseCSVFiles('files/NormalDependencies/normal_dependencies@1.csv');
        var highlight_dependencies = parseCSVFiles('files/HighlighDepedencies/highlight_dependencies@1.csv');

    }

    normal_dependencies.then(data => {
        const normalDependenciesGrouped = GroupDependencies(data);
        highlight_dependencies.then(data => {
            const highlightDependenciesGrouped = GroupDependencies(data);

            //functions for processing highlight and normal data
            function normaltext_to_load(normal_dependencies_grouped) {
                return normal_dependencies_grouped.get(selectedDatasetOption);
            }

            function highlights_to_load(highlight_dependencies_grouped) {
                return highlight_dependencies_grouped.get(selectedDatasetOption);
            }

            function filter_normal_nodes(d) {
                return normaltext_to_load(normalDependenciesGrouped).some(
                    (filterEl) => d[filterEl.type] === filterEl.name
                );
            }
            function filter_highlight_nodes(d) {
                return highlights_to_load(highlightDependenciesGrouped).some(
                    (filterEl) => d[filterEl.type] === filterEl.name
                );
            }

            tangled_tree_data.then(tangled_tree_dta => {
                //get tangle tree layout, normal data, and highlight data
                var chart_dta = chart(tangled_tree_dta);
                var normal_data = chart_dta.nodes.filter(filter_normal_nodes);
                var highlight_data = chart_dta.nodes.filter(filter_highlight_nodes);

                console.log(normal_data);
                console.log(highlight_data);


                draw(chart_dta, highlight_data, normal_data);
            })
        })


    })
}