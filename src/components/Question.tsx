import { useState, memo } from "react";
import { PlaceholderNode } from "@/components/placeholder-node";

type QuestionProps = {
    data: {
        label: string,
        questionType: string
    }
}
 
const Question = memo(({ data }: QuestionProps) => {
  const peopleQuestions: string[] = ["Who have they worked with?", "Who have they inspired?", "Who else do they know?"]
  const orgQuestions: string[] = ["Where do they work?", "What sort of groups are they part of?", "How would you describe their social circle?"]
  const movementQuestions: string[] = ["Are they part of a movement?", "How would you categorize what they do?"]
  const introQuestions: string[] = ["What musician or band do you listen to the most?", "Who is your favorite artist?", "Who wrote your favorite book?", "Who is the most underrated director?"]
  const otherQuestions: string[] = ["Something else!"]

  function getQuestion(questionType: string): string{

    let questionArray:string[] = []

    if(questionType === "people"){
      questionArray = peopleQuestions;
    } else if (questionType === "org"){
      questionArray = orgQuestions;
    } else if (questionType === "movement"){
      questionArray = movementQuestions;
    } else if (questionType === "other"){
      questionArray = otherQuestions;
    } else if (questionType === "intro")
    {
      questionArray = introQuestions;
    }
      else {
      console.error("Invalid question type.")
    }

    const randomIndex: number = Math.floor(Math.random()*questionArray.length)
    return questionArray[randomIndex]
  }

  const [question] = useState(() => getQuestion(data.questionType));
  data.label = question;

    return (
    <PlaceholderNode>
      <div>{question}</div>
    </PlaceholderNode>
  );
});
 
export default Question;