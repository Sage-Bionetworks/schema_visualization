
//////////////////all functions related to later visualization step
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


////////////////////////call create collapsible tree function to create my collapsible tree
//preprocessing data -- now is a hard-coded function
//assume that we could let biospecimen node knows all its children
function preprocessChart(chart) {
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
    return chart
}

function removeElemFromArr(item, array) {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array
}

function addElemToArray(newItem, array) {
    if (array == null) {
        array = [];
    }
    array.indexOf(newItem) === -1 && array.push(newItem)
    return array
}

//separarte interactive part and steady part
function SeparateInteractiveAndSteady(chart) {
    var interactiveKeys = FilterNode(chart);

    var InteractivePartNode = filterArrayIfInArray(chart['nodes'], interactiveKeys, 'id')
    var steadyPartNode = filterArrayIfNotInArray(chart['nodes'], interactiveKeys, 'id')

    return [InteractivePartNode, steadyPartNode]
}

//create steady part tree

function createSteadyPartNode(steadyPartNode, svg) {


    steadyPartNode.map(n => {

        const path_three = svg.append('path')
            .attr('class', 'selectable node')
            .attr('data-id', `${n.id}`)
            .attr('stroke', 'black')
            .attr('stroke-width', 8)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

        const path_four = svg.append('path')
            .attr('class', 'node')
            .attr('stroke', 'white')
            .attr('stroke-width', 4)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);

    })


}

