# schema_visualization
This repository is for extracting D3 and Javascript code from observables to produce a stand-alone visualization. Please view links to the original design and Mialy's work in the last section. 

# Running the code
Simply clone the repository and run `python3 -m http.server`. 

# Update Static files
Currently, the schema visualization requires the following files: `files/JSON/HTAN_tangled_tree.json` for the tangled tree and `files/Merged/HTAN_attribute_table.csv` for the attribute table. If the schema changes, please follow the following steps to update the schema: 
1. Install the latest version of `schematicpy` by following the instructions [here](https://github.com/Sage-Bionetworks/schematic/blob/develop/README.md#installation:~:text=various%20data%20contributors.-,Installation,-Installation%20Requirements)
2. Start schematic APIs in your virtual environment by doing: 
```
python3 run_api.py
```
You should be able to see that the flask server is running. If you open `http://localhost:3001/v1/ui/` on your local machine, you should be able to see swagger UI. 

3. Scroll to the `visualization operation` section on swagger UI and run the following endpoints: 

For generating `HTAN_attribute_table.csv`: 
1) `/visualize/attributes`

See detailed steps:
<ol type="a">
<li>Click on "try it out"</li>
<li>Update "schema_url" parameter. Replace the example schema with HTAN schema.</li>
<li>Click on "execute" to run the endpoint. </li>
<li>Download the respose by clicking the "download" button on swagger UI and save the csv to "~/schema_visualization/files/Merged/HTAN_attribute_table.csv"</li>
</ol>

For generating `HTAN_tangled_tree.json`
2) `/visualize/tangled_tree/layers`

See detailed steps:
<ol type="a">
<li>Click on "try it out"</li>
<li>Update "schema_url" parameter. Replace the example schema with HTAN schema.</li>
<li>Use the default "figure_type": "component"</li>
<li>Click on "execute" to run the endpoint. </li>
<li>Download the respose by clicking the "download" button on swagger UI and save the json to "~/schema_visualization/files/JSON/HTAN_tangled_tree.json"</li>
</ol>


# Other resources
* [The original design](https://observablehq.com/@nitaku/tangled-tree-visualization-ii) 
* [Mialy's work on observable](https://observablehq.com/d/c3fd85acfb34db59) -- You might need to request access before viewing 
* [Simpler tangled tree design](https://observablehq.com/@nettly/tangled-tree-sourcing-facts)

