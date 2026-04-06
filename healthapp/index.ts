import express from 'express'
const app = express()

import { calculateBmi } from './bmiCalculator.ts'
import { calculateExercises } from './exerciseCalculator.ts'

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query

  if (!height || !weight) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }

  const bmi = calculateBmi(Number(height), Number(weight))

  return res.json({
    weight: Number(weight),
    height: Number(height),
    bmi: bmi,
  })
})

app.post('/exercises', express.json(), (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' })
  }

  if (
    !Array.isArray(daily_exercises) ||
    isNaN(Number(target)) ||
    daily_exercises.some((day) => isNaN(Number(day)))
  ) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }

  const result = calculateExercises(daily_exercises.map(Number), Number(target))

  return res.json(result)
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
