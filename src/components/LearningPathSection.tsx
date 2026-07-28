import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { learningLevels } from '../data/learningPathData';
import { Level, Lesson, QuizQuestion } from '../types';
import { playClickSound, playLevelCompleteSound } from '../utils/soundEffects';
import { 
  CheckCircle, 
  BookOpen, 
  Sparkles, 
  Award, 
  Clock, 
  HelpCircle, 
  ArrowLeft,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Printer,
  CheckCircle2,
  XCircle,
  BarChart2,
  Zap,
  ArrowRight,
  Lock,
  Unlock,
  AlertCircle,
  ShieldCheck,
  Check,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearningPathSectionProps {
  completedLevelIds: number[];
  onCompleteLevel: (levelId: number, xpEarned: number, scorePercentage?: number) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LearningPathSection: React.FC<LearningPathSectionProps> = ({
  completedLevelIds,
  onCompleteLevel,
  showToast
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [quizState, setQuizState] = useState<{
    answers: Record<number, number>;
    isSubmitted: boolean;
    score: number;
  }>({ answers: {}, isSubmitted: false, score: 0 });

  const currentLevel = learningLevels.find(l => l.id === selectedLevelId) || learningLevels[0];
  const currentLesson: Lesson = currentLevel.lessons[activeLessonIndex] || currentLevel.lessons[0];

  const totalLevels = learningLevels.length;
  const completionPercentage = Math.round((completedLevelIds.length / totalLevels) * 100);

  const isLevelUnlocked = (lvlId: number) => {
    if (lvlId === 1) return true;
    return completedLevelIds.includes(lvlId - 1);
  };

  const handleSelectLevel = (levelId: number) => {
    if (!isLevelUnlocked(levelId)) {
      playClickSound();
      showToast(
        `المستوى ${levelId} مغلق حالياً 🔒. يجب عليك أولاً اجتياز اختبار المستوى ${levelId - 1} بنسبة نجاح (70% على الأقل) لفتحه!`,
        'info'
      );
      return;
    }
    playClickSound();
    setSelectedLevelId(levelId);
    setActiveLessonIndex(0);
    setQuizState({ answers: {}, isSubmitted: false, score: 0 });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleOptionSelect = (questionId: number, optionIdx: number) => {
    if (quizState.isSubmitted) return;
    playClickSound();
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionIdx }
    }));
  };

  const handleSubmitQuiz = () => {
    let scoreCount = 0;
    currentLevel.quiz.forEach(q => {
      if (quizState.answers[q.id] === q.correctOption) {
        scoreCount++;
      }
    });

    const totalQuestions = currentLevel.quiz.length;
    const scorePct = Math.round((scoreCount / totalQuestions) * 100);
    const isPassed = scorePct >= 70; // 70% threshold required to pass and unlock next level

    setQuizState(prev => ({ ...prev, isSubmitted: true, score: scoreCount }));

    if (isPassed) {
      playLevelCompleteSound();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      const xpValue = Math.round((scoreCount / totalQuestions) * 100) + 60;
      onCompleteLevel(currentLevel.id, xpValue, scorePct);

      if (currentLevel.id < totalLevels) {
        showToast(`تهانينا! نجحت بنسبة ${scorePct}% 🎉 وتم فتح المستوى ${currentLevel.id + 1} بنجاح! 🔓`, 'success');
      } else {
        showToast(`عظيم جداً! نجحت بنسبة ${scorePct}% 🎉 وأكملت كافة مستويات مسار التعلم! 🏆`, 'success');
      }
    } else {
      showToast(`درجتك ${scorePct}% (تحتاج 70% على الأقل لفتح المستوى التالي). راجع التفسيرات وحاول مجدداً! 📝`, 'error');
    }
  };

  const handleResetQuiz = () => {
    playClickSound();
    setQuizState({ answers: {}, isSubmitted: false, score: 0 });
  };

  const handleNextLevel = () => {
    if (selectedLevelId < totalLevels) {
      handleSelectLevel(selectedLevelId + 1);
    }
  };

  const allLevelsCompleted = completedLevelIds.length === totalLevels;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-12 pb-16"
    >
      
      {/* Header Banner - Sleek Interface Styling */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>مسار تعلم الـ Vibe Coding التفاعلي</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              من غير مبرمج إلى صانع أفكار محترف 🎓
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              5 مستويات ميسرة تشرح لك بالتشبيهات كيفية توجيه الذكاء الاصطناعي Gemini ونشر مشاريعك عبر GitHub، متبوعة باختبارات تقييمية تفاعلية.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700/80 min-w-[240px] text-center space-y-3 shadow-inner">
            <span className="text-xs text-slate-400 font-bold block">إجمالي الإنجاز بالمسار</span>
            <div className="text-4xl font-black text-emerald-400">{completionPercentage}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-300 block font-bold">
              المستويات المكتملة: {completedLevelIds.length} من {totalLevels}
            </span>
          </div>
        </div>

        {/* Level Tabs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80">
          {learningLevels.map((lvl) => {
            const isCompleted = completedLevelIds.includes(lvl.id);
            const unlocked = isLevelUnlocked(lvl.id);
            const isSelected = selectedLevelId === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevel(lvl.id)}
                className={`p-4 rounded-2xl border text-right transition duration-200 font-bold text-xs flex flex-col justify-between h-28 relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                    : isCompleted
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                    : unlocked
                    ? 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-800 hover:text-white'
                    : 'bg-slate-900/60 text-slate-500 border-slate-800/90 cursor-not-allowed opacity-75'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[11px] opacity-90 font-extrabold flex items-center gap-1">
                    <span>المستوى {lvl.id}</span>
                    {!unlocked && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                  </span>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : unlocked ? (
                    <Clock className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>
                <span className="line-clamp-2 text-xs font-black leading-snug">
                  {lvl.title}
                </span>
                {!unlocked && (
                  <span className="text-[9px] font-extrabold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-block self-start mt-1">
                    مغلق 🔒
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Active Level Content & Quiz Layout with Fade-in Motion on Level Change */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedLevelId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* Left Column: Lesson Reader */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Level Title Header */}
              <div className="pb-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
                    المستوى {currentLevel.id}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                    {currentLevel.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
                    {currentLevel.subtitle}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200/80 text-amber-800 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>{currentLevel.badgeName}</span>
                </div>
              </div>

              {/* Lesson Selector Sub-Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
                {currentLevel.lessons.map((les, idx) => (
                  <button
                    key={les.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeLessonIndex === idx
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    الدرس {idx + 1}: {les.title}
                  </button>
                ))}
              </div>

              {/* Active Lesson Reader Body with Smooth Fade-in on Lesson Switch */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentLesson.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  
                  {/* Summary */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-sm font-semibold text-slate-800 leading-relaxed">
                    {currentLesson.summary}
                  </div>

                  {/* Non-Technical Life Analogy Card */}
                  <div className="p-5 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 rounded-2xl border border-indigo-100 space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse text-indigo-700 font-extrabold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>التشبيه الميسر لغير المبرمجين:</span>
                    </div>
                    <p className="text-xs md:text-sm text-indigo-950 font-medium leading-relaxed">
                      {currentLesson.analogy}
                    </p>
                  </div>

                  {/* Lesson Paragraphs */}
                  <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                    {currentLesson.content.map((p, idx) => (
                      <p key={idx} className="bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100 font-medium">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Key Takeaways */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
                    <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>النقاط الجوهرية (Key Takeaways):</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-emerald-950 font-semibold">
                      {currentLesson.keyTakeaways.map((take, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-emerald-500 text-sm">•</span>
                          <span>{take}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vibe Tip */}
                  <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 font-semibold flex items-start gap-2.5">
                    <span className="text-base shrink-0">💡</span>
                    <div>
                      <span className="font-extrabold block mb-0.5">نصيحة الـ Vibe Coder:</span>
                      <p className="leading-relaxed">{currentLesson.vibeTip}</p>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        {/* Right Column: Interactive Quiz Component */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-7 border border-slate-200/90 shadow-sm space-y-6">
            
            {/* Quiz Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5 space-x-reverse">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">اختبار تقييم المستوى {currentLevel.id}</h3>
                  <p className="text-xs text-slate-500 font-medium">أجب عن الأسئلة واحصل على تغذية راجعة فورية</p>
                </div>
              </div>

              <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                {currentLevel.quiz.length} أسئلة
              </span>
            </div>

            {/* Questions List with Immediate Feedback */}
            <div className="space-y-6">
              {currentLevel.quiz.map((q, qIdx) => {
                const userChoice = quizState.answers[q.id];
                const hasChosen = userChoice !== undefined;
                const isUserCorrect = userChoice === q.correctOption;

                return (
                  <div 
                    key={q.id} 
                    className={`space-y-3.5 p-5 rounded-3xl border transition-all duration-300 ${
                      hasChosen
                        ? isUserCorrect || (quizState.isSubmitted && userChoice === q.correctOption)
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-rose-50/30 border-rose-200'
                        : 'bg-slate-50/80 border-slate-200/80'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs md:text-sm font-extrabold text-slate-900 leading-snug">
                        <span className="text-indigo-600 ml-1">{qIdx + 1}.</span> {q.question}
                      </p>
                      
                      {/* Immediate Status Badge */}
                      {hasChosen && (
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                          isUserCorrect
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {isUserCorrect ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>صحيحة!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>خاطئة</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Options List */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        const isCorrectOption = q.correctOption === optIdx;

                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (hasChosen) {
                          if (isCorrectOption) {
                            btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm';
                          } else if (isSelected && !isCorrectOption) {
                            btnStyle = 'bg-rose-600 border-rose-600 text-white font-bold shadow-sm';
                          } else {
                            btnStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleOptionSelect(q.id, optIdx)}
                            disabled={quizState.isSubmitted}
                            className={`w-full text-right p-3.5 rounded-2xl border text-xs transition duration-200 flex items-center justify-between gap-2 ${btnStyle}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-lg bg-slate-200/50 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {['أ', 'ب', 'ج', 'د'][optIdx]}
                              </span>
                              <span className="leading-snug font-medium">{opt}</span>
                            </div>

                            {hasChosen && isCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                            )}
                            {hasChosen && isSelected && !isCorrectOption && (
                              <XCircle className="w-4 h-4 text-white shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Immediate Explanation Box */}
                    {hasChosen && (
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 text-[11px] font-medium text-slate-700 space-y-1 animate-fadeIn">
                        <span className="font-bold text-indigo-600 block">💡 التفسير والإجابة النموذجية:</span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Result / Actions Bar */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              {!quizState.isSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizState.answers).length < currentLevel.quiz.length}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-black rounded-2xl text-xs shadow-xl shadow-indigo-500/20 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>
                    {Object.keys(quizState.answers).length < currentLevel.quiz.length
                      ? `أجب على جميع الأسئلة لتسليم الاختبار (${Object.keys(quizState.answers).length} / ${currentLevel.quiz.length})`
                      : 'تسليم الإجابات وتقييم النتيجة 🎯'}
                  </span>
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Instant Score Evaluation Breakdown Card */}
                  {(() => {
                    const scorePct = Math.round((quizState.score / currentLevel.quiz.length) * 100);
                    const isPassed = scorePct >= 70;
                    return (
                      <div className={`p-6 rounded-3xl border text-center space-y-4 shadow-sm transition-all ${
                        isPassed
                          ? 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/40 border-emerald-300 text-emerald-950'
                          : 'bg-gradient-to-br from-rose-50 via-amber-50/50 to-rose-100/40 border-rose-300 text-rose-950'
                      }`}>
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-md font-black text-2xl mx-auto">
                          {isPassed ? '🎉' : '⚠️'}
                        </div>

                        <div className="space-y-1.5">
                          <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-black border ${
                            isPassed
                              ? 'bg-emerald-200/80 text-emerald-900 border-emerald-300'
                              : 'bg-rose-200/80 text-rose-900 border-rose-300'
                          }`}>
                            {isPassed ? 'ناجح ومتمكن 🌟' : 'تحتاج لإعادة المحاولة 📝'}
                          </span>

                          <h4 className="font-black text-lg">
                            {isPassed
                              ? `نتيجة رائعة! اجتزت الاختبار بنسبة ${scorePct}%`
                              : `درجتك: ${scorePct}% (الحد الأدنى للنجاح 70%)`}
                          </h4>

                          <p className="text-xs font-medium opacity-90 max-w-sm mx-auto leading-relaxed">
                            {isPassed
                              ? selectedLevelId < totalLevels
                                ? `ممتاز! تم اعتماد إجاباتك بنجاح وفتح المستوى ${selectedLevelId + 1} لتبدأ التعلم فوراً.`
                                : 'تهانينا الحارة! أتممت جميع المستويات بنجاح واكتسبت كافة المفاهيم.'
                              : 'يجب عليك اختيار الإجابات الصحيحة للوصول إلى درجة 70% على الأقل لفتح المستوى التالي.'}
                          </p>
                        </div>

                        {/* Status Unlock Announcement */}
                        <div className="p-3 bg-white/90 rounded-2xl border border-slate-200 text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
                          <span className="flex items-center gap-1.5 text-slate-800">
                            <Target className="w-4 h-4 text-indigo-600" />
                            <span>الدرجة الحالية: {quizState.score} من {currentLevel.quiz.length}</span>
                          </span>
                          {isPassed ? (
                            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl flex items-center gap-1 font-extrabold">
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{selectedLevelId < totalLevels ? `المستوى ${selectedLevelId + 1} مفتوح 🔓` : 'المسار مكتمل 🏆'}</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 bg-rose-100 px-2.5 py-1 rounded-xl flex items-center gap-1 font-extrabold">
                              <Lock className="w-3.5 h-3.5 text-rose-600" />
                              <span>المستوى التالي مغلق 🔒</span>
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <button
                            onClick={handleResetQuiz}
                            className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl text-xs border border-slate-200 shadow-xs transition flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                            <span>إعادة محاولة الاختبار 🔄</span>
                          </button>

                          {isPassed && selectedLevelId < totalLevels ? (
                            <button
                              onClick={handleNextLevel}
                              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-1.5 transform active:scale-95"
                            >
                              <span>الانتقال للمستوى {selectedLevelId + 1}</span>
                              <ArrowLeft className="w-3.5 h-3.5 text-indigo-300" />
                            </button>
                          ) : isPassed && selectedLevelId === totalLevels ? (
                            <button
                              onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                            >
                              <span>عرض الشهادة 🏆</span>
                            </button>
                          ) : (
                            <button
                              onClick={handleResetQuiz}
                              className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                            >
                              <span>حاول مرة أخرى لتتجاوز الاختبار 🎯</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

          </div>
        </div>

      </motion.div>
    </AnimatePresence>

      {/* Graduation Certificate Section when All Completed */}
      {allLevelsCompleted && (
        <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 md:p-12 border border-indigo-700/50 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
            🏆
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-black text-amber-300 tracking-tight">
              تهانينا! أصبحت الآن Vibe Master معتمداً 🎓
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              أكملت جميع مستويات المسار التعليمي واختباراتها التقييمية لـ "ڤايب كود عربي". يمكنك الآن صياغة أي فكرة ونشرها للعالم كأفضل مهندس أوامر باللغة العربية!
            </p>
          </div>

          <button
            onClick={() => {
              try {
                if (window.self !== window.top) {
                  showToast('لطباعة الشهادة، يرجى فتح التطبيق في نافذة جديدة (شاشة كاملة) أولاً بالضغط على زر المشاركة أو فتح رابط التطبيق مباشرة.', 'info');
                } else {
                  window.print();
                }
              } catch (e) {
                showToast('لطباعة الشهادة، يرجى فتح التطبيق في نافذة جديدة (شاشة كاملة) أولاً.', 'info');
              }
            }}
            className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-sm transition shadow-xl inline-flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة شهادة الإنجاز</span>
          </button>
        </section>
      )}

    </motion.div>
  );
};
