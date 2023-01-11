<template>
	<div ref="tooltip" class="seventv-tooltip" tooltip-type="emote">
		<img ref="imgRef" class="tooltip-emote" :srcset="srcSet" :alt="emote.name" />
		<div class="spacer">
			<h3 class="emote-name">{{ emote.name }}</h3>
			<div class="spacer"></div>
			<Logo class="logo" :provider="emote.provider" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { imageHostToSrcset } from "@/common/Image";
import Logo from "@/assets/svg/Logo.vue";

const props = withDefaults(
	defineProps<{
		emote: SevenTV.ActiveEmote;
		imageFormat?: SevenTV.ImageFormat;
		unload?: boolean;
		height: number;
		width: number;
	}>(),
	{ unload: false, imageFormat: "WEBP" },
);

const srcSet = computed(() => (props.unload ? "" : imageHostToSrcset(props.emote.data!.host, props.imageFormat)));
const width = computed(() => `${props.width * 3}px`);
const height = computed(() => `${props.height * 3}px`);
</script>

<style scoped lang="scss">
.seventv-tooltip {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 12em;
	background-color: var(--seventv-background-transparent-2);
	backdrop-filter: blur(1em);
	outline: 0.1em solid var(--seventv-border-transparent-1);
	border-radius: 0.25em;
	padding: 1.3em;
}
.emote-name {
	font-size: 1.5rem;
	font-weight: 300;
	max-width: 18em;
	word-break: break-all;
	float: left;
}
.logo {
	width: 1.6em;
	height: auto;
	float: right;
	align-self: end;
}
.tooltip-emote {
	padding-bottom: 3em;
	width: v-bind("width");
	height: v-bind("height");
}
.spacer {
	display: flex;
	column-gap: 0.25em;
	flex: 1;
	align-items: center;
	justify-items: stretch;
}
</style>
