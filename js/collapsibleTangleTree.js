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
    //         element['direct_children'] = ['CellLine', 'AnimalModel']
    //     }
    //     else if (element['id'] == "CellLine") {
    //         element['children'] = ['Resource', 'Mutation', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Development']
    //         element['direct_children'] = ['Resource', 'Mutation']
    //     }
    //     else if (element['id'] == "AnimalModel") {
    //         element['direct_children'] = ['Resource', 'Mutation']
    //         element['children'] = ['Resource', 'Mutation', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "GeneticReagent") {
    //         element['direct_children'] = ['Resource']
    //         element['children'] = ['Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "Antibody") {
    //         element['direct_children'] = ['Resource']
    //         element['children'] = ['Resource', 'Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Mutation', 'Development']
    //     }
    //     else if (element['id'] == "Resource") {
    //         element['direct_children'] = ['Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Development']
    //         element['children'] = ['Usage', 'Biobank', 'VendorItem', 'Observation', 'ResourceApplication', 'Development']
    //     }
    //     else if (element['id'] == "Vendor") {
    //         element['direct_children'] = ['VendorItem']
    //         element['children'] = ['VendorItem']
    //     }
    //     else if (element['id'] == "MutationDetails") {
    //         element['direct_children'] = ['Mutation']
    //         element['children'] = ['Mutation']
    //     }
    //     else if (element['id'] == "Investigator") {
    //         element['direct_children'] = ['Observation', 'Development']
    //         element['children'] = ['Observation', 'Development']
    //     }
    //     else if (element['id'] == "Publication") {
    //         element['direct_children'] = ['Usage', 'Development']
    //         element['children'] = ['Usage', 'Development']
    //     }
    //     else if (element['id'] == "Funder") {
    //         element['direct_children'] = ['Development']
    //         element['children'] = ['Development']
    //     }
    //     else {
    //         element['direct_children'] = []
    //         element['children'] = []
    //     }

    // })


    ////////////////////////HTAN
    chart['nodes'].forEach(element => {
        element['visible'] = true
        if (element['id'] == 'Biospecimen') {
            element['direct_children'] = ['ScRNA-seqLevel1', 'BulkRNA-seqLevel1', 'BulkWESLevel1', 'OtherAssay', 'ScATAC-seqLevel1', 'ImagingLevel2']
            element['children'] = ['ScRNA-seqLevel1', 'BulkRNA-seqLevel1',
                'BulkWESLevel1', 'OtherAssay', 'ScATAC-seqLevel1', 'ImagingLevel2',
                'ScRNA-seqLevel2', 'BulkRNA-seqLevel2', 'BulkWESLevel2',
                'ScRNA-seqLevel3', 'BulkRNA-seqLevel3', 'BulkWESLevel3', 'ScRNA-seqLevel4']

        }
        else if (element['id'] == 'ImagingLevel2Channels') {
            element['direct_children'] = ['ImagingLevel2']
            element['children'] = ['ImagingLevel2']
        } else if (element['id'] == 'ScRNA-seqLevel1') {
            element['children'] = ['ScRNA-seqLevel2', 'ScRNA-seqLevel3', 'ScRNA-seqLevel4']
            element['direct_children'] = ['ScRNA-seqLevel2']
        } else if (element['id'] == 'BulkRNA-seqLevel1') {
            element['children'] = ['BulkRNA-seqLevel2', 'BulkRNA-seqLevel3']
            element['direct_children'] = ['BulkRNA-seqLevel2']
        } else if (element['id'] == 'BulkRNA-seqLevel2') {
            element['direct_children'] = ['BulkRNA-seqLevel3']
            element['children'] = ['BulkRNA-seqLevel3']
        }

        else if (element['id'] == 'BulkWESLevel1') {
            element['children'] = ['BulkWESLevel2', 'BulkWESLevel3']
            element['direct_children'] = ['BulkWESLevel2']
        }
        else if (element['id'] == 'BulkWESLevel2') {
            element['direct_children'] = ['BulkWESLevel3']

        }
        else if (element['id'] == 'ScRNA-seqLevel2') {
            element['children'] = ['ScRNA-seqLevel3', 'ScRNA-seqLevel4']
            element['direct_children'] = ['ScRNA-seqLevel3']
        }
        else if (element['id'] == 'ScRNA-seqLevel3') {
            element['direct_children'] = ['ScRNA-seqLevel4']
            element['children'] = ['ScRNA-seqLevel4']
        }
        else {
            element['direct_children'] = []
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
                return d._direct_children && d._direct_children.length > 0 && !checkIfDirectLinkExist(d, InteractivePartNode, bundles) ? "orange" : "#575757"
            })
            // .style('fill', function (d) {
            //     return d._direct_children && d._direct_children.length > 0 && !checkIfDirectLinkExist(d, InteractivePartNode, bundles) ? "orange" : "#575757"
            // })
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
        // ///////////////control icons
        // var hoveredStyle = { "background-color": "lightgray" };
        // var flexibleIcon = svg.selectAll("i").data(InteractivePartNode);
        // var flexibleIconEnter = flexibleIcon.enter();
        // // flexibleIconEnter.append("i").merge(flexibleIcon).attr("class", function (d) {
        // //     d._direct_children && d._direct_children.length > 0 && !checkIfDirectLinkExist(d, InteractivePartNode, bundles) ? "fa-thin fa-plus" : "random"
        // // })
        // //     .on("mouseover", function () {
        // //         d3.select(this).style(hoveredStyle);
        // //     })

        // flexibleIconEnter.append("i").merge(flexibleIcon).attr("class", "fa-solid fa-plus")
        //     .on("mouseover", function () {
        //         d3.select(this).style(hoveredStyle);
        //     })
        //     .attr('x', function (d) { return (d.x + 6) })
        //     .attr('y', function (d) { return (d.y - d.height / 2 - 4) })

        // flexibleIconEnter.exit().remove();

        ///////////////control text
        //only select "text" element and bind those elements to data
        var flexibleText = svg.selectAll('text').data(InteractivePartNode);
        var flexibletTextEnter = flexibleText.enter();

        flexibletTextEnter.append('text').merge(flexibleText)
            .attr('style', 'pointer-events: none')
            .attr("class", function (d) {
                return d._direct_children && d._direct_children.length > 0 && !checkIfDirectLinkExist(d, InteractivePartNode, bundles) ? "fa" : ""
            })
            .attr('x', function (d) { return (d.x + 5) })
            .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
            .text(function (d) {
                if (d._direct_children && d._direct_children.length > 0 && !checkIfDirectLinkExist(d, InteractivePartNode, bundles)) {
                    var label = d.id
                    var result = label.concat('\uf067')
                    return result
                } else {
                    return d.id
                }
            })

        flexibleText.exit().remove();

        ///////////////control links
        //only select paths that have class "link"
        var link = svg.select("g").selectAll("path.link").data(bundles);
        var flexibleLinkEnter = link.enter();

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
        if (d.direct_children && d.direct_children.length > 0 && checkIfDirectLinkExist(d, InteractivePartNode, bundles)) {
            console.log('triggering if statement')

            console.log('interactive part node', InteractivePartNode)

            ////when collapsing a node, to indicate that the node has already been "collapsed", we move 
            /// element from "children" to "_children" if that element does not already exist
            if (d._direct_children == null) {
                d._direct_children = d.direct_children;
            } else {
                d.direct_children.forEach(elem => {
                    d._direct_children.indexOf(elem) === -1 && d._direct_children.push(elem)
                })
            }

            // /////Check if any direct children have any shared parents
            // /////In return, we get a list of direct children that won't be collapsed and a list of direct children that will be collapsed
            var notCollapsedArr = checkSharedChildren(d.direct_children, d.id, InteractivePartNode)
            var CollapsedArr = removeArrFromArr(d.children, notCollapsedArr) //also include sub children
            var CollapsedDirectChildrenArr = removeArrFromArr(d.direct_children, notCollapsedArr)

            // //// Handle links
            HidePathNew(d.id, d.children, notCollapsedArr, bundles)


            // ////for the list of children that will be collapsed by the node currently being clicked, we should collapse their children too 
            CollapseSubsequentChildren(CollapsedArr, InteractivePartNode)


            // ////Handle visibility
            ///visibility is different from "collapse/expand" status
            ///a node would disppear if it is 
            //1) direct children of the node being clicked and don't have shared parents; 
            //2) they belong to the nodes that will disppear (and also don't have other parents)

            var NewInteractiveNode = HideChildren(CollapsedDirectChildrenArr, InteractivePartNode)

            d.direct_children = null;

        }

        else {
            console.log('triggering else')

            //get only direct children
            var directChildren = d._direct_children

            //add children nodes back
            var NewInteractiveNode = SetVisibilityChildren(directChildren, InteractivePartNode, true)

            console.log('NewInteractive node', NewInteractiveNode)

            //add links back from parents to children 
            addPathNew(d.id, bundles)

            d.direct_children = d._direct_children

            d._direct_children = null
        }


        //keep children based on visibility
        // we want to keep the nodes as long as visible is not false
        // if visible = true or a node doesn't have attribute 'visible', we would want to keep them
        var ChangeableNode = NewInteractiveNode.filter(function (obj) {
            return obj.visible != false;
        });

        update(ChangeableNode, bundles);


    }




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

    //get all direct children
    var directChildren = concatArr(node.direct_children, node._direct_children)

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

    // console.log('this node is being clicked', node)
    // console.log('the link exist', SavedLinks)

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
        e['visible'] = visibility
    })

    //add changed nodes back to the pool and replace old ones
    var NewPoolArray = replaceObjInArry(poolNode, changeableNode)

    return NewPoolArray

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
            var children = elem['direct_children']

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
            if (e._direct_children == null) {
                e._direct_children = e.direct_children
            } else {
                if (e.direct_children) {
                    e._direct_children = e._direct_children.concat(e.direct_children)
                }
            }

            e.direct_children = null
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

