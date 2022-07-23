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


function toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
        rv[i] = arr[i];
    return rv;
}
////////////////////////call create collapsible tree function to create my collapsible tree
//preprocessing data -- now is a hard-coded function
//assume that we could let biospecimen node knows all its children

function preprocessChart(chart) {
    //console.log(chart)
    console.log('chart nodes', chart['nodes'])

    ///////////////////////NF
    chart['nodes'].forEach(element => {
        //by default, no nodes get collapsed
        element['collapsed'] = false

        //by default, all the nodes are visible
        element['visible'] = true

        if (element['id'] == "Donor") {
            element['children'] = ['CellLine', 'AnimalModel', 'Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
            element['directChildren'] = ['CellLine', 'AnimalModel']
            element['directChildrenStatus'] = ['CellLine', 'AnimalModel']
        }
        else if (element['id'] == "CellLine") {
            element['children'] = ['Resource', 'Mutation', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Development']
            element['directChildren'] = ['Resource', 'Mutation']
            element['directChildrenStatus'] = ['Resource', 'Mutation']
        }
        else if (element['id'] == "AnimalModel") {
            element['children'] = ['Resource', 'Mutation', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
            element['directChildren'] = ['Resource', 'Mutation']
            element['directChildrenStatus'] = ['Resource', 'Mutation']
        }
        else if (element['id'] == "GeneticReagent") {
            element['children'] = ['Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
            element['directChildren'] = ['Resource']
            element['directChildrenStatus'] = ['Resource']
        }
        else if (element['id'] == "Antibody") {
            element['children'] = ['Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
            element['directChildren'] = ['Resource']
            element['directChildrenStatus'] = ['Resource']
        }
        else if (element['id'] == "Resource") {
            element['children'] = ['Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Development']
            element['directChildren'] = ['Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Development']
            element['directChildrenStatus'] = ['Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Development']
        }
        else if (element['id'] == "Vendor") {
            element['children'] = ['VendorItem']
            element['directChildren'] = ['VendorItem']
            element['directChildrenStatus'] = ['VendorItem']
        }
        else if (element['id'] == "MutationDetails") {
            element['children'] = ['Mutation']
            element['directChildren'] = ['Mutation']
            element['directChildrenStatus'] = ['Mutation']
        }
        else if (element['id'] == "Investigator") {
            element['children'] = ['Observation', 'Development']
            element['directChildren'] = ['Observation', 'Development']
            element['directChildrenStatus'] = ['Observation', 'Development']
        }
        else if (element['id'] == "Publication") {
            element['children'] = ['Usage', 'Development']
            element['directChildren'] = ['Usage', 'Development']
            element['directChildrenStatus'] = ['Usage', 'Development']
        }
        else if (element['id'] == "Funder") {
            element['children'] = ['Development']
            element['directChildren'] = ['Development']
            element['directChildrenStatus'] = ['Development']
        }
        else {
            element['children'] = []
            element['directChildren'] = []
            element['directChildrenStatus'] = []
        }

        //convert array to a list of object
        if (element['directChildren'].length > 0) {
            element['directChildrenStatus'] = element['directChildrenStatus'].reduce((accumulator, value) => ({ ...accumulator, [value]: { collapsed: false } }), {})
        }

        // if (element['directChildren'].length > 0) {
        //     element['directChildren'] = element['directChildren'].reduce((a, v) => ({ ...a, [v]: { collapsed: false } }), {})
        // }

    }


    )


    ////////////////////////HTAN
    // chart['nodes'].forEach(element => {
    //     if (element['id'] == 'Biospecimen') {
    //         element['children'] = ['ScRNA-seqLevel1', 'BulkRNA-seqLevel1',
    //             'BulkWESLevel1', 'OtherAssay', 'ScATAC-seqLevel1', 'ImagingLevel2',
    //             'ScRNA-seqLevel2', 'BulkRNA-seqLevel2', 'BulkWESLevel2',
    //             'ScRNA-seqLevel3', 'BulkRNA-seqLevel3', 'BulkWESLevel3', 'ScRNA-seqLevel4']
    //     }
    //     else if (element['id'] == 'ImagingLevel2Channels') {
    //         element['children'] = ['ImagingLevel2']
    //     } else if (element['id'] == 'ScRNA-seqLevel1') {
    //         element['children'] = ['ScRNA-seqLevel2', 'ScRNA-seqLevel3', 'ScRNA-seqLevel4']
    //     } else if (element['id'] == 'BulkRNA-seqLevel1') {
    //         element['children'] = ['BulkRNA-seqLevel2', 'BulkRNA-seqLevel3']
    //     } else if (element['id'] == 'BulkRNA-seqLevel2') {
    //         element['children'] = ['BulkRNA-seqLevel3']
    //     }

    //     else if (element['id'] == 'BulkWESLevel1') {
    //         element['children'] = ['BulkWESLevel2', 'BulkWESLevel3']
    //     }
    //     else if (element['id'] == 'BulkWESLevel2') {
    //         element['children'] = ['BulkWESLevel3']

    //     }
    //     else if (element['id'] == 'ScRNA-seqLevel2') {
    //         element['children'] = ['ScRNA-seqLevel3', 'ScRNA-seqLevel4']
    //     }
    //     else if (element['id'] == 'ScRNA-seqLevel3') {
    //         element['children'] = ['ScRNA-seqLevel4']
    //     }
    //     else {
    //         element['children'] = []
    //     }

    // })
    // return chart

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


const filterPureArray = (base, filter) => {
    //if any elements are in "filter array", remove those from base
    const filtered = base.filter(el => {
        return filter.indexOf(el) === -1;
    });
    return filtered;
};

function createCollapsibleTree(chart) {

    //preprocess data
    var chart = preprocessChart(chart);

    console.log(chart)

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

    //for styling
    InteractivePartNode.map(n => {
        d3.select('#myViz').append('path')
            .attr('class', 'node')
            .attr('stroke', 'white')
            .attr('stroke-width', 3)
            .attr('d', `M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`);
    })

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
                //return d._children && d._children.length > 0 && otherThanNull(d._children) ? "orange" : "#575757"
                //console.log('checking', d)
                //console.log(checkIfDirectLinkExist(d, InteractivePartNode, bundles))
                return d._children && d._children.length > 0 && !checkIfDirectLinkExist(d, InteractivePartNode, bundles) ? "orange" : "#575757"
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
        if (!d.collapsed && checkIfDirectLinkExist(d, InteractivePartNode, bundles)) {
            console.log('triggering if statement')

            //collapse this node
            d.collapsed = true

            //list of children 
            var childrenArr = d.children

            //update children status
            var directChildrenStatus = d['directChildrenStatus']
            Object.keys(directChildrenStatus).forEach(function (key) { directChildrenStatus[key]['collapsed'] = true })

            //all the children of the node being clicked get "collapsed"
            var ChildrenNodes = filterArrayIfInArray(InteractivePartNode, d.children, 'id')
            CollapseChildren(ChildrenNodes)

            console.log('interactive part node', InteractivePartNode)

            //loop through the tree to also collapse the children of the children 
            //CollapseSubChildren(d.directChildren, InteractivePartNode)
            //CollapseSubsequentChildren(filteredChildrenArr, InteractivePartNode)


            //Find the children that won't disappear after the collapse interaction
            //Those children are usually direct children that have other parents that have not yet been collapsed
            var notDisappear = checkSharedChildrenNew(d.directChildren, InteractivePartNode)
            var notDisappearArr = notDisappear.map(elem => elem.id)
            console.log('a list of children nodes that would not disappear', notDisappearArr)

            //now, we get a list of children that will need to disappear
            var copyChildren = structuredClone(d.children);
            var copyChildrenArr = Object.keys(copyChildren);
            var disappearChildren = filterPureArray(copyChildrenArr, notDisappearArr)
            var disappearChildrenNodes = filterArrayIfInArray(InteractivePartNode, disappearChildren, 'id')

            //handle the link 
            HidePathNew(d.id, childrenArr, notDisappearArr, bundles)

            // //for the node being clicked update children status 
            //UpdateChildrenStatus(d)

            // //for all the children that will disappear, let's update the status of them to "collapsed"
            // UpdateChildrenNodes(filteredChildrenNode)

            //for all the nodes that will disppear, let's make them disappear now
            //their children should also disappear
            updateVisibility(disappearChildrenNodes)

            //For the node that get collapsed, their direct children would also disppear



            console.log('children array', d.children)
            console.log('bundles', bundles)

        }

        console.log('interactive part node after transformation', InteractivePartNode)

        var ChangeableNode = InteractivePartNode.filter(function (obj) {
            return obj.visible != false;
        });

        update(ChangeableNode, bundles)
    }

    //     //the if statement controls collapsing node, and the else statement controls expanding nodes. 
    //     if (d.children && d.children.length > 0 && checkIfDirectLinkExist(d, InteractivePartNode, bundles)) {
    //         console.log('triggering if statement')

    //         //make exceptions for children that owned by other parents that have not yet been collapsed
    //         //this function also handles nodes that would get collapsed in this iteration. 
    //         var notCollapsed = checkSharedChildren(d.children, d.id, InteractivePartNode)
    //         console.log('not collapsed potential list', notCollapsed)

    //         //remove the children that we don't want to collapse from the array
    //         var filteredChildrenArr = removeArrFromArr(d.children, notCollapsed)

    //         //children of this node is no longer visible -> set visible = false
    //         var NewInteractiveNode = SetVisibilityChildren(d.children, InteractivePartNode, false)

    //         //handle the link from children to parents
    //         HidePathNew(d.id, d.children, notCollapsed, bundles)

    //         //for all the children that will be collapsed, tell them that their children have also been collapsed
    //         CollapseSubsequentChildren(filteredChildrenArr, NewInteractiveNode)

    //         //tell other parents that their children have also been collapsed
    //         //not restrict to higher level parents 
    //         relayCollapsedChildrenNew(filteredChildrenArr, NewInteractiveNode)
    //         //relayCollapsedChildren(d.id, filteredChildrenArr, NewInteractiveNode)

    //         //update visbility attribute of some children 
    //         //if those children is also under other parents (and those parents have not yet been collapsed) -> set visibility = true
    //         //this step is not needed when expanding nodes
    //         showSharedChildrenNew(notCollapsed, NewInteractiveNode)

    //         if (d._children == null) {
    //             d._children = d.children;
    //         } else {
    //             d.children.forEach(elem => {
    //                 d._children.indexOf(elem) === -1 && d._children.push(elem)
    //             })
    //         }

    //         d.children = null;

    //         console.log('triggering if')
    //         console.log('New interactive node', NewInteractiveNode)

    //     }
    //     else if (d.children && d.children.length > 0 && !checkIfDirectLinkExist(d, InteractivePartNode, bundles)) {
    //         //for special expansion
    //         var directChildren = FilterChildrenIfDirectParent(d.id, d._children, InteractivePartNode)

    //         // add children nodes back
    //         var NewInteractiveNode = SetVisibilityChildren(directChildren, InteractivePartNode, true)

    //         //get direct children back to "children container"
    //         directChildren.forEach(elem => {
    //             d.children.indexOf(elem) === -1 && d.children.push(elem)
    //         })


    //         addPathNew(d.id, bundles)

    //         // still hiding children that are not in d.children
    //         d._children = d._children.filter(function (el) {
    //             return !d.children.includes(el)
    //         })

    //         //relay expanded children 
    //         relayExpandedChildren(d.id, directChildren, NewInteractiveNode)

    //         console.log('else if', NewInteractiveNode)

    //     } else {
    //         var childrenSelected = d.children;

    //         //get only "direct" children (these children here are directly related to the clicked node)
    //         //note: "direct" children could be across multiple levels
    //         //for example, for "CellLine" in NF, the direct children are: "Resource" and "Mutation"
    //         var directChildren = FilterChildrenIfDirectParent(d.id, d._children, InteractivePartNode)

    //         // add children nodes back
    //         var NewInteractiveNode = SetVisibilityChildren(directChildren, InteractivePartNode, true)

    //         //add links back from parents to children 
    //         addPathNew(d.id, bundles)

    //         //only keep direct children in d.children
    //         d.children = directChildren

    //         // still hiding children that are not immediate children
    //         d._children = d._children.filter(function (el) {
    //             return !directChildren.includes(el)
    //         })

    //         //relay expanded children 
    //         // tell parents from higher level that their grand children have been expanded. 
    //         // without this step, when the node from higher level collapse, it would ignore collapsing the grand children 
    //         // example: collapse "Biospecimen" -> expand "ScRNA-seqLevel1" -> collapse "Biospecimen" again
    //         relayExpandedChildren(d.id, directChildren, NewInteractiveNode)

    //         console.log('else statement', NewInteractiveNode)
    //     }


    //     //keep children based on visibility
    //     // we want to keep the nodes as long as visible is not false
    //     // if visible = true or a node doesn't have attribute 'visible', we would want to keep them
    //     var ChangeableNode = NewInteractiveNode.filter(function (obj) {
    //         return obj.visible != false;
    //     });

    //     //update(d)
    //     update(ChangeableNode, bundles);


    // }




}



function checkIfDirectLinkExist(node, InteractivePartNode, bundles) {
    //this function is for figuring out if there's a direct link between the node being clicked and all its direct children
    //if such links do not exist, we would still want to expand the node instead of collapse
    //this function was created because we saw a problem with NF
    //example: after collapse on "CellLine" and also "Resource", if we expand on "Resource" and then click on "CellLine" again, 
    //the code would think that we want to collapse "CellLine". This shouldn't be the case since there's no link between "CellLine"
    //and "Resource". 

    var toCollapse = true

    //concat array function
    //this also works for combining an array and a null value
    const concatArr = (...arrays) => [].concat(...arrays.filter(Array.isArray));

    //get all children
    var allChildren = concatArr(node.children, node._children)

    //figure out direct children
    var childrenNode = filterArrayIfInArray(InteractivePartNode, allChildren, 'id')
    var directChildren = [];
    childrenNode.forEach(child => {
        var parents = getLstParents(child)
        if (parents.includes(node.id)) {
            directChildren.push(child.id) && directChildren.indexOf(child.id) === -1
        }

    })

    var SavedLinks = [];

    //looping through bundles
    bundles.forEach(bundle => {
        var parents = getLstParents(bundle)

        //if this node's immediate parent is the node that is being clicked
        if (parents.includes(node.id)) {
            var linkArrContainer = bundle["_links"]

            //if the link between the node being clicked and its direct children are hidden
            if (linkArrContainer) {

                linkArrContainer.forEach(elem => {
                    if (directChildren.includes(elem.source.id) && node['id'] == elem.target.id) {
                        SavedLinks.push(elem)
                    }
                })
            }

        }
    })

    console.log('this node is being clicked', node)
    console.log('the link exist', SavedLinks)

    if (SavedLinks.length > 0) {
        toCollapse = false
    }

    return toCollapse

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

function CollapseChildren(arrayChildrenNode) {
    if (arrayChildrenNode.length > 0) {
        arrayChildrenNode.forEach(node => {
            node.collapsed = true
        })
    }
}

function FindChildren(nodes) {
    nodes.forEach(elem => {
        var children = elem['directChildren']
    })

}

function CollapseSubChildren(directChildrenArr, poolNode) {

    var childrenToCheck = directChildrenArr

    if (childrenToCheck.length > 0) {

    }

    // while (childrenToCheck.length > 0) {
    //     //figure out the children of the direct children
    //     directChildrenNodes = filterArrayIfInArray(poolNode, childrenToCheck, 'id')

    //     //collapse thse nodes
    //     CollapseChildren(directChildrenNodes)

    //     directChildrenNodes.forEach(node => {
    //         var childrenToCheck = node['directChildren']
    //     })


    // }

}

function updateVisibility(arrayChildrenNode) {
    if (arrayChildrenNode.length > 0) {
        arrayChildrenNode.forEach(node => {
            node['visible'] = false
        })
    }



}

// function UpdateCollapsedChildren(arrayChildrenNode, collapsedLst) {
//     Object.keys(arrayChildrenNode).forEach(key => {
//         if (collapsedLst.includes(key)) {
//             arrayChildrenNode[key].collapsed = true
//         }
//     });

//     //console.log('arrayChildrenNode after transformation', arrayChildrenNode)
// }

function UpdateChildrenStatus(clickedNode) {
    var children = clickedNode['children']
    Object.keys(children).forEach(key => {
        children[key].collapsed = true
    });

    //UpdateCollapsedChildren(children, collapsedLst)
}

function UpdateChildrenNodes(childrenNodes) {
    childrenNodes.forEach(child => {
        child.collapsed = true
    })
}

function removeArrFromArr(baseArr, toRemove) {
    //////
    /*this function removes an array from another array*/
    /////

    baseArr = baseArr.filter(function (el) {
        return !toRemove.includes(el);
    });
    return baseArr
}

function checkSharedChildrenNew(directChildren, poolNode) {
    //check if any direct children nodes have other parents
    var childrenNode = filterArrayIfInArray(poolNode, directChildren, 'id')

    var notCollapsed = [];

    //get a list of parents of each children node
    childrenNode.forEach(elem => {
        // list of direct parents for each node
        var parents = getLstParents(elem)

        //get the nodes of other parents
        var otherParentsNodes = filterArrayIfInArray(poolNode, parents, 'id')

        //check status of other parents nodes and see if they have been collapsed
        var NotCollapsedParentsArr = otherParentsNodes.map(elem => !elem.collapsed)

        if (NotCollapsedParentsArr.length >= 0) {
            notCollapsed.push(elem)
        }
    })

    console.log('a list of direct children that will not be disappear', notCollapsed)

    return notCollapsed


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
        })

        //if a node is going to get collapsed in this round, save it in a different bucket
        if (!NotCollapsed.includes(e.id)) {
            Collapsed.indexOf(e.id) === -1 && Collapsed.push(e.id)
        }

    })

    console.log('not collapsed', NotCollapsed)
    return NotCollapsed

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
    console.log('childrenarray', childrenArray)
    console.log('not collapsed', notCollapsed)
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

function relayExpandedChildren(clickElem, childrenArray, poolNode) {
    var levelClicked = checkLevel(poolNode, clickElem)

    poolNode.forEach(item => {
        var childrenArr = item._children; //children array of other parents
        var level = item.level; //level of other parents
        var toRemove = [];

        if (childrenArr != null && childrenArr.length > 0) {
            console.log('item before transform', item)
            console.log('children of other parents', childrenArr)
            childrenArr.forEach(child => {
                //if the children that we are expanding also belong to other parents from higher level
                if (childrenArray.includes(child) && levelClicked > level) {
                    //console.log('the child that will move', child)

                    //save it back to "children" container
                    if (item.children == null) {
                        item.children = []
                    }

                    item.children.indexOf(child) === -1 && item.children.push(child)
                    toRemove.push(child)
                }
            })

            console.log('item', item)

        }
        console.log('to remove', toRemove)

        //make sure that _children container no longer contains children that have been moved to "children" container
        if (item._children != null) {
            item._children = removeArrFromArr(item._children, toRemove)
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