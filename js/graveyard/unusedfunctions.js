
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