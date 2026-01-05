import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Player {
  id: string;
  name: string;
  avatar: string;
  points: number;
  team?: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  players: string[];
}

interface Game {
  id: string;
  name: string;
  teams: Team[];
  status: 'active' | 'finished';
}

interface Task {
  id: string;
  name: string;
  description: string;
  points: number;
  gameId: string;
}

const teamColors = [
  { name: 'Красные', color: '#ef4444', bgClass: 'bg-red-500' },
  { name: 'Синие', color: '#3b82f6', bgClass: 'bg-blue-500' },
  { name: 'Зелёные', color: '#22c55e', bgClass: 'bg-green-500' },
  { name: 'Жёлтые', color: '#eab308', bgClass: 'bg-yellow-500' },
];

const mockPlayers: Player[] = [
  { id: '1', name: 'Дмитрий Ильин', avatar: '', points: 25000 },
  { id: '2', name: 'Алексей Волков', avatar: '', points: 18000 },
  { id: '3', name: 'Сергей Акула', avatar: '', points: 12000 },
  { id: '4', name: 'Иван Дракон', avatar: '', points: 8000 },
  { id: '5', name: 'Мария Феникс', avatar: '', points: 5500 },
  { id: '6', name: 'Павел Снайпер', avatar: '', points: 4200 },
  { id: '7', name: 'Анна Стрелок', avatar: '', points: 3800 },
  { id: '8', name: 'Николай Тень', avatar: '', points: 2100 },
];

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [games, setGames] = useState<Game[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPlayer] = useState<Player>(mockPlayers[0]);
  const [isAdmin] = useState(true);

  const [newGameName, setNewGameName] = useState('');
  const [newGameTeamsCount, setNewGameTeamsCount] = useState('2');
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isManageGameOpen, setIsManageGameOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const getRankIcon = (points: number) => {
    if (points >= 25000) return '👑🔥';
    if (points >= 20000) return '💀👑';
    if (points >= 15000) return '🐉';
    if (points >= 10000) return '🦈';
    if (points >= 5000) return '🐺';
    return '⚔️';
  };

  const createGame = () => {
    if (!newGameName.trim()) {
      toast({ title: 'Ошибка', description: 'Введите название игры', variant: 'destructive' });
      return;
    }

    const teamsCount = parseInt(newGameTeamsCount);
    const newTeams: Team[] = [];
    
    for (let i = 0; i < teamsCount; i++) {
      newTeams.push({
        id: `team-${Date.now()}-${i}`,
        name: teamColors[i].name,
        color: teamColors[i].color,
        players: [],
      });
    }

    const newGame: Game = {
      id: `game-${Date.now()}`,
      name: newGameName,
      teams: newTeams,
      status: 'active',
    };

    setGames([...games, newGame]);
    setNewGameName('');
    setNewGameTeamsCount('2');
    setIsCreateGameOpen(false);
    toast({ title: 'Игра создана!', description: `"${newGameName}" готова к началу` });
  };

  const addPlayersToGame = (gameId: string, teamId: string) => {
    if (selectedPlayers.length === 0) {
      toast({ title: 'Ошибка', description: 'Выберите игроков', variant: 'destructive' });
      return;
    }

    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          teams: game.teams.map(team => {
            if (team.id === teamId) {
              return {
                ...team,
                players: [...new Set([...team.players, ...selectedPlayers])],
              };
            }
            return team;
          }),
        };
      }
      return game;
    }));

    setSelectedPlayers([]);
    toast({ title: 'Игроки добавлены!', description: `${selectedPlayers.length} игроков добавлено в команду` });
  };

  const removePlayerFromTeam = (gameId: string, teamId: string, playerId: string) => {
    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          teams: game.teams.map(team => {
            if (team.id === teamId) {
              return {
                ...team,
                players: team.players.filter(p => p !== playerId),
              };
            }
            return team;
          }),
        };
      }
      return game;
    }));
  };

  const finishGame = (gameId: string, winnerTeamId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    const winnerTeam = game.teams.find(t => t.id === winnerTeamId);
    const loserTeams = game.teams.filter(t => t.id !== winnerTeamId);

    if (!winnerTeam) return;

    const loserPlayerIds = loserTeams.flatMap(t => t.players);
    const loserPlayers = players.filter(p => loserPlayerIds.includes(p.id));

    const totalLoserPoints = loserPlayers.reduce((sum, p) => sum + p.points, 0);
    const pointsPerWinner = Math.floor((totalLoserPoints * 0.1) / winnerTeam.players.length);

    setPlayers(players.map(player => {
      if (winnerTeam.players.includes(player.id)) {
        return { ...player, points: player.points + pointsPerWinner };
      }
      if (loserPlayerIds.includes(player.id)) {
        return { ...player, points: Math.max(0, player.points - Math.floor(player.points * 0.1)) };
      }
      return player;
    }));

    setGames(games.filter(g => g.id !== gameId));
    toast({ 
      title: '🏆 Игра завершена!', 
      description: `${winnerTeam.name} победили! Каждый победитель получил +${pointsPerWinner} XP` 
    });
  };

  const createTask = () => {
    if (!newTaskName.trim() || !newTaskPoints.trim()) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: newTaskName,
      description: newTaskDescription,
      points: parseInt(newTaskPoints),
      gameId: selectedGame?.id || '',
    };

    setTasks([...tasks, newTask]);
    setNewTaskName('');
    setNewTaskPoints('');
    setNewTaskDescription('');
    setIsCreateTaskOpen(false);
    toast({ title: 'Задача создана!', description: `"${newTaskName}" на ${newTaskPoints} XP` });
  };

  const completeTask = (taskId: string, playerId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, points: p.points + task.points } : p
    ));

    setTasks(tasks.filter(t => t.id !== taskId));
    
    const player = players.find(p => p.id === playerId);
    toast({ 
      title: '✅ Задача выполнена!', 
      description: `${player?.name} получил +${task.points} XP` 
    });
  };

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold neon-text mb-2">
            СТРАЙКБОЛ РЕЙТИНГ
          </h1>
          <p className="text-muted-foreground">Система подсчета очков от Дмитрия Ильина</p>
        </header>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/50 p-1 neon-border">
            <TabsTrigger value="leaderboard" className="data-[state=active]:neon-border">
              <Icon name="Trophy" className="mr-2" size={18} />
              Лидеры
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:neon-border">
              <Icon name="Swords" className="mr-2" size={18} />
              События
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:neon-border">
              <Icon name="User" className="mr-2" size={18} />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="p-6 bg-card/80 border-primary/30 neon-border">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="Crown" className="text-primary" size={32} />
                <h2 className="text-3xl font-bold neon-text">Таблица лидеров</h2>
              </div>

              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-[1.02] ${
                      index === 0
                        ? 'bg-primary/10 border-2 border-primary neon-border'
                        : 'bg-muted/30 border border-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl font-bold w-8 text-center">
                        {index + 1}
                      </span>
                      <Avatar className="h-14 w-14 border-2 border-primary">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{player.name}</h3>
                          <span className="text-2xl">{getRankIcon(player.points)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {player.team || 'Без команды'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-lg px-4 py-2 border-primary text-primary font-bold"
                    >
                      {player.points.toLocaleString()} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {isAdmin ? (
              <Card className="p-6 bg-card/80 border-secondary/30 neon-border-secondary">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Icon name="Shield" className="text-secondary" size={32} />
                    <h2 className="text-3xl font-bold text-secondary neon-text">
                      Панель администратора
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isCreateGameOpen} onOpenChange={setIsCreateGameOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/80 neon-border">
                          <Icon name="Plus" className="mr-2" size={18} />
                          Создать игру
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-primary">
                        <DialogHeader>
                          <DialogTitle className="text-primary">Новая игра</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Название игры</Label>
                            <Input 
                              placeholder="Битва за территорию" 
                              className="bg-muted border-primary/30"
                              value={newGameName}
                              onChange={(e) => setNewGameName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Количество команд</Label>
                            <Select value={newGameTeamsCount} onValueChange={setNewGameTeamsCount}>
                              <SelectTrigger className="bg-muted border-primary/30">
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2 команды</SelectItem>
                                <SelectItem value="3">3 команды</SelectItem>
                                <SelectItem value="4">4 команды</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={createGame} className="w-full bg-primary hover:bg-primary/80 neon-border">
                            Создать
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-accent text-accent neon-border-accent">
                          <Icon name="ListChecks" className="mr-2" size={18} />
                          Задачи
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-accent">
                        <DialogHeader>
                          <DialogTitle className="text-accent">Создать задачу</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Название задачи</Label>
                            <Input 
                              placeholder="Захват флага" 
                              className="bg-muted border-accent/30"
                              value={newTaskName}
                              onChange={(e) => setNewTaskName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Количество очков</Label>
                            <Input 
                              type="number" 
                              placeholder="500" 
                              className="bg-muted border-accent/30"
                              value={newTaskPoints}
                              onChange={(e) => setNewTaskPoints(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Описание</Label>
                            <Textarea 
                              placeholder="Описание задачи..." 
                              className="bg-muted border-accent/30"
                              value={newTaskDescription}
                              onChange={(e) => setNewTaskDescription(e.target.value)}
                            />
                          </div>
                          <Button onClick={createTask} className="w-full bg-accent hover:bg-accent/80 text-black neon-border-accent">
                            Создать задачу
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {tasks.length > 0 && (
                  <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                    <h3 className="text-accent font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Target" size={20} />
                      Активные задачи
                    </h3>
                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                          <div>
                            <p className="font-semibold">{task.name}</p>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-accent text-black">+{task.points} XP</Badge>
                            <Select onValueChange={(playerId) => completeTask(task.id, playerId)}>
                              <SelectTrigger className="w-[180px] bg-muted">
                                <SelectValue placeholder="Выбрать игрока" />
                              </SelectTrigger>
                              <SelectContent>
                                {players.map(player => (
                                  <SelectItem key={player.id} value={player.id}>
                                    {player.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {games.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                      <Icon name="GamepadIcon" className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">Нет активных игр</p>
                      <p className="text-sm text-muted-foreground">
                        Создайте новую игру для начала
                      </p>
                    </div>
                  ) : (
                    games.map((game) => (
                      <Card key={game.id} className="p-6 bg-muted/30 border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-2xl">{game.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {game.teams.length} команды
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button onClick={() => setSelectedGame(game)} size="sm" variant="outline" className="border-accent text-accent">
                                <Icon name="Users" className="mr-2" size={16} />
                                Управление
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-accent max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-accent">Управление игрой: {game.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Добавить игроков:</h4>
                                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-muted/30 rounded">
                                    {players.map(player => (
                                      <div key={player.id} className="flex items-center gap-2">
                                        <Checkbox 
                                          id={`player-${player.id}`}
                                          checked={selectedPlayers.includes(player.id)}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedPlayers([...selectedPlayers, player.id]);
                                            } else {
                                              setSelectedPlayers(selectedPlayers.filter(p => p !== player.id));
                                            }
                                          }}
                                        />
                                        <label htmlFor={`player-${player.id}`} className="text-sm cursor-pointer">
                                          {player.name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  {game.teams.map(team => (
                                    <div key={team.id} className="p-4 rounded-lg" style={{ backgroundColor: `${team.color}20`, borderColor: team.color, borderWidth: 2 }}>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-bold" style={{ color: team.color }}>{team.name}</h4>
                                        <Button 
                                          size="sm" 
                                          onClick={() => addPlayersToGame(game.id, team.id)}
                                          style={{ backgroundColor: team.color }}
                                          className="text-black"
                                        >
                                          <Icon name="Plus" size={14} />
                                        </Button>
                                      </div>
                                      <div className="space-y-2">
                                        {team.players.map(playerId => {
                                          const player = players.find(p => p.id === playerId);
                                          return player ? (
                                            <div key={playerId} className="flex items-center justify-between p-2 bg-black/20 rounded">
                                              <span className="text-sm">{player.name}</span>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0"
                                                onClick={() => removePlayerFromTeam(game.id, team.id, playerId)}
                                              >
                                                <Icon name="X" size={14} />
                                              </Button>
                                            </div>
                                          ) : null;
                                        })}
                                        {team.players.length === 0 && (
                                          <p className="text-xs text-muted-foreground">Нет игроков</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-4 border-t">
                                  <h4 className="font-semibold mb-2">Определить победителя:</h4>
                                  <div className="flex gap-2">
                                    {game.teams.map(team => (
                                      <Button
                                        key={team.id}
                                        onClick={() => finishGame(game.id, team.id)}
                                        style={{ backgroundColor: team.color }}
                                        className="flex-1 text-black font-bold"
                                      >
                                        {team.name} победили!
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {game.teams.map(team => (
                            <div 
                              key={team.id} 
                              className="p-3 rounded-lg" 
                              style={{ backgroundColor: `${team.color}20`, borderColor: team.color, borderWidth: 2 }}
                            >
                              <h4 className="font-semibold mb-1" style={{ color: team.color }}>
                                {team.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {team.players.length} игроков
                              </p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-card/80 border-secondary/30">
                <div className="flex items-center gap-4 mb-6">
                  <Icon name="Gamepad2" className="text-secondary" size={32} />
                  <h2 className="text-3xl font-bold text-secondary">Активные игры</h2>
                </div>
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                  <Icon name="Search" className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <p className="text-muted-foreground">Нет доступных игр</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6 bg-card/80 border-accent/30 neon-border-accent">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-accent neon-border-accent">
                    <AvatarImage src={currentPlayer.avatar} />
                    <AvatarFallback className="bg-accent/20 text-accent text-3xl">
                      {currentPlayer.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="border-accent text-accent">
                    <Icon name="Upload" className="mr-2" size={16} />
                    Изменить фото
                  </Button>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{currentPlayer.name}</h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-xl px-4 py-2 bg-accent text-black">
                        {currentPlayer.points.toLocaleString()} XP
                      </Badge>
                      <span className="text-4xl">{getRankIcon(currentPlayer.points)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-accent">Достижения</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className={`p-3 rounded-lg border text-center ${currentPlayer.points >= 5000 ? 'bg-accent/10 border-accent' : 'bg-muted/30 border-muted opacity-50'}`}>
                        <div className="text-3xl mb-1">🐺</div>
                        <p className={`text-xs ${currentPlayer.points >= 5000 ? 'text-accent font-bold' : 'text-muted-foreground'}`}>5000 XP</p>
                      </div>
                      <div className={`p-3 rounded-lg border text-center ${currentPlayer.points >= 10000 ? 'bg-accent/10 border-accent' : 'bg-muted/30 border-muted opacity-50'}`}>
                        <div className="text-3xl mb-1">🦈</div>
                        <p className={`text-xs ${currentPlayer.points >= 10000 ? 'text-accent font-bold' : 'text-muted-foreground'}`}>10000 XP</p>
                      </div>
                      <div className={`p-3 rounded-lg border text-center ${currentPlayer.points >= 15000 ? 'bg-accent/10 border-accent' : 'bg-muted/30 border-muted opacity-50'}`}>
                        <div className="text-3xl mb-1">🐉</div>
                        <p className={`text-xs ${currentPlayer.points >= 15000 ? 'text-accent font-bold' : 'text-muted-foreground'}`}>15000 XP</p>
                      </div>
                      <div className={`p-3 rounded-lg border text-center ${currentPlayer.points >= 20000 ? 'bg-accent/10 border-accent' : 'bg-muted/30 border-muted opacity-50'}`}>
                        <div className="text-3xl mb-1">💀👑</div>
                        <p className={`text-xs ${currentPlayer.points >= 20000 ? 'text-accent font-bold' : 'text-muted-foreground'}`}>20000 XP</p>
                      </div>
                      <div className={`p-3 rounded-lg border text-center ${currentPlayer.points >= 25000 ? 'bg-primary/10 border-primary neon-border' : 'bg-muted/30 border-muted opacity-50'}`}>
                        <div className="text-3xl mb-1">👑🔥</div>
                        <p className={`text-xs ${currentPlayer.points >= 25000 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>25000 XP</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Имя игрока</Label>
                    <Input defaultValue={currentPlayer.name} className="bg-muted border-accent/30" />
                    <Button className="bg-accent hover:bg-accent/80 text-black neon-border-accent">
                      <Icon name="Save" className="mr-2" size={16} />
                      Сохранить изменения
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
