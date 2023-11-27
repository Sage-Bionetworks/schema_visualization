# schema_visualization
This repository is for extracting D3 and Javascript code from observables to produce a stand-alone visualization. Please view links to the original design and Mialy's work in the last section. 

# Running the code
Simply clone the repository and run `python3 -m http.server`. 

# Run schema viz for your data model locally utilizing schematic APIs (preferred)
* Open files/config.yml and update the schema url that you want to use for your project. Please note that by default we are using schematic prod environment when making API calls. 
* Run `python3 -m http.server` and you should be able to see the visualization of your schema.

# Run schema viz for your data model and publish visualization using github action (preferred)
* Fork this repository. If you have forked this repo, make sure that the `main` branch of your forked repository is in sync with the `main` branch of this repo. 
* In your forked repository, open `files/config.yml` and update the schema url that you want to use for your project. Please note that by default we are using schematic prod environment when making API calls.
* Run schema viz locally by running `python3 -m http.server` and see the schema viz locally. If some parts of the visualization gets cut, please adjust the width of your visualization in `createCollapsibleTree` function in `collapsibleTangleTree.js` (See around line 66 in `collapsibleTangleTree.js`)
* Enable Github action in your repo. Click on "Settings" > "Pages". Under section "Build and deployment", select "main" branch or a branch that you desire to build github pages. (Please see more instructions [here](https://github.com/ncihtan/schema_visualization/tree/develop-update-schema-viz))
* After your site gets published successfully, to visit your published site, under "GitHub Pages", click `Visit site`

> Note: if the tangled tree or the attribute table is not showing up, it is likely that there is an error when using your schema to make API calls to the following endpoints: 1) `GET /visualize/tangled_tree/layers`; 2) `Get /visualize/attributes`. Please start by using schematic prod: https://schematic.api.sagebionetworks.org/v1/ui/ and see if you could use these two endpoints with your schema. If you could not, please contact FAIR data service desk. 


# Update Static files (**Will be deprecated**)
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

For generating `HTAN_tangled_tree.json`:

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

