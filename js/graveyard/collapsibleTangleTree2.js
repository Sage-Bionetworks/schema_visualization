// function chart(source) {
//     //define levels
//     var levels = data
// }


function chart(data) {
    //define levels
    var levels = data

    // precompute level depth - each node (n) in each array (forEach, l) in the specified array (forEach, levels) is assigned an int as their level value that corresponds to the array in which they're contained (n.level = i). 
    //levels, which was until now nested json arrays, now has clear stratification. Without this line, the nodes are on the same x-axis.
    levels.forEach((l, i) => l.forEach(n => n.level = i))

    // begin to define "nodes" separately from their levels (var nodes =) by regathering the json objects that had just been separated (levels.reduce).
    var nodes = levels.reduce(((a, x) => a.concat(x)), [])
    //create an object (nodes_index)
    var nodes_index = {}
    console.log("levels", levels)
    console.log("nodes_index", nodes_index)
    // that object (nodes_index) consists of nodes objects (d); each object goes through a function in which the object is named in accordance with its id value (nodes_index[d.id])
    nodes.forEach(d => nodes_index[d.id] = d)
    console.log("nodes", nodes)
    // objectification
    nodes.forEach(d => {
        // create new array (.map) inside "nodes_index", the objects of which (p) are either an empty array or the "parents" array ([] : d.parents) for each node (d), depending on whether there is a parents array (d.parents === undefined ?).
        d.parents = (d.parents === undefined ? [] : d.parents).map(p => nodes_index[p])
    })

    // precompute bundles
    levels.forEach((l, i) => {
        var index = {}
        // for each level (l) in "levels",
        l.forEach(n => {
            // "name" value is node's name
            var name = n.name
            var url = n.url
            // if there are no parents, pass.
            if (n.parents.length == 0) {
                return
            }
            // otherwise, make a var (id) that consists of all parents of a node separated by "--"
            var id = n.parents.map(d => d.id).sort().join('--')
            //if the id is already in the index...
            if (id in index) {
                // (concat ids??)
                index[id].parents = index[id].parents.concat(n.parents)
            }
            //if "id" not in "index", add it as an object named after "id" which consists of values for "id, "parents", and "level".
            else {
                //return the selected elements in an array. Parents are returned as new array objects (.slice)
                index[id] = { id: id, name: name, url: url, parents: n.parents.slice(), level: i }
            }
            n.bundle = index[id]
        })
        l.bundles = Object.keys(index).map(k => index[k])
        // Deleting THIS line disappears lines between nodes
        l.bundles.forEach((b, i) => b.i = i)
    })

    var links = []
    //for each object (n) in nodes, perform a function...
    nodes.forEach(d => {
        d.parents.forEach(p => links.push({ source: d, bundle: d.bundle, target: p }))
    })

    var bundles = levels.reduce(((a, x) => a.concat(x.bundles)), [])

    // reverse pointer from parent to bundles
    bundles.forEach(b => b.parents.forEach(p => {
        if (p.bundles_index === undefined) {
            p.bundles_index = {}
        }
        if (!(b.id in p.bundles_index)) {
            p.bundles_index[b.id] = []
        }
        p.bundles_index[b.id].push(b)
    }))

    //for each object (n) in nodes, perform a function...
    nodes.forEach(n => {
        //if the node has an accompanying bundles_index, 
        if (n.bundles_index !== undefined) {
            n.bundles = Object.keys(n.bundles_index).map(k => n.bundles_index[k])
        }
        else {
            n.bundles_index = {}
            n.bundles = []
        }
        n.bundles.forEach((b, i) => b.i = i)
    })

    links.forEach(l => {
        if (l.bundle.links === undefined) {
            l.bundle.links = []
        }
        l.bundle.links.push(l)
    })

    // layout
    const padding = 10
    const node_height = 22
    const node_width = 145
    const bundle_width = 14
    const level_y_padding = 16
    const metro_d = 4
    const c = 16
    const min_family_height = 16

    // THIS relates to size and placement of nodes

    nodes.forEach(n => n.height = (Math.max(1, n.bundles.length) - 1) * metro_d)

    var x_offset = padding
    var y_offset = padding
    levels.forEach(l => {
        x_offset += l.bundles.length * bundle_width
        y_offset += level_y_padding
        l.forEach((n, i) => {
            n.x = n.level * node_width + x_offset
            n.y = node_height + y_offset + n.height / 2
            y_offset += node_height + n.height
        })
    })

    var i = 0
    levels.forEach(l => {
        l.bundles.forEach(b => {
            b.x = b.parents[0].x + node_width + (l.bundles.length - 1 - b.i) * bundle_width
            b.y = i * node_height
        })
        i += l.length
    })

    links.forEach(l => {
        l.xt = l.target.x
        l.yt = l.target.y + l.target.bundles_index[l.bundle.id].i * metro_d - l.target.bundles.length * metro_d / 2 + metro_d / 2
        l.xb = l.bundle.x
        l.xs = l.source.x
        l.ys = l.source.y
    })

    // compress vertical space
    var y_negative_offset = 0
    levels.forEach(l => {
        y_negative_offset += -min_family_height + d3.min(l.bundles, b => d3.min(b.links, link => (link.ys - c) - (link.yt + c))) || 0
        l.forEach(n => n.y -= y_negative_offset)
    })

    // add curvature
    links.forEach(l => {
        l.yt = l.target.y + l.target.bundles_index[l.bundle.id].i * metro_d - l.target.bundles.length * metro_d / 2 + metro_d / 2
        l.ys = l.source.y
        l.c1 = l.source.level - l.target.level > 1 ? node_width + c : c
        l.c2 = c
    })

    var layout = {
        height: d3.max(nodes, n => n.y) + node_height / 2 + 2 * padding,
        node_height,
        node_width,
        bundle_width,
        level_y_padding,
        metro_d
    }

    return { levels, nodes, nodes_index, links, bundles, layout, }

}


