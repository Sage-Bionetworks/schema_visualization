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
    //after the two blocks above, we have the x and y coordinates of nodes. 

    // console.log('this is node', Object.keys(nodes[0]))

    // //Collapse after the second level --testing
    // nodes.forEach((element) => {
    //     if (element.level >= 1) {
    //         element = null
    //     }
    // })

    // console.log('nodes', nodes) //nothing changes. this is not working

    // update the nodes ...


    function update(source) {
        var node = svg.selectAll('path.node').data(nodes);
        var nodeEnter = node.enter().append('g').attr('transform', function (d) {
            return "translate(" + source.y0 + "," + source.x0 + ")"
        }).on('clilck', click)

        nodeEnter.append('text').attr("dy", "0.35em")
            .attr("x", function (d) {
                return d.level || d._level ? -13 : 13;
            })
            .attr("text-anchor", function (d) {
                return d.level || d._level ? "end" : "start";
            })
            .text(function (d) {
                return d.id;
            })
    }

    function click(d) {
        if (d.level) {
            d._level = d.level;
            d.level = null;
        } else {
            d.level = d._level;
            d._level = null;
        }
        update(d);
    }

    var i = 0,
        duration = 750,
        source;

    var source = d3.hierarchy(levels, function (d) {
        return d.level
    })

    const height = 900;
    source.x0 = height / 2;
    source.y0 = 0

    console.log('this is levels', levels)
    console.log('this is root', source)

    update(source);





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




function draw(chart, highlight_data, normal_data) {

    console.log('draw chart function is being used');

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

    //add zoom
    var zoom = d3.zoom()
        .extent([[0, 0], [width + 100, height + 100]])
        .scaleExtent([1, 8])
        .on("zoom", function () {
            g.attr('transform', d3.event.transform)
        });

    g.call(zoom);



    chart.bundles.map(b => {
        let d = b.links.map(l => `
              M${l.xt} ${l.yt}
              L${l.xb - l.c1} ${l.yt}
              A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
              L${l.xb} ${l.ys - l.c2}
              A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
              L${l.xs} ${l.ys}`
        ).join("");

        const path = g.append('path')
            .attr('class', 'link')
            .attr('d', d)
            .attr('stroke', 'white')
            .attr('stroke-width', 5);

        const path_two = g.append('path')
            .attr('class', 'link')
            .attr('d', d)
            .attr('stroke-width', 2)
            .attr('stroke', color(b.id));
    })

    normal_data.map(n => {
        const path_three = g.append('path')
            .attr('class', 'selectable node')
            .attr('data-id', n.id)
            .attr('stroke', 'black')
            .attr('stroke-width', 8)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const path_four = g.append('path')
            .attr('class', 'node')
            .attr('stroke', 'white')
            .attr('stroke-width', 4)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const text_one = g.append('text')
            .attr('class', 'selectable')
            .attr('data-id', `${n.id}`)
            .attr('x', `${n.x + 4}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)

        text_one.html(n.id)

        const text_two = g.append('text')
            .attr('x', `${n.x + 4}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('style', "pointer-events: none");

        text_two.html(n.id)



    })

    highlight_data.map((n) => {
        const path_five = g.append('path')
            .attr('class', 'selectable node')
            .attr('stroke', 'black')
            .attr('stroke-width', 8)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const path_six = g.append('path')
            .attr('stroke', 'white')
            .attr('stroke-width', 4)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const text_three = g.append('text')
            .attr('class', 'selectable')
            .attr('data-id', n.id)
            .attr('x', `${n.x + 5}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('font-weight', 'bold')
            .attr('stroke', '#FAEFC2')
            .attr('stroke-width', '4')
        text_three.html(n.id)

        const text_four = g.append('text')
            .attr('x', `${n.x + 4}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('font-weight', 'bold')
            .attr('style', 'pointer-events: auto;')

        text_four.html(n.id)




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
    var node = svg.selectAll('g.node')
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    console.log('node is here', node)
    console.log('nodes are here', nodes)
    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function (d) {
            console.log('what is source', source)
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);


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
            console.log('d children', d)
            console.log('d_children', d._children)
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
        if (d.children) {

            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
