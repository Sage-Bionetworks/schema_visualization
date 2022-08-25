
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

            //console.log('item', item)

        }
        //console.log('to remove', toRemove)

        //make sure that _children container no longer contains children that have been moved to "children" container
        if (item._children != null) {
            item._children = removeArrFromArr(item._children, toRemove)
        }

    })

    console.log('after transformation', poolNode)

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

    console.log('after relaycollapsedChildrennew', poolNode)
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

//within the if statement
//for relay collapsed child: 
//            //let other parents know that its child has already been collapsed by removing other parent's children from "d.children"
// in this case, d._children might not always be an empty container. 
// if (d._children == null) {
//     d._children = d.children
// } else {
//     var childrenContainer = Array.from(d._children) //array like object
//     var childrenArr = Array.from(d.children) //array like object
//     d._children = childrenContainer.concat(childrenArr);
// }

//in else statement
//d.children = d._children;
// if (d.children == null) {
//     d.children = d._children
// } else {
//     var childrenContainer = Array.from(d._children) //array like object
//     var childrenArr = Array.from(d.children) //array like object
//     d.children = childrenContainer.concat(childrenArr);
// }
function relayCollapsedChild(poolNode, selectedChildren) {
    poolNode.forEach(item => {
        var childrenArr = item.children;
        if (childrenArr !== null && childrenArr.length > 0) {
            selectedChildren.forEach(elem => {
                //if the collapsed child is also a child of other parent 
                if (childrenArr.includes(elem)) {
                    //remove the collpased child also from other parent
                    removeElemFromArr(elem, childrenArr)
                    // addElemToArray(elem, item._children)
                    //push the child and saved it in _children container
                    if (item._children == null) {
                        item._children = [];
                        item._children.push(elem)
                    } else {
                        //check if the element already exists
                        //if it doesn't exist, push the element
                        item._children.indexOf(elem) === -1 && item._children.push(elem)
                    }

                }

            })
        }
    })

    //console.log('poolNode', poolNode)
}

function relayExpandedChild(poolNode, selectedChildren) {
    poolNode.forEach(item => {
        //children of parents
        var childrenArr = item._children
        if (childrenArr != null && childrenArr.length > 0) {
            selectedChildren.forEach(elem => {
                //if this child is also another parent's child
                if (childrenArr.includes(elem)) {
                    //add the expanded child to other parents if it doesn't already exists
                    //addElemToArray(elem, item.children)
                    removeElemFromArr(elem, childrenArr)
                    if (item.children == null) {
                        item.children = [];
                        item.children.push(elem)
                    } else {
                        //check if the element already exists
                        //if it doesn't exist, push the element
                        item.children.indexOf(elem) === -1 && item.children.push(elem)
                    }

                }
                // } else {
                //     //remove that child from item._children
                //     removeElemFromArr(elem, item._children)
                // }
            })

        }


    })

    console.log('poolNode', poolNode)
}



function relayCollapseChildrenPath(clickElem, targetNodeChildren, poolNode) {
    //get the rest of the nodes
    otherNode = filterArrayIfNotInArray(poolNode, [clickElem], 'id')

    //look up other parents
    //if they share children with the target parents, we will hide their links too
    otherNode.forEach(node => {
        bundleArray = node['bundles']
        //loop through each bundle within bundle array
        bundleArray.forEach(bundle => {
            var bundleId = bundle[0]['id']
            //we want to target the bundle that includes the id of the clicked element
            if (bundleId.includes('--') && bundleId.includes(clickElem)) {
                //this element has the links that we want to hide
                var linkArr = bundle[0]['links']
                console.log('node', node)
                console.log('bundle', bundle)
                console.log('linkArr', linkArr)

                //remove the parent to children paths from link array like we did when we hide the path
                //filteredLinkArray = linkArr.filter(i => targetNodeChildren.includes(i['source']['id']))
                //bundle[0]['links'] = filteredLinkArray

                //bundle[0]['_links'].push(elem)


                //now looping through this link array and see if it contains any children of the clicked element
                // linkArr.forEach(link=>{
                //     var source = link.source
                //     //if this source is part of the "_children" of the target node, that means we want to collapse the path
                //     if(targetNodeChildren.includes(source)){
                //         //collapsing the path 
                //         linkArr = linkArr.filter(function(item){
                //             return item !== link
                //         })


                //     }
                // })


            }
        })
    })


}

