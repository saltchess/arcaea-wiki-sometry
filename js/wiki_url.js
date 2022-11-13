const axios = require("axios");
module.exports = function (supple) {
	return axios.get("https://wiki.arcaea.cn/api.php?" + Object.entries({
		action: "query",
		format: "json",
		formatversion: 2,
		prop: "revisions",
		rvprop: "content",
		...supple
	}).map(([k, v]) => k + "=" + v).join("&")
	).then(v => v.data.query.pages[0].revisions[0].content)
}