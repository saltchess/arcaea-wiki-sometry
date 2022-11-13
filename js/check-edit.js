const { readFile } = require("node:fs/promises");
const { resolve } = require("path");
const wiki_url = require("./wiki_url");
(async () => {
	try {
		const filePath = process.argv[2]
		let [wiki, contents] = await Promise.all([
			wiki_url({ titles: "Template:" + filePath.match(/[^\/\\]+$/)[0] + ".json" }),
			readFile(resolve(filePath), { encoding: 'utf8' })
		]);
		[wiki, contents] = [wiki, contents].map(JSON.parse).map(JSON.stringify)
		console.log(String(wiki != contents))
	} catch (error) {
		console.error("error")
		process.exit(1)
	}
})()