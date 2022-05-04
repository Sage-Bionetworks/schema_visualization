function constructTangleLayout(levels) {
    // precompute level depth
    levels.forEach((l, i) => l.forEach((n) => (n.level = i)));

    var nodes = levels.reduce((a, x) => a.concat(x), []);
    var nodes_index = {};
    nodes.forEach((d) => (nodes_index[d.id] = d));

    // objectification
    nodes.forEach((d) => {
        d.parents = (d.parents === undefined ? [] : d.parents).map(
            (p) => nodes_index[p]
        );
    });

    // precompute bundles
    levels.forEach((l, i) => {
        var index = {};
        l.forEach((n) => {
            if (n.parents.length == 0) {
                return;
            }

            var id = n.parents
                .map((d) => d.id)
                .sort()
                .join("--");
            if (id in index) {
                index[id].parents = index[id].parents.concat(n.parents);
            } else {
                index[id] = { id: id, parents: n.parents.slice(), level: i };
            }
            n.bundle = index[id];
        });
        l.bundles = Object.keys(index).map((k) => index[k]);
        l.bundles.forEach((b, i) => (b.i = i));
    });

    var links = [];
    nodes.forEach((d) => {
        d.parents.forEach((p) =>
            links.push({ source: d, bundle: d.bundle, target: p })
        );
    });

    var bundles = levels.reduce((a, x) => a.concat(x.bundles), []);

    // reverse pointer from parent to bundles
    bundles.forEach((b) =>
        b.parents.forEach((p) => {
            if (p.bundles_index === undefined) {
                p.bundles_index = {};
            }
            if (!(b.id in p.bundles_index)) {
                p.bundles_index[b.id] = [];
            }
            p.bundles_index[b.id].push(b);
        })
    );

    nodes.forEach((n) => {
        if (n.bundles_index !== undefined) {
            n.bundles = Object.keys(n.bundles_index).map((k) => n.bundles_index[k]);
        } else {
            n.bundles_index = {};
            n.bundles = [];
        }
        n.bundles.forEach((b, i) => (b.i = i));
    });

    links.forEach((l) => {
        if (l.bundle.links === undefined) {
            l.bundle.links = [];
        }
        l.bundle.links.push(l);
    });

    // layout
    const padding = 10;
    const node_height = 22;
    const node_width = 145;
    const bundle_width = 14;
    const level_y_padding = 16;
    const metro_d = 4;
    const c = 16;
    const min_family_height = 16;

    nodes.forEach(
        (n) => (n.height = (Math.max(1, n.bundles.length) - 1) * metro_d)
    );

    var x_offset = padding;
    var y_offset = padding;
    levels.forEach((l) => {
        x_offset += l.bundles.length * bundle_width;
        y_offset += level_y_padding;
        l.forEach((n, i) => {
            n.x = n.level * node_width + x_offset;
            n.y = node_height + y_offset + n.height / 2;

            y_offset += node_height + n.height;
        });
    });

    var i = 0;
    levels.forEach((l) => {
        l.bundles.forEach((b) => {
            b.x =
                b.parents[0].x +
                node_width +
                (l.bundles.length - 1 - b.i) * bundle_width;
            b.y = i * node_height;
        });
        i += l.length;
    });

    links.forEach((l) => {
        l.xt = l.target.x;
        l.yt =
            l.target.y +
            l.target.bundles_index[l.bundle.id].i * metro_d -
            (l.target.bundles.length * metro_d) / 2 +
            metro_d / 2;
        l.xb = l.bundle.x;
        l.xs = l.source.x;
        l.ys = l.source.y;
    });

    // compress vertical space
    var y_negative_offset = 0;
    levels.forEach((l) => {
        y_negative_offset +=
            -min_family_height +
            d3.min(l.bundles, (b) =>
                d3.min(b.links, (link) => link.ys - c - (link.yt + c))
            ) || 0;
        l.forEach((n) => (n.y -= y_negative_offset));
    });

    // very ugly, I know
    links.forEach((l) => {
        l.yt =
            l.target.y +
            l.target.bundles_index[l.bundle.id].i * metro_d -
            (l.target.bundles.length * metro_d) / 2 +
            metro_d / 2;
        l.ys = l.source.y;
        l.c1 = l.source.level - l.target.level > 1 ? node_width + c : c;
        l.c2 = c;
    });

    var layout = {
        width: d3.max([d3.max(nodes, (n) => n.x) + node_width + 2 * padding, 650]),
        height: d3.max(nodes, (n) => n.y) + node_height / 2 + 2 * padding,
        node_height,
        node_width,
        bundle_width,
        level_y_padding,
        metro_d
    };

    return { levels, nodes, nodes_index, links, bundles, layout };
}