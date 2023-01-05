import { log } from "@/common/Logger";
import { onCosmeticCreate } from "./cosmetic.handler";
import { onEmoteSetUpdate } from "./emote-set.handler";
import { onEntitlementCreate } from "./entitlement.handler";
import type { ChangeMap, EventContext, ObjectTypeOfKind } from "../";

export function handleDispatchedEvent(ctx: EventContext, type: string, cm: ChangeMap<SevenTV.ObjectKind>) {
	const h = {
		"cosmetic.create": () => onCosmeticCreate(ctx, cm as ChangeMap<SevenTV.ObjectKind.COSMETIC>),
		"entitlement.create": () => onEntitlementCreate(ctx, cm as ChangeMap<SevenTV.ObjectKind.ENTITLEMENT>),
		"emote_set.update": () => onEmoteSetUpdate(ctx, cm as ChangeMap<SevenTV.ObjectKind.EMOTE_SET>),
	}[type];

	if (typeof h === "function") h();
	else log.warn("<Net/EventAPI>", `Received dispatch '${type}' but no handler was found`);
}

export function iterateChangeMap<T extends SevenTV.ObjectKind>(cm: ChangeMap<T>, h: ChangeMapHandler<T>) {
	for (const v of Object.values(h)) {
		const hook = v as ChangeMapHook;

		for (const x of cm.pulled ?? []) {
			hook.pulled?.(x.value, x.old_value);
			log.debug("Net/EventAPI", `PULL (${cm.kind}) ${cm.id}/${String(x.key)}`, JSON.stringify(x.old_value));
		}
		for (const x of cm.pushed ?? []) {
			hook.pushed?.(x.value, x.old_value);
			log.debug("Net/EventAPI", `PUSH (${cm.kind}) ${cm.id}/${String(x.key)}`, JSON.stringify(x.value));
		}
	}
}

export type ChangeMapHandler<T extends SevenTV.ObjectKind> = {
	[Property in keyof ObjectTypeOfKind[T]]?: ChangeMapHook;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ChangeMapHook {
	pulled?: (newValue: any, oldValue: any) => void;
	pushed?: (newValue: any, oldValue: any) => void;
}
