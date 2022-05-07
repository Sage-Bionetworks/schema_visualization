//parse CSV file and return an array (from d3-fetch library)
function parseCSVFiles(file_name) {
    const merged_data_2 = d3.csv(file_name).then((data) => {
        return data
    })
    return merged_data_2
}

//parse json file
function parseJSON(file_name) {
    const json_data = d3.json(file_name).then((data) => {
        return data
    })
    return json_data
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function createNewOptions(selectElement, array) {
    for (var i = 0; i < array.length; i++) {
        var opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        selectElement.appendChild(opt);
    }
}

function GroupDependencies(dependencies) {
    const group_data = d3.group(dependencies, (d) => d.Component)

    return group_data
}

// async function fetchUrl(url) {
//     const result = await fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             console.log('my tangled tree data', data)
//             return data
//         })
//         .catch(err => console.error(err));

//     return result
//}
async function fetchUrl(url = '') {
    // Default options are marked with *
    const response = await fetch(url)
    return response.json(); // parses JSON response into native JavaScript objects
}

// async function fetchAsync(url) {
//     let response = await fetch(url, { mode: "no-cors" });
//     console.log('response', response);
//     let data = await response.json();
//     return data;
// }

// function fetchAsync(url) {
//     fetch(url, { mode: "no-cors" })
//         .then(response => {
//             console.log('response', response);
//             var data = response.json;
//             console.log('this is data', data);
//             return data
//         })
// }

// var HttpClient = function() {
//     this.get = function(aUrl, aCallback) {
//         var anHttpRequest = new XMLHttpRequest();
//         anHttpRequest.onreadystatechange = function() { 
//             if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
//                 aCallback(anHttpRequest.responseText);
//         }

//         anHttpRequest.open( "GET", aUrl, true );            
//         anHttpRequest.send( null );
//     }
// }


// function normaltext_to_load(normal_dependencies_grouped) {
//     return normal_dependencies_grouped.get(datatype);
// }