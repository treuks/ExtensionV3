<template>
	<Tooltip />
</template>

<script setup lang="ts">
import { nextTick, watch } from "vue";
import { until } from "@vueuse/shared";
import { getModule } from "@/composable/useModule";
import { useConfig, useSettings } from "@/composable/useSettings";
import Tooltip from "./Tooltip.vue";

const { register } = useSettings();
register([
	{
		key: "app.version",
		type: "NONE",
		label: "App Version",
		defaultValue: void 0 as never,
	},
]);

const runtimeVersion = import.meta.env.VITE_APP_VERSION;
const version = useConfig("app.version");
const mod = getModule("settings");

const stop = watch(
	version,
	(v) => {
		if (version.value === null || runtimeVersion === v) return;

		version.value = runtimeVersion;

		until(mod)
			.toMatch((v) => !!v?.instance)
			.then(() => {
				nextTick(() => mod!.instance!.setFrontpageArea?.());
			});

		nextTick(() => stop());
	},
	{ immediate: true },
);
</script>
