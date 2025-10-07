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

function Header({ step, totalQuestions }) {
	return (
		<div className="sticky top-0 z-20 backdrop-blur-md bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-orange-500/90 border-b-4 border-white shadow-xl">
			<div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-14 h-14 rounded-2xl bg-white/95 grid place-items-center text-3xl shadow-lg flex-shrink-0 transform hover:scale-110 transition-transform duration-200 animate-bounce-slow">
						🦉
					</div>
					<div>
						<p className="text-2xl font-black leading-tight font-sans text-white drop-shadow-lg">
							Teacher Bot — Mia's Story
						</p>
						<p className="text-xs text-white/90 font-bold tracking-wide font-sans">
							✨ For Year 1–4 Students ✨
						</p>
					</div>
				</div>
				<div
					className="flex flex-col items-end gap-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl"
					aria-label="Progress"
				>
					<p className="text-xs font-bold text-white">
						Progress
					</p>
					<p className="text-2xl font-black text-white">
						{step}/{totalQuestions}
					</p>
					<div className="flex items-center gap-1.5 mt-1">
						{Array.from({ length: totalQuestions }).map((_, i) => (
							<div
								key={i}
								className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
									i < step
										? "bg-green-400 scale-125 shadow-lg"
										: "bg-white/40"
								}`}
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
		<div className={`flex ${isBot ? "justify-start" : "justify-end"} px-1 animate-fade-in`}>
			{isBot && (
				<div className="w-12 h-12 mt-1 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 grid place-items-center text-2xl shadow-lg flex-shrink-0 border-3 border-white transform hover:scale-110 transition-transform">
					👩‍🏫
				</div>
			)}
			<div
				className={
					"max-w-[90%] sm:max-w-[72%] rounded-3xl px-6 py-5 shadow-2xl text-slate-900 text-lg font-semibold leading-relaxed transform hover:scale-[1.02] transition-all " +
					(isBot
						? "bg-gradient-to-br from-white to-blue-50 ml-3 rounded-tl-none border-2 border-blue-200"
						: "bg-gradient-to-br from-green-100 to-emerald-200 mr-3 rounded-br-none border-2 border-green-300")
				}
			>
				{children}
			</div>
			{!isBot && (
				<div className="w-12 h-12 mt-1 rounded-full bg-gradient-to-br from-green-300 to-teal-400 grid place-items-center text-2xl shadow-lg flex-shrink-0 border-3 border-white transform hover:scale-110 transition-transform">
					👧
				</div>
			)}
		</div>
	);
}

function BigButton({ label, onClick, ariaLabel, tone = "primary", disabled = false }) {
	const toneClass =
		tone === "primary"
			? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-500/50 border-blue-400"
			: tone === "danger"
			? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/50 border-rose-400"
			: "bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-900 shadow-slate-500/50 border-slate-400";
	const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.03] active:scale-[0.97]";

	return (
		<button
			onClick={onClick}
			aria-label={ariaLabel || label}
			disabled={disabled}
			className={`w-full text-left rounded-2xl px-7 py-5 min-h-[72px] text-xl font-black transition-all duration-200 transform shadow-xl border-4 ${toneClass} ${disabledClass} focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-yellow-400`}
		>
			{label}
		</button>
	);
}

function ImageCard({ src }) {
	return (
		<div className="mt-5 rounded-2xl overflow-hidden border-4 border-white shadow-2xl shadow-purple-300/60 bg-white transform hover:scale-[1.02] transition-transform animate-fade-in">
			<img
				src={src}
				alt="Generated image for Mia's story moment"
				className="w-full h-auto object-cover"
				style={{ minHeight: "200px" }}
			/>
		</div>
	);
}

function ImageLoader() {
	return (
		<div className="mt-4 p-6 animate-pulse">
			<div className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-4 border-purple-300 shadow-lg">
				<svg
					className="w-12 h-12 text-purple-500 animate-spin-slow"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<p className="mt-3 text-base font-black text-purple-700">
					🎨 Creating your picture...
				</p>
			</div>
		</div>
	);
}

// Generate a placeholder SVG image for fallback scenarios
function generatePlaceholderImage(questionId) {
	const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#A8DADC', '#F1A7FE'];
	const color = colors[questionId % colors.length];
	
	const svg = `
		<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
			<rect width="600" height="400" fill="${color}" opacity="0.2"/>
			<circle cx="300" cy="200" r="80" fill="${color}" opacity="0.4"/>
			<text x="300" y="210" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${color}" text-anchor="middle">🎨</text>
			<text x="300" y="280" font-family="Arial, sans-serif" font-size="20" fill="#333" text-anchor="middle">Image Preview</text>
		</svg>
	`.trim();
	
	return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Generate image by calling the Vercel serverless API function
async function generateImage(prompt) {
	try {
		const response = await fetch('/api/generate-image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt }),
		});

		if (!response.ok) {
			console.warn('Image generation API returned error:', response.status);
			return null; // Will trigger fallback
		}

		const json = await response.json();
		
		// Extract base64 image from Google Imagen response format
		if (json.predictions && json.predictions[0]?.bytesBase64Encoded) {
			return `data:image/png;base64,${json.predictions[0].bytesBase64Encoded}`;
		}
		
		console.warn('Unexpected API response format:', json);
		return null; // Will trigger fallback
	} catch (error) {
		console.error('Image generation failed:', error);
		return null; // Will trigger fallback
	}
}

export default function MiaKidsChatbot() {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [chatHistory, setChatHistory] = useState([]);
	const [questionProgress, setQuestionProgress] = useState(0);
	const [pendingRetry, setPendingRetry] = useState(null);
	const [imageByQ, setImageByQ] = useState({});
	const [loadingImage, setLoadingImage] = useState(null);

	const totalQuestions = useMemo(
		() => STEPS.filter((s) => s.type === "question").length,
		[]
	);
	const currentStep = STEPS[currentStepIndex];

	const randomizedChoices = useMemo(() => {
		if (currentStep?.type !== "question") return [];
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
			setChatHistory([{ type: "bot", content: STEPS[0].text, key: Date.now() }]);
			setCurrentStepIndex(1);
		}
	}, [chatHistory.length]);

	function advanceStep() {
		const next = STEPS[currentStepIndex];
		if (!next) return;
		setChatHistory((history) => [
			...history,
			{ type: "bot", content: next.text, key: Date.now() + Math.random() },
		]);
		setCurrentStepIndex((i) => i + 1);
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

		setChatHistory((history) => [
			...history,
			{ type: "user", content: pickedText, key: Date.now() },
		]);

		if (isCorrectChoice) {
			setLoadingImage(q.questionId);
			let img = await generateImage(q.correct.prompt);
			
			// Use fallback placeholder if API fails or returns null
			if (!img) {
				console.log('Using fallback placeholder image for question', q.questionId);
				img = generatePlaceholderImage(q.questionId);
			}
			
			setLoadingImage(null);
			setImageByQ((m) => ({ ...m, [q.questionId]: img }));
			setChatHistory((history) => [
				...history,
				{
					type: "bot-image",
					questionId: q.questionId,
					content: q.correct.response,
					key: Date.now() + 1,
				},
			]);
			setQuestionProgress((n) => Math.min(totalQuestions, n + 1));
			setCurrentStepIndex((i) => i + 1);
		} else {
			const explanation = q.wrong.explanation;
			let prevStoryIndex = currentStepIndex - 1;
			while (prevStoryIndex >= 0 && STEPS[prevStoryIndex].type !== "story") {
				prevStoryIndex--;
			}
			prevStoryIndex = Math.max(0, prevStoryIndex);
			setChatHistory((history) => [
				...history,
				{ type: "bot", content: explanation, key: Date.now() + 1 },
			]);
			setPendingRetry({ storyIndex: prevStoryIndex, questionIndex: currentStepIndex });
		}
	}

	function handleRetryReadStory() {
		if (!pendingRetry) return;
		const storyStep = STEPS[pendingRetry.storyIndex];
		if (storyStep) {
			setChatHistory((history) => [
				...history,
				{ type: "bot", content: storyStep.text, key: Date.now() + 2 },
			]);
		}
		setCurrentStepIndex(pendingRetry.storyIndex);
		setPendingRetry(null);
	}

	function handleRetryRepeatQuestion() {
		if (!pendingRetry) return;
		setPendingRetry(null);
	}

	const renderChatHistory = () =>
		chatHistory.map((msg) => {
			if (msg.type === "bot") {
				return (
					<ChatBubble key={msg.key} role="bot">
						<p className="text-lg leading-relaxed">{msg.content}</p>
					</ChatBubble>
				);
			}
			if (msg.type === "bot-image") {
				const imgUrl = imageByQ[msg.questionId];
				return (
					<ChatBubble key={msg.key} role="bot">
						<p className="text-lg leading-relaxed">{msg.content}</p>
						{imgUrl && <ImageCard src={imgUrl} />}
					</ChatBubble>
				);
			}
			if (msg.type === "user") {
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
				<div className="flex justify-start px-1 mt-6 animate-fade-in">
					<div className="w-12 h-12 mt-1 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 grid place-items-center text-2xl shadow-lg flex-shrink-0 border-3 border-white">
						👩‍🏫
					</div>
					<div className="max-w-[90%] sm:max-w-[72%] rounded-3xl px-6 py-5 shadow-2xl bg-gradient-to-br from-white to-blue-50 ml-3 rounded-tl-none border-2 border-blue-200">
						<ImageLoader />
					</div>
				</div>
			);
		}

		if (pendingRetry) {
			return (
				<div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-6 animate-fade-in">
					<div className="rounded-3xl bg-gradient-to-br from-orange-100 to-rose-100 border-4 border-orange-300 p-6 shadow-2xl">
						<p className="text-rose-900 font-black mb-5 text-2xl flex items-center gap-2">
							🤔 What would you like to do now?
						</p>
						<div className="grid gap-4">
							<BigButton
								label="📖 Read the story again"
								onClick={handleRetryReadStory}
								tone="secondary"
								ariaLabel="Go back and read the story again."
							/>
							<BigButton
								label="🔁 Repeat the question"
								onClick={handleRetryRepeatQuestion}
								tone="primary"
								ariaLabel="I remember! Show the question options again."
							/>
						</div>
					</div>
				</div>
			);
		}

		if (currentStep?.type === "question") {
			return (
				<div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-6 animate-fade-in">
					<div className="rounded-3xl bg-gradient-to-br from-white to-indigo-100 p-6 shadow-2xl border-4 border-indigo-300">
						<p className="text-indigo-900 font-black mb-5 text-2xl flex items-center gap-2">
							❓ {currentStep.text}
						</p>
						<div className="grid grid-cols-1 gap-4">
							{randomizedChoices.map((choice) => (
								<BigButton
									key={choice.text}
									label={choice.text}
									onClick={() => handleAnswer(choice.isCorrect)}
									disabled={loadingImage !== null}
								/>
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
					<BigButton
						label={currentStep.actionText}
						onClick={isFinal ? restart : advanceStep}
						tone={isFinal ? "danger" : "primary"}
						ariaLabel={currentStep.actionText}
					/>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 w-32 h-32 bg-pink-300/30 rounded-full blur-3xl animate-float"></div>
				<div className="absolute top-40 right-20 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-float-delay"></div>
				<div className="absolute bottom-20 left-1/4 w-36 h-36 bg-yellow-300/30 rounded-full blur-3xl animate-float"></div>
			</div>
			
			<style>
				{`
					@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
					body { font-family: 'Inter', sans-serif; }
					
					@keyframes float {
						0%, 100% { transform: translateY(0px); }
						50% { transform: translateY(-20px); }
					}
					
					@keyframes float-delay {
						0%, 100% { transform: translateY(0px) translateX(0px); }
						50% { transform: translateY(-30px) translateX(10px); }
					}
					
					@keyframes fade-in {
						from { opacity: 0; transform: translateY(10px); }
						to { opacity: 1; transform: translateY(0); }
					}
					
					@keyframes bounce-slow {
						0%, 100% { transform: translateY(0); }
						50% { transform: translateY(-5px); }
					}
					
					@keyframes spin-slow {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
					
					.animate-float { animation: float 6s ease-in-out infinite; }
					.animate-float-delay { animation: float-delay 8s ease-in-out infinite; }
					.animate-fade-in { animation: fade-in 0.5s ease-out; }
					.animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
					.animate-spin-slow { animation: spin-slow 2s linear infinite; }
				`}
			</style>
			<Header step={questionProgress} totalQuestions={totalQuestions} />

			<main className="max-w-3xl mx-auto px-4 pt-6 pb-8 relative z-10">
				<div className="space-y-6">
					{renderChatHistory()}
					<ActiveInteraction />
					<div ref={chatEndRef} />
				</div>
			</main>
		</div>
	);
}
