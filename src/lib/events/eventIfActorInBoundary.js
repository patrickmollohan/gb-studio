const l10n = require("../helpers/l10n").default;

const id = "EVENT_IF_ACTOR_IN_BOUNDARY";
const groups = ["EVENT_GROUP_CONTROL_FLOW", "EVENT_GROUP_ACTOR"];

const autoLabel = (fetchArg, input) => {
  const unitPostfix =
    input.units === "pixels" ? l10n("FIELD_PIXELS_SHORT") : "";
  return l10n("EVENT_IF_ACTOR_IN_BOUNDARY_LABEL", {
    actor: fetchArg("actorId"),
    left: `${fetchArg("left")}${unitPostfix}`,
    right: `${fetchArg("right")}${unitPostfix}`,
    top: `${fetchArg("top")}${unitPostfix}`,
    bottom: `${fetchArg("bottom")}${unitPostfix}`,
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
    type: "group",
    fields: [
      {
        key: "left",
        label: "X1 (" + l10n("FIELD_LEFT") + ")",
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
        key: "top",
        label: "Y1 (" + l10n("FIELD_TOP") + ")",
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
    ],
  },
  {
    type: "group",
    fields: [
      {
        key: "right",
        label: "X2 (" + l10n("FIELD_RIGHT") + ")",
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
      {
        key: "bottom",
        label: "Y2 (" + l10n("FIELD_BOTTOM") + ")",
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
    key: "checkType",
    label: l10n("FIELD_CHECK_TYPE"),
    type: "select",
    options: [
      ["position", l10n("FIELD_ACTOR_POSITION")],
      ["bounds_partial", l10n("FIELD_ACTOR_BOUNDS_PARTIAL")],
      ["bounds_full", l10n("FIELD_ACTOR_BOUNDS_FULL")],
    ],
    defaultValue: "position",
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
  const {
    ifActorPosInBoundary,
    ifActorPosInBoundaryVariables,
    ifActorBoundsInBoundaryPartial,
    ifActorBoundsInBoundaryPartialVariables,
    ifActorBoundsInBoundaryFull,
    ifActorBoundsInBoundaryFullVariables,
    temporaryEntityVariable,
    variableFromUnion,
  } = helpers;
  const truePath = input.true;
  const falsePath = input.__disableElse ? [] : input.false;

  if (
    input.left.type === "number" &&
    input.right.type === "number" &&
    input.top.type === "number" &&
    input.bottom.type === "number"
  ) {
    switch (input.checkType) {
      case "position":
        ifActorPosInBoundary(
          input.actorId,
          input.left.value,
          input.right.value,
          input.top.value,
          input.bottom.value,
          truePath,
          falsePath,
          input.units,
        );
        break;
      case "bounds_partial":
        ifActorBoundsInBoundaryPartial(
          input.actorId,
          input.left.value,
          input.right.value,
          input.top.value,
          input.bottom.value,
          truePath,
          falsePath,
          input.units,
        );
        break;
      case "bounds_full":
        ifActorBoundsInBoundaryFull(
          input.actorId,
          input.left.value,
          input.right.value,
          input.top.value,
          input.bottom.value,
          truePath,
          falsePath,
          input.units,
        );
        break;
      default:
        ifActorPosInBoundary(
          input.actorId,
          input.left.value,
          input.right.value,
          input.top.value,
          input.bottom.value,
          truePath,
          falsePath,
          input.units,
        );
    }
  } else {
    const leftVar = variableFromUnion(input.left, temporaryEntityVariable(0));
    const rightVar = variableFromUnion(input.right, temporaryEntityVariable(1));
    const topVar = variableFromUnion(input.top, temporaryEntityVariable(2));
    const bottomVar = variableFromUnion(
      input.bottom,
      temporaryEntityVariable(3),
    );

    switch (input.checkType) {
      case "position":
        ifActorPosInBoundaryVariables(
          input.actorId,
          leftVar,
          rightVar,
          topVar,
          bottomVar,
          truePath,
          falsePath,
          input.units,
        );
        break;
      case "bounds_partial":
        ifActorBoundsInBoundaryPartialVariables(
          input.actorId,
          leftVar,
          rightVar,
          topVar,
          bottomVar,
          truePath,
          falsePath,
          input.units,
        );
        break;
      case "bounds_full":
        ifActorBoundsInBoundaryFullVariables(
          input.actorId,
          leftVar,
          rightVar,
          topVar,
          bottomVar,
          truePath,
          falsePath,
          input.units,
        );
        break;
      default:
        ifActorPosInBoundaryVariables(
          input.actorId,
          leftVar,
          rightVar,
          topVar,
          bottomVar,
          truePath,
          falsePath,
          input.units,
        );
    }
  }
};

module.exports = {
  id,
  autoLabel,
  groups,
  fields,
  compile,
  helper: {
    type: "boundary",
    left: "left",
    right: "right",
    top: "top",
    bottom: "bottom",
    units: "units",
  },
};
