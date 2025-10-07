import React, { useEffect, useMemo, useRef, useState } from "react";

const STEPS = [
  {
    type: "bot",
    text:
      "Hi! I'm Teacher Bot. We're going to read a story about Mia and help her by choosing the best sentences for a picture. Are you ready?",
    actionText: "Start",
  },
  {
    type: "story",
    text: "Mia is in Year 1 and loves to draw. One day, she can't find her special red pencil.",
    actionText: "Next",
  },
  {
    type: "question",
    questionId: 1,
    text: "What is Mia looking for?",
    correct: {
      text: "A: Mia is looking for her red pencil.",
      prompt:
        "Full-colour, child-friendly cartoon of a Malaysian primary school girl named Mia (age 7) looking sad because she cannot find her red pencil. She is in a bright classroom. The red pencil is not in the picture.",
      response: "That's right! Mia is looking for her red pencil. Here is the picture you described.",
    },
    wrong: {
      text: "B: Mia is looking for a book.",
      explanation:
        "Not quite! Remember, the story tells us what Mia lost. Read the story again to find the answer. You can do it!",
    },
  },
  {
    type: "story",
    text:
      "First, Mia looks in her pencil case. It's not there! Then, she looks under her desk. It's not there either.",
    actionText: "Next",
  },
  {
    type: "question",
    questionId: 2,
    text: "Where did Mia look for her pencil?",
    correct: {
      text: "A: Mia looks in her pencil case and under her desk.",
      prompt:
        "Medium-shot cartoon of Mia (Malaysian girl, age 7) first looking in her pencil case, then bending down to look under her school desk. Show a curious and slightly worried expression. The red pencil is not there. Bright classroom setting.",
      response: "Excellent! Mia looked in her pencil case and under her desk. Here is the picture!",
    },
    wrong: {
      text: "B: Mia looks in her school bag.",
      explanation:
        "Good try! The story tells us two places Mia looked. Can you find them? Read the story again and give it another go!",
    },
  },
  {
    type: "story",
    text:
      "Mia asks her friend, Ali, 'Can you help me?' Ali says, 'Yes! Let’s go to the art corner to look.'",
    actionText: "Next",
  },
  {
    type: "question",
    questionId: 3,
    text: "Who does Mia ask for help?",
    correct: {
      text: "A: Mia asks her friend Ali for help.",
      prompt:
        "Mid-shot, child-safe cartoon of Mia (girl, age 7) asking her friend Ali (Malaysian boy, age 7) for help. Ali should have a friendly, helpful expression. They are in a classroom.",
      response: "Yes, Ali is a great friend! You chose the perfect sentence for this picture.",
    },
    wrong: {
      text: "B: Mia asks her teacher.",
      explanation:
        "That's a good idea, but Mia asked someone else in the story. Who was it? Read the story again to find out. You're doing great!",
    },
  },
  {
    type: "story",
    text:
      "They go to the art corner. And look! Mia finds her red pencil on a big table.",
    actionText: "Next",
  },
  {
    type: "question",
    questionId: 4,
    text: "Where did Mia find her red pencil?",
    correct: {
      text: "B: Mia finds the red pencil in the art corner.",
      prompt:
        "Full-colour, joyful cartoon of Mia (girl, age 7) finding her red pencil on a table in the school's art corner. Ali (boy, age 7) is smiling next to her. Show paint jars, brushes, and coloured paper on the table to make the location clear. Both children look happy.",
      response: "That's it! She found it in the art corner. What a happy picture!",
    },
    wrong: {
      text: "A: Mia finds the pencil in the library.",
      explanation:
        "Almost! The story tells us a special place where they found the pencil. Read the story again to see where they went. Try again!",
    },
  },
  {
    type: "story",
    text: "Mia is very happy. She smiles and says, 'Thank you, Ali!'",
    actionText: "Next",
  },
  {
    type: "question",
    questionId: 5,
    text: "What does Mia say to Ali?",
    correct: {
      text: "A: Mia says 'Thank you' to Ali.",
      prompt:
        "Close-up shot, child-safe cartoon of Mia (girl, age 7) smiling happily and saying 'Thank you!' to Ali (boy, age 7). Ali is smiling back. They are in the art corner with colourful supplies in the background. Show warmth and friendship.",
      response: "Perfect! Saying thank you is very important. You finished the story!",
    },
    wrong: {
      text: "B: Mia says 'Let's play'.",
      explanation:
        "What do you say when a friend helps you? The story tells us what Mia said. Read the last part of the story again. You're almost there!",
    },
  },
  {
    type: "bot",
    text:
      "Yay, you did it! You chose all the best sentences to tell Mia's story. Remember, a good sentence for a picture tells us WHO is in it, WHERE they are, and WHAT they are doing. Press 'Play Again' to start over.",
    actionText: "Play Again",
  },
];

