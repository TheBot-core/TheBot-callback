const { command_manager } = require("../src");
const { fail } = require("../src/constants");
const fs = require("fs");
const fetch = require("node-fetch");

command_manager.add_command("corona", "Get info about COVID 19!", undefined, async (event) => {
	if(event.args.length != 1) {
		return fail;
	}

	const res = await fetch("https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Country_Region%3D%27" + event.args[0] + "%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&resultOffset=0&resultRecordCount=50&cacheHint=true");
	const features = (await res.json()).features;

	return {
		is_response: true,
		response: `COVID info for _${features[0].attributes.Country_Region}_\n\n*Confirmed cases: ${features[0].attributes.Confirmed}*\n*Total deaths: ${features[0].attributes.Deaths}*\n*Recovered cases: ${features[0].attributes.Recovered}*\n*Active cases: ${features[0].attributes.Active}*\n\n_Last updated: ${new Date(features[0].attributes.Last_Update).toUTCString()}_`
	}
});