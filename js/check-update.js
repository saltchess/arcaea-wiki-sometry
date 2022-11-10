const axios = require("axios");
const wiki_url = require("./wiki_url");
const base = Date.now();
(async () => {
	while (true) {
		try {
			let [official, wiki] = await axios.all([
				axios.get("https://webapi.lowiro.com/webapi/serve/static/bin/arcaea/apk").then(v => v.data.value),
				axios.get(wiki_url({ titles: "Template:version" })).then(v => v.data.query.pages[0].revisions[0].content),
			])
			let newVersion = official.version.replace(/c$/, "")
			let result = wiki.replace(/(?<=mobile=v)\S+/, newVersion)
			if (wiki != result) {
				console.log(official.url)
				console.log(official.version)
				console.log(result)
				return
			}
			if (Date.now() - base >= 1000 * 60 * process.argv[2]) {
				console.error("\033[;31mtimeOut\033[0m")
				process.exit(1)
			}
			console.warn("sleeping")
			await new Promise(resolve => setTimeout(resolve, 1000 * 60))
		} catch { continue }
	}
})()