const l10n = require("../helpers/l10n").default;

const id = "EVENT_ACTOR_FACE_ACTOR";
const groups = ["EVENT_GROUP_ACTOR"];

const autoLabel = (fetchArg, input) => {
  const direction = input.invert ? l10n("FIELD_FACE_AWAY") : l10n("FIELD_FACE");
  return l10n("EVENT_ACTOR_FACE_ACTOR_LABEL", {
    actor1: fetchArg("actorId"),
    actor2: fetchArg("otherActorId"),
    direction: direction,
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
    label: l10n("FIELD_FACE"),
    width: "50%",
    type: "actor",
    defaultValue: "$self$",
  },
  {
    key: "direction",
    label: l10n("FIELD_DIRECTION"),
    type: "select",
    options: [
      ["all", "✥ " + l10n("FIELD_ALL_DIRECTIONS")],
      ["horizontal", "↔ " + l10n("FIELD_HORIZONTAL_ONLY")],
      ["vertical", "↕ " + l10n("FIELD_VERTICAL_ONLY")],
    ],
    defaultValue: "all",
  },
  {
    key: "invert",
    label: l10n("FIELD_INVERT"),
    type: "checkbox",
    defaultValue: false,
  },
];

const compile = (input, helpers) => {
  const { actorFaceActor } = helpers;
  actorFaceActor(
    input.actorId,
    input.otherActorId,
    input.direction,
    input.invert,
  );
};

module.exports = {
  id,
  autoLabel,
  groups,
  fields,
  compile,
};
