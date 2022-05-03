
function renderChart(tangled_tree_data, normalDependenciesGrouped) {
    const tangleLayout = constructTangleLayout(_.cloneDeep(tangled_tree_data));

    function normaltext_to_load(normal_dependencies_grouped) {
        return normal_dependencies_grouped.get(datatype);
    }

    function filter_normal_nodes(d) {
        return normaltext_to_load(normalDependenciesGrouped).some(
            (filterEl) => d[filterEl.type] === filterEl.name
        );
    }
    function filter_highlight_nodes(d) {
        return highlights_to_load.some(
            (filterEl) => d[filterEl.type] === filterEl.name
        );
    }
    console.log(tangled_tree_data);

    let normal_data = tangleLayout.nodes.filter(filter_normal_nodes);
    let highlight_data = tangleLayout.nodes.filter(filter_highlight_nodes);

    return svg`<svg width="${tangleLayout.layout.width}" height="${tangleLayout.layout.height
        }" style="background-color: ${background_color}">
    <style>
      text {
        font-family: sans-serif;
        font-size: 10px;
        text-decoration: none;
      }
      .bold {
        font-family: sans-serif;
        font-size: 10px;
        font-weight: bold;
      }
      .legend { 
        font-family: serif;
        font-size: 15px;
      }
      .bold_legend{
      font-family: serif;
        font-size: 15px;
        font-weight: bold;
      }
      .node {
        stroke-linecap: round;
      }
      .link {
        fill: none;
      }
    </style>
  
    <script type="text/JavaScript">
        <![CDATA[
          function showColor() {
              alert("hey i was clicked");
          }
          ]]>
      </script>
  
    ${tangleLayout.bundles.map((b) => {
            let d = b.links
                .map(
                    (l) => `
        M${l.xt} ${l.yt}
        L${l.xb - l.c1} ${l.yt}
        A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
        L${l.xb} ${l.ys - l.c2}
        A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
        L${l.xs} ${l.ys}`
                )
                .join("");
            return `
        <path class="link" d="${d}" stroke="${background_color}" stroke-width="5"/>
        <path class="link" d="${d}" stroke="${color(b.id)}" stroke-width="2"/>
      `;
        })}
  
    ${highlight_data.map(
            (n) => `
      <path class="selectable node" data-id="${n.id
                }" stroke="black" stroke-width="8" d="M${n.x} ${n.y - n.height / 2} L${n.x
                } ${n.y + n.height / 2}"/>
      <path class="node" stroke="white" stroke-width="4" d="M${n.x} ${n.y - n.height / 2
                } L${n.x} ${n.y + n.height / 2}"/>
      <text class="selectable" data-id="${n.id}" x="${n.x + 5}" y="${n.y - n.height / 2 - 4
                }"font-weight="bold" stroke="${highlight_color}" stroke-width="4">${n.id
                }</text>
      <text x="${n.x + 4}" y="${n.y - n.height / 2 - 4}" 
      onClick="showColor()"
      font-weight="bold" style="pointer-events: auto;">${n.id}</text>
      `
        )}
  
    ${normal_data.map(
            (n) => `
      <path class="selectable node" data-id="${n.id
                }" stroke="black" stroke-width="8" d="M${n.x} ${n.y - n.height / 2} L${n.x
                } ${n.y + n.height / 2}"/>
      <path class="node" stroke="white" stroke-width="4" d="M${n.x} ${n.y - n.height / 2
                } L${n.x} ${n.y + n.height / 2}"/>
      <text class="selectable" data-id="${n.id}" x="${n.x + 5}" y="${n.y - n.height / 2 - 4
                }" stroke="${background_color}" stroke-width="2">${n.id}</text>
      <text x="${n.x + 4}" y="${n.y - n.height / 2 - 4
                }" style="pointer-events: auto;">${n.id}</text>
      `
        )}
  
    function start(e){
      console.log(e);
      // just an example
    }
  
    <rect x="395" y="5" width="225" height="100"
    style="fill:${box_color};stroke:${background_color};stroke-width:0;fill-opacity:0.5;" />
  
    <text x="400"  y="30" class="bold_legend">Note:</text>
    <text x="440"  y="30" class="legend">Bold and highlighted text</text>
    <text x="440"  y="50" class="legend">indicates all the data</text>
    <text x="440"  y="70" class="legend">required for a given dataset</text>
    <text x="440"  y="90" class="legend">submission to be complete.</text>
    </svg>`;
}