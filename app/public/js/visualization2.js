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
    const padding = 8
    const node_height = 22
    const node_width = 70
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
    const width = 900;

    const totalWidth = width + margins.left + margins.right;

    //remove previous result
    d3.select('#visualization').select('svg').remove();

    //create new chart
    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', totalWidth)
        .attr('height', chart.layout.height)
        .attr('id', 'myViz');

    chart.bundles.map(b => {
        let d = b.links.map(l => `
              M${l.xt} ${l.yt}
              L${l.xb - l.c1} ${l.yt}
              A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
              L${l.xb} ${l.ys - l.c2}
              A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
              L${l.xs} ${l.ys}`
        ).join("");

        const path = d3.select('#myViz').append('path')
            .attr('class', 'link')
            .attr('d', d)
            .attr('stroke', 'white')
            .attr('stroke-width', 5);

        const path_two = d3.select('#myViz').append('path')
            .attr('class', 'link')
            .attr('d', d)
            .attr('stroke-width', 2)
            .attr('stroke', color(b.id));
    })

    normal_data.map(n => {
        const path_three = d3.select('#myViz').append('path')
            .attr('class', 'selectable node')
            .attr('data-id', n.id)
            .attr('stroke', 'black')
            .attr('stroke-width', 8)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const path_four = d3.select('#myViz').append('path')
            .attr('class', 'node')
            .attr('stroke', 'white')
            .attr('stroke-width', 4)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const text_one = d3.select('#myViz').append('text')
            .attr('class', 'selectable')
            .attr('data-id', `${n.id}`)
            .attr('x', `${n.x + 4}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)

        text_one.html(n.id)

        const text_two = d3.select('#myViz').append('text')
            .attr('x', `${n.x + 4}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('style', "pointer-events: none");

        text_two.html(n.id)



    })

    highlight_data.map((n) => {
        const path_five = d3.select('#myViz').append('path')
            .attr('class', 'selectable node')
            .attr('stroke', 'black')
            .attr('stroke-width', 8)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const path_six = d3.select('#myViz').append('path')
            .attr('stroke', 'white')
            .attr('stroke-width', 4)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const text_three = d3.select('#myViz').append('text')
            .attr('class', 'selectable')
            .attr('data-id', n.id)
            .attr('x', `${n.x + 5}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('font-weight', 'bold')
            .attr('stroke', '#FAEFC2')
            .attr('stroke-width', '4')
        text_three.html(n.id)

        const text_four = d3.select('#myViz').append('text')
            .attr('x', `${n.x + 4}`)
            .attr('y', `${n.y - n.height / 2 - 4}`)
            .attr('font-weight', 'bold')
            .attr('style', 'pointer-events: auto;')

        text_four.html(n.id)




    })


}