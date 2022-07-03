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


////////////////////////call create collapsible tree function to create my collapsible tree
//preprocessing data -- now is a hard-coded function
//assume that we could let biospecimen node knows all its children
function preprocessChart(chart) {
    //console.log(chart)

    ///////////////////////NF
    // chart['nodes'].forEach(element => {
    //     if (element['id'] == "Donor") {
    //         element['children'] = ['CellLine', 'AnimalModel', 'Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "CellLine") {
    //         element['children'] = ['Resource', 'Mutation', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "AnimalModel") {
    //         element['children'] = ['Resource', 'Mutation', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "GeneticReagent") {
    //         element['children'] = ['Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "Antibody") {
    //         element['children'] = ['Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "Resource") {
    //         element['children'] = ['Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "Vendor") {
    //         element['children'] = ['VendorItem']
    //     }
    //     else if (element['id'] == "MutationDetails") {
    //         element['children'] = ['Mutation']
    //     }
    //     else if (element['id'] == "Investigator") {
    //         element['children'] = ['Observation', 'Development']
    //     }
    //     else if (element['id'] == "Publication") {
    //         element['children'] = ['Usage', 'Development']
    //     }
    //     else if (element['id'] == "Funder") {
    //         element['children'] = ['Development']
    //     }
    //     else {
    //         element['children'] = []
    //     }

    // })


    ////////////////////////HTAN
    chart['nodes'].forEach(element => {
        if (element['id'] == 'Biospecimen') {
            element['children'] = ['ScRNA-seqLevel1', 'BulkRNA-seqLevel1',
                'BulkWESLevel1', 'OtherAssay', 'ScATAC-seqLevel1', 'ImagingLevel2',
                'ScRNA-seqLevel2', 'BulkRNA-seqLevel2', 'BulkWESLevel2',
                'ScRNA-seqLevel3', 'BulkRNA-seqLevel3', 'BulkWESLevel3', 'ScRNA-seqLevel4']
        }
        else if (element['id'] == 'ImagingLevel2Channels') {
            element['children'] = ['ImagingLevel2']
        } else if (element['id'] == 'ScRNA-seqLevel1') {
            element['children'] = ['ScRNA-seqLevel2', 'ScRNA-seqLevel3', 'ScRNA-seqLevel4']
        } else if (element['id'] == 'BulkRNA-seqLevel1') {
            element['children'] = ['BulkRNA-seqLevel2', 'BulkRNA-seqLevel3']
        } else if (element['id'] == 'BulkRNA-seqLevel2') {
            element['children'] = ['BulkRNA-seqLevel3']
        }

        else if (element['id'] == 'BulkWESLevel1') {
            element['children'] = ['BulkWESLevel2', 'BulkWESLevel3']
        }
        else if (element['id'] == 'BulkWESLevel2') {
            element['children'] = ['BulkWESLevel3']

        }
        else if (element['id'] == 'ScRNA-seqLevel2') {
            element['children'] = ['ScRNA-seqLevel3', 'ScRNA-seqLevel4']
        }
        else if (element['id'] == 'ScRNA-seqLevel3') {
            element['children'] = ['ScRNA-seqLevel4']
        }
        else {
            element['children'] = []
        }

    })
    return chart

    //return chart
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


function createCollapsibleTree(chart) {

    //preprocess data
    var chart = preprocessChart(chart);

    console.log('nodes after processsing', chart['nodes'])

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

    //begin to draw tree
    var InteractivePartNode = chart['nodes']
    var links = chart['links']
    var bundles = chart['bundles']

    //console.log('bundles', bundles)

    //by default, all the children have been expanded. 
    update(InteractivePartNode, bundles);

    function update(InteractivePartNode, bundles) {
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

        ///////////////control nodes 

        //create g element to store all the nodes 
        var g = svg.append("g")

        //create nodes
        //only select path that have class "node"
        var flexibleNode = svg.select("g").selectAll("path.node").data(InteractivePartNode);
        var flexibleNodeEnter = flexibleNode.enter()

        //create nodes
        flexibleNodeEnter.append('path').merge(flexibleNode)
            .attr('class', 'selectable node')
            .attr('stroke', function (d) {
                //if nodes could be expanded, we change its color to orange
                return d._children && d._children.length > 0 && otherThanNull(d._children) ? "orange" : "#575757"
            })
            .attr('stroke-width', 8) //size of node
            .attr('d', function (d, i) {
                return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}` //location of the nodes
            }).on('click', click);

        //exiting nodes
        flexibleNode.exit().remove();

        ///////////////might be useful for transitioning
        // if (clickElem == null) {
        //     flexibleNode.exit().remove();
        // } else {
        //     flexibleNode.exit().transition().duration(250).attr("transform", function (b) {
        //         return (`translate(${-(clickElem.y - clickElem.height / 2)}, ${-clickElem.x})`)
        //         //return `translate(-328, -276)`
        //     }).remove()

        // }
        //////////////////////////////

        ///////////////control text
        //only select "text" element and bind those elements to data
        var flexibleText = svg.selectAll('text').data(InteractivePartNode);
        var flexibletTextEnter = flexibleText.enter();

        flexibletTextEnter.append('text').merge(flexibleText)
            .attr('style', 'pointer-events: none')
            .attr('x', function (d) { return (d.x + 5) })
            .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
            .text(function (d) { return d.id });

        flexibleText.exit().remove();

        ///////////////control links
        //only select paths that have class "link"
        var link = svg.select("g").selectAll("path.link").data(bundles);
        var flexibleLinkEnter = link.enter();

        console.log('bundles', bundles)

        //this part is only create links that have stroke white. 
        //this helps with styling
        // flexibleLinkEnter.append('path').merge(link)
        //     .attr('class', 'link')
        //     .attr('d', function (b) {
        //         if (b.bundles && b.bundles.links) {
        //             let d = b.bundles.links.map(l => `
        //                                 M${l.xt} ${l.yt}
        //                                 L${l.xb - l.c1} ${l.yt}
        //                                 A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
        //                                 L${l.xb} ${l.ys - l.c2}
        //                                 A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
        //                                 L${l.xs} ${l.ys}`).join("");
        //             return d
        //         }
        //     })
        //     .attr('stroke', 'white')
        //     .attr('stroke-width', 5)

        //create actual links
        // flexibleLinkEnter.append('path').merge(link)
        //     .attr('class', 'link')
        //     .attr('d', function (b) {
        //         console.log(b.id)
        //         if (b.bundles) {
        //             if (b.bundles[0]) {
        //                 //
        //                 var firstElem = b.bundles[0][0].links
        //                 //console.log(b.bundles[0]) -- this add links that other parents at the same level have
        //                 //console.log(b.bundles[1]) -- this add the pure children
        //                 console.log(b.bundles)

        //                 let d = firstElem.map(l => `
        //                         M${l.xt} ${l.yt}
        //                         L${l.xb - l.c1} ${l.yt}
        //                         A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
        //                         L${l.xb} ${l.ys - l.c2}
        //                         A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
        //                         L${l.xs} ${l.ys}`).join("");
        //                 //console.log(d)
        //                 return d
        //             }

        //         }
        //     })
        //     .attr('stroke', function (b) {
        //         return color(b.id)
        //     })
        //     .attr('stroke-width', 2)

        //var bundleId = [];
        flexibleLinkEnter.append('path').merge(link)
            .attr('class', 'link')
            .attr('d', function (b) {
                let d = b.links.map(l => `
                    M${l.xt} ${l.yt}
                    L${l.xb - l.c1} ${l.yt}
                    A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
                    L${l.xb} ${l.ys - l.c2}
                    A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
                    L${l.xs} ${l.ys}`).join("")
                return d
            })
            .attr('stroke', function (b) {
                //console.log(b.source)
                return color(b.id)
            })
            .attr('stroke-width', 2)

        link.exit().remove();


    }

    function click(d) {
        //the if statement controls collapsing node, and the else statement controls expanding nodes. 
        if (d.children && d.children.length > 0) {
            console.log('triggering if statement')
            console.log('begin if statement', InteractivePartNode)

            //make exceptions for children that owned by other parents that have not yet been collapsed
            var notCollapsed = checkSharedChildren(d.children, d.id, InteractivePartNode)
            console.log('not collapsed potential list', notCollapsed)

            //remove the children that we don't want to collapse from the array
            var filteredChildrenArr = removeArrFromArr(d.children, notCollapsed)

            //children of this node is no longer visible -> set visible = false
            var NewInteractiveNode = SetVisibilityChildren(d.children, InteractivePartNode, false)


            //handle the link from children to parents
            // // HidePath(d.id, d.children, NewInteractiveNode);
            HidePathNew(d.id, d.children, notCollapsed, bundles)

            //for all the children that will be collapsed, tell them that their children have also been collapsed
            CollapseSubsequentChildren(filteredChildrenArr, NewInteractiveNode)

            //tell other parents that their children have also been collapsed
            relayCollapsedChildrenNew(filteredChildrenArr, NewInteractiveNode)

            // // //update visbility attribute of some children 
            // // //if those children is also under other parents (and those parents have not yet been collapsed) -> set visibility = true
            // // //this step is not needed when expanding nodes
            // //ShowSharedChildren(NewInteractiveNode, d.children, d.id)
            showSharedChildrenNew(notCollapsed, NewInteractiveNode)

            if (d._children == null) {
                d._children = d.children;
            } else {
                d.children.forEach(elem => {
                    d._children.indexOf(elem) === -1 && d._children.push(elem)
                })
            }

            d.children = null;

            // console.log('triggering if')
            // console.log('New interactive node', NewInteractiveNode)

        } else {
            var childrenSelected = d.children;

            //get immediate children of a given node
            //var immediateChildren = GetImmediateChildren(InteractivePartNode, d.id, d.level)
            //get only "direct" children (these children here are directly related to the clicked node)
            var directChildren = FilterChildrenIfDirectParent(d.id, d._children, InteractivePartNode)


            // add children nodes back
            //var NewInteractiveNode = SetVisibilityChildren(immediateChildren, InteractivePartNode, true)
            var NewInteractiveNode = SetVisibilityChildren(directChildren, InteractivePartNode, true)

            //add links back from parents to children 
            //addPath(d.id, NewInteractiveNode);
            //HidePathByLevel(d._children, NewInteractiveNode)
            addPathNew(d.id, bundles)

            //only keep immediate children in d.children
            //d.children = immediateChildren;
            d.children = directChildren

            // still hiding children that are not immediate children
            d._children = d._children.filter(function (el) {
                return !directChildren.includes(el)
            })

            //relay expanded children 
            //if the children that get expanded are also part of other parents
            //relayExpandedChildren(d.id, immediateChildren, NewInteractiveNode)
            relayExpandedChildrenNew(directChildren, NewInteractiveNode)
        }


        //keep children based on visibility
        // we want to keep the nodes as long as visible is not false
        // if visible = true or a node doesn't have attribute 'visible', we would want to keep them
        var ChangeableNode = NewInteractiveNode.filter(function (obj) {
            return obj.visible != false;
        });

        //update(d)
        update(ChangeableNode, bundles);


    }




}

function otherThanNull(arr) {
    return arr.some(el => el !== null);
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

// function GetImmediateChildren(poolNode, node, nodeLevel) {
//     var immediateChildren = [];

//     poolNode.forEach(elem => {
//         var level = elem.level
//         var parentArray = elem.parents
//         let parents = parentArray.map(a => a.id)

//         if (parents.includes(node) && (level - nodeLevel == 1)) {
//             immediateChildren.indexOf(elem) === -1 && immediateChildren.push(elem.id)
//         }
//     })

//     return immediateChildren
// }

function removeArrFromArr(baseArr, toRemove) {
    //////
    /*this function removes an array from another array*/
    /////

    baseArr = baseArr.filter(function (el) {
        return !toRemove.includes(el);
    });
    return baseArr
}

// function checkIfOwnChildren(childrenNode, childrenArray) {
//     var toRemove = [];
//     childrenNode.forEach(elem => {
//         //children array of children node 
//         var children = elem['children']
//         //if children here overlaps with childrenArray
//         //then it means that this element contains other children
//         const contains = children.some(element => {
//             return childrenArray.indexOf(element)
//         })

//         if (contains) {
//             toRemove.indexOf(elem.id) === -1 && toRemove.push(elem.id)
//         }
//     })

//     return toRemove
// }

function collapseDirectChildren(e) {
    if (e._children == null) {
        e._children = [];
    }

    e.children.forEach(elem => {
        e._children.indexOf(elem) === -1 && e._children.push(elem)
    })

    e.children = null;

}

function expandNode(e) {
    //if the node is part of ""
}

function checkSharedChildren(childrenArray, clickElem, poolNode) {
    /*this function finds out the children that have not yet been collapsed by other direct parents*/
    //this function returns a list of children that should not be collapsed 

    var NotCollapsed = [];
    var Collapsed = [];

    //check if any children nodes have other parents
    var childrenNode = filterArrayIfInArray(poolNode, childrenArray, 'id')

    childrenNode.forEach(e => {
        //get a list of direct parents
        var parents = getLstParents(e)
        //console.log('this child', e)
        //console.log('list of parents', parents)

        //ignore the current node that gets clicked
        var otherParents = removeArrFromArr(parents, clickElem)

        //if there's also another parent that will get temporarily collapsed, we ignore that as well
        // if (temporaryCollapsible) {
        //     console.log('temporary collapsible', temporaryCollapsible)
        //     var otherParents = removeArrFromArr(parents, temporaryCollapsible)
        //     console.log('other parents in this case', otherParents)
        // }

        //nodes of other parents
        var otherParentsNodes = filterArrayIfInArray(poolNode, otherParents, 'id')

        //if parents from the higher level would get collapse in this round, we ignore that node too
        var filteredOtherParentsNodes = filterArrayIfNotInArray(otherParentsNodes, Collapsed, 'id')

        //if any other direct parents still have not yet been collapsed 
        filteredOtherParentsNodes.forEach(elem => {

            //children array of children node 
            var children = elem['children']

            // check which children also have other parents
            if (children && children.includes(e.id)) {
                NotCollapsed.indexOf(e.id) === -1 && NotCollapsed.push(e.id)
            }
            // childrenArray.forEach(child => {
            //     if (children && children.includes(child)) {
            //         NotCollapsed.indexOf(child) === -1 && NotCollapsed.push(child)
            //     }
            // })
        })

        //if a node is going to get collapsed in this round, save it in a different bucket
        if (!NotCollapsed.includes(e.id)) {
            Collapsed.indexOf(e.id) === -1 && Collapsed.push(e.id)
        }

    })

    console.log('not collapsed', NotCollapsed)
    console.log('otherparentsnode', childrenNode)
    return NotCollapsed







    // //get id of all the nodes
    // var allNodes = poolNode.map(elem => elem.id)

    // //ignore the node that is being clicked
    // var filtered = removeArrFromArr(allNodes, clickElem)

    // //also ignore the child that owns other children 
    // //for example, when clicking on "CellLine", "Resource" also owns "Biobank" and "ResourceApplication"
    // //We want to ignore "Resource" as a "shared" parent
    // var childrenNode = filterArrayIfInArray(poolNode, childrenArray, 'id')
    // var toRemove = checkIfOwnChildren(childrenNode, childrenArray)
    // var filteredNew = removeArrFromArr(filtered, toRemove)

    // //now, begin to look at these nodes and see if they share children with the node being clicked
    // var filteredNode = filterArrayIfInArray(poolNode, filteredNew, 'id')
    // filteredNode.forEach(elem => {
    //     //children array of children node 
    //     var children = elem['children']

    //     //check which children also have other parents
    //     childrenArray.forEach(child => {but
    //         if (children && children.includes(child)) {
    //             console.log('elem that owns the children', elem)
    //             console.log('child', child)
    //             NotCollapsed.indexOf(child) === -1 && NotCollapsed.push(child)
    //         }
    //     })
    // })

    // console.log('not collapsed list', NotCollapsed)


    // return NotCollapsed




    // console.log('pool node in checksharedChildren', poolNode)

    // var childrenNode = filterArrayIfInArray(poolNode, childrenArray, 'id')

    // //check if any children are also owned by other parents 
    // //if so, and if other parents have not yet collapsed those, then we dont want to collapse the children of these children
    // var NotCollapsed = [];
    // childrenNode.forEach(e => {
    //     //get a list of parents
    //     var parents = getLstParents(e)

    //     //ignore current parent
    //     var filteredParents = removeArrFromArr(parents, clickElem)
    //     console.log('more original list', filteredParents)

    //     //if current children also owns other current children, ignore those
    //     var filteredParentNew = filteredParents.filter(item => !childrenArray.includes(item))
    //     console.log('children node', e)
    //     console.log('filteredParents', filteredParentNew)

    //     //get parent nodes 
    //     var parentNode = filterArrayIfInArray(poolNode, filteredParentNew, 'id')

    //     //console.log('parent node', parentNode)

    //     // see if any children nodes are also part of other parents
    //     parentNode.forEach(elem => {
    //         var childrenContainer = elem.children
    //         if (childrenContainer && childrenContainer.includes(e.id)) {
    //             //save it if it doesn't already exists
    //             //console.log('who is the parent that owns you', elem)
    //             NotCollapsed.indexOf(e.id) === -1 && NotCollapsed.push(e.id)
    //         }
    //     })
    // })

    // //console.log('not collapsed', NotCollapsed)

    // return NotCollapsed

}

function CollapseSubsequentChildren(childrenArray, poolNode) {
    //set the attribute
    if (childrenArray.length > 0) {
        //get all children nodes from the pool
        var childrenNode = filterArrayIfInArray(poolNode, childrenArray, 'id')

        //collapse children of children
        childrenNode.forEach(e => {
            if (e._children == null) {
                e._children = e.children
            } else {
                if (e.children) {
                    e._children = e._children.concat(e.children)
                }
            }

            e.children = null
        })
        var NewPoolArray = replaceObjInArry(poolNode, childrenNode)

        return NewPoolArray
    } else {
        return poolNode
    }

}

function HidePathNew(clickElem, childrenArray, notCollapsed, bundles) {
    //hide links
    bundles.forEach(bundles => {
        var linkArr = bundles['links']
        //create an empty container for storing links that get temporarily removed
        if (bundles['_links'] == undefined) {
            bundles['_links'] = [];
        }

        linkArr.forEach((link, index) => {
            //collapse the link if the following occurs: 
            //if "target" is the clicked node, and "source" is one of the children
            //OR if "target" is one of the children (and for NF, target has to NOT belong in the "not collapsed" group)
            if (((childrenArray.includes(link.source.id) && clickElem == link.target.id)) || (childrenArray.includes(link.target.id)) && !notCollapsed.includes(link.target.id)) {
                //then we collapse the link by hiding it in '_link' bucket
                bundles['_links'].push(link) && bundles['_links'].indexOf(link) === -1
            }
        })

        //if the link is not in "_links" bucket, then keep it in "link"
        //otherwise, remove the link
        bundles['links'] = linkArr.filter(function (a) {
            return !bundles['_links'].find(function (b) {
                return a.source.id === b.source.id && a.target.id === b.target.id
            })
        })



    })
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

function addPathNew(clickElem, bundles) {
    bundles.forEach(bundle => {
        var linkContainer = bundle['_links']
        if (linkContainer.length > 0) {
            linkContainer.forEach(link => {
                if (link.target.id == clickElem) {
                    bundle['links'].push(link)
                }
            })
        }

        bundle['_links'] = linkContainer.filter(function (a) {
            return !bundle['links'].find(function (b) {
                return a.source.id === b.source.id && a.target.id === b.target.id
            })
        })
    })
}

function addPath(clickElem, poolNode) {
    //get the parent node that you want to change
    //similar to HidePath function, changes will also get applied 
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

function getLstParents(node) {
    var parents = node['parents'].map(function (elem) { return elem.id })
    return parents
}

function FilterChildrenIfDirectParent(ClickElem, ChildrenArray, poolNode) {
    var childrenContainer = [];
    //get children nodes
    childrenNodes = filterArrayIfInArray(poolNode, ChildrenArray, 'id')

    //loop through the nodes and see if their parent is the clicked node
    childrenNodes.forEach(node => {
        var parents = getLstParents(node)
        if (parents.includes(ClickElem)) {
            childrenContainer.push(node.id)
        }

    })

    return childrenContainer

}


// function HidePathByLevel(ChildrenArray, poolNode) {
//     //the 'Add Path' function adds the paths from the node being clicked to all its immediate children
//     //To be able to expand "by level", we also have to hide the paths that lead to further levels
//     var ImmediateChildrenNodes = filterArrayIfInArray(poolNode, ChildrenArray, 'id')

//     //console.log('immediate children nodes before', ImmediateChildrenNodes)

//     //get the link element of the target node
//     ImmediateChildrenNodes.forEach(elem => {
//         var bundles = elem['bundles']

//         //hide links
//         if (bundles) {
//             bundles.forEach(bundle => {
//                 var linkArray = bundle[0]['links']
//                 //save the links to _link container for future use
//                 if (bundle[0]['_links'] == null) {
//                     bundle[0]['_links'] = linkArray
//                 } else {
//                     //add new element to _links if it doesn't exit
//                     linkArray.forEach(elem => {
//                         bundle[0]['_links'].indexOf(elem) === -1 && bundle[0]['_links'].push(elem)
//                     })
//                 }

//                 bundle[0]['links'] = [];

//             })


//         }

//     })


// }

function relayCollapsedChildrenNew(childrenArray, poolNode) {
    poolNode.forEach(item => {
        var childrenArr = item.children; //children array of other parents

        if (childrenArr instanceof Array && childrenArr.length > 0) {
            childrenArr.forEach(child => {
                //if the children that we are collapsing also belong to other parents
                if (childrenArray.includes(child)) {
                    // then we want to let those parents know that their grand children have been collapsed
                    item.children = removeElemFromArr(child, childrenArr)
                    // and save it to container 
                    if (item._children == null) {
                        item._children = []
                    }

                    item._children.indexOf(child) === -1 && item._children.push(child)

                }
            })

        }
    })

    console.log('pool node after replay collapsed', poolNode)
}


function relayExpandedChildrenNew(childrenArray, poolNode) {
    poolNode.forEach(item => {
        var childrenArr = item._children; //children array of other parents
        var level = item.level; //level of other parents

        if (childrenArr != null && childrenArr.length > 0) {
            childrenArr.forEach(child => {
                //if the children that we are expanding also belong to other parents from higher level
                if (childrenArray.includes(child)) {
                    // then we want to let those parents know that their grand children have been expanded
                    item._children = removeElemFromArr(child, childrenArr)
                    // and save it to container 
                    if (item.children == null) {
                        item.children = []
                    }

                    item.children.indexOf(child) === -1 && item.children.push(child)

                }
            })

        }
    })

    console.log('pool node after replay expanded', poolNode)
}

function relayCollapsedChildren(clickElem, childrenArray, poolNode) {
    var levelClicked = checkLevel(poolNode, clickElem)

    poolNode.forEach(item => {
        var childrenArr = item.children; //children array of other parents
        var level = item.level; //level of other parents

        if (childrenArr instanceof Array && childrenArr.length > 0) {
            childrenArr.forEach(child => {
                //if the children that we are collapsing also belong to other parents from higher level
                if (childrenArray.includes(child) && levelClicked > level) {
                    // then we want to let those parents know that their grand children have been collapsed
                    item.children = removeElemFromArr(child, childrenArr)
                    // and save it to container 
                    if (item._children == null) {
                        item._children = []
                    }

                    item._children.indexOf(child) === -1 && item._children.push(child)

                }
            })



        }
    })

}


function relayExpandedChildren(clickElem, childrenArray, poolNode) {
    var levelClicked = checkLevel(poolNode, clickElem)

    poolNode.forEach(item => {
        var childrenArr = item._children; //children array of other parents
        var level = item.level; //level of other parents

        if (childrenArr != null && childrenArr.length > 0) {
            childrenArr.forEach(child => {
                //if the children that we are expanding also belong to other parents from higher level
                if (childrenArray.includes(child) && levelClicked > level) {
                    // then we want to let those parents know that their grand children have been expanded
                    item._children = removeElemFromArr(child, childrenArr)
                    // and save it to container 
                    if (item.children == null) {
                        item.children = []
                    }

                    item.children.indexOf(child) === -1 && item.children.push(child)

                }
            })

        }
    })

    console.log('after transformation', poolNode)

}



function showSharedChildrenNew(childrenArr, poolNode) {
    childrenArr.forEach(child => {
        SetVisibilityChildren([child], poolNode, true)
    })
}


function checkLevel(poolNode, element) {
    var elementNode = filterArrayIfInArray(poolNode, [element], 'id')

    var level = elementNode[0]['level']

    return level
}


function ShowSharedChildren(poolNode, selectedChildren, clickElem) {
    //if the collapsed child is also a child of other parent,
    //we will update the visibility attribute of the child again to make sure that child still shows up

    //level of the clicked element
    var levelClicked = checkLevel(poolNode, clickElem)

    //get the remianing nodes other than the one gets clicked
    var filteredNode = filterArrayIfNotInArray(poolNode, [clickElem], 'id')

    filteredNode.forEach(item => {
        var childrenArr = item.children;
        var level = item.level
        if (childrenArr !== null && childrenArr.length > 0) {
            selectedChildren.forEach(elem => {
                //if other parents also share this children
                //and if other parents have the same level as "clicked" element
                if ((childrenArr.includes(elem) && level == levelClicked) || (childrenArr.includes(elem) && !childrenArr.includes(clickElem))) {
                    //for collapsing, set the visibility of that special child to 'true'
                    //console.log('elem to show', elem)
                    SetVisibilityChildren([elem], poolNode, true)
                }

            })
        }
    })

    return filteredNode


}




// function click(d) {
//     //the if statement controls collapsing node, and the else statement controls expanding nodes. 
//     if (d.children && d.children.length > 0) {
//         var childrenSelected = d.children;

//         //children of this node is no longer visible -> set visible = false
//         var NewInteractiveNode = SetVisibilityChildren(d.children, InteractivePartNode, false)

//         //handle the link from children to parents
//         HidePath(d.id, d.children, NewInteractiveNode);

//         d._children = d.children;
//         d.children = null;

//         //update visbility attribute of some children 
//         //if those children is also under other parents (and those parents have not yet been collapsed) -> set visibility = true
//         //this step is not needed when expanding nodes
//         relayChildren(InteractivePartNode, childrenSelected, true)
//         console.log('New interactive node', NewInteractiveNode)


//     } else {
//         var childrenSelected = d.children;

//         //set visibility to true
//         var NewInteractiveNode = SetVisibilityChildren(d._children, InteractivePartNode, true)

//         //add links back from parents to children 
//         addPath(d.id, d._children, NewInteractiveNode);

//         d.children = d._children;
//         d._children = null;

//         console.log('triggering interactive node', NewInteractiveNode)
//     }


//     //keep children based on visibility
//     // we want to keep the nodes as long as visible is not false
//     // if visible = true or a node doesn't have attribute 'visible', we would want to keep them
//     var ChangeableNode = NewInteractiveNode.filter(function (obj) {
//         return obj.visible != false;
//     });

//     update(ChangeableNode);

    // //     //////////Control exiting node and adding new node
    // var flexibleNode = svg.select("g").selectAll("path").data(ChangeableNode);
    // console.log('my changeable node', ChangeableNode)
    // var flexibleNodeEnter = flexibleNode.enter()
    // flexibleNodeEnter.append('path').merge(flexibleNode)
    //     .attr('class', 'selectable node')
    //     .attr("transform", function (d) {
    //         return "translate(0,0)"
    //     })
    //     .attr('stroke', 'orange')
    //     .attr('stroke-width', 8)
    //     .attr('d', function (d, i) {
    //         return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}`
    //     }).on('click', click);

    // console.log('flexible node here here here', flexibleNode)

    // // const nodeExit = flexibleNode.exit().transition()
    // //     .attr("transform", d => `translate(${d.y},${d.x})`)
    // //     .duration(250).remove();

    // //node transition
    // // const nodeUpdate = flexibleNodeEnter.merge(flexibleNode);

    // // nodeUpdate.transition()
    // //     .duration(250)
    // //     .attr('d', function (d) {
    // //         return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}`
    // //     })


    // // flexibleNodeEnter.transition()
    // //     .duration(250)
    // //     .attr("transform", function (d) {
    // //         return ('translate(' + d.y + ',' + d.x + ')')
    // //     })
    // // var flexibleNodeUpdate = flexibleNodeEnter.merge(flexibleNode);

    // // flexibleNodeUpdate.transition()
    // //     .duration(250)
    // //     .attr("transform", function (d) {
    // //         return "translate(" + d.y + "," + d.x + ")";
    // //     });


    // //control text
    // var flexibleText = svg.selectAll('text').data(ChangeableNode);
    // var flexibletTextEnter = flexibleText.enter();

    // flexibletTextEnter.append('text').merge(flexibleText)
    //     .attr('style', 'pointer-events: none')
    //     .attr('x', function (d) { return (d.x + 5) })
    //     .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
    //     .text(function (d) { return d.id });

    // // const nodeExit = flexibleNode.exit().transition()
    // //     .attr("transform", d => `translate(${d.y},${d.x})`)
    // //     .duration(250).remove();

    // // flexibleText.exit()
    // //     .transition().duration(250)
    // //     .attr('d', function (d) {
    // //         return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}`
    // //     }).remove();

    // flexibleNode.exit().remove();
    // flexibleText.exit().remove();

    // //control links
    // var link = svg.select("g").selectAll("path.link").data(ChangeableNode);
    // var flexibleLinkEnter = link.enter();

    // flexibleLinkEnter.insert('path', 'g').merge(link)
    //     .attr('class', 'link')
    //     .attr('d', function (b) {
    //         if (b.bundles && b.bundles.links) {
    //             let d = b.bundles.links.map(l => `
    //                             M${l.xt} ${l.yt}
    //                             L${l.xb - l.c1} ${l.yt}
    //                             A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
    //                             L${l.xb} ${l.ys - l.c2}
    //                             A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
    //                             L${l.xs} ${l.ys}`).join("");
    //             return d
    //         }
    //     })
    //     .attr('stroke', 'white')
    //     .attr('stroke-width', 5)


    // flexibleLinkEnter.insert('path', 'g').merge(link)
    //     .attr('class', 'link')
    //     .attr('d', function (b) {
    //         if (b.bundles) {
    //             if (b.bundles[0]) {
    //                 var firstElem = b.bundles[0][0].links

    //                 let d = firstElem.map(l => `
    //                     M${l.xt} ${l.yt}
    //                     L${l.xb - l.c1} ${l.yt}
    //                     A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
    //                     L${l.xb} ${l.ys - l.c2}
    //                     A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
    //                     L${l.xs} ${l.ys}`).join("");
    //                 return d
    //             }

    //         }
    //     })
    //     .attr('stroke', function (b) {
    //         return color(b.id)
    //     })
    //     .attr('stroke-width', 2)


    // //flexibleLinkEnter.exit().transition().duration(250).remove();
    // flexibleLinkEnter.exit().remove();

    // console.log('flexibleLinkEnter', flexibleLinkEnter)

    // // Store the old positions for transition.
    // ChangeableNode.forEach(function (d) {
    //     d.x0 = d.x;
    //     d.y0 = d.y;
    // });

    // //}



//}

