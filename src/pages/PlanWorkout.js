import React from 'react'
import InputFields from '../components/InputFields'
import { Box } from '@mui/material';
import WorkoutPlanExercises from '../components/WorkoutPlanExercises';
import { useState } from 'react';

const PlanWorkout = () => {
  const [workoutContent, setworkoutContent] = useState([]);
  const [generate,setgenerate] = useState('');
  const [selectedExercises,setselectedExercises] = useState([]);
  
  return (
    <Box>
        <InputFields setworkoutContent={setworkoutContent} setgenerate={setgenerate} setselectedExercises={setselectedExercises} ></InputFields>
        <WorkoutPlanExercises workoutContent={workoutContent} generate={generate} selectedExercises={selectedExercises}></WorkoutPlanExercises>
    </Box>
  )
}

export default PlanWorkout;