function HideChildren(collapsedChildren, poolNode) {
    if (collapsedChildren.length > 0) {
        //get detailed information about the nodes that will get collapsed
        var collapsedNodes = filterArrayIfInArray(poolNode, collapsedChildren, 'id')

        //loop through the nodes that will get collapsed
        var SavedChildren = [];
        collapsedNodes.forEach(node => {
            //check if any of its direct and indirect children belong to other parents
            var children = node["children"]

            //find a list of children that won't be collapsed
            if (children && children.length > 0) {

                //call checkSharedChildren function again and figure out the children that have other parents that have not yet been collapsed
                var notCollapsedChildren = checkSharedChildren(children, node.id, poolNode)

                //now get a list of children that will be collapsed
                var childrenToCollapse = removeArrFromArr(children, notCollapsedChildren)

                childrenToCollapse.forEach(child => {
                    SavedChildren.indexOf(child) === -1 && SavedChildren.push(child)
                })
            }



        })
        var allChildrenCollapse = SavedChildren.concat(collapsedChildren)

        console.log('all children to collapse', allChildrenCollapse)

        var NewInteractiveNode = SetVisibilityChildren(collapsedChildren, poolNode, false)
        var NewInteractiveNode = SetVisibilityChildren(SavedChildren, poolNode, false)

    } else {
        var NewInteractiveNode = poolNode
    }

    return NewInteractiveNode

}
