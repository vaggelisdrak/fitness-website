import React from 'react';
import Loader from './Loader';
import { Stack,Typography } from '@mui/material';
import ExerciseCard from './ExerciseCard';

const WorkoutPlanExercises = ({ workoutContent, generate, selectedExercises }) => {
  if (generate === 'clicked') {
    return <Loader />;
  }

  if (!workoutContent || !workoutContent.workout_plan || workoutContent.workout_plan.length === 0) {
    return <div></div>;
  }

  window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });

  return (
    <ol sx={{ fontSize: { lg: '50px', xs: '30px' } }}>
    {workoutContent.workout_plan.map((exercise, index) => (
        <li key={index} >
           <br />
          <hr/>
          <Stack gap="60px" sx={{ flexDirection: { lg: 'row' }, p: '20px', alignItems: 'center' }}>
           
            <Stack sx={{ gap: { lg: '35px', xs: '20px' } }}>
              <Typography sx={{ fontSize: { lg: '50px', xs: '30px' } }} fontWeight={600} textTransform="capitalize">
                <strong style={{textAlign: 'center'}}>Exercise:</strong> {exercise.exercise} <br />
              </Typography>
              <Typography sx={{ fontSize: { lg: '24px', xs: '18px' }, marginLeft: '30px' }} color="#4F4C4C">
                <ul>
                  <li><span style={{ textTransform: 'capitalize' }}>{exercise.time}</span><br/></li>
                  <li><span style={{ textTransform: 'capitalize' }}>{exercise.reps}</span><br/></li>
                  <li><span style={{ textTransform: 'capitalize' }}>{exercise.break} break between sets</span><br/></li>
                </ul>
              </Typography>
            </Stack>
            
            <Stack>
            <ExerciseCard exercise={selectedExercises[index]} sx={{padding: '0px'}}></ExerciseCard>
            </Stack>

          </Stack>
          <br />
        </li>
      ))}
    </ol>
  );
};

export default WorkoutPlanExercises;