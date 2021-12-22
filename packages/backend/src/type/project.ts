type MapKey<M> = keyof M;
type MapValue<M> = M[MapKey<M>];

const ProjectType = {
  UNKNOWN: 0,
  NODE: 1,
  WEB: 2,
} as const;

type ProjectTypeMap = typeof ProjectType;
type ProjectTypeKey = MapKey<ProjectTypeMap>;
type ProjectTypeValue = MapValue<ProjectTypeMap>;

export {
  ProjectType,
  type ProjectTypeKey,
  type ProjectTypeMap,
  type ProjectTypeValue,
};
