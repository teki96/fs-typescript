import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from '../types';

const baseurl = "http://localhost:3000/api/diaries";

const getAll = () => {
    return axios
        .get<DiaryEntry[]>(baseurl)
        .then(response => response.data);
};

const create = (entry: NewDiaryEntry) => {
    return axios
        .post<DiaryEntry>(baseurl, entry)
        .then(response => response.data);
};

export default { getAll, create };