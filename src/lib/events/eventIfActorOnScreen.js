const l10n = require("../helpers/l10n").default;

const id = "EVENT_IF_ACTOR_ON_SCREEN";
const groups = ["EVENT_GROUP_CONTROL_FLOW", "EVENT_GROUP_ACTOR"];

const autoLabel = (fetchArg, input) => {
  return l10n("EVENT_IF_ACTOR_ON_SCREEN_LABEL", {
    actor: fetchArg("actorId")
  });
};

const fields = [
  {
    key: "actorId",
    label: l10n("ACTOR"),
    type: "actor",
    defaultValue: "$self$",
  },
  {
    label: l10n("FIELD_OFFSET"),
  },
  {
    type: "group",
    fields: [
      {
        key: "left",
        label: l10n("FIELD_LEFT"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: -128,
        max: 127,
        width: "50%",
        unitsField: "units",
        unitsDefault: "tiles",
        unitsAllowed: ["tiles", "pixels"],
        defaultValue: {
          number: 0,
          variable: "LAST_VARIABLE",
          property: "$self$:xpos",
        },
      },
      {
        key: "right",
        label: l10n("FIELD_RIGHT"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: -128,
        max: 127,
        width: "50%",
        unitsField: "units",
        unitsDefault: "tiles",
        unitsAllowed: ["tiles", "pixels"],
        defaultValue: {
          number: 0,
          variable: "LAST_VARIABLE",
          property: "$self$:ypos",
        },
      },
    ],
  },
  {
    type: "group",
    fields: [
      {
        key: "top",
        label: l10n("FIELD_TOP"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: -128,
        max: 127,
        width: "50%",
        unitsField: "units",
        unitsDefault: "tiles",
        unitsAllowed: ["tiles", "pixels"],
        defaultValue: {
          number: 0,
          variable: "LAST_VARIABLE",
          property: "$self$:xpos",
        },
      },
      {
        key: "bottom",
        label: l10n("FIELD_BOTTOM"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: -128,
        max: 127,
        width: "50%",
        unitsField: "units",
        unitsDefault: "tiles",
        unitsAllowed: ["tiles", "pixels"],
        defaultValue: {
          number: 0,
          variable: "LAST_VARIABLE",
          property: "$self$:ypos",
        },
      },
    ],
  },
  {
    key: "true",
    label: l10n("FIELD_TRUE"),
    type: "events",
  },
  {
    key: "__collapseElse",
    label: l10n("FIELD_ELSE"),
    type: "collapsable",
    defaultValue: true,
    conditions: [
      {
        key: "__disableElse",
        ne: true,
      },
    ],
  },
  {
    key: "false",
    label: l10n("FIELD_FALSE"),
    conditions: [
      {
        key: "__collapseElse",
        ne: true,
      },
      {
        key: "__disableElse",
        ne: true,
      },
    ],
    type: "events",
  },
];

const compile = (input, helpers) => {
  const { ifActorOnScreen, ifActorOnScreenVariables, variableFromUnion, temporaryEntityVariable } = helpers;
  const truePath = input.true;
  const falsePath = input.__disableElse ? [] : input.false;
  
  if (input.left.type === "number" && input.right.type === "number" && input.top.type === "number" && input.bottom.type === "number") {
    ifActorOnScreen(input.actorId, input.left.value, input.right.value, input.top.value, input.bottom.value, truePath, falsePath, input.units);
  } else {
    const leftVar = variableFromUnion(input.left, temporaryEntityVariable(0));
    const rightVar = variableFromUnion(input.right, temporaryEntityVariable(1));
    const topVar = variableFromUnion(input.top, temporaryEntityVariable(2));
    const bottomVar = variableFromUnion(input.bottom, temporaryEntityVariable(3));

    ifActorOnScreenVariables(input.actorId, leftVar, rightVar, topVar, bottomVar, truePath, falsePath, input.units);
  }
};

module.exports = {
  id,
  autoLabel,
  groups,
  fields,
  compile,
};
