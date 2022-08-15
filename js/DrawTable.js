function drawTable(data, selectedDataType) {
    all_attribute_info = d3.group(data, (d) => d.Component)
    //see which radio button get selected
    //control using radio buttons to filter attribute tables
    var rad = document.table.attribute;
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function () {
            //remove previous graph 
            d3.select('#table').select('#jsonTable').remove();
            //create new graph
            var attribute_to_load = getAttributes(all_attribute_info, selectedDataType, this.value)
            createTable(attribute_to_load)
        });
    }

    //create new graph by default 
    //this part gets triggered when users collapse/expand a node
    d3.select('#table').select('#jsonTable').remove();
    var attribute_to_load = getAttributes(all_attribute_info, selectedDataType, "All Attributes")
    createTable(attribute_to_load)

}


function getAttributes(all_attribute_info, datatype, radios) {
    if (radios == "Required Attributes") {
        var attributes_to_load = all_attribute_info
            .get(datatype)
            .filter((d) => d.Required == "True");
        return attributes_to_load;
    } else if (radios == "Conditionally Required Attributes") {
        var attributes_to_load = all_attribute_info
            .get(datatype)
            .filter((d) => d.Cond_Req == "True");
        return attributes_to_load;
    } else if (radios == "Required and Conditionally Required Attributes") {
        var attributes_to_load = all_attribute_info
            .get(datatype)
            .filter((d) => d.Required === "True" || d.Cond_Req === "True");
        return attributes_to_load;
    } else if (radios == "All Attributes") {
        var attributes_to_load = all_attribute_info.get(datatype);
        return attributes_to_load;
    }
}


function createTable(object) {
    $('#table').append('<table id="jsonTable"><thead><tr></tr></thead><tbody></tbody></table>');

    $.each(Object.keys(object[0]), function (index, key) {
        $('#jsonTable thead tr').append('<th>' + key + '</th>');
    });
    $.each(object, function (index, jsonObject) {
        if (Object.keys(jsonObject).length > 0) {
            var tableRow = '<tr>';
            $.each(Object.keys(jsonObject), function (i, key) {
                tableRow += '<td>' + jsonObject[key] + '</td>';
            });
            tableRow += "</tr>";
            $('#jsonTable tbody').append(tableRow);
        }
    });
}