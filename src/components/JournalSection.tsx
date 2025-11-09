import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Flame, TrendingUp, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'tough';
}

export const JournalSection = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'okay' | 'tough'>('good');
  const { toast } = useToast();

  // Fetch journal entries from Supabase
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries((data || []).map(entry => ({
        ...entry,
        mood: entry.mood as 'great' | 'good' | 'okay' | 'tough'
      })));
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: user.id,
          content: currentEntry.trim(),
          mood: selectedMood
        }])
        .select()
        .single();

      if (error) throw error;

      setEntries([{...data, mood: data.mood as 'great' | 'good' | 'okay' | 'tough'}, ...entries]);
      setCurrentEntry('');
      toast({
        title: "Journal Entry Saved",
        description: "Your thoughts have been recorded. Great job reflecting!",
      });
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    }
  };

  const streak = 7; // Mock streak data
  const totalEntries = entries.length;

  const moodEmojis = {
    great: '🎉',
    good: '😊', 
    okay: '😐',
    tough: '😰'
  };

  const moodColors = {
    great: 'text-success',
    good: 'text-primary',
    okay: 'text-accent',
    tough: 'text-destructive'
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Journal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass card-3d">
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="glass card-3d">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">{totalEntries}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>
        
        <Card className="glass card-3d">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">Growth</div>
            <div className="text-sm text-muted-foreground">Mindset</div>
          </CardContent>
        </Card>
      </div>

      {/* New Entry */}
      <Card className="glass-elevated card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">How was your day?</label>
            <div className="flex gap-3">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMood(mood as any)}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="capitalize">{mood}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Textarea
              placeholder="What happened today? What did you learn? What are you grateful for?"
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[120px] bg-surface/50 border-glass-border resize-none"
            />
          </div>
          
          <Button 
            onClick={saveEntry}
            className="w-full bg-gradient-primary hover:glow-primary transition-all duration-smooth"
            disabled={!currentEntry.trim()}
          >
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Previous Entries
        </h3>
        
        {entries.map((entry) => (
          <Card key={entry.id} className="glass card-3d">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                  <div>
                    <div className="font-medium">
                      {new Date(entry.created_at).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className={`text-sm capitalize font-medium ${moodColors[entry.mood]}`}>
                      {entry.mood} day
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">
                {entry.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length === 0 && (
        <Card className="glass-elevated">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground">
              Begin journaling to track your growth and reflect on your daily experiences.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};