//imagine that we could let the node know its children

function createCollapsibleTree(chart) {
    //console.log('createCollapsibletree function is being called', chart);

    //assume that we could let biospecimen node knows all its children
    chart['nodes'].forEach(element => {
        if (element['id'] == 'Biospecimen') {
            element['children'] = ['ScRNA-seqLevel1', 'BulkRNA-seqLevel1',
                'BulkWESLevel1', 'OtherAssay', 'ScATAC-seqLevel1', 'ImagingLevel2',
                'ScRNA-seqLevel2', 'BulkRNA-seqLevel2', 'BulkWESLevel2',
                'ScRNA-seqLevel3', 'BulkRNA-seqLevel3', 'BulkWESLevel3', 'ScRNA-seqLevel4']
        }
        else if (element['id'] == 'ImagingLevel2Channels') {
            element['children'] = ['ImagingLevel2']
        } else {
            element['children'] = []
        }

    })

    //draw tangled tree like we did before
    const margins = {
        top: 20,
        bottom: 300,
        left: 30,
        right: 100,
    };

    const color = d3.scaleOrdinal(d3.schemeDark2);

    const height = 900;
    const width = 1000;

    const totalWidth = width + margins.left + margins.right;

    //remove previous result
    d3.select('#visualization').select('svg').remove();

    //create new chart
    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', totalWidth)
        .attr('height', chart.layout.height)
        .attr('id', 'myViz');

    const g = svg.append('g');

    // const FlexibleNodesHolder = svg.append('g').attr('flexible-node').attr('id', 'flexible-node');

    var collapsedChildrenNewArray = [];

    //add zoom
    // var zoom = d3.zoom()
    //     .extent([[0, 0], [width + 100, height + 100]])
    //     .scaleExtent([1, 8])
    //     .on("zoom", function () {
    //         g.attr('transform', d3.event.transform)
    //     });

    // g.call(zoom);


    //filter nodes based on if they have children or not
    // if nodes have children, we would use a different way to let them show
    // if they don't have children, we would let them show like they did before in tangled tree

    function concatArrayFromArray(array) {
        var merged = [].concat.apply([], array);
        return merged

    }

    function ExtractValsFromArrayObj(array, key) {
        var NewArray = [];

        for (var i = 0; i < array.length; i++) {
            if (array[i][key]) {
                if (array[i][key].length > 0) {
                    NewArray.push(array[i][key]);
                }
            }
        }



        return NewArray

    }

    function getParentHasChildren(arrayofObj) {
        //filter out parents that do not have children. This return an array of objects 
        var ParentsWithChildrenObjArray = _.filter(arrayofObj, function (item) { return item['children'].length !== 0; });
        //get the keys of parents. this returns like ['Biospecimen', 'ImagingLevel2Channels']
        var ParentKeys = ExtractValsFromArrayObj(ParentsWithChildrenObjArray, 'id')

        console.log('parent keys', ParentKeys)

        return ParentKeys

    }

    function onlyUniqueFromArray(arr) {
        var unique = arr.filter(function (item, pos) {
            return arr.indexOf(item) == pos;
        });

        console.log('unique', unique)
        return unique
    }

    function RemoveEmptyFromArray(array) {
        var filterd = array.filter(item => item)

        return filterd
    }

    function filterArrayIfInArray(baseArray, filter, keyInBase) {

        var filteredArray = baseArray.filter(i => filter.includes(i[keyInBase]))
        console.log('intersted', filteredArray)

        return filteredArray

    }

    function filterArrayIfNotInArray(baseArray, filter, keyInBase) {

        var filteredArray = baseArray.filter(i => !filter.includes(i[keyInBase]))

        return filteredArray

    }

    function replaceObjInArry(arrayofObjBase, arrayofObjReplacement) {
        var res = arrayofObjBase.map(x => {
            const item = arrayofObjReplacement.find(({ id }) => id === x.id);
            return item ? item : x;
        });

        return res
    }


    function FilterNode(chart) {
        var arrayNodes = chart['nodes']
        //var UniqueChildren = getUniqueValsFromArrayObj(arrayNodes, 'children')
        //get all unique children
        var ChildrenArray = ExtractValsFromArrayObj(arrayNodes, 'children')
        var joinedChildren = concatArrayFromArray(ChildrenArray)

        //get all parents that have children as an array
        var parentsWithChildren = getParentHasChildren(arrayNodes)

        //combine the parents that have children and parent array
        var KeysToHide = joinedChildren.concat(parentsWithChildren)
        var KeysToHideNew = RemoveEmptyFromArray(KeysToHide)

        //this is the unique keys from array
        var UniqueKeysinteract = onlyUniqueFromArray(KeysToHideNew)

        return UniqueKeysinteract
    }


    var interactiveKeys = FilterNode(chart);

    var InteractivePartNode = filterArrayIfInArray(chart['nodes'], interactiveKeys, 'id')
    var steadyPartNode = filterArrayIfNotInArray(chart['nodes'], interactiveKeys, 'id')

    console.log(InteractivePartNode);

    // console.log(chart.bundles)

    // var node = svg.selectAll('g.node').data(InteractivePartNode)

    //console.log('node', node)

    // // Enter any new modes at the parent's previous position.
    // var nodeEnter = node.enter().append('g')
    //     .attr('class', 'node')
    //     .on('click', click);

    update(InteractivePartNode, collapsedChildrenNewArray);

    function update(InteractivePartNode, collapsedChildrenNewArray) {

        console.log('update is doing something')

        //remove node if that exits
        //var nodeExit = svg.selectAll('g.node').remove();

        // var node = svg.selectAll('g.node').data(InteractivePartNode);
        // var nodeEnter = node.enter().append('g');

        console.log(InteractivePartNode)

        //get all unique children
        // when collapse (if statement), some children should be gone
        var ChildrenArray = ExtractValsFromArrayObj(InteractivePartNode, 'children')
        var joinedChildren = concatArrayFromArray(ChildrenArray)

        //remove children of selected node from interactive nodes
        var filteredInteractiveNode = filterArrayIfNotInArray(InteractivePartNode, joinedChildren, 'id')

        console.log('filtered interactive node', filteredInteractiveNode)


        var node = svg.selectAll('g.node')
            .data(filteredInteractiveNode);

        var nodeEnter = node.enter().append('g').attr('class', 'node').on('click', click);

        console.log('initital node enter', nodeEnter)

        //node.remove();


        console.log('selected', nodeEnter.selectAll('path.flexible'))

        filteredInteractiveNode.map(n => {
            nodeEnter.append('path')
                .attr('class', 'selectable node flexible')
                .attr('data-id', `${n.id}`)
                .attr('stroke', 'red')
                .attr('stroke-width', 8)
                .attr('collapsed', n.collapsed)
                .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`)
            // .on('click', click);

            nodeEnter.append('path')
                .attr('class', 'node flexible')
                .attr('stroke', 'orange')
                .attr('stroke-width', 4)
                .attr('collapsed', n.collapsed)
                .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`)
                ;

            console.log('finishing')
        })

        // collapsedChildrenNewArray.map(n => {
        //     nodeEnter.append('path').attr('stroke', 'white').attr('stroke-width', 4).attr('class', 'node')
        //         .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`)
        // })

        // if (n.collapsed){
        //     var nodeToRemove = d3.selectAll(`path[data-id = ${n}.id]`)

        //     nodeToRemove.attr('stroke', 'white')
        // } else{
        //     console.log('else statement is here')
        // }
        var nodesToCollapse = d3.selectAll('node[collapsed=true]');

        console.log('nocdesToCollapse', nodesToCollapse.length)


    }

    // Toggle children on click.
    function click(d) {

        console.log('d', d)
        var selected = this;
        var dataId = d3.select(selected).attr('data-id');

        //Find the children array of selected node
        console.log('dataId', dataId)
        var selectedElem = filterArrayIfInArray(InteractivePartNode, [dataId], 'id')

        var ChangeSelectedElemChildren = function (selectedElem) {
            if (selectedElem[0]['children']) {
                console.log('if statement');
                console.log('selected item', selectedElem);
                selectedElem[0]._children = selectedElem[0]['children'];
                selectedElem[0]['children'] = null;

                //ensure all children of the selected element have property 'collapsed = true'
                var collapsedChildren = selectedElem[0]._children
                var collapsedChildrenBaseArray = filterArrayIfInArray(InteractivePartNode, collapsedChildren, 'id')
                collapsedChildrenBaseArray.forEach(elem => {
                    elem['collapsed'] = true;
                })

                return selectedElem, collapsedChildrenBaseArray
            } else {
                console.log('else statement');
                console.log('selected item', selectedElem);
                selectedElem[0]['children'] = selectedElem[0]._children;
                selectedElem[0]._children = null;
                selectedElem[0]['collapsed'] = false;


                //ensure all children of the selected element have property 'collapsed = false'
                var collapsedChildren = selectedElem[0].children
                var collapsedChildrenBaseArray = filterArrayIfInArray(InteractivePartNode, collapsedChildren, 'id')
                collapsedChildrenBaseArray.forEach(elem => {
                    elem['collapsed'] = false;
                })

                //console.log('result', selectedElem);
                return selectedElem, collapsedChildrenBaseArray
            }
        }

        var selectedElem, collapsedChildrenNewArray = ChangeSelectedElemChildren(selectedElem);

        console.log('collapsedChildrenNewArray', collapsedChildrenNewArray);

        var InteractivePartNodeNew = replaceObjInArry(InteractivePartNode, selectedElem);
        //var InteractivePartNodeNew = replaceObjInArry(InteractivePartNode, collapsedChildrenNewArray);



        //console.log('result', selectedElem)

        // var childrenArrSelectedElem = selectedElem[0]['children']
        // var interactiveNodesArr = filterArrayIfInArray(InteractivePartNode, childrenArrSelectedElem, 'id')

        // console.log('children of selected', selectedElem[0]['children'])
        // //console.log('interactive nodes', interactiveNodes)

        // interactiveNodesArr.forEach((element) => {
        //     if (element.children) {
        //         console.log('the if')
        //         console.log('element.children', element.children)
        //         //this should indicate collapsing all children
        //         d3.select(selected).attr('stroke', 'blue');
        //         element._children = element.children;
        //         element.children = null;
        //     } else {
        //         console.log('the else')
        //         console.log('element.children', element.children)
        //         //this should indicate expanding all children
        //         d3.select(selected).attr('stroke', 'red');
        //         element.children = element._children;
        //         element._children = null
        //     }
        // })

        //var testing = replaceObjInArry(InteractivePartNode, interactiveNodesArr);

        //console.log(interactiveNodesArr);

        update(InteractivePartNodeNew, collapsedChildrenNewArray);
    }

    // chart.bundles.map(b => {
    //     let d = b.links.map(l => `
    //           M${l.xt} ${l.yt}
    //           L${l.xb - l.c1} ${l.yt}
    //           A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
    //           L${l.xb} ${l.ys - l.c2}
    //           A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
    //           L${l.xs} ${l.ys}`
    //     ).join("");

    //     const path = g.append('path')
    //         .attr('class', 'link')
    //         .attr('d', d)
    //         .attr('stroke', 'white')
    //         .attr('stroke-width', 5);

    //     const path_two = g.append('path')
    //         .attr('class', 'link')
    //         .attr('d', d)
    //         .attr('stroke-width', 2)
    //         .attr('stroke', color(b.id));
    // })

    steadyPartNode.map(n => {

        const path_three = g.append('path')
            .attr('class', 'selectable node')
            .attr('data-id', `${n.id}`)
            .attr('stroke', 'black')
            .attr('stroke-width', 8)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const path_four = g.append('path')
            .attr('class', 'node')
            .attr('stroke', 'white')
            .attr('stroke-width', 4)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);
    })



}











