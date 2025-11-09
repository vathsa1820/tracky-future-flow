import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  due_time?: string;
  priority: 'low' | 'medium' | 'high';
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [newDueTime, setNewDueTime] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDueTime, setEditDueTime] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const { toast } = useToast();

  // Fetch todos from Supabase
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos((data || []).map(task => ({
        ...task,
        priority: task.priority as 'low' | 'medium' | 'high'
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: user.id,
          text: newTodo.trim(),
          completed: false,
          due_time: newDueTime || null,
          priority: newPriority
        }])
        .select()
        .single();

      if (error) throw error;

      setTodos([{...data, priority: data.priority as 'low' | 'medium' | 'high'}, ...todos]);
      setNewTodo('');
      setNewDueTime('');
      setNewPriority('medium');
      toast({
        title: "Task Added",
        description: "Your new task has been added to the list.",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
      
      if (!todo.completed) {
        toast({
          title: "Task Completed! 🎉",
          description: "Great job! Keep up the momentum.",
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: "Task Deleted",
        description: "Task has been removed from your list.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDueTime(todo.due_time || '');
    setEditPriority(todo.priority);
  };

  const saveEdit = async () => {
    if (!editText.trim() || !editingId) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          text: editText.trim(),
          due_time: editDueTime || null,
          priority: editPriority
        })
        .eq('id', editingId);

      if (error) throw error;

      setTodos(todos.map(todo =>
        todo.id === editingId ? { 
          ...todo, 
          text: editText.trim(),
          due_time: editDueTime || undefined,
          priority: editPriority
        } : todo
      ));
      setEditingId(null);
      setEditText('');
      setEditDueTime('');
      setEditPriority('medium');
      toast({
        title: "Task Updated",
        description: "Your task has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };
  
  const isOverdue = (dueTime?: string) => {
    if (!dueTime) return false;
    const now = new Date();
    const [hours, minutes] = dueTime.split(':').map(Number);
    const dueDate = new Date();
    dueDate.setHours(hours, minutes, 0, 0);
    return now > dueDate;
  };
  
  // Sort todos by priority and due time
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (a.due_time && b.due_time) {
      return a.due_time.localeCompare(b.due_time);
    }
    
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Add New Task */}
      <Card className="glass-elevated card-3d">
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1 bg-surface/50 border-glass-border"
            />
            <Button 
              onClick={addTodo}
              className="bg-gradient-primary hover:glow-primary transition-all duration-smooth"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                placeholder="Due time (optional)"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                className="bg-surface/50 border-glass-border"
              />
            </div>
            
            <Select value={newPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewPriority(value)}>
              <SelectTrigger className="w-32 bg-surface/50 border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <div className="text-center">
        <div className="text-2xl font-bold text-primary mb-2">
          {completedCount} of {todos.length} tasks completed
        </div>
        <div className="text-muted-foreground">
          {completedCount === todos.length && todos.length > 0 
            ? "🎉 All tasks completed! Amazing work!" 
            : "Keep going, you're doing great!"
          }
        </div>
      </div>

      {/* Todo Items */}
      <div className="space-y-3">
        {sortedTodos.map((todo) => (
          <Card 
            key={todo.id} 
            className={`glass card-3d transition-all duration-smooth ${
              todo.completed ? 'opacity-75' : ''
            } ${isOverdue(todo.due_time) && !todo.completed ? 'ring-2 ring-destructive/50' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
                
                {editingId === todo.id ? (
                  <div className="flex-1 space-y-3">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="bg-surface/50 border-glass-border"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={editDueTime}
                        onChange={(e) => setEditDueTime(e.target.value)}
                        className="bg-surface/50 border-glass-border"
                      />
                      <Select value={editPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditPriority(value)}>
                        <SelectTrigger className="w-32 bg-surface/50 border-glass-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className={`${
                            todo.completed 
                              ? 'line-through text-muted-foreground' 
                              : 'text-foreground'
                          }`}
                        >
                          {todo.text}
                        </span>
                        <Badge className={getPriorityColor(todo.priority)}>
                          {todo.priority}
                        </Badge>
                      </div>
                      
                      {todo.due_time && (
                        <div className={`flex items-center gap-1 text-sm ${
                          isOverdue(todo.due_time) && !todo.completed 
                            ? 'text-destructive' 
                            : 'text-muted-foreground'
                        }`}>
                          {isOverdue(todo.due_time) && !todo.completed && (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          <Clock className="h-3 w-3" />
                          <span>Due: {todo.due_time}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(todo)}
                        className="h-8 w-8 p-0 hover:bg-primary/20"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {todos.length === 0 && (
        <Card className="glass-elevated">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground">
              Add your first task above to get started on your productive journey!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};