import { description, displayName, name, version } from "./package.json";
import type { Manifest } from "webextension-polyfill-ts";

interface MV3HostPermissions {
	host_permissions?: string[];
	optional_host_permissions?: string[];
}

export async function getManifest(mv2?: boolean, chunkResources?: string[]): Promise<Manifest.WebExtensionManifest> {
	const manifest = {
		manifest_version: 3,
		name: displayName || name,
		version: version,
		description: description,
		action: {
			default_icon: "./icon/icon-512.png",
		},

		background: {
			service_worker: "background.js",
		},
		content_scripts: [
			{
				matches: ["*://*.twitch.tv/*"],
				js: ["content.js"],
			},
		],
		icons: {
			16: "./icon/icon-512.png",
			48: "./icon/icon-512.png",
			128: "./icon/icon-512.png",
		},

		permissions: ["tabs", "storage", "activeTab"],

		// By default the extension is enabled only on Twitch
		host_permissions: ["*://*.twitch.tv/*"],

		// Declare YouTube as an optional host permission
		optional_host_permissions: ["*://*.youtube.com/*"],

		web_accessible_resources: [
			{
				resources: [
					"site.js",
					"site.js.map",
					"content.js.map",
					"worker.js",
					"assets/style.css",
					...(chunkResources ?? []),
				],
				matches: ["*://*.twitch.tv/*"],
			},
		],
	} as Manifest.WebExtensionManifest & MV3HostPermissions;

	if (mv2) {
		// if dev set manifest to version 2
		manifest.manifest_version = 2;

		manifest.background = {
			scripts: ["background.js"],
		};

		// Host permissions -> permissions
		manifest.permissions = [...(manifest.permissions ?? []), ...(manifest.host_permissions ?? [])];
		manifest.optional_permissions = [
			...(manifest.optional_permissions ?? []),
			...(manifest.optional_host_permissions ?? []),
		];

		// web accessible resources
		manifest.web_accessible_resources = (
			manifest.web_accessible_resources as Manifest.WebExtensionManifestWebAccessibleResourcesC2ItemType[]
		)
			.map((v) => v.resources)
			.reduce((a, b) => [...(a ?? []), ...(b ?? [])]);

		// this is required on dev for Vite script to load
		manifest.content_security_policy = `script-src-elem 'self' 'unsafe-eval' http://localhost:${4777}; object-src 'self'`;
	}

	return manifest;
}