function relayCollapsedPath(clickElem, poolNode) {
    //get the parent node that you click on 
    targetNode = filterArrayIfInArray(poolNode, [clickElem], 'id')
    //get the rest of node
    otherNode = filterArrayIfNotInArray(poolNode, [clickElem], 'id')

    var Targetbundles = targetNode[0]['bundles']

    //check out the bundle name
    var SavedBundles = [];

    if (Targetbundles) {
        Targetbundles.forEach(bundle => {
            //more array nested in one array
            //only keep those id that contains '--'
            filteredBundle = bundle.filter(function (item) {
                //console.log('item', item.id)
                if (item['id'].includes('--')) {
                    return item
                }
            })
            SavedBundles.push(filteredBundle)
        })
    }


    //filter out empty arrays from array
    //this array might have multiple elements if a parent shares children with more than one other parents
    SavedBundles = SavedBundles.filter(e => e.length)
    console.log('savedbundles', SavedBundles)

    if (SavedBundles.length > 0) {
        SavedBundles.forEach(singlebundle => {
            //id of the bundle 
            var id = singlebundle[0]['id']

        })
    }

    //now we could go through existing nodes and update those that have the same id as this one
    // if (SavedBundles.length > 0) {
    //     otherNode.forEach(item => {
    //         var otherBundles = item['bundles']
    //         otherBundles.forEach(item => {
    //             //console.log(elem) -- this should show all the other bundles from other nodes
    //             item.forEach(elem => {
    //                 SavedBundles.forEach(singlebundle => {
    //                     // console.log('elem.id', elem.id)
    //                     // console.log('singlebundle.id', singlebundle.id)
    //                     // if (elem.id = singlebundle.id) {
    //                     //     elem = singlebundle
    //                     //     console.log('elem', elem)
    //                     //     console.log('single bundle', singlebundle)
    //                     // }
    //                 })
    //             })
    //         })
    //     })
    // }



    //goal: sync the changes to other nodes 
    // poolNode.forEach(item => {
    //     //bundles of other parents
    //     var otherBundles = item['bundles']

    //     if (Targetbundles) {
    //         Targetbundles.forEach(bundle => {
    //             console.log('bundle within target bundle', bundle)
    //             otherBundles.forEach(elem => {
    //                 var linkArray = elem[0].links

    //                 //if the links in target bundle is the same as the link in other bundles
    //                 linkArray.ForEach(link => {
    //                     if (link == bundle) {
    //                         console.log('I am here')
    //                     } else {
    //                         console.log('I am not here')
    //                     }

    //                 })
    //             })
    //         })
    //     }



    // })

    // if (Targetbundles) {
    //     Targetbundles.forEach(bundle => {
    //         //if link the targeted node also exists in other nodes
    //         poolNode.forEach(elem =>{

    //         })


    // bundles.forEach(bundle => {
    //     //get link array in each bundle 
    //     // var linksArray = bundle[0].links
    //     // linksArray.forEach(link => {
    //     //     //console.log(link)
    //     //     if (selectedChildren.includes(link.source.id)) {
    //     //         console.log(link)

    //     //     }
    //         // if (selectedChildren.includes(link.target.id)) {
    //         //     console.log(link)
    //         // }
    //     // })
    // })



}

function collapseDirectChildren(e) {
    if (e._children == null) {
        e._children = [];
    }

    e.children.forEach(elem => {
        e._children.indexOf(elem) === -1 && e._children.push(elem)
    })

    e.children = null;

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