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
import Icon from '@/components/ui/icon';

interface Player {
  id: string;
  name: string;
  avatar: string;
  points: number;
  team?: string;
}

interface Team {
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
  points: number;
  gameId: string;
}

const mockPlayers: Player[] = [
  { id: '1', name: 'Дмитрий Ильин', avatar: '', points: 25000 },
  { id: '2', name: 'Алексей Волков', avatar: '', points: 18000 },
  { id: '3', name: 'Сергей Акула', avatar: '', points: 12000 },
  { id: '4', name: 'Иван Дракон', avatar: '', points: 8000 },
  { id: '5', name: 'Мария Феникс', avatar: '', points: 5500 },
];

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [games, setGames] = useState<Game[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPlayer] = useState<Player>(mockPlayers[0]);
  const [isAdmin] = useState(true);

  const getRankIcon = (points: number) => {
    if (points >= 25000) return '👑🔥';
    if (points >= 20000) return '💀👑';
    if (points >= 15000) return '🐉';
    if (points >= 10000) return '🦈';
    if (points >= 5000) return '🐺';
    return '⚔️';
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
                  <Dialog>
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
                          <Input placeholder="Битва за территорию" className="bg-muted border-primary/30" />
                        </div>
                        <div>
                          <Label>Количество команд</Label>
                          <Select>
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
                        <Button className="w-full bg-primary hover:bg-primary/80 neon-border">
                          Создать
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

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
                      <Card key={game.id} className="p-4 bg-muted/30 border-primary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{game.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {game.teams.length} команды
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-accent text-accent">
                              <Icon name="Users" className="mr-2" size={16} />
                              Игроки
                            </Button>
                            <Button size="sm" variant="outline" className="border-primary text-primary">
                              <Icon name="Award" className="mr-2" size={16} />
                              Завершить
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                <div className="mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-accent text-accent neon-border-accent">
                        <Icon name="ListChecks" className="mr-2" size={18} />
                        Дополнительные задачи
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-accent">
                      <DialogHeader>
                        <DialogTitle className="text-accent">Создать задачу</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Название задачи</Label>
                          <Input placeholder="Захват флага" className="bg-muted border-accent/30" />
                        </div>
                        <div>
                          <Label>Количество очков</Label>
                          <Input type="number" placeholder="500" className="bg-muted border-accent/30" />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea placeholder="Описание задачи..." className="bg-muted border-accent/30" />
                        </div>
                        <Button className="w-full bg-accent hover:bg-accent/80 text-black neon-border-accent">
                          Создать задачу
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                      <div className="p-3 bg-muted/30 rounded-lg border border-muted text-center">
                        <div className="text-3xl mb-1">🐺</div>
                        <p className="text-xs text-muted-foreground">5000 XP</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg border border-muted text-center">
                        <div className="text-3xl mb-1">🦈</div>
                        <p className="text-xs text-muted-foreground">10000 XP</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg border border-muted text-center">
                        <div className="text-3xl mb-1">🐉</div>
                        <p className="text-xs text-muted-foreground">15000 XP</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg border border-muted text-center">
                        <div className="text-3xl mb-1">💀👑</div>
                        <p className="text-xs text-muted-foreground">20000 XP</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary neon-border text-center">
                        <div className="text-3xl mb-1">👑🔥</div>
                        <p className="text-xs text-primary font-bold">25000 XP</p>
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
