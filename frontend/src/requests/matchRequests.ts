import axios from 'axios';

// Get all matches
export async function getAllMatches(url: string, data: any) {
    axios
      .get(url)
      .then((res) => {
        data.value = res?.data;
      })
      .catch((e) => console.log(e));
}

// Get match by id
export async function getMatchById(url: string, match: any) {
    try {
      match = await axios.get(url);
    } catch (e) {
      match = { data: e.message };
      throw new Error("ERROR: missing or wrong id : " + e.message);
    }
    return match;
}

// Create match
export async function createMatch(url: string, p1_input: string, p2_input: string, s1_input: number, s2_input: number, data: any) {
    const win = s1_input > s2_input ? p1_input : p2_input;
    const score = [s1_input, s2_input]
    const new_match = { playerOne: p1_input, playerTwo: p2_input, winner: win, score: score };
    axios
      .post(url, new_match)
      .then((ret) => {
        data.push(ret.data);
        data.sort((a: any, b: any) => a.id - b.id);
      })
      .catch((e) => console.log(e));
}

// Update match data by Id
// Call this function in createMatch() if id already exists
export async function updateMatch(id: string, p1: string, p2: string, s1: string, s2: string, url: string, match: any) {
    await getMatchById(url, match).then(async (res) => {
        const score1 = s1 !== '' ? Number(s1) : res.data.score[0];
        const score2 = s2 !== '' ? Number(s2) : res.data.score[1];
        const score = [score1, score2]
        const new_match = {playerOne: '', playerTwo: '', winner: '', score: score};
        new_match.playerOne = p1 !== '' ? p1 : res.data.playerOne;
        new_match.playerTwo = p2 !== '' ? p2 : res.data.playerTwo;
        new_match.winner = new_match.score[0] > new_match.score[1] ? new_match.playerOne : new_match.playerTwo;

        await axios
            .patch(url, new_match)
            .then((ret) => {
            const index = match.findIndex((el: any) => el.id === +id);
            match[index] = { ...match[index], ...ret.data };
            match.sort((a: any, b: any) => a.id - b.id);
            })
            .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
}

// Delete user
export async function deleteMatch(id: number, url: string) {
    try {
      await axios.delete(url);
    } catch(e) {
      id = -1;
      console.log(e);
    }
    return id;
}