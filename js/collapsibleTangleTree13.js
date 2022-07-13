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
    chart['nodes'].forEach(element => {
        if (element['id'] == 'Biospecimen') {
            element['children'] = ['ScRNA-seqLevel1', 'BulkRNA-seqLevel1',
                'BulkWESLevel1', 'OtherAssay', 'ScATAC-seqLevel1', 'ImagingLevel2',]
        }
        else if (element['id'] == 'ImagingLevel2Channels') {
            element['children'] = ['ImagingLevel2']
        } else if (element['id'] == 'ScRNA-seqLevel1') {
            element['children'] = ['ScRNA-seqLevel2']
        } else if (element['id'] == 'BulkRNA-seqLevel1') {
            element['children'] = ['BulkRNA-seqLevel2']
        } else if (element['id'] == 'BulkRNA-seqLevel2') {
            element['children'] = ['BulkRNA-seqLevel3']
        }

        else if (element['id'] == 'BulkWESLevel1') {
            element['children'] = ['BulkWESLevel2']
        }
        else if (element['id'] == 'BulkWESLevel2') {
            element['children'] = ['BulkWESLevel3']

        }
        else if (element['id'] == 'ScRNA-seqLevel2') {
            element['children'] = ['ScRNA-seqLevel3']
        }
        else if (element['id'] == 'ScRNA-seqLevel3') {
            element['children'] = ['ScRNA-seqLevel4']
        }
        else {
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

    //begin to draw tree
    var InteractivePartNode = chart['nodes']
    console.log('chart', chart)
    update(InteractivePartNode);

    //when we have the default position, the nodes that have children have not yet been expanded
    function update(InteractivePartNode) {

        //store the old positions for transition 
        // InteractivePartNode.forEach(function (d) {
        //     d.x0 = d.x;
        //     d.y0 = d.y;
        // });

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

        // //////////Control exiting node and adding new node
        var g = svg.append("g")
        console.log('interactive node', InteractivePartNode)
        var flexibleNode = svg.select("g").selectAll("path.node").data(InteractivePartNode);
        //console.log('my changeable node', InteractivePartNode)
        var flexibleNodeEnter = flexibleNode.enter()


        flexibleNodeEnter.append('path').merge(flexibleNode)
            .attr('class', 'selectable node')
            // .attr('stroke', 'orange')
            .attr('stroke', function (d) {
                return d._children && d._children.length > 0 && otherThanNull(d._children) ? "orange" : "#575757"
            })
            .attr('stroke-width', 8)
            .attr('transform', "translate(0,0)")
            .attr('d', function (d, i) {
                return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}`
            }).on('click', click);


        // if (clickElem == null) {
        //     flexibleNode.exit().remove();
        // } else {
        //     flexibleNode.exit().transition().duration(250).attr("transform", function (b) {
        //         return (`translate(${-(clickElem.y - clickElem.height / 2)}, ${-clickElem.x})`)
        //         //return `translate(-328, -276)`
        //     }).remove()

        // }


        //control text
        //var flexibleText = svg.selectAll('text').data(InteractivePartNode);
        var flexibleText = svg.selectAll('text')
        var flexibletTextEnter = flexibleText.enter();

        flexibletTextEnter.append('text').merge(flexibleText)
            .attr('style', 'pointer-events: none')
            .attr('x', function (d) { return (d.x + 5) })
            .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
            .text(function (d) { return d.id });


        // //flexibleNode.exit().remove();
        flexibleText.exit().remove();

        // //control links
        var link = svg.select("g").selectAll("path.link")
        // var link = svg.select("g").selectAll("path.link").data(InteractivePartNode);
        var flexibleLinkEnter = link.enter();

        //flexibleLinkEnter.insert('path', 'g').merge(link)
        flexibleLinkEnter.append('path').merge(link)
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


        //flexibleLinkEnter.insert('path', 'g').merge(link)
        flexibleLinkEnter.append('path').merge(link)
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



        link.exit().remove();




        // Store the old positions for transition.
        // InteractivePartNode.forEach(function (d) {
        //     d.x0 = d.x;
        //     d.y0 = d.y;
        // });

    }

    function click(d) {
        //the if statement controls collapsing node, and the else statement controls expanding nodes. 
        if (d.children && d.children.length > 0) {
            var childrenSelected = d.children;

            d._children = d.children

            //children of this node is no longer visible -> set visible = false
            //var NewInteractiveNode = SetVisibilityChildren(d.children, InteractivePartNode, false)

            //handle the link from children to parents
            //HidePath(d.id, d.children, NewInteractiveNode);



            //tell all the children that their children have also been collapsed
            //CollapseSubsequentChildren(d.children, NewInteractiveNode)

            //tell the parents of higher level that their children have been collapsed
            //relayCollapsedChildren(d.id, d.children, NewInteractiveNode)

            // if (d._children == null) {
            //     d._children = d.children;
            // } else {
            //     d.children.forEach(elem => {
            //         d._children.indexOf(elem) === -1 && d._children.push(elem)
            //     })
            // }

            d.children = null;

            //update visbility attribute of some children 
            //if those children is also under other parents (and those parents have not yet been collapsed) -> set visibility = true
            //this step is not needed when expanding nodes
            //relayChildren(InteractivePartNode, childrenSelected, d.id)

            console.log('triggering if')
            // console.log('New interactive node', NewInteractiveNode)


        } else {
            d.children = d._children;
            d._children = null;
            // var childrenSelected = d.children;

            // //get immediate children of a given node
            // var immediateChildren = GetImmediateChildren(InteractivePartNode, d.id, d.level)

            // // add children nodes back
            // var NewInteractiveNode = SetVisibilityChildren(immediateChildren, InteractivePartNode, true)

            // //add links back from parents to children 
            // addPath(d.id, NewInteractiveNode);
            // HidePathByLevel(d._children, NewInteractiveNode)

            // //only keep immediate children in d.children
            // d.children = immediateChildren;

            // // still hiding children that are not immediate children
            // d._children = d._children.filter(function (el) {
            //     return !immediateChildren.includes(el)
            // })

            // //relay expanded children 
            // //if the children that get expanded are also part of other parents
            // relayExpandedChildren(d.id, immediateChildren, NewInteractiveNode)
        }


        //keep children based on visibility
        // we want to keep the nodes as long as visible is not false
        // if visible = true or a node doesn't have attribute 'visible', we would want to keep them
        // var ChangeableNode = NewInteractiveNode.filter(function (obj) {
        //     return obj.visible != false;
        // });

        update(d)
        //update(ChangeableNode, clickElem = d);


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

function GetImmediateChildren(poolNode, node, nodeLevel) {
    var immediateChildren = [];

    poolNode.forEach(elem => {
        var level = elem.level
        var parentArray = elem.parents
        let parents = parentArray.map(a => a.id)

        if (parents.includes(node) && (level - nodeLevel == 1)) {
            immediateChildren.indexOf(elem) === -1 && immediateChildren.push(elem.id)
        }
    })

    return immediateChildren
}

function CollapseSubsequentChildren(childrenArray, poolNode) {
    //get all children nodes from the pool
    var childrenNode = filterArrayIfInArray(poolNode, childrenArray, 'id')

    //set the attribute
    childrenNode.forEach(e => {
        if (e._children == null) {
            e._children = e.children
        } else {
            e._children = e._children.concat(e.children)
        }

        e.children = null
    })

    var NewPoolArray = replaceObjInArry(poolNode, childrenNode)

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

function HidePathByLevel(ChildrenArray, poolNode) {
    //the 'Add Path' function adds the paths from the node being clicked to all its immediate children
    //To be able to expand "by level", we also have to hide the paths that lead to further levels
    var ImmediateChildrenNodes = filterArrayIfInArray(poolNode, ChildrenArray, 'id')

    //console.log('immediate children nodes before', ImmediateChildrenNodes)

    //get the link element of the target node
    ImmediateChildrenNodes.forEach(elem => {
        var bundles = elem['bundles']

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

                bundle[0]['links'] = [];

            })


        }

    })

    //console.log('immediate children nodes', ImmediateChildrenNodes)

}

function relayCollapsedChildren(clickElem, childrenArray, poolNode) {
    var levelClicked = checkLevel(poolNode, clickElem)

    poolNode.forEach(item => {
        var childrenArr = item.children; //children array of other parents
        var level = item.level; //level of other parents

        if (childrenArr !== null && childrenArr.length > 0) {
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

    //console.log('after transformation', poolNode)


}


function relayExpandedChildren(clickElem, childrenArray, poolNode) {
    var levelClicked = checkLevel(poolNode, clickElem)

    poolNode.forEach(item => {
        var childrenArr = item._children; //children array of other parents
        var level = item.level; //level of other parents

        if (childrenArr != null && childrenArr.length > 0) {
            childrenArr.forEach(child => {
                //if the children that we are collapsing also belong to other parents from higher level
                if (childrenArray.includes(child) && levelClicked > level) {
                    // then we want to let those parents know that their grand children have been collapsed
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



function checkLevel(poolNode, element) {
    var elementNode = filterArrayIfInArray(poolNode, [element], 'id')

    var level = elementNode[0]['level']

    return level
}

function relayChildren(poolNode, selectedChildren, clickElem) {
    //if the collapsed child is also a child of other parent,
    //we will update the visibility attribute of the child again to make sure that child still shows up

    //level of the clicked element
    var levelClicked = checkLevel(poolNode, clickElem)

    poolNode.forEach(item => {
        var childrenArr = item.children;
        var level = item.level
        if (childrenArr !== null && childrenArr.length > 0) {
            selectedChildren.forEach(elem => {
                //if other parents also share this children
                //and if other parents have the same level as "clicked" element
                // TO DO: or if other parents is in a higher level than the "clicked" element
                // try logic: if (childrenArr.includes(elem) && level == levelClicked) && !childrenArr.includes(clickElem)
                if (childrenArr.includes(elem) && level == levelClicked) {
                    //for collapsing(if statement triggering), set the visibility of that special child to 'true'
                    SetVisibilityChildren([elem], poolNode, true)
                }

            })
        }
    })

    return poolNode


}

