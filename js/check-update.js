const axios = require("axios");
const { setFailed } = require("@actions/core");
const wiki_url = require("./wiki_url");
const base = Date.now();

// case "${{ github.event_name }}" in
// 'schedule') repeat=90;;
// 'workflow_dispatch') repeat=0;;
// esac
const trigType = process.argv[2]
let repeat
switch (trigType) {
	case "schedule":
		repeat = new Date().getUTCDay() == 3 ? 90 : 5
		break
	case "workflow_dispatch":
		repeat = 0
		break
}
function sleep(miliseconds) {
	return new Promise(resolve => setTimeout(resolve, miliseconds))
}
async function request() {
	for (let i = 0; i < 3; i++) {
		try {
			return [undefined, await Promise.all([
				axios.get("https://webapi.lowiro.com/webapi/serve/static/bin/arcaea/apk").then(v => v.data.value),
				wiki_url({ titles: "Template:version" }),
			])]
		} catch { await sleep(1000) }
	}
	return [true]
}
(async () => {
	while (true) {
		let [err, data] = await request()
		if (err) {
			console.warn("Network failure")
			await sleep(1000 * 60)
			continue
		}
		let [official, wiki] = data
		let newVersion = official.version.replace(/c$/, "")
		let result = wiki.replace(/(?<=mobile.*v)[\w.]+/, newVersion)
		if (wiki != result || trigType == "workflow_dispatch") {
			console.log(official.url)
			console.log(official.version)
			console.log(result)
			return
		}
		if (Date.now() - base >= 1000 * 60 * repeat) {
			setFailed("\033[;31mtimeOut\033[0m")
			process.exit(1)
		}
		console.warn("Sleeping")
		await sleep(1000 * 60)
	}
})()