module.exports = function (supple) {
	return "https://wiki.arcaea.cn/api.php?" + Object.entries({
		action: "query",
		format: "json",
		formatversion: 2,
		prop: "revisions",
		rvprop: "content",
		...supple
	}).map(([k, v]) => k + "=" + v).join("&")
}