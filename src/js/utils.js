const isHttpRequest = (text) => {
	const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
	return regex.test(text);
}
const extractURL = (url) => {
	let source = undefined;
	let id = undefined;

	if (url.includes("tiktok")) {
		source = "tiktok";
		id = url.split(/(@[\w.-]+)\/video\/(\d+)/)[2];
		id = /^[0-9]+$/.test(id) ? id : undefined;
	} else if (url.includes("facebook")) {
		source = "facebook";
		url = new URL(url);
		id = url.searchParams.get('v');
		if (!id) {
			try {
				const entries = url.pathname.split('videos')[1].split('/');
				for (const entry of entries) if (/^[0-9]+$/.test(entry)) id = entry;
			} catch (err) { }
		}
		id = /^[0-9]+$/.test(id) ? id : undefined;
	} else {
		source = "youtube";
		url = new URL(url);
		id = url.searchParams.get('v');
		if (!id) {
			const paths = url.pathname.split('/');
			id = url.host === 'youtu.be' ? paths[1] : paths[2];
		}
		id = id?.substring(0, 11);
		id = /^[a-zA-Z0-9-_]{11}$/.test(id) ? id : undefined;
	}
	return { source, id }
}

const saveHistory = async (textSearch) => {
	if (!textSearch) return;

	const history = JSON.parse(
		window.localStorage.getItem("histories") || "[]"
	);

	const index = history.indexOf(textSearch);
	if (index !== -1) history.splice(index, 1);

	history.unshift(textSearch);
	if (history.length > 13) history.splice(13);

	window.localStorage.setItem("histories", JSON.stringify(history));
}

module.exports = {isHttpRequest, extractURL, saveHistory}