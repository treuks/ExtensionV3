<template>
	<div v-if="user && user.displayName" class="seventv-chat-user" :style="{ color: color }">
		<!--Badge List -->
		<span v-if="twitchBadges.length || cosmetics.badges.length" class="seventv-chat-user-badge-list">
			<Badge
				v-for="badge of twitchBadges"
				:key="badge.id"
				:badge="badge"
				:alt="badge.title"
				type="twitch"
				@click="(e) => emit('badgeClick', e, badge)"
			/>
			<Badge
				v-for="badge of cosmetics.badges"
				:key="badge.id"
				:badge="badge"
				:alt="badge.data.tooltip"
				type="app"
			/>
		</span>

		<!-- Message Author -->
		<span class="seventv-chat-user-username" @click="(e) => emit('nameClick', e)">
			<span v-if="!paint">
				<span>{{ user.displayName }}</span>
				<span v-if="user.intl"> ({{ user.username }})</span>
			</span>
			<span v-else>
				<UiPaint :paint="paint" :text="true">
					<span>{{ user.displayName }}</span>
					<span v-if="user.intl"> ({{ user.username }})</span>
				</UiPaint>
			</span>
		</span>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ChatUser } from "@/common/chat/ChatMessage";
import { useChatProperties } from "@/composable/chat/useChatProperties";
import { useCosmetics } from "@/composable/useCosmetics";
import Badge from "./Badge.vue";
import UiPaint from "@/ui/UiPaint.vue";

const props = defineProps<{
	user: ChatUser;
	color: string;
	badges?: Record<string, string>;
}>();

const emit = defineEmits<{
	(event: "nameClick", e: MouseEvent): void;
	(event: "badgeClick", e: MouseEvent, badge: Twitch.ChatBadge): void;
}>();

const properties = useChatProperties();
const cosmetics = useCosmetics(props.user.id);
const twitchBadges = ref([] as Twitch.ChatBadge[]);

const paint = computed(() => (cosmetics.paints && cosmetics.paints.length ? cosmetics.paints[0] : null));

if (props.badges && properties.twitchBadgeSets) {
	for (const [key, value] of Object.entries(props.badges)) {
		const setID = key;
		const badgeID = value;

		for (const setGroup of [properties.twitchBadgeSets.channelsBySet, properties.twitchBadgeSets.globalsBySet]) {
			if (!setGroup) continue;

			const set = setGroup.get(setID);
			if (!set) continue;

			const badge = set.get(badgeID);
			if (!badge) continue;

			twitchBadges.value.push(badge);
			break;
		}
	}
}
</script>

<style scoped lang="scss">
.seventv-chat-user {
	display: inline-block;
	cursor: pointer;
	word-break: break-all;
	vertical-align: baseline;
	margin: -0.2rem;
	padding: 0.2rem;

	.seventv-chat-user-badge-list {
		margin-right: 0.25em;

		:deep(img) {
			vertical-align: middle;
		}

		.seventv-chat-badge ~ .seventv-chat-badge {
			margin-left: 0.25em;
		}
	}

	.seventv-chat-user-username {
		font-weight: 700;
	}
}
</style>
