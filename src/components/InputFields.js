import React, { useState } from 'react';
import { Slider, Select, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, Button, Box, Typography} from '@mui/material';
import { ChatGPTOptions, fetchData,exerciseOptions } from '../utils/fetchData';

const InputFields = ({setworkoutContent,setgenerate,setselectedExercises}) => {
  const [sliderValue, setSliderValue] = useState(60);
  const [selectedOption, setSelectedOption] = useState('Back-Biceps');
  const [selectedRadio, setSelectedRadio] = useState('Beginner');
  const [selectedValue, setSelectedValue] = useState('Muscle gain');


  const handleSliderChange = (event, newValue) => {setSliderValue(newValue);};
  const handleOptionChange = (event) => {setSelectedOption(event.target.value);};
  const handleValueChange = (event) => {setSelectedValue(event.target.value);};
  const handleRadioChange = (event) => {setSelectedRadio(event.target.value);};

  // Function to find corresponding exercise data
  async function findCorrespondingExerciseData(exerciseName) {
    try {
      let search = exerciseName;
      const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

      let updatedSearch = search;

      if (search.endsWith('s')){
        updatedSearch = search.slice(0,-1);
      }
      //console.log('search',updatedSearch)

      const searchedExercises = exercisesData.filter(
        (item) => item.name.toLowerCase().includes(updatedSearch.toLowerCase().trim())
               || (item.name.toLowerCase().includes(updatedSearch.toLowerCase().trim().split(' ')[0]) && item.name.toLowerCase().includes(updatedSearch.toLowerCase().trim().split(' ')[1]))
               || (item.name.toLowerCase().includes(updatedSearch.toLowerCase().trim().split(' ')[0]) && item.name.toLowerCase().includes(updatedSearch.toLowerCase().trim().split(' ')[1]) && item.name.toLowerCase().includes(updatedSearch.toLowerCase().trim().split(' ')[2]))
               || item.target.toLowerCase().includes(updatedSearch.toLowerCase().trim())
               || item.equipment.toLowerCase().includes(updatedSearch.toLowerCase().trim())
               || item.bodyPart.toLowerCase().includes(updatedSearch.toLowerCase().trim()),
      );

      //console.log(searchedExercises[0]);
      return searchedExercises[0]

    } catch (error) {
      console.error('Error fetching exercise data:', error);
      return null;
    }
  }



  const fetchChatData = async () => {
    try {
      const workoutPlanData = await fetchData('https://api.openai.com/v1/chat/completions',
      ChatGPTOptions(`Write me a detailed ${sliderValue} minutes workout plan to train ${selectedOption} with the goal being ${selectedValue} for someone who is ${selectedRadio}.
      The total exercises should be ${sliderValue/15}.
      For each exercise mention the time it takes to complete, the reps and the break
      .Don't explain each exercise and don't add notes.
      Return the answer as a JSON object with name workout_plan like this 
        {
        "workout_plan": [
            {
                "exercise": "Barbell Rows",
                "time": "15 minutes",
                "reps": "4 sets of 8-12 reps",
                "break": "1-2 minutes"
            },
            {
                "exercise": "Hammer Curls",
                "time": "15 minutes",
                "reps": "4 sets of 8-12 reps",
                "break": "1-2 minutes"
            }
        ]
    } for example`));

      console.log(JSON.parse(workoutPlanData.choices[0].message.content))
      setworkoutContent(JSON.parse(workoutPlanData.choices[0].message.content))
      setgenerate('unclicked')

      const ex = JSON.parse(workoutPlanData.choices[0].message.content);

      const exerciseNames = ex.workout_plan.map((exercise) => exercise.exercise);

      const resultsArray = [];

      for (const name of exerciseNames) {
        const data = await findCorrespondingExerciseData(name);
        resultsArray.push(data);
      }

      console.log(resultsArray)
      setselectedExercises(resultsArray)


    } catch (error) {
      console.error(error);
    } 
    
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(sliderValue,selectedOption,selectedRadio,selectedValue);

    setgenerate('clicked')
    fetchChatData();
  };

  return (
    <Box sx={{ mt: { lg: '52px', xs: '70px' }, ml: { sm: '50px' } }} position="relative" p="20px" >

        <Typography fontWeight={700} sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="49px" textAlign="center">
        Plan your Workout
      </Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <FormControl fullWidth>
            <label htmlFor="slider">Workout time in minutes:</label>
            <Slider
              id="slider"
              value={sliderValue}
              onChange={handleSliderChange}
              step={5}
              marks
              min={20}
              max={120}
              valueLabelDisplay="auto"
              style={{color:'#FF2625'}}
            />
            <p>Selected value: {sliderValue} minutes = {(sliderValue/60).toFixed(2)} hour</p>
          </FormControl>
        </div>
        <br/>
        <br/>

        <div>
          <FormControl fullWidth>
            <label style={{marginBottom: '10px'}}>Select workout plan:</label>
            <Select
              name="dropdown1"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <MenuItem value="Back-Biceps">Back-Biceps</MenuItem>
              <MenuItem value="Legs">Legs</MenuItem>
              <MenuItem value="Chest-Triceps-Shoulders">Chest-Triceps-Shoulders</MenuItem>
              <MenuItem value="Only arms">Only arms</MenuItem>
              <MenuItem value="Cardio-abs">Cardio-abs</MenuItem>
            </Select>
          </FormControl>
        </div>
         <br/>
        <br/>

        <div>
          <FormControl fullWidth>
            <label>Choose workout's Difficulty:</label>
            <RadioGroup
              name="radioButtons"
              value={selectedRadio}
              onChange={handleRadioChange}
              row
              
            >
              <FormControlLabel value="Beginner" control={<Radio color="default"  />} label="Beginner" />
              <FormControlLabel value="Intermediate" control={<Radio color="default" />} label="Intermediate" />
              <FormControlLabel value="Advanced" control={<Radio color="default"  />} label="Advanced" />
            </RadioGroup>
          </FormControl>
        </div>
         <br/>
        <br/>

         <div>
          <FormControl fullWidth>
            <label style={{marginBottom: '10px'}}>Workout goal:</label>
            <Select
              name="dropdown2"
              value={selectedValue}
              onChange={handleValueChange}
            >
              <MenuItem value="Muscle gain">Muscle gain</MenuItem>
              <MenuItem value="Weight Loss">Weight Loss</MenuItem>
              <MenuItem value="Strength training">Strength training</MenuItem>
              <MenuItem value="Calisthenics">Calisthenics</MenuItem>
              <MenuItem value="Flexibility">Flexibility</MenuItem>
              <MenuItem value="Endurance">Endurance</MenuItem>
              <MenuItem value="General fitness">General fitness</MenuItem>
            </Select>
          </FormControl>
        </div>
         <br/>
        <br/>

        <Button type="submit"  style={{ marginTop: '15px', textDecoration: 'none', width: '160px', textAlign: 'center', background: '#FF2625', padding: '12px', fontSize: '16px', textTransform: 'none', color: 'white', borderRadius: '4px' }}
        variant="contained">
          Generate workout
        </Button>
      </form>
      <br/>
    </Box>
    
  );
};

export default InputFields;
