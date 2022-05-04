# schema_visualization
This repository is for extracting D3 and Javascript code from observables to produce a stand-alone visualization. Please view links to the original design and Mialy's work in the last section. 

# journey of figuring things out

Main difficulty: the origin design is on Observable, and we could not just copy and paste all the code to make it work. For one thing, code on observables is not entirely Javascript(see [here](https://observablehq.com/@observablehq/observables-not-javascript)). For another, there are some built-in functions that Observable is using under the hood. For example, take a look at this code taken from the original tangled tree design: 

```
    return svg`<svg width="${tangleLayout.layout.width}" height="${tangleLayout.layout.height
        }" style="background-color: ${background_color}">

```

You could see that the `svg` here right after `return` is a built-in observable function that we could not easily borrow. 

Initially, I was thinking of borrowing other tangled tree code on Stack overflow. There are a couple of examples but they didn't work well after I replaced their datasets with our tangled tree data. In the end, I decided to focus on replacing the code on Observable and make it work locally. 


How? 

The way that Observable works is actually very similar to React. If you take a closer look at the code below: 
```
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
      `;
        })}
```

This is very similar to returning HTML elements using a map function in React. And we could transform the code in Javascript by doing something like this: 

```
    tangleLayout.bundles.map(b => {
        let d = b.links.map(l => `
              M${l.xt} ${l.yt}
              L${l.xb - l.c1} ${l.yt}
              A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
              L${l.xb} ${l.ys - l.c2}
              A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
              L${l.xs} ${l.ys}`
        ).join("");

        const path = d3.select('#myViz').append('path')
            .attr('class', 'link')
            .attr('d', d)
            .attr('stroke', 'white')
            .attr('stroke-width', 5);
    })

```

By doing the above, we are also appending the `path` HTML element with the return statement. Eventually, I was able to transform most of the code in Observable without starting everything from scratch. 



# Other resources
* [The original design](https://observablehq.com/@nitaku/tangled-tree-visualization-ii) 
* [Mialy's work on observable](https://observablehq.com/d/c3fd85acfb34db59) -- You might need to request access before viewing 
* [Simpler tangled tree design](https://observablehq.com/@nettly/tangled-tree-sourcing-facts)

