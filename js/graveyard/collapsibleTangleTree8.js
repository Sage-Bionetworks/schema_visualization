
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
    var dataBulk = SeparateInteractiveAndSteady(chart);
    var InteractivePartNode = dataBulk[0];
    var steadyPartNode = dataBulk[1];

    //draw steady part 
    createSteadyPartNode(steadyPartNode, svg);

    //begin to draw interactive part

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

        NodeEnter.append('path')
            .attr('class', 'selectable node')
            .attr('stroke', 'orange')
            .attr('stroke-width', 8)
            .attr('d', function (d, i) {
                return `M${d.x} ${d.y - d.height / 2} L${d.x} ${d.y + d.height / 2}`
            }).on('click', click);

        NodeEnter.append('text')
            .attr('style', 'pointer-events: none')
            .attr('x', function (d) { return (d.x + 5) })
            .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
            .text(function (d) { return d.id });

        //UPDATE
        var NodeUpdate = NodeEnter.merge(node);

        // //Control exiting node and adding new node
        // var flexibleNode = svg.select("g").selectAll("path").data(filteredInteractiveNode);
        // flexibleNode.enter().append('path');
        // var nodeExit = flexibleNode.exit().remove();
    }

    var NodeContainer = { 'collapsed': [] };

    function relayCollapsedChild(poolNode, selectedChildren) {
        poolNode.forEach(item => {
            //children of parents
            var childrenArr = item.children;
            if (childrenArr !== null && childrenArr.length > 0) {
                selectedChildren.forEach(elem => {
                    //if the collapsed child is also a child of other parent 
                    if (childrenArr.includes(elem)) {
                        //remove the collpased child also from other parent
                        removeElemFromArr(elem, childrenArr)
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

        console.log('poolNode', poolNode)
    }





    function click(d) {
        //var InteractivePartNodeNew = replaceObjInArry(InteractivePartNode, [d])
        //collapsing
        if (d.children && d.children.length > 0) {
            console.log('triggering if')
            d._children = d.children;
            //shrink the dataset
            //removing all the children
            console.log('NodeContainer', NodeContainer)
            var ChangeableNode = filterArrayIfNotInArray(InteractivePartNode, d.children, 'id');

            //save the nodes that are collapsed
            NodeContainer['collapsed'] = ChangeableNode;

            //let other parents know if their children have been collapsed
            var childrenSelected = d.children;
            d.children = null;
            relayCollapsedChild(InteractivePartNode, childrenSelected);
            console.log('new interactive node ', InteractivePartNode);



        } else {
            //expanding
            console.log('triggering else')
            d.children = d._children;
            //returning all the children
            var NodesToAdd = filterArrayIfInArray(InteractivePartNode, d.children, 'id');
            var ChangeableNode = NodesToAdd.concat(NodeContainer['collapsed'])
            d._children = null;
        }


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

        // flexibleNodeEnter.append('path')
        //     .attr('class', 'link')
        //     .attr('d', function (b) {
        //         if (b.bundle && b.bundle.links) {
        //             let d = b.bundle.links.map(l => `
        //                     M${l.xt} ${l.yt}
        //                     L${l.xb - l.c1} ${l.yt}
        //                     A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
        //                     L${l.xb} ${l.ys - l.c2}
        //                     A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
        //                     L${l.xs} ${l.ys}`).join("");
        //             return d
        //         }
        //     })
        //     .attr('stroke', function (b) {
        //         return color(b.id)
        //     })
        //     .attr('stroke-width', 2)


        var flexibleText = svg.selectAll('text').data(ChangeableNode);
        var flexibletTextEnter = flexibleText.enter();

        flexibletTextEnter.append('text').merge(flexibleText)
            .attr('style', 'pointer-events: none')
            .attr('x', function (d) { return (d.x + 5) })
            .attr('y', function (d) { return (d.y - d.height / 2 - 4) })
            .text(function (d) { return d.id });


        flexibleNode.exit().remove();
        flexibleText.exit().remove();

        console.log('flexibleNode', flexibleNode);
        console.log('flexibletext', flexibleText);


        // // var flexibleNode = svgDoc.select("g").selectAll("path").data(filteredInteractiveNode);
        // // flexibleNode.enter().append('path').on('click', click);
        // // flexibleNode.exit().remove();
        // var nodeEnter = flexibleNode.enter().append('path');
        // var nodeExit = flexibleNode.exit().remove();

        // console.log(flexibleNode)
    }



}
