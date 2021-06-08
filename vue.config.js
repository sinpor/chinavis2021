module.exports = {
	devServer: {
		proxy: {
			"api/": {
				target: "http://localhost:4000",
				pathRewrite: {
					"^/api": "",
				},
			},
		},
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					javascriptEnabled: true,
				},
			},
		},
	},
}
