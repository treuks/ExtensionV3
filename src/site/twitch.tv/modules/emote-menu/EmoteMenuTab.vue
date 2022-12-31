<template>
	<UiScrollable class="scroll-area">
		<div class="emote-area">
			<template v-for="(emoteSet, i) of emoteSets" :key="i">
				<div v-if="emoteSet.emotes.length" :ref="'set-' + i.toString()" class="emote-set-container">
					<div class="set-header">
						<div class="set-header-icon">
							<img v-if="emoteSet.owner && emoteSet.owner.avatar_url" :src="emoteSet.owner.avatar_url" />
							<Logo v-else class="logo" :provider="emoteSet.provider" />
						</div>
						{{ emoteSet.name }}
					</div>
					<div class="emote-set">
						<div
							v-for="emote of emoteSet.emotes"
							:key="emote.id"
							:ref="(el) => setCardRef(el as HTMLElement)"
							class="emote-container"
							:class="`ratio-${determineRatio(emote)}`"
							:visible="loaded[emote.id]"
							:emote-id="emote.id"
							@click="emit('emoteClick', emote)"
						>
							<ChatEmote :emote="emote" :image-format="imageFormat" :unload="!loaded[emote.id]" />
						</div>
					</div>
				</div>
			</template>
		</div>
	</UiScrollable>
	<div class="sidebar">
		<template v-for="(emoteSet, i) of emoteSets" :key="i">
			<div
				v-if="emoteSet.emotes.length"
				class="set-sidebar-icon-container"
				:selected="selectedSet == i"
				@click="
					{
						selectedSet = i;
						($refs['set-' + i.toString()] as HTMLDivElement[])[0].scrollIntoView({ behavior: 'smooth' });
					}
				"
			>
				<div class="set-sidebar-icon">
					<img v-if="emoteSet.owner && emoteSet.owner.avatar_url" :src="emoteSet.owner.avatar_url" />
					<Logo v-else class="logo" :provider="emoteSet.provider" />
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from "vue";
import { determineRatio } from "./EmoteMenuBackend";
import Logo from "@/common/Logo.vue";
import ChatEmote from "../chat/components/ChatEmote.vue";
import UiScrollable from "@/ui/UiScrollable.vue";

defineProps<{
	emoteSets: SevenTV.EmoteSet[];
	imageFormat: SevenTV.ImageFormat;
}>();

const emit = defineEmits<{
	(event: "emoteClick", emote: SevenTV.ActiveEmote): void;
}>();

const selectedSet = ref(0);

const refs = [] as HTMLElement[];
const loaded = reactive<Record<string, number>>({});
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		loaded[entry.target.getAttribute("emote-id") as string] = entry.isIntersecting ? 1 : 0;
	});
});
// gather all card elements and observe them
const setCardRef = (el: HTMLElement) => {
	if (el instanceof Element) {
		refs.push(el as HTMLElement);
		observer.observe(el);
	}
};
onBeforeUnmount(() => {
	observer.disconnect();
});
</script>
<style scoped lang="scss">
.scroll-area {
	width: 28rem;
}

.emote-area:after {
	content: "";
	position: absolute;
	height: 100%;
	width: 100%;
	top: 0;
	overflow: hidden;
	pointer-events: none;
	box-shadow: inset -7px 0 9px -9px hsla(0deg, 0%, 0%, 50%);
}

.emote-set-container {
	position: relative;
}

.emote-set {
	display: inline-flex;
	flex-wrap: wrap;
	margin: 0.5rem;
}

.set-header {
	height: 3rem;
	padding: 0.5rem 1.25rem;
	position: sticky;
	top: -1px;
	display: flex;
	background: var(--color-background-base);
	box-shadow: 0px 1px 3px hsla(0deg, 0%, 0%, 50%);
}

.set-header-icon {
	height: 2rem;
	width: 2rem;
	border-radius: 0.5rem;
	margin-right: 1rem;
	overflow: clip;
}

.emote-container {
	display: grid;
	background: hsla(0deg, 0%, 50%, 6%);
	border-radius: 0.5rem;
	height: 4rem;
	margin: 0.25rem;
	cursor: pointer;

	&:hover {
		background: hsla(0deg, 0%, 50%, 32%);
	}
}

.ratio-1 {
	width: 4rem;
}

.ratio-2 {
	width: 6.25rem;
}

.ratio-3 {
	width: 8.5rem;
}

.ratio-4 {
	width: 13rem;
}

.sidebar {
	width: 4rem;
	height: 100%;
	background: hsla(0deg, 0%, 50%, 6%);
	box-shadow: -1px 0px 1px hsla(0deg, 0%, 0%, 50%);
	overflow-y: scroll;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
}

.set-sidebar-icon-container {
	width: 100%;
	padding: 0.5rem;

	&[selected="true"] {
		background: hsla(0deg, 0%, 50%, 32%);
	}
}

.set-sidebar-icon {
	width: 2.8rem;
	height: 2.8rem;
	border-radius: 0.5rem;
	overflow: clip;
	margin: auto;
	cursor: pointer;
}

.logo {
	width: 100%;
	height: 100%;
}
</style>