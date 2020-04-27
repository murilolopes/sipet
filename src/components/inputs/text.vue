<script>
export default {
	functional: true,
	render: function(createElement, { props, listeners }) {
		let hasError = props.validations.$error;
		let errorMessages = props.errorMessages;
		let spans = [];

		errorMessages.filter(message => {
			if (!props.validations[message.key])
				spans.push(createElement("span", {}, message.message));
		});

		const textDanger = { "text-danger": true };
		const formControl = { "form-control": true };
		const formGroup = { "form-group": true };
		const invalidFeedback = { "invalid-feedback": true };

		const spanRequired = createElement("span", { class: { ...textDanger } }, "*");

		const label = createElement("label", {}, [
			props.label,
			props.required ? spanRequired : ""
		]);

		const input = createElement("input", {
			attrs: { },
			class: { ...formControl, "is-invalid": hasError },
			domProps: { value: props.value },
			on: { input: e => listeners.input(e.target.value) }
		});

		const errorsDiv = createElement(
			"div",
			{ class: { ...invalidFeedback } },
			spans
		);

		return createElement("div", { class: { ...formGroup } }, [
			label,
			input,
			hasError ? errorsDiv : ""
		]);
	}
};
</script>
