import { useEffect, useState } from 'react';
import axios from 'axios';
import type { DiaryEntry } from './types';
import diaryService from './services/diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const weatherOptions = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];
  const visibilityOptions = ['great', 'good', 'ok', 'poor'];

  useEffect(() => {
    diaryService.getAll().then((data) => {
      setDiaries(data);
    });
  }, []);

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    diaryService
      .create(newEntry)
      .then((returnedDiary) => {
        setDiaries(diaries.concat(returnedDiary));
        setDate('');
        setWeather('');
        setVisibility('');
        setComment('');
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data);
        }
        setTimeout(() => {
          setError('');
        }, 5000);
      });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addDiary}>
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          weather:
          {weatherOptions.map((w) => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={(e) => setWeather(e.target.value)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          visibility:
          {visibilityOptions.map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={(e) => setVisibility(e.target.value)}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          comment:
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diary Entries</h2>
      {diaries.map((d) => (
        <div key={d.id}>
          <h3>{d.date}</h3>
          <p>weather: {d.weather}</p>
          <p>visibility: {d.visibility}</p>
          <p>comment: {d.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
