const l10n = require("../helpers/l10n").default;

const id = "EVENT_ACTOR_CHASE_ACTOR";
const groups = ["EVENT_GROUP_ACTOR"];
const subGroups = {
  EVENT_GROUP_ACTOR: "EVENT_GROUP_MOVEMENT",
};

const autoLabel = (fetchArg, input) => {
  return l10n("EVENT_ACTOR_CHASE_ACTOR_LABEL", {
    actor1: fetchArg("actorId"),
    actor2: fetchArg("otherActorId"),
    direction: input.invert ? l10n("FIELD_FLEE") : l10n("FIELD_CHASE"),
  });
};

const fields = [
  {
    key: "actorId",
    label: l10n("ACTOR"),
    width: "50%",
    type: "actor",
    defaultValue: "$self$",
  },
  {
    key: "otherActorId",
    label: l10n("FIELD_CHASE"),
    width: "50%",
    type: "actor",
    defaultValue: "$self$",
  },
  {
    type: "group",
    fields: [
      {
        key: "x",
        label: l10n("FIELD_X"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: 0,
        max: 255,
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
        key: "y",
        label: l10n("FIELD_Y"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: 0,
        max: 255,
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
    key: "moveType",
    label: l10n("FIELD_MOVEMENT_TYPE"),
    type: "select",
    options: [
      ["horizontal", "↔ " + l10n("FIELD_HORIZONTAL_FIRST")],
      ["vertical", "↕ " + l10n("FIELD_VERTICAL_FIRST")],
      ["diagonal", "⤡ " + l10n("FIELD_DIAGONAL")],
    ],
    defaultValue: "horizontal",
    width: "50%",
  },
  {
    key: "useCollisions",
    label: l10n("FIELD_USE_COLLISIONS"),
    width: "50%",
    alignCheckbox: true,
    type: "checkbox",
    defaultValue: false,
  },
  {
    key: "invert",
    label: l10n("FIELD_INVERT"),
    width: "50%",
    type: "checkbox",
    defaultValue: false,
  },
];

const compile = (input, helpers) => {
  const { actorChaseActor, actorChaseActorVariables, variableFromUnion, temporaryEntityVariable } = helpers;
  if (input.x.type === "number" && input.y.type === "number") {
    actorChaseActor(input.actorId, input.otherActorId, input.x.value, input.y.value, input.useCollisions, input.moveType, input.units, input.invert);
  } else {
  	const xVar = variableFromUnion(input.x, temporaryEntityVariable(0));
    const yVar = variableFromUnion(input.y, temporaryEntityVariable(1));
    actorChaseActorVariables(input.actorId, input.otherActorId, xVar, yVar, input.useCollisions, input.moveType, input.units, input.invert);
  }
};

module.exports = {
  id,
  autoLabel,
  groups,
  subGroups,
  fields,
  compile,
};
