function drawTable(data, selectedDataType) {
    all_attribute_info = d3.group(data, (d) => d.Component)

    //when the filter changes, apply filter effect from dropdown
    $("#filterBy").change(function (e) {
        var dropdownSelection = document.getElementById("filterBy")
        var dropdownVal = dropdownSelection.value;

        //remove previous table 
        d3.select('#table').select('#jsonTable').remove();
        //load new table
        var attribute_to_load = getAttributes(all_attribute_info, selectedDataType, dropdownVal)
        createTable(attribute_to_load)
    })


    //create new graph by default 
    //this part gets triggered when users collapse/expand a node
    d3.select('#table').select('#jsonTable').remove();
    var attribute_to_load = getAttributes(all_attribute_info, selectedDataType, "All Attributes")
    createTable(attribute_to_load)

}


function getAttributes(all_attribute_info, datatype, opt) {
    console.log('opt', opt)
    if (opt == "Required Attributes") {
        var attributes_to_load = all_attribute_info
            .get(datatype)
            .filter((d) => d.Required == "True");
        return attributes_to_load;
    } else if (opt == "Conditionally Required Attributes") {
        var attributes_to_load = all_attribute_info
            .get(datatype)
            .filter((d) => d.Cond_Req == "True");
        return attributes_to_load;
    } else if (opt == "Required and Conditionally Required Attributes") {
        var attributes_to_load = all_attribute_info
            .get(datatype)
            .filter((d) => d.Required === "True" || d.Cond_Req === "True");
        return attributes_to_load;
    } else if (opt == "All Attributes") {
        var attributes_to_load = all_attribute_info.get(datatype);
        return attributes_to_load;
    }
}

function toggleAttributeTable() {
    if ($('#chart-placeholder').hasClass('show-attributes-table')) {
        $('#chart-placeholder').removeClass('show-attributes-table')
    } else {
        $('#chart-placeholder').addClass('show-attributes-table')
    }

}
function createTable(object) {
    //create table
    $('#toggle-table').append('<button id="toggle-attributes-table" onclick="toggleAttributeTable()">Show Attribute Table</button>');

    //show the top part of the table 
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