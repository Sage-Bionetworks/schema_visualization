const margins = {
    top: 20,
    bottom: 300,
    left: 30,
    right: 100,
};

const height = 900;
const width = 900;

const totalWidth = width + margins.left + margins.right;
const totalHeight = height + margins.top + margins.bottom;

const svg = d3.select('body')
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight);

const graphGroup = svg.append('g')
    .attr('transform', "translate(" + margins.left + "," + margins.top + ")");


const levels = [
    [
        {
            "id": "Demographics"
        },
        {
            "id": "FamilyHistory"
        },
        {
            "id": "Exposure"
        },
        {
            "id": "FollowUp"
        },
        {
            "id": "Diagnosis"
        },
        {
            "id": "Therapy"
        },
        {
            "id": "MolecularTest"
        }
    ],
    [
        {
            "id": "Patient",
            "parents": [
                "Demographics",
                "FamilyHistory",
                "Exposure",
                "FollowUp",
                "Diagnosis",
                "Therapy",
                "MolecularTest"
            ]
        }
    ],
    [
        {
            "id": "Biospecimen",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "ClinicalDataTier2",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "SRRSClinicalDataTier2",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "LungCancerTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "ColorectalCancerTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "BreastCancerTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "NeuroblastomaandGliomaTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "AcuteLymphoblasticLeukemiaTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "OvarianCancerTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "ProstateCancerTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "SarcomaTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "PancreaticCancerTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "MelanomaTier3",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "SRRSBiospecimen",
            "parents": [
                "Patient"
            ]
        },
        {
            "id": "ImagingLevel2Channels"
        }
    ],
    [
        {
            "id": "ScRNA-seqLevel1",
            "parents": [
                "Biospecimen"
            ]
        },
        {
            "id": "BulkRNA-seqLevel1",
            "parents": [
                "Biospecimen"
            ]
        },
        {
            "id": "BulkWESLevel1",
            "parents": [
                "Biospecimen"
            ]
        },
        {
            "id": "OtherAssay",
            "parents": [
                "Biospecimen"
            ]
        },
        {
            "id": "ScATAC-seqLevel1",
            "parents": [
                "Biospecimen"
            ]
        },
        {
            "id": "ImagingLevel2",
            "parents": [
                "Biospecimen",
                "ImagingLevel2Channels"
            ]
        }
    ],
    [
        {
            "id": "ScRNA-seqLevel2",
            "parents": [
                "ScRNA-seqLevel1"
            ]
        },
        {
            "id": "BulkRNA-seqLevel2",
            "parents": [
                "BulkRNA-seqLevel1"
            ]
        },
        {
            "id": "BulkWESLevel2",
            "parents": [
                "BulkWESLevel1"
            ]
        }
    ],
    [
        {
            "id": "ScRNA-seqLevel3",
            "parents": [
                "ScRNA-seqLevel2"
            ]
        },
        {
            "id": "BulkRNA-seqLevel3",
            "parents": [
                "BulkRNA-seqLevel2"
            ]
        },
        {
            "id": "BulkWESLevel3",
            "parents": [
                "BulkWESLevel2"
            ]
        }
    ],
    [
        {
            "id": "ScRNA-seqLevel4",
            "parents": [
                "ScRNA-seqLevel3"
            ]
        }
    ]
]
// const levels = [
//     [{
//         id: 'Chaos',
//     }],
//     [{
//         id: 'Gaea',
//         parents: ['Chaos'],
//     },
//     {
//         id: 'Uranus',
//     },
//     ],
//     [{
//         id: 'Oceanus',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Thethys',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Pontus',
//     },
//     {
//         id: 'Rhea',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Cronus',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Coeus',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Phoebe',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Crius',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Hyperion',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Iapetus',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Thea',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Themis',
//         parents: ['Gaea', 'Uranus'],
//     },
//     {
//         id: 'Mnemosyne',
//         parents: ['Gaea', 'Uranus'],
//     },
//     ],
//     [{
//         id: 'Doris',
//         parents: ['Oceanus', 'Thethys'],
//     },
//     {
//         id: 'Neures',
//         parents: ['Pontus', 'Gaea'],
//     },
//     {
//         id: 'Dionne',
//     },
//     {
//         id: 'Demeter',
//         parents: ['Rhea', 'Cronus'],
//     },
//     {
//         id: 'Hades',
//         parents: ['Rhea', 'Cronus'],
//     },
//     {
//         id: 'Hera',
//         parents: ['Rhea', 'Cronus'],
//     },
//     {
//         id: 'Alcmene',
//     },
//     {
//         id: 'Zeus',
//         parents: ['Rhea', 'Cronus'],
//     },
//     {
//         id: 'Eris',
//     },
//     {
//         id: 'Leto',
//         parents: ['Coeus', 'Phoebe'],
//     },
//     {
//         id: 'Amphitrite',
//     },
//     {
//         id: 'Medusa',
//     },
//     {
//         id: 'Poseidon',
//         parents: ['Rhea', 'Cronus'],
//     },
//     {
//         id: 'Hestia',
//         parents: ['Rhea', 'Cronus'],
//     },
//     ],
//     [{
//         id: 'Thetis',
//         parents: ['Doris', 'Neures'],
//     },
//     {
//         id: 'Peleus',
//     },
//     {
//         id: 'Anchises',
//     },
//     {
//         id: 'Adonis',
//     },
//     {
//         id: 'Aphrodite',
//         parents: ['Zeus', 'Dionne'],
//     },
//     {
//         id: 'Persephone',
//         parents: ['Zeus', 'Demeter'],
//     },
//     {
//         id: 'Ares',
//         parents: ['Zeus', 'Hera'],
//     },
//     {
//         id: 'Hephaestus',
//         parents: ['Zeus', 'Hera'],
//     },
//     {
//         id: 'Hebe',
//         parents: ['Zeus', 'Hera'],
//     },
//     {
//         id: 'Hercules',
//         parents: ['Zeus', 'Alcmene'],
//     },
//     {
//         id: 'Megara',
//     },
//     {
//         id: 'Deianira',
//     },
//     {
//         id: 'Eileithya',
//         parents: ['Zeus', 'Hera'],
//     },
//     {
//         id: 'Ate',
//         parents: ['Zeus', 'Eris'],
//     },
//     {
//         id: 'Leda',
//     },
//     {
//         id: 'Athena',
//         parents: ['Zeus'],
//     },
//     {
//         id: 'Apollo',
//         parents: ['Zeus', 'Leto'],
//     },
//     {
//         id: 'Artemis',
//         parents: ['Zeus', 'Leto'],
//     },
//     {
//         id: 'Triton',
//         parents: ['Poseidon', 'Amphitrite'],
//     },
//     {
//         id: 'Pegasus',
//         parents: ['Poseidon', 'Medusa'],
//     },
//     {
//         id: 'Orion',
//         parents: ['Poseidon'],
//     },
//     {
//         id: 'Polyphemus',
//         parents: ['Poseidon'],
//     },
//     ],
//     [{
//         id: 'Deidamia',
//     },
//     {
//         id: 'Achilles',
//         parents: ['Peleus', 'Thetis'],
//     },
//     {
//         id: 'Creusa',
//     },
//     {
//         id: 'Aeneas',
//         parents: ['Anchises', 'Aphrodite'],
//     },
//     {
//         id: 'Lavinia',
//     },
//     {
//         id: 'Eros',
//         parents: ['Hephaestus', 'Aphrodite'],
//     },
//     {
//         id: 'Helen',
//         parents: ['Leda', 'Zeus'],
//     },
//     {
//         id: 'Menelaus',
//     },
//     {
//         id: 'Polydueces',
//         parents: ['Leda', 'Zeus'],
//     },
//     ],
//     [{
//         id: 'Andromache',
//     },
//     {
//         id: 'Neoptolemus',
//         parents: ['Deidamia', 'Achilles'],
//     },
//     {
//         id: 'Aeneas(2)',
//         parents: ['Creusa', 'Aeneas'],
//     },
//     {
//         id: 'Pompilius',
//         parents: ['Creusa', 'Aeneas'],
//     },
//     {
//         id: 'Iulus',
//         parents: ['Lavinia', 'Aeneas'],
//     },
//     {
//         id: 'Hermione',
//         parents: ['Helen', 'Menelaus'],
//     },
//     ],
// ];

