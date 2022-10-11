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
    var dropdownSelection = document.getElementById("filterBy")
    var dropdownVal = dropdownSelection.value;
    d3.select('#table').select('#jsonTable').remove();
    var attribute_to_load = getAttributes(all_attribute_info, selectedDataType, dropdownVal);
    createTable(attribute_to_load)

}


function getAttributes(all_attribute_info, datatype, opt) {
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

function readMore(btnId) {
    var btnIdArr = btnId.split('-')
    var last_two_idx = btnIdArr.splice(btnIdArr.length - 2, 2).join('-')

    var dotId = 'dots-' + last_two_idx
    var btnId = 'read-more-btn-' + last_two_idx
    var moreText = 'read-more-' + last_two_idx

    var dot = document.getElementById(dotId);
    var btnText = document.getElementById(btnId);
    var moreTextElem = document.getElementById(moreText);

    if (dot.style.display === "none") {
        dot.style.display = "inline";
        btnText.innerHTML = '&plus;'
        moreTextElem.style.display = "none";
    } else {
        dot.style.display = "none";
        btnText.innerHTML = '&#8722'
        moreTextElem.style.display = "inline";
    }


}

function createTable(object) {
    //create table
    $('#toggle-table').append('<button id="toggle-attributes-table" onclick="toggleAttributeTable(this.id)">Show Attribute Table</button>');

    //show the top part of the table 
    $('#table').append('<table id="jsonTable"><thead><tr></tr></thead><tbody></tbody></table>');

    if (object[0] != null) {
        $.each(Object.keys(object[0]), function (index, key) {
            console.log('key from here', key)
            $('#jsonTable thead tr').append('<th>' + key + '</th>');
        });
        $.each(object, function (index, jsonObject) {
            if (Object.keys(jsonObject).length > 0) {
                var tableRow = '<tr>';
                $.each(Object.keys(jsonObject), function (i, key) {
                    //count the number of words
                    var numWord = WordCount(jsonObject[key])

                    //if the text is very long 
                    if (numWord > 20) {
                        var first20 = jsonObject[key].split(" ").slice(0, 20).join(" ")
                        var remaining = jsonObject[key].split(" ").slice(20, numWord).join(" ")
                        var id_dot = 'dots-' + index.toString() + '-' + i.toString();
                        var btnId = 'read-more-btn-' + index.toString() + '-' + i.toString();
                        var read_more = 'read-more-' + index.toString() + '-' + i.toString();
                        tableRow += '<td>' + first20 + `<span id=${id_dot}>...</span><div class="read-more" id=${read_more}>` + remaining + "</div>" + `<button class="read-more-btn" id=${btnId} onclick="readMore(this.id)">&plus;</button></td>`;
                    } else {
                        tableRow += '<td>' + jsonObject[key] + '</td>';
                    }

                });
                tableRow += "</tr>";
                $('#jsonTable tbody').append(tableRow);
            }
        });

        //and remove previous sign of "no row to show"
        var tag = document.querySelector('#placeholder p')

        //only remove it if it exists
        if (tag != null) {
            tag.remove();
        }
    }//if there's no attributes to show, we could show a line that says "no row to show"
    else {
        var tag = document.querySelector('#placeholder p')
        //only add it if it doesn't exist
        if (tag == null) {
            $('#placeholder').append('<p id="no-row-sign">No Row to show</p>')
        }
    }
}