interface ExerciseResult {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

interface ExerciseValues {
  target: number
  exercises: number[]
}
export const calculateExercises = (
  dailyExercises: number[],
  target: number,
): ExerciseResult => {
  const totalDays = dailyExercises.length;
  const trainingDays = dailyExercises.filter((day) => day > 0).length;
  const average = dailyExercises.reduce((sum, day) => sum + day, 0) / totalDays;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'good';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad';
  }

  return {
    periodLength: totalDays,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average,
  };
};

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (!isNaN(Number(args[2]))) {
    return {
      target: Number(args[2]),
      exercises: args.slice(3).map(Number),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { target, exercises } = parseArguments(process.argv);
    console.log(calculateExercises(exercises, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
