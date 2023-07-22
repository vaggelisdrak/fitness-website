export const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
  },
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
  },
};


export const ChatGPTOptions = (content) => ({
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_CHATGPT_API_KEY}`,
    'Content-Type': 'application/json', 
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages:[{role: "user", content: content}],
    temperature: 0.5,
    max_tokens: 500
  })
})

export const fetchData = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json();

  return data;
};