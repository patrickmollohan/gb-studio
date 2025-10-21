const l10n = require("../helpers/l10n").default;

const id = "EVENT_ACTOR_FOLLOW_ACTOR";
const groups = ["EVENT_GROUP_ACTOR"];

const autoLabel = (fetchArg, input) => {
  const unitPostfix =
    input.units === "pixels" ? l10n("FIELD_PIXELS_SHORT") : "";
  return l10n("EVENT_ACTOR_FOLLOW_ACTOR_LABEL", {
    actor: fetchArg("actorId"),
    otherActor: fetchArg("otherActor"),
    x: `${fetchArg("offsetX")}${unitPostfix}`,
    y: `${fetchArg("offsetY")}${unitPostfix}`,
  });
};

const fields = [
  {
    type: "group",
    fields: [
      {
        key: "actorId",
        label: l10n("ACTOR"),
        width: "50%",
        type: "actor",
        defaultValue: "$self$",
      },
      {
        key: "otherActor",
        label: l10n("FIELD_FOLLOW"),
        width: "50%",
        type: "actor",
        defaultValue: "$self$",
      },
    ],
  },
  {
    type: "group",
    fields: [
      {
        key: "offsetX",
        label: l10n("FIELD_OFFSET_X"),
        description: l10n("FIELD_OFFSET_X_DESC"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: -128,
        max: 127,
        width: "50%",
        unitsField: "units",
        unitsDefault: "pixels",
        unitsAllowed: ["tiles", "pixels"],
        defaultValue: {
          number: 1,
          variable: "LAST_VARIABLE",
          property: "$self$:xpos",
        },
      },
      {
        key: "offsetY",
        label: l10n("FIELD_OFFSET_Y"),
        description: l10n("FIELD_OFFSET_Y_DESC"),
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: -128,
        max: 127,
        width: "50%",
        unitsField: "units",
        unitsDefault: "pixels",
        unitsAllowed: ["tiles", "pixels"],
        defaultValue: {
          number: 1,
          variable: "LAST_VARIABLE",
          property: "$self$:ypos",
        },
      },
    ],
  },
  {
    key: "moveType",
    label: l10n("FIELD_MOVE_TYPE"),
    description: l10n("FIELD_MOVE_TYPE_DESC"),
    hideLabel: true,
    type: "moveType",
    defaultValue: "horizontal",
    flexBasis: 30,
    flexGrow: 0,
  },
  {
    key: "useCollisions",
    label: l10n("FIELD_USE_COLLISIONS"),
    description: l10n("FIELD_USE_COLLISIONS_DESC"),
    width: "50%",
    alignCheckbox: true,
    type: "checkbox",
    defaultValue: false,
  },
  {
    key: "variable",
    type: "variable",
    defaultValue: "LAST_VARIABLE",
  },
];

const compile = (input, helpers) => {
  const {
    actorFollowActor,
    actorFollowActorVariables,
    variableFromUnion,
    temporaryEntityVariable,
  } = helpers;
  if (input.offsetX.type === "number" && input.offsetY.type === "number") {
    actorFollowActor(
      input.actorId,
      input.otherActor,
      input.offsetX.value,
      input.offsetY.value,
      input.variable,
      input.useCollisions,
      input.moveType,
      input.units,
    );
  } else {
    const xVar = variableFromUnion(input.offsetX, temporaryEntityVariable(0));
    const yVar = variableFromUnion(input.offsetY, temporaryEntityVariable(1));
    actorFollowActorVariables(
      input.actorId,
      input.otherActor,
      xVar,
      yVar,
      input.useCollisions,
      input.moveType,
      input.units,
    );
  }
};

module.exports = {
  id,
  description: l10n("EVENT_ACTOR_FOLLOW_ACTOR_DESC"),
  autoLabel,
  groups,
  fields,
  compile,
};
