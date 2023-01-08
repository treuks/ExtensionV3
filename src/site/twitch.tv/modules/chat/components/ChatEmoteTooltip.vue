<template>
	<div ref="tooltip" class="seventv-tooltip" tooltip-type="emote">
		<img ref="imgRef" class="tooltip-emote" :srcset="srcSet" :alt="emote.name" />
		<h3 class="emote-name">{{ emote.name }}</h3>
		<Logo class="logo" :provider="emote.provider" />
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Logo from "@/assets/svg/Logo.vue";

const props = withDefaults(
	defineProps<{
		emote: SevenTV.ActiveEmote;
		imageFormat?: SevenTV.ImageFormat;
		unload?: boolean;
	}>(),
	{ unload: false, imageFormat: "WEBP" },
);

const srcSet = computed(() => (props.unload ? "" : getSrcSet(props.emote)));

function getSrcSet(emote: SevenTV.ActiveEmote) {
	const host = emote.data?.host ?? { url: "", files: [] };
	const format = host.files.some((fi) => fi.format === props.imageFormat) ? props.imageFormat : host.files[0]?.format;

	return host.files
		.filter((f) => f.format === format)
		.map((f, i) => `${host.url}/${f.name} ${i - 1}x`)
		.join(", ");
}
</script>

<style scoped lang="scss">
.seventv-tooltip {
	display: grid;
	min-width: 12em;
	background-color: var(--seventv-background-transparent-2);
	backdrop-filter: blur(16px);
	outline: 1px solid var(--seventv-border-transparent-1);
	border-radius: 0.25em;
	padding: 1.3em;
}
.emote-name {
	grid-row-start: 2;
	grid-column-start: 1;
	font-size: 16px;
	font-weight: 300;
	max-width: 300px;
	word-break: break-all;
	justify-self: start;
	align-self: center;
}

.logo {
	grid-row-start: 2;
	grid-column-start: 2;
	align-self: end;
	justify-self: center;
	margin-left: 2em;
	width: 18px;
	height: auto;
}
.tooltip-emote {
	grid-row-start: 1;
	grid-column-start: 1;
	grid-column-end: 3;
	justify-self: center;
	align-self: center;
	padding-bottom: 3em;
	height: auto;
	max-width: 100px;
}
</style>