var treeData =
{
    "name": "Top Level",
    "children": [
        {
            "name": "Level 2: A",
            "children": [
                { "name": "Son of A" },
                { "name": "Daughter of A" }
            ]
        },
        { "name": "Level 2: B" }
    ]
};

// Set the dimensions and margins of the diagram
var margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);
console.log('treemap', treemap)

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function (d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

console.log('this is root', root);

// Collapse after the second level
root.children.forEach(collapse);

console.log('root after collapse', root)

update(root);

// Collapse the node and all it's children
function collapse(d) {
    if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    console.log('this is threeData', treeData)

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 180 });

    // ****************** Nodes section ***************************

    // Update the nodes...

    console.log('sample binded to node', nodes)
    var node = svg.selectAll('g.node')
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function (d) {
            console.log('what is source', source)
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);
    console.log('nodeEnter of sample', nodeEnter)
    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function (d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function (d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function (d) { return d.data.name; });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
        .data(links, function (d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function (d) {
            var o = { x: source.x0, y: source.y0 }
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function (d) { return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function (d) {
            var o = { x: source.x, y: source.y }
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

        return path
    }

    // Toggle children on click.
    function click(d) {
        console.log('this is d', d)
        if (d.children) {
            //collapse
            console.log('d.children is being executed', d.children)
            d._children = d.children;
            d.children = null;
        } else {
            //expand
            console.log('else', d.children)
            console.log('more else', d._children)
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
