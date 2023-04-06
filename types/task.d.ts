type TaskType = {
  name: string;
  task: string;
  video: string;
  practice: { combination: string[] };
  test: {
    centralObject: string;
    molecules: string[];
    correctCombination: string[];
  };
};

export default TaskType;
