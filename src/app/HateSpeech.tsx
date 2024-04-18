import { useEffect, useState } from "react";
import { findMissingPart } from "./missingPart";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY; 
 

const filterProfanity = async (text: string) => {

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/profanityfilter?text=${encodeURIComponent(text)}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY
        }
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const analyzeSentiment = async (text: string) => {
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/sentiment?text=${encodeURIComponent(text)}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY
        }
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export function HateSpeech() {
  const [inputText, setInputText] = useState("");
  const [filteredText, setFilteredText] = useState("");
  const [profanityDetected, setProfanityDetected] = useState(false);
  const [missingPart, setMissingPart] = useState<any>("");
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const [sentiment, setSentiment] = useState<string | null>(null);


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await filterProfanity(inputText);
    if (result) {
      setFilteredText(result.censored);
      setProfanityDetected(result.has_profanity);
      const part = findMissingPart(inputText, result.censored);
      setMissingPart(part);

      const sentimentResult = await analyzeSentiment(inputText);
      if (sentimentResult) {
        setSentimentScore(sentimentResult.score);
        setSentiment(sentimentResult.sentiment);
      }
    }
  };

  useEffect(() => { 
    return () => {
      // console.log("sentiment :",sentiment,"filteredText :",filteredText );
    }
  }, [sentiment,filteredText])
  
  return (
    <div className=" bg-gradient-to-r from-fuchsia-300 to-cyan-300 animate-gradient-x  h-screen gap-4 ">
      <div className="h-1/5 flex justify-center items-center">
        <h1 className=" text-center  bg-gradient-to-r from-violet-600 to-blue-600 bg-opacity-5 text-white w-fit p-2">Hate Speech Detection</h1>
      </div>
      <div className="  flex flex-col gap-4 justify-center items-center ">
        <form onSubmit={handleSubmit} className=" flex flex-col items-center gap-3 ">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter text..."
            rows={4}
            id="form"
            name="form"
            cols={50}
            className="border rounded-lg p-2 text-black resize-nonce"
          />
          <button type="submit" className=" bg-green-500   active:scale-105 p-2 rounded-lg">Submit</button>
        </form>
        <div className=" flex justify-center items-center w-3/5 flex-col gap-4">
          {profanityDetected && <p className=" text-lg font-semibold">Corrected part : {filteredText}</p>}
          {missingPart && <p className=" font-semibold text-lg ">Hate Words: {missingPart}</p>}
          {filteredText.includes("***") && <p className=" font-semibold text-red-600 text-xl" >Hate speech detected!</p>}
          {sentimentScore !== null && sentiment !== null && (
            <p className=" font-semibold flex gap-1">Sentece is 
           <p className={`${sentiment==='NEGATIVE'? 'text-red-600': 'text-green-600'}`}>{ sentiment==='NEGATIVE'? "Negative": "Positive"}</p>
              (Score: {sentimentScore})</p>
          )}
        </div>
      </div>
    </div>
  );
}
