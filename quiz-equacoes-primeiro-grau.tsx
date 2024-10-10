import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const questions = [
  // Fáceis
  { question: "2x + 3 = 7", answer: 2, difficulty: "fácil" },
  { question: "x - 5 = 10", answer: 15, difficulty: "fácil" },
  { question: "3x = 12", answer: 4, difficulty: "fácil" },
  { question: "x + 8 = 20", answer: 12, difficulty: "fácil" },
  // Médias
  { question: "2x + 5 = 3x - 1", answer: 6, difficulty: "média" },
  { question: "4x - 7 = 2x + 3", answer: 5, difficulty: "média" },
  { question: "5x + 2 = 3x + 10", answer: 4, difficulty: "média" },
  { question: "6x - 4 = 4x + 8", answer: 6, difficulty: "média" },
  // Difíceis
  { question: "3(x + 2) = 2(x + 5)", answer: 4, difficulty: "difícil" },
  { question: "4(2x - 1) = 3(2x + 2)", answer: 5, difficulty: "difícil" },
  { question: "2(3x - 4) = 3(2x - 1)", answer: 5, difficulty: "difícil" },
  { question: "5(x - 2) = 3(x + 4)", answer: 8, difficulty: "difícil" },
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizEquacoesPrimeiroGrau = () => {
  const [name, setName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameState, setGameState] = useState('initial');
  const [sortedQuestions, setSortedQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', isCorrect: false });
  const [showNextButton, setShowNextButton] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'initial') {
      const easy = shuffleArray(questions.filter(q => q.difficulty === 'fácil')).slice(0, 4);
      const medium = shuffleArray(questions.filter(q => q.difficulty === 'média')).slice(0, 4);
      const hard = shuffleArray(questions.filter(q => q.difficulty === 'difícil')).slice(0, 4);
      setSortedQuestions([...easy, ...medium, ...hard]);
    }
  }, [gameState]);

  const startQuiz = () => {
    if (name.trim()) {
      setGameState('playing');
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeElapsed(0);
    } else {
      alert('Por favor, insira seu nome para começar.');
    }
  };

  const playSound = (isCorrect) => {
    const audio = new Audio(isCorrect ? '/correct.mp3' : '/incorrect.mp3');
    audio.play();
  };

  const handleAnswer = () => {
    const currentQuestion = sortedQuestions[currentQuestionIndex];
    const isCorrect = parseFloat(userAnswer) === currentQuestion.answer;
    
    setFeedback({
      message: isCorrect ? 'Correto!' : `Incorreto. A resposta correta é ${currentQuestion.answer}.`,
      isCorrect,
    });

    setShowFeedback(true);
    playSound(isCorrect);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      setShowNextButton(true);
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sortedQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setUserAnswer('');
      setFeedback({ message: '', isCorrect: false });
      setShowNextButton(false);
      setShowFeedback(false);
    } else {
      setGameState('finished');
    }
  };

  const renderQuestion = () => {
    const currentQuestion = sortedQuestions[currentQuestionIndex];
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Questão {currentQuestionIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Resolva a equação: {currentQuestion.question}</p>
          <p className="text-sm mb-2 text-gray-600">Dificuldade: {currentQuestion.difficulty}</p>
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Sua resposta"
            className="mb-4"
          />
          {!showFeedback && (
            <Button onClick={handleAnswer} disabled={userAnswer === ''}>
              Responder
            </Button>
          )}
          {showFeedback && (
            <Alert className={`mt-4 ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <AlertTitle>{feedback.isCorrect ? 'Correto!' : 'Incorreto'}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}
          {showNextButton && (
            <Button onClick={nextQuestion} className="mt-4">
              Próxima Questão
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderResult = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Resultado Final</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Nome: {name}</p>
        <p>Pontuação: {score} de {sortedQuestions.length}</p>
        <p>Tempo total: {timeElapsed} segundos</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Quiz de Equações do Primeiro Grau</h1>
      {gameState === 'initial' && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Bem-vindo ao Quiz!</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="mb-4"
            />
            <Button onClick={startQuiz}>Começar Quiz</Button>
          </CardContent>
        </Card>
      )}
      {gameState === 'playing' && renderQuestion()}
      {gameState === 'finished' && renderResult()}
    </div>
  );
};

export default QuizEquacoesPrimeiroGrau;
