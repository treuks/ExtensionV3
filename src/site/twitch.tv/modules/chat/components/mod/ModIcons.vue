<template>
	<span class="seventv-chat-mod-buttons">
		<span
			v-if="msg.author"
			ref="banRef"
			@click="emit('ban', msg.author!.username)"
			@mouseenter="banTooltip.show(banRef)"
			@mouseleave="banTooltip.hide()"
		>
			<TwChatModBan />
		</span>

		<span
			v-if="msg.author"
			ref="timeoutRef"
			@click="emit('timeout', msg.author!.username)"
			@mouseenter="timeoutTooltip.show(timeoutRef)"
			@mouseleave="timeoutTooltip.hide()"
		>
			<TwChatModTimeout />
		</span>

		<span
			ref="deleteRef"
			@click="emit('delete', msg.id)"
			@mouseenter="deleteTooltip.show(deleteRef)"
			@mouseleave="deleteTooltip.hide()"
		>
			<TwChatModDelete />
		</span>
	</span>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChatMessage } from "@/common/chat/ChatMessage";
import { useTooltip } from "@/composable/useTooltip";
import TwChatModBan from "@/assets/svg/twitch/TwChatModBan.vue";
import TwChatModDelete from "@/assets/svg/twitch/TwChatModDelete.vue";
import TwChatModTimeout from "@/assets/svg/twitch/TwChatModTimeout.vue";

const emit = defineEmits<{
	(event: "ban", userLogin: string): void;
	(event: "timeout", userLogin: string): void;
	(event: "delete", msgID: string): void;
}>();

const props = defineProps<{
	msg: ChatMessage;
}>();

const banRef = ref();
const banTooltip = useTooltip(`Ban ${props.msg.author?.username ?? "???"}`);

const timeoutRef = ref();
const timeoutTooltip = useTooltip(`Timeout ${props.msg.author?.username ?? "???"}`);

const deleteRef = ref();
const deleteTooltip = useTooltip(`Delete message by ${props.msg.author?.username ?? "???"}`);
</script>

<style scoped lang="scss">
.seventv-chat-mod-buttons {
	display: inline-block;
	color: hsl(0deg, 0%, 65%);
	margin-right: 0.35em;
	font-size: 1.25em;

	span,
	svg {
		cursor: pointer;
		vertical-align: middle;

		&:hover {
			color: hsl(0deg, 0%, 70%);
		}
	}
}
</style>