async function generateImage(prompt) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const maxRetries = 5;
  let delay = 1000;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const payload = { instances: { prompt: prompt }, parameters: { sampleCount: 1 } };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`Server error or rate limit: ${response.status}`);
        }
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      } else {
        throw new Error("Missing image data in successful response.");
      }
    } catch (e) {
      console.warn(`Attempt ${attempt + 1} failed.`, e);
      if (attempt === maxRetries - 1 || e.message.includes("API error")) {
        console.warn("Falling back to placeholder image.");
        return await generateImagePlaceholder(prompt);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

async function generateImagePlaceholder(prompt, width = 768, height = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, "#fef3c7");
  g.addColorStop(1, "#e0e7ff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (let i = 0; i < 36; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 8 + Math.random() * 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 30px Inter, system-ui, sans-serif";
  ctx.fillText("Mia's Picture (Placeholder)", 24, 46);
  ctx.font = "18px Inter, system-ui, sans-serif";

  const words = prompt.split(" ");
  let line = "";
  let y = 86;
  const maxWidth = width - 48;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, 24, y);
      line = words[i] + " ";
      y += 28;
      if (y > height - 28) break;
    } else {
      line = testLine;
    }
  }
  if (y <= height - 28) ctx.fillText(line, 24, y);

  return canvas.toDataURL("image/png");
}

function Header({ step, totalQuestions }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-300 to-blue-300 grid place-items-center text-2xl shadow-md flex-shrink-0">🦉</div>
          <div>
            <p className="text-xl font-extrabold leading-tight font-sans">Teacher Bot — Mia's Story</p>
            <p className="text-xs text-slate-600 font-sans">For Year 1–2 students (Malaysia)</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1" aria-label="Progress">
          <p className="text-xs font-semibold text-slate-700">Progress: {step}/{totalQuestions}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={
                  "w-4 h-4 rounded-full transition-colors duration-300 shadow-inner " +
                  (i < step ? "bg-green-500 ring-2 ring-green-700" : "bg-slate-300")
                }
                title={`Question ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ role, children }) {
  const isBot = role === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} px-1`}>
      {isBot && <div className="w-10 h-10 mt-1 rounded-full bg-yellow-200 grid place-items-center text-xl shadow-md flex-shrink-0">👩‍🏫</div>}
      <div
        className={
          "max-w-[90%] sm:max-w-[72%] rounded-3xl px-5 py-4 shadow-lg text-slate-900 text-lg font-medium " +
          (isBot ? "bg-white ml-2 rounded-tl-none" : "bg-green-100 mr-2 rounded-br-none")
        }
      >
        {children}
      </div>
      {!isBot && <div className="w-10 h-10 mt-1 rounded-full bg-green-200 grid place-items-center text-xl shadow-md flex-shrink-0">👧</div>}
    </div>
  );
}

