<script>
export default {
	functional: true,
	props: {
		value: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: 'text'
		},
		required: {
			type: Boolean,
			default: false
		},
		validations: {
			type: Object,
			required: false
		},
		errorMessages: {
			type: Array,
			required: false
		},
		label: {
			type: String,
			required: true
		}
	},
	render: function(createElement, { props, listeners }) {
		const textDanger = { "text-danger": true };
		const formControl = { "form-control": true };
		const formGroup = { "form-group": true };

		let spans = [];
		let formGroupError = {};
		let formGroupPending = {};
		let isInvalid = {};
		let invalidFeedback = {};
		let errorsDiv = '';

		if (props.validations && props.errorMessages.length) {
			let hasError = props.validations.$error;
			let errorMessages = props.errorMessages;
			errorMessages.filter(message => {
				if (!props.validations[message.key])
					spans.push(createElement("span", {}, message.message));
			});

			formGroupError["form-group--error"] = props.validations.$error;
			formGroupPending["form-group--loading"] = props.validations.$pending;
			isInvalid["is-invalid"] = hasError;
			invalidFeedback["invalid-feedback"] = hasError;

			if (hasError)
				errorsDiv = createElement(
					"div",
					{ class: { ...invalidFeedback } },
					spans
				);
		}

		const spanRequired = createElement(
			"span",
			{ class: { ...textDanger } },
			"*"
		);

		const label = createElement("label", {}, [
			props.label,
			props.required ? spanRequired : ""
		]);

		const input = createElement("input", {
			attrs: { type: props.type },
			class: { ...formControl, ...isInvalid },
			domProps: { value: props.value },
			on: { input: e => listeners.input(e.target.value) }
		});

		return createElement(
			"div",
			{ class: { ...formGroup, ...formGroupError, ...formGroupPending } },
			[label, input, errorsDiv]
		);
	}
};
</script>
