import Checkbox from "./Checkbox.vue";
import Dropdown from "./Dropdown.vue";
import Input from "./Input.vue";
import Select from "./Select.vue";
import Slider from "./Slider.vue";
import Toggle from "./Toggle.vue";

const standard = {
	SELECT: Select,
	DROPDOWN: Dropdown,
	CHECKBOX: Checkbox,
	INPUT: Input,
	TOGGLE: Toggle,
	SLIDER: Slider,
	CUSTOM: undefined,
	NONE: undefined,
};

export function getComponent(node: SevenTV.SettingNode<SevenTV.SettingType>) {
	return standard[node.type] ?? node.component;
}
