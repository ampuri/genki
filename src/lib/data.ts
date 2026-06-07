import grammarData from '../data/grammar.json';
import type { GrammarPoint, LessonGroup } from '../types';

export const allPoints: GrammarPoint[] = grammarData as GrammarPoint[];

const lessonTitleMap: Record<number, string> = {
  0: 'Greetings',
  1: 'New Friends',
  2: 'Shopping',
  3: 'Making a Date',
  4: 'The First Date',
  5: 'A Trip to Okinawa',
  6: "A Day in Robert's Life",
  7: 'Family Picture',
  8: 'Barbecue',
  9: 'Kabuki',
  10: 'Winter Vacation Plans',
  11: 'After the Vacation',
  12: 'Feeling Ill',
  13: 'Looking for a Part-time Job',
  14: "Valentine's Day",
  15: 'A Trip to Nagano',
  16: 'Lost and Found',
  17: 'Grumble and Gossip',
  18: "John's Part-time Job",
  19: 'Meeting the Boss',
  20: 'Mary Goes Shopping',
  21: 'Burglar',
  22: 'Education in Japan',
  23: 'Good-bye',
};

export function getLessonGroups(): LessonGroup[] {
  const map = new Map<number, GrammarPoint[]>();
  for (const pt of allPoints) {
    if (!map.has(pt.lesson)) map.set(pt.lesson, []);
    map.get(pt.lesson)!.push(pt);
  }

  const groups: LessonGroup[] = [];
  for (const [lesson, points] of map) {
    points.sort((a, b) => a.order - b.order);
    const book = points[0].book;
    groups.push({ lesson, book, title: lessonTitleMap[lesson] ?? `Lesson ${lesson}`, points });
  }

  return groups.sort((a, b) => a.lesson - b.lesson);
}

export function getById(id: string): GrammarPoint | undefined {
  return allPoints.find(p => p.id === id);
}
