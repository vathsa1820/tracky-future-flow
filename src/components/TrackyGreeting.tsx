import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Coffee, Sun, Moon, Sunrise, CloudSun } from "lucide-react";

const greetings = {
  morning: [
    { text: "Rise and grind! ☀️", sub: "Early bird catches the A+, am I right?" },
    { text: "Good morning, champion!", sub: "Today's gonna be YOUR day. I can feel it!" },
    { text: "Wakey wakey, future engineer!", sub: "Those textbooks aren't gonna read themselves... but I'll help!" },
    { text: "Morning sunshine! 🌅", sub: "Coffee first, conquering the world second?" },
    { text: "Look who's up early!", sub: "Your future self is already thanking you." },
    { text: "GM! Ready to be awesome?", sub: "Spoiler alert: you already are." },
  ],
  afternoon: [
    { text: "Afternoon warrior! ⚡", sub: "Halfway through the day and still crushing it!" },
    { text: "Hey there, productivity machine!", sub: "Need a study buddy? I'm literally always free." },
    { text: "Good afternoon!", sub: "Fun fact: you're doing better than you think." },
    { text: "Lunch break over?", sub: "Let's turn that food coma into focus mode! 🎯" },
    { text: "Still going strong! 💪", sub: "That's the engineering spirit right there." },
    { text: "Afternoon check-in!", sub: "How's it going? (I'm genuinely curious!)" },
  ],
  evening: [
    { text: "Evening, night owl! 🦉", sub: "The best ideas come after sunset, trust me." },
    { text: "Good evening!", sub: "Time for that final push... or a well-deserved break!" },
    { text: "Still at it? Legend.", sub: "But also... have you eaten? Just checking! 🍕" },
    { text: "Evening productivity mode!", sub: "Let's make these hours count!" },
    { text: "Hey night warrior!", sub: "Remember: sleep is part of studying too!" },
    { text: "Burning the midnight oil?", sub: "I respect the hustle, but pace yourself!" },
  ],
  night: [
    { text: "Whoa, late night session! 🌙", sub: "Your dedication is inspiring (and slightly concerning)." },
    { text: "Still here? You're a legend.", sub: "But seriously, don't forget to sleep!" },
    { text: "Night owl mode: ACTIVATED", sub: "Just... promise me you'll rest soon?" },
    { text: "3am study session?", sub: "Engineers really are built different, huh? 😅" },
    { text: "Burning bright at night! ✨", sub: "Tomorrow-you will thank tonight-you. Or need coffee. Probably both." },
    { text: "Can't sleep?", sub: "Let's make this time productive then! Or just chat?" },
  ],
};

const motivationalTips = [
  "💡 Tip: Break big tasks into tiny wins. Your brain loves celebrating!",
  "🎯 Remember: Progress > Perfection. Every step counts!",
  "⏰ Quick hack: 25 min focus + 5 min break = Pomodoro magic!",
  "🧠 Fun fact: Teaching someone else helps YOU learn better!",
  "☕ Hydration check! Water helps your brain work 14% better.",
  "🌟 You've got this! Engineering is hard, but so are you.",
  "📚 Active recall > Re-reading. Quiz yourself!",
  "💪 Struggling? That means you're learning. Keep pushing!",
];

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const getTimeIcon = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return Sunrise;
  if (hour >= 8 && hour < 12) return Sun;
  if (hour >= 12 && hour < 17) return CloudSun;
  if (hour >= 17 && hour < 21) return Moon;
  return Moon;
};

export const TrackyGreeting = () => {
  const [greeting, setGreeting] = useState({ text: "", sub: "" });
  const [tip, setTip] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const TimeIcon = getTimeIcon();

  useEffect(() => {
    const timeOfDay = getTimeOfDay();
    const greetingList = greetings[timeOfDay];
    const randomGreeting = greetingList[Math.floor(Math.random() * greetingList.length)];
    const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
    
    setGreeting(randomGreeting);
    setTip(randomTip);
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="glass-elevated rounded-2xl p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="h-7 w-7 text-primary-foreground" />
                  </div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">Tracky says</span>
                    <TimeIcon className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2"
                  >
                    {greeting.text}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground text-sm md:text-base"
                  >
                    {greeting.sub}
                  </motion.p>
                </div>
              </div>
              
              {/* Motivational tip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 pt-4 border-t border-glass-border"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
