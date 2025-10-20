const l10n = require("../helpers/l10n").default;

const id = "EVENT_SCRIPT_RETURN";
const groups = ["EVENT_GROUP_CONTROL_FLOW"];

const label = l10n("EVENT_SCRIPT_RETURN_LABEL");
const description = l10n("EVENT_SCRIPT_RETURN_DESCRIPTION");

const fields = [
  {
    label: description,
  },
];

const compile = (input, helpers) => {
  const { returnFar } = helpers;
  returnFar();
};

module.exports = {
  id,
  label,
  description,
  groups,
  fields,
  compile
};