levels.unshift([]);

// We add one pseudo node to every level to deal with parentless nodes
levels.forEach((l, i) => {
    l.forEach((n, j) => {
        n.level = i;
        if (n.parents !== undefined) {
            n.parent = n.parents[0];
        } else {
            n.parent = `pseudo-${i - 1}`;
        }
    });
    l.unshift({
        id: `pseudo-${i}`,
        parent: i > 0 ? `pseudo-${i - 1}` : "",
        level: i
    });
});

const nodes = levels.flat();

// function drawNodes(tangled_tree_data){
//     tangled_tree_data.unshift([]);

//     // We add one pseudo node to every level to deal with parentless nodes
//     tangled_tree_data.forEach((l, i) => {
//         l.forEach((n, j) => {
//             n.level = i;
//             if (n.parents !== undefined) {
//                 n.parent = n.parents[0];
//             } else {
//                 n.parent = `pseudo-${i - 1}`;
//             }
//         });
//         l.unshift({
//             id: `pseudo-${i}`,
//             parent: i > 0 ? `pseudo-${i - 1}` : "",
//             level: i
//         });
//     });

//     const nodes = levels.flat();

//     return nodes
// }

const colours = d3.scaleOrdinal()
    .domain(nodes.filter(n => n.parents)
        .map(n => n.parents.sort()
            .join("-")))
    .range(d3.schemePaired);

