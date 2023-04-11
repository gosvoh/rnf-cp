type TaskType = {
  name: string;
  task: string;
  video: string;
  practice: {
    combination: string[];
    centralObject?: string;
    consumedObjects?: string[];
  };
  test: {
    centralObject: string;
    molecules: string[];
    correctCombination: string[];
    consumedObjects?: string[];
  };
};

export default TaskType;
