const { readFile } = require("node:fs/promises");
const axios = require("axios");
const wiki_url = require("./wiki_url");
const { resolve } = require("path");
(async () => {
	try {
		const filePath = process.argv[2]
		let [wiki, contents] = await Promise.all([
			axios.get(wiki_url({ titles: "Template:" + filePath.match(/[^\/\\]+$/)[0] + ".json" }))
				.then(v => v.data.query.pages[0].revisions[0].content),
			readFile(resolve(filePath), { encoding: 'utf8' })
		]);
		[wiki, contents] = [wiki, contents].map(JSON.parse).map(JSON.stringify)
		console.log(String(wiki != contents))
	} catch (error) {
		console.error("error")
		process.exit(1)
	}
})()