// function colors(nodes){
//     d3.scaleOrdinal()
//         .domain(nodes.filter(n => n.parents)
//             .map(n => n.parents.sort()
//                 .join("-")))
//         .range(d3.schemePaired);


// }

function getLinks(nodes) {
    return nodes
        .filter(n => n.data.parents !== undefined)
        .map(n => n.data.parents.map(p => ({
            source: nodes.find(n => n.id === p),
            target: n
        })))
        .flat();
}

const offsetPerPartner = 3;
const drawNodePath = d => {
    const radius = 5;
    // The number of partners determines the node height
    // But when a node has only one partner,
    // treat it the same as when it has zero
    const nPartners = (d.data.partners && d.data.partners.length > 1)
        ? d.data.partners.length
        : 0;

    // We want to centre each node
    const straightLineOffset = (nPartners * offsetPerPartner) / 2;

    const context = d3.path();
    context.moveTo(-radius, 0);
    context.lineTo(-radius, -straightLineOffset);
    context.arc(0, -straightLineOffset, radius, -Math.PI, 0);
    context.lineTo(radius, straightLineOffset);
    context.arc(0, straightLineOffset, radius, 0, Math.PI);
    context.closePath();

    return context + "";
};

const drawLinkCurve = (x0, y0, x1, y1, offset, radius) => {
    const context = d3.path();
    context.moveTo(x0, y0);
    context.lineTo(x1 - 2 * radius - offset, y0);

    // If there is not enough space to draw two corners, reduce the corner radius
    if (Math.abs(y0 - y1) < 2 * radius) {
        radius = Math.abs(y0 - y1) / 2;
    }

    if (y0 < y1) {
        context.arcTo(x1 - offset - radius, y0, x1 - offset - radius, y0 + radius, radius);
        context.lineTo(x1 - offset - radius, y1 - radius);
        context.arcTo(x1 - offset - radius, y1, x1 - offset, y1, radius);
    } else if (y0 > y1) {
        context.arcTo(x1 - offset - radius, y0, x1 - offset - radius, y0 - radius, radius);
        context.lineTo(x1 - offset - radius, y1 + radius);
        context.arcTo(x1 - offset - radius, y1, x1 - offset, y1, radius);
    }
    context.lineTo(x1, y1);
    return context + "";
};

