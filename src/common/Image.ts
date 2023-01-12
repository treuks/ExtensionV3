export function imageHostToSrcset(host: SevenTV.ImageHost, imageFormat?: SevenTV.ImageFormat): string {
	const format = host.files.some((fi) => fi.format === imageFormat) ? imageFormat : host.files[0]?.format;
	return host.files
		.filter((f) => f.format === format)
		.map((f, i) => `https:${host.url}/${f.name} ${i + 1}x`)
		.join(", ");
}

export function imageHostAndSizeToSrcset(
	height: number,
	width: number,
	host: SevenTV.ImageHost,
	imageFormat?: SevenTV.ImageFormat,
): string {
	const format = host.files.some((fi) => fi.format === imageFormat) ? imageFormat : host.files[0]?.format;
	return host.files
		.filter((f) => f.format === format)
		.map((f, i) => `https:${host.url}/${f.name} ${width * (i + 1)}w ${height * (i + 1)}h`)
		.join(", ");
}