function BigButton({ label, onClick, ariaLabel, tone = "primary", disabled = false }) {
  const toneClass =
    tone === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-400/50"
      : tone === "danger"
      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-400/50"
      : "bg-slate-200 hover:bg-slate-300 text-slate-900 shadow-slate-400/50";
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      disabled={disabled}
      className={`w-full text-left rounded-xl px-6 py-4 min-h-[64px] text-xl font-extrabold transition duration-150 transform hover:scale-[1.01] active:scale-[0.98] shadow-lg ${toneClass} ${disabledClass} focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-300`}
    >
      {label}
    </button>
  );
}

function ImageCard({ src }) {
  return (
    <div className="mt-4 rounded-xl overflow-hidden border-4 border-white shadow-2xl shadow-indigo-200/50 bg-white">
      <img src={src} alt="Generated image for Mia's story moment" className="w-full h-auto object-cover" style={{ minHeight: '180px' }} />
    </div>
  );
}

function ImageLoader() {
  return (
    <div className="mt-2 p-4 animate-pulse">
      <div className="flex flex-col items-center justify-center h-28 bg-gray-100 rounded-xl border border-gray-200">
        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-1 text-sm font-semibold text-blue-600">Generating picture...</p>
      </div>
    </div>
  );
}

export default function MiaKidsChatbot() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [questionProgress, setQuestionProgress] = useState(0);
  const [pendingRetry, setPendingRetry] = useState(null);
  const [imageByQ, setImageByQ] = useState({});
  const [loadingImage, setLoadingImage] = useState(null);

  const totalQuestions = useMemo(() => STEPS.filter((s) => s.type === "question").length, []);
  const currentStep = STEPS[currentStepIndex];

  const randomizedChoices = useMemo(() => {
    if (currentStep?.type !== 'question') return [];
    const choices = [
      { text: currentStep.correct.text, isCorrect: true },
      { text: currentStep.wrong.text, isCorrect: false },
    ];
    if (Math.random() > 0.5) {
      return choices.reverse();
    }
    return choices;
  }, [currentStep]);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory.length, loadingImage]);

  useEffect(() => {
    if (chatHistory.length === 0 && STEPS.length > 0) {
      setChatHistory([{ type: 'bot', content: STEPS[0].text, key: Date.now() }]);
      setCurrentStepIndex(1);
    }
  }, [chatHistory.length]);

  function advanceStep() {
    const next = STEPS[currentStepIndex];
    if (!next) return;
    setChatHistory(history => [...history, { type: 'bot', content: next.text, key: Date.now() + Math.random() }]);
    setCurrentStepIndex(i => i + 1);
  }

  function restart() {
    setChatHistory([]);
    setCurrentStepIndex(0);
    setQuestionProgress(0);
    setPendingRetry(null);
    setImageByQ({});
    setLoadingImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleAnswer(isCorrectChoice) {
    if (!currentStep || currentStep.type !== "question" || loadingImage) return;
    const q = currentStep;
    const picked = isCorrectChoice ? q.correct : q.wrong;
    const pickedText = picked.text;

    setChatHistory(history => [...history, { type: 'user', content: pickedText, key: Date.now() }]);

    if (isCorrectChoice) {
      setLoadingImage(q.questionId);
      const img = await generateImage(q.correct.prompt);
      setLoadingImage(null);
      setImageByQ((m) => ({ ...m, [q.questionId]: img }));
      setChatHistory(history => [...history, { type: 'bot-image', questionId: q.questionId, content: q.correct.response, key: Date.now() + 1 }]);
      setQuestionProgress((n) => Math.min(totalQuestions, n + 1));
      setCurrentStepIndex(i => i + 1);
    } else {
      const explanation = q.wrong.explanation;
      let prevStoryIndex = currentStepIndex - 1;
      while (prevStoryIndex >= 0 && STEPS[prevStoryIndex].type !== 'story') {
        prevStoryIndex--;
      }
      prevStoryIndex = Math.max(0, prevStoryIndex);
      setChatHistory(history => [...history, { type: 'bot', content: explanation, key: Date.now() + 1 }]);
      setPendingRetry({ storyIndex: prevStoryIndex, questionIndex: currentStepIndex });
    }
  }

  function handleRetryReadStory() {
    if (!pendingRetry) return;
    const storyStep = STEPS[pendingRetry.storyIndex];
    if (storyStep) {
      setChatHistory(history => [...history, { type: 'bot', content: storyStep.text, key: Date.now() + 2 }]);
    }
    setCurrentStepIndex(pendingRetry.storyIndex);
    setPendingRetry(null);
  }

  function handleRetryRepeatQuestion() {
    if (!pendingRetry) return;
    setPendingRetry(null);
  }

  const renderChatHistory = () => chatHistory.map((msg) => {
    if (msg.type === 'bot') {
      return (
        <ChatBubble key={msg.key} role="bot">
          <p className="text-lg leading-relaxed">{msg.content}</p>
        </ChatBubble>
      );
    }
    if (msg.type === 'bot-image') {
      const imgUrl = imageByQ[msg.questionId];
      return (
        <ChatBubble key={msg.key} role="bot">
          <p className="text-lg leading-relaxed">{msg.content}</p>
          {imgUrl && <ImageCard src={imgUrl} />}
        </ChatBubble>
      );
    }
    if (msg.type === 'user') {
      return (
        <ChatBubble key={msg.key} role="user">
          <p className="text-lg">{msg.content}</p>
        </ChatBubble>
      );
    }
    return null;
  });

  const ActiveInteraction = () => {
    if (loadingImage !== null) {
      return (
        <div className="flex justify-start px-1 mt-6">
          <div className="w-10 h-10 mt-1 rounded-full bg-yellow-200 grid place-items-center text-xl shadow-md flex-shrink-0">👩‍🏫</div>
          <div className="max-w-[90%] sm:max-w-[72%] rounded-3xl px-5 py-4 shadow-lg bg-white ml-2 rounded-tl-none">
            <ImageLoader />
          </div>
        </div>
      );
    }

    if (pendingRetry) {
      return (
        <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-4">
          <div className="rounded-3xl bg-rose-50 border border-rose-200 p-4 shadow-lg">
            <p className="text-rose-800 font-extrabold mb-3 text-lg">What would you like to do now?</p>
            <div className="grid gap-3">
              <BigButton label="📖 Read the story again" onClick={handleRetryReadStory} tone="secondary" ariaLabel="Go back and read the story again." />
              <BigButton label="🔁 Repeat the question" onClick={handleRetryRepeatQuestion} tone="primary" ariaLabel="I remember! Show the question options again." />
            </div>
          </div>
        </div>
      );
    }

    if (currentStep?.type === "question") {
      return (
        <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-4">
          <div className="rounded-3xl bg-white p-4 shadow-lg border border-slate-100">
            <p className="text-slate-800 font-extrabold mb-4 text-xl">{currentStep.text}</p>
            <div className="grid grid-cols-1 gap-3">
              {randomizedChoices.map((choice) => (
                <BigButton key={choice.text} label={choice.text} onClick={() => handleAnswer(choice.isCorrect)} disabled={loadingImage !== null} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep?.actionText) {
      const isFinal = currentStep.actionText === "Play Again";
      return (
        <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-4">
          <BigButton label={currentStep.actionText} onClick={isFinal ? restart : advanceStep} tone={isFinal ? "danger" : "primary"} ariaLabel={currentStep.actionText} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-amber-50 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap'); body { font-family: 'Inter', sans-serif; }`}</style>
      <Header step={questionProgress} totalQuestions={totalQuestions} />

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-8">
        <div className="space-y-6">
          {renderChatHistory()}
          <ActiveInteraction />
          <div ref={chatEndRef} />
        </div>
      </main>

    </div>
  );
}