const partnershipsPerLevel = {};
const getPartnershipOffset = (parent, partner) => {
    let partnershipId, level;
    if (partner !== undefined) {
        // On every level, every relationship gets its own offset. If a relationship
        // spans multiple levels, the furthest level is chosen
        level = Math.max(parent.depth, partner.level);
        if (!partnershipsPerLevel[level]) { partnershipsPerLevel[level] = []; }
        partnershipId = [parent.id, partner.id].sort().join("-");
    } else {
        level = parent.depth;
        if (!partnershipsPerLevel[level]) { partnershipsPerLevel[level] = []; }
        partnershipId = parent.id;
    }

    // Assume that the partnership already has a slot assigned
    const partnershipOffset = partnershipsPerLevel[level].indexOf(partnershipId);
    if (partnershipOffset === -1) {
        // Apparently not
        return partnershipsPerLevel[level].push(partnershipId) - 1;
    }
    return partnershipOffset;
}

const lineRadius = 10;
const offsetStep = 5;
const linkFn = link => {
    const thisParent = link.source;
    const partnerId = link.target.data.parents.find(p => p !== thisParent.id);
    const partners = thisParent.data.partners || [];

    // Let the first link start with this negative offset
    // But when a node has only one partner,
    // treat it the same as when it has zero
    const startOffset = (partners.length > 1)
        ? -(partners.length * offsetPerPartner) / 2
        : 0;

    const partner = partners.find(p => p.id === partnerId);

    // Chaos has no partner, nor Zeus with Athena
    const nthPartner = partner !== undefined
        ? partners.indexOf(partner)
        : (partners || []).length;
    const partnershipOffset = getPartnershipOffset(thisParent, partner);

    return drawLinkCurve(
        thisParent.y,
        thisParent.x + startOffset + offsetPerPartner * nthPartner,
        link.target.y,
        link.target.x,
        offsetStep * partnershipOffset,
        lineRadius
    );
};

function draw(root) {
    // Now every node has had it's position set, we can draw them now
    const nodes = root.descendants()
        .filter(n => !n.id.startsWith("pseudo-"));
    const links = getLinks(nodes)
        .filter(l => !l.source.id.startsWith("pseudo-"));

    const link = graphGroup.selectAll(".link")
        .data(links);
    link.exit().remove();
    link.enter()
        .append("path")
        .attr("class", "link")
        .merge(link)
        .attr("stroke", d => colours(d.target.data.parents.sort().join("-")))
        .attr("d", linkFn);

    const node = graphGroup.selectAll(".node")
        .data(nodes);
    node.exit().remove();
    const newNode = node.enter()
        .append("g")
        .attr("class", "node");

    newNode.append("path")
        .attr("d", drawNodePath);
    newNode.append("text")
        .attr("dy", -3)
        .attr("x", 6);

    newNode.merge(node)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .selectAll("text")
        .text(d => d.id);
}

const root = d3.stratify()
    .parentId(d => d.parent)
    (nodes);

// Map the different sets of parents,
// assigning each parent an array of partners
getLinks(root.descendants())
    .filter(l => l.target.data.parents)
    .forEach(l => {
        const parentNames = l.target.data.parents;
        if (parentNames.length > 1) {
            const parentNodes = parentNames.map(p => nodes.find(n => n.id === p));

            parentNodes.forEach(p => {
                if (!p.partners) {
                    p.partners = [];
                }
                parentNodes
                    .filter(n => n !== p && !p.partners.includes(n))
                    .forEach(n => {
                        p.partners.push(n);
                    });
            });
        }
    });

// Take nodes with more partners first,
// also counting the partners of the children
root
    .sum(d => (d.value || 0) + (d.partners || []).length)
    .sort((a, b) => b.value - a.value);

const tree = d3.tree()
    .size([height, width])
    .separation((a, b) => {
        // More separation between nodes with many children
        const totalPartners = (a.data.partners || []).length + (b.data.partners || []).length;
        return 1 + (totalPartners / 5);
    });

// draw(tree(root));