function createCollapsibleTree(chart) {

    //preprocess data
    var chart = preprocessChart(chart);

    //prepare for rendering charts
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

    //separate two types of nodes
    //var dataBulk = SeparateInteractiveAndSteady(chart);
    //var InteractivePartNode = dataBulk[0];
    //var steadyPartNode = dataBulk[1];

    //draw steady part 
    //createSteadyPartNode(steadyPartNode, svg);

    //begin to draw interactive part

    //update(InteractivePartNode);
    var InteractivePartNode = chart['nodes']
    update(InteractivePartNode);

    //when we have the default position, the nodes that have children have not yet been expanded
    function update(InteractivePartNode) {

        console.log('this is InteractivePartNode', InteractivePartNode);

        var filteredInteractiveNode = InteractivePartNode;

        ///////////////do not touch the following section
        //always bind the changed data to our node element
        // var svgDoc = d3.select('#visualization').append('svg')
        // var nodeEnter = svgDoc.append("g").selectAll("path")
        //                     .data(filteredInteractiveNode)
        //                     .enter()
        //                     .append('path');
        // var flexibleNode = svgDoc.select("g").selectAll("path").data(filteredInteractiveNode);
        // flexibleNode.enter().append('path').on('click', click);
        // flexibleNode.exit().remove();

        // console.log('flexible nodes', flexibleNode)
        ///////////////////////////////////////////////////

        //bind data to existing node
        var g = svg.append("g")
        var node = g.selectAll("path").data(filteredInteractiveNode)
        var NodeEnter = node.enter();

        //control node
        NodeEnter.append('path')
            .attr('class', 'selectable node')
            .attr('stroke', 'orange')
            .attr('stroke-width', 8)
            .attr('d', function (d, i) {
                return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}`
            }).on('click', click);


        //control text
        NodeEnter.append('text')
            .attr('style', 'pointer-events: none')
            .attr('x', function (d) { return (d.x + 5) })
            .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
            .text(function (d) { return d.id });

        //UPDATE
        var NodeUpdate = NodeEnter.merge(node);


        //control links
        NodeEnter.insert('path', 'g')
            .attr('class', 'link')
            .attr('d', function (b) {
                if (b.bundles && b.bundles.links) {
                    let d = b.bundles.links.map(l => `
                                M${l.xt} ${l.yt}
                                L${l.xb - l.c1} ${l.yt}
                                A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
                                L${l.xb} ${l.ys - l.c2}
                                A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
                                L${l.xs} ${l.ys}`).join("");
                    return d
                }
            })
            .attr('stroke', 'white')
            .attr('stroke-width', 5)


        NodeEnter.insert('path', 'g')
            .attr('class', 'link')
            .attr('d', function (b) {
                if (b.bundles) {
                    if (b.bundles[0]) {
                        var firstElem = b.bundles[0][0].links

                        let d = firstElem.map(l => `
                        M${l.xt} ${l.yt}
                        L${l.xb - l.c1} ${l.yt}
                        A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
                        L${l.xb} ${l.ys - l.c2}
                        A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
                        L${l.xs} ${l.ys}`).join("");
                        return d
                    }

                }
            })
            .attr('stroke', function (b) {
                return color(b.id)
            })
            .attr('stroke-width', 2)

    }



    function SetVisibilityChildren(childrenArray, poolNode, visibility) {
        //get all children nodes from the pool
        var changeableNode = filterArrayIfInArray(poolNode, childrenArray, 'id')

        //set the attribute "visible"
        changeableNode.forEach(e => {
            if (e['visible'] === undefined) {
                e['visible'] = false //set default as hiding children when click
            } else {
                e['visible'] = visibility
            }
        })

        //add changed nodes back to the pool and replace old ones
        var NewPoolArray = replaceObjInArry(poolNode, changeableNode)

        return NewPoolArray

    }

    function HidePath(clickElem, childrenArray, poolNode) {
        //even though "targetNode" appears to be a segment of the "poolNode", any changes that you applied to "targetNode"
        //would get automatically apply to "poolNode" because filterArrayIfInArray function simply filters the original array
        //get the parent node that you want to change
        targetNode = filterArrayIfInArray(poolNode, [clickElem], 'id')

        //get the link element of the target node
        var bundles = targetNode[0]['bundles']

        //hide links
        if (bundles) {
            bundles.forEach(bundle => {
                var linkArray = bundle[0]['links']
                //save the links to _link container for future use
                if (bundle[0]['_links'] == null) {
                    bundle[0]['_links'] = linkArray
                } else {
                    //add new element to _links if it doesn't exit
                    linkArray.forEach(elem => {
                        bundle[0]['_links'].indexOf(elem) === -1 && bundle[0]['_links'].push(elem)
                    })
                }

                //remove the parent to children paths from link array
                //for children that have multiple parents, make sure not touching paths that lead to other parents while collapsing
                var filteredLinkArray = linkArray.filter(i => ![clickElem].includes(i['target']['id']) && childrenArray.includes(i['source']['id']))

                //if there's a child that also belongs to other parents 
                if (filteredLinkArray != null && filteredLinkArray.length > 0) {
                    //make sure that child is still in the 'links' bucket
                    bundle[0]['links'] = filteredLinkArray
                } else {
                    //otherwise, we could just set 'links' to an empty list since we have backed up the links in _links
                    bundle[0]['links'] = [];
                }

            })
        }

    }

    function addPath(clickElem, childrenArray, poolNode) {
        //get the parent node that you want to change
        //similar to HidePath function, chhanges will also get applied 
        targetNode = filterArrayIfInArray(poolNode, [clickElem], 'id')

        var bundles = targetNode[0]['bundles']
        if (bundles) {
            bundles.forEach(bundle => {
                if (bundle[0]['links'] == null) {
                    bundle[0]['links'] = [];
                }

                //add new element to links if it doesn't exist
                //only add links specific to the parent that gets clicked. 
                //make sure not touching the links between children and other parents
                bundle[0]['_links'].forEach(elem => {
                    bundle[0]['links'].indexOf(elem) === -1 && [clickElem].includes(elem['target']['id']) && bundle[0]['links'].push(elem)
                })

            })


        }

    }

    function relayChildren(poolNode, selectedChildren, visibility) {
        //if the collapsed child is also a child of other parent,
        //we will update the visibility attribute of the child again to make sure that child still shows up

        poolNode.forEach(item => {
            var childrenArr = item.children;

            if (childrenArr !== null && childrenArr.length > 0) {
                selectedChildren.forEach(elem => {
                    //if other parents also share this children
                    if (childrenArr.includes(elem)) {
                        //for collapsing(if statement triggering), set the visibility of that special child to 'true'
                        SetVisibilityChildren([elem], poolNode, visibility)
                    }

                })
            }
        })

        return poolNode


    }




    function click(d) {
        //the if statement controls collapsing node, and the else statement controls expanding nodes. 
        if (d.children && d.children.length > 0) {
            console.log('triggering if')

            var childrenSelected = d.children;

            //children of this node is no longer visible -> set visible = false
            var NewInteractiveNode = SetVisibilityChildren(d.children, InteractivePartNode, false)

            //handle the link from children to parents
            HidePath(d.id, d.children, NewInteractiveNode);

            d._children = d.children;
            d.children = null;

            //update visbility attribute of some children 
            //if those children is also under other parents (and those parents have not yet been collapsed) -> set visibility = true
            //this step is not needed when expanding nodes
            relayChildren(InteractivePartNode, childrenSelected, true)
            console.log('New interactive node', NewInteractiveNode)


        } else {
            var childrenSelected = d.children;

            //set visibility to true
            var NewInteractiveNode = SetVisibilityChildren(d._children, InteractivePartNode, true)

            //add links back from parents to children 
            addPath(d.id, d._children, NewInteractiveNode);

            d.children = d._children;
            d._children = null;

            console.log('triggering interactive node', NewInteractiveNode)
        }


        //keep children based on visibility
        // we want to keep the nodes as long as visible is not false
        // if visible = true or a node doesn't have attribute 'visible', we would want to keep them
        var ChangeableNode = NewInteractiveNode.filter(function (obj) {
            return obj.visible != false;
        });

        console.log('my experiment nodes', ChangeableNode)
        //update(ChangeableNode);

        //Control exiting node and adding new node
        var flexibleNode = svg.select("g").selectAll("path").data(ChangeableNode);
        var flexibleNodeEnter = flexibleNode.enter()
        flexibleNodeEnter.append('path').merge(flexibleNode)
            .attr('class', 'selectable node')
            .attr('stroke', 'orange')
            .attr('stroke-width', 8)
            .attr('d', function (d, i) {
                return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}`
            }).on('click', click);

        //control text
        var flexibleText = svg.selectAll('text').data(ChangeableNode);
        var flexibletTextEnter = flexibleText.enter();

        flexibletTextEnter.append('text').merge(flexibleText)
            .attr('style', 'pointer-events: none')
            .attr('x', function (d) { return (d.x + 5) })
            .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
            .text(function (d) { return d.id });


        flexibleNode.exit().remove();
        flexibleText.exit().remove();

        //control links
        var link = svg.select("g").selectAll("path.link").data(ChangeableNode);
        var flexibleLinkEnter = link.enter();

        flexibleLinkEnter.insert('path', 'g').merge(link)
            .attr('class', 'link')
            .attr('d', function (b) {
                if (b.bundles && b.bundles.links) {
                    let d = b.bundles.links.map(l => `
                                M${l.xt} ${l.yt}
                                L${l.xb - l.c1} ${l.yt}
                                A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
                                L${l.xb} ${l.ys - l.c2}
                                A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
                                L${l.xs} ${l.ys}`).join("");
                    return d
                }
            })
            .attr('stroke', 'white')
            .attr('stroke-width', 5)


        flexibleLinkEnter.insert('path', 'g').merge(link)
            .attr('class', 'link')
            .attr('d', function (b) {
                if (b.bundles) {
                    if (b.bundles[0]) {
                        var firstElem = b.bundles[0][0].links

                        let d = firstElem.map(l => `
                        M${l.xt} ${l.yt}
                        L${l.xb - l.c1} ${l.yt}
                        A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
                        L${l.xb} ${l.ys - l.c2}
                        A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
                        L${l.xs} ${l.ys}`).join("");
                        return d
                    }

                }
            })
            .attr('stroke', function (b) {
                return color(b.id)
            })
            .attr('stroke-width', 2)

        flexibleLinkEnter.exit().remove();

        console.log('flexibleLinkEnter', flexibleLinkEnter)
    }



}

