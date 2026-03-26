// Central app state — mock data store

export type Category = 'Church' | 'Academic' | 'Social' | 'Sports' | 'Tech';

export type Event = {
  id: string;
  title: string;
  category: Category;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  interested: number;
  views: number;
  attendanceEstimate: number;
  interestedByMe: boolean;
  zone: string;
  imageUrl?: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: Category;
  eventId?: string;
};

export type UserProfile = {
  name: string;
  email: string;
  interests: Category[];
  pastCategories: Category[];
};

export const mockUser: UserProfile = {
  name: 'Alex Banda',
  email: 'alex@cbu.ac.zm',
  interests: ['Church', 'Tech'],
  pastCategories: ['Church', 'Church', 'Tech', 'Social'],
};

const now = new Date();
const today = (h: number, m = 0) => { const d = new Date(now); d.setHours(h, m, 0, 0); return d.toISOString(); };
const tomorrow = (h: number) => { const d = new Date(now); d.setDate(d.getDate() + 1); d.setHours(h, 0, 0, 0); return d.toISOString(); };
const inDays = (days: number, h: number) => { const d = new Date(now); d.setDate(d.getDate() + days); d.setHours(h, 0, 0, 0); return d.toISOString(); };

export const mockEvents: Event[] = [
  { id: '1', title: 'Vespers Service', category: 'Church', date: today(17), time: '17:00', location: 'SBE Lawns', description: 'Join us for a peaceful Vespers service as we close the week in worship and reflection. All are welcome.', organizer: 'SDA Campus Ministry', interested: 142, views: 380, attendanceEstimate: 120, interestedByMe: true, zone: 'SBE Campus', imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b671e4668?w=800&q=80' },
  { id: '2', title: 'Tech Talk: AI in Africa', category: 'Tech', date: today(14), time: '14:00', location: 'ICT Lab, Block C', description: 'A panel discussion on how AI is transforming industries across Africa. Guest speakers from Lusaka tech startups.', organizer: 'CBU Tech Club', interested: 89, views: 210, attendanceEstimate: 70, interestedByMe: false, zone: 'ICT Block', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
  { id: '3', title: 'Inter-Faculty Football', category: 'Sports', date: tomorrow(10), time: '10:00', location: 'Main Sports Ground', description: 'Annual inter-faculty football tournament. Cheer your faculty to victory!', organizer: 'CBU Sports Council', interested: 203, views: 540, attendanceEstimate: 300, interestedByMe: false, zone: 'Sports Ground', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80' },
  { id: '4', title: 'Prayer & Praise Night', category: 'Church', date: tomorrow(19), time: '19:00', location: 'Main Chapel', description: 'An evening of worship, prayer, and testimonies. Come as you are.', organizer: 'CBU Christian Union', interested: 95, views: 180, attendanceEstimate: 80, interestedByMe: false, zone: 'Chapel Area', imageUrl: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800&q=80' },
  { id: '5', title: 'Hackathon 2026', category: 'Tech', date: inDays(3, 8), time: '08:00', location: 'Engineering Block', description: '24-hour hackathon. Build solutions for local community problems. Prizes worth K10,000.', organizer: 'CBU Tech Club', interested: 167, views: 420, attendanceEstimate: 100, interestedByMe: true, zone: 'Engineering Block', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' },
  { id: '6', title: 'End of Semester Social', category: 'Social', date: inDays(5, 18), time: '18:00', location: 'Student Union Hall', description: 'Celebrate the end of semester with food, music, and good vibes. Free entry for all students.', organizer: 'Student Union', interested: 312, views: 890, attendanceEstimate: 250, interestedByMe: false, zone: 'Student Union', imageUrl: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80' },
  { id: '7', title: 'CAT Revision Session', category: 'Academic', date: tomorrow(9), time: '09:00', location: 'Library Seminar Room', description: 'Group revision for upcoming CATs. Bring your notes and questions.', organizer: 'Academic Affairs', interested: 44, views: 120, attendanceEstimate: 40, interestedByMe: false, zone: 'Library', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80' },
  { id: '8', title: 'Basketball Tournament', category: 'Sports', date: inDays(2, 15), time: '15:00', location: 'Basketball Court', description: '3-on-3 basketball tournament open to all students. Register your team at the sports office.', organizer: 'CBU Sports Council', interested: 78, views: 190, attendanceEstimate: 60, interestedByMe: false, zone: 'Sports Ground', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Vespers in 1 hour', body: "Vespers Service starts at 17:00 at SBE Lawns. Don't miss it!", time: '16:00', read: false, category: 'Church', eventId: '1' },
  { id: 'n2', title: 'New Tech event: Hackathon', body: "Hackathon 2026 is happening in 3 days. You're interested — mark your calendar!", time: 'Yesterday', read: false, category: 'Tech', eventId: '5' },
  { id: 'n3', title: 'Reminder: Tech Talk today', body: 'Tech Talk: AI in Africa starts at 14:00 at ICT Lab.', time: '13:00', read: true, category: 'Tech', eventId: '2' },
  { id: 'n4', title: 'Prayer Night tomorrow', body: 'Prayer & Praise Night is tomorrow at 19:00 in the Main Chapel.', time: 'Yesterday', read: true, category: 'Church', eventId: '4' },
];

export function scoreEvent(event: Event, user: UserProfile): number {
  let score = 0;
  if (user.interests.includes(event.category)) score += 40;
  const pastCount = user.pastCategories.filter(c => c === event.category).length;
  score += pastCount * 10;
  const hoursUntil = (new Date(event.date).getTime() - Date.now()) / 3600000;
  if (hoursUntil >= 0 && hoursUntil <= 24) score += 30;
  else if (hoursUntil > 24 && hoursUntil <= 72) score += 15;
  else if (hoursUntil > 72) score += 5;
  score += Math.min(event.interested / 10, 10);
  return score;
}

export function getPersonalizedFeed(events: Event[], user: UserProfile): Event[] {
  return [...events]
    .filter(e => new Date(e.date).getTime() >= Date.now() - 3600000)
    .sort((a, b) => scoreEvent(b, user) - scoreEvent(a, user));
}

export function getSmartReason(event: Event, user: UserProfile): string | null {
  if (user.interests.includes(event.category)) {
    const count = user.pastCategories.filter(c => c === event.category).length;
    if (count >= 2) return `You usually attend ${event.category} events`;
    return `Matches your ${event.category} interest`;
  }
  const hoursUntil = (new Date(event.date).getTime() - Date.now()) / 3600000;
  if (hoursUntil >= 0 && hoursUntil <= 3) return 'Happening very soon';
  if (event.interested > 150) return 'Trending on campus';
  return null;
}

export function formatEventTime(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const diffH = (d.getTime() - now.getTime()) / 3600000;
  if (diffH >= 0 && diffH < 1) return `In ${Math.round(diffH * 60)} min`;
  if (diffH >= 1 && diffH < 24) return `Today ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  if (diffH >= 24 && diffH < 48) return `Tomorrow ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// iconName maps to Ionicons names used across the app
export const CATEGORY_META: Record<Category, { color: string; bg: string; iconName: string }> = {
  Church:   { color: '#A78BFA', bg: 'rgba(167,139,250,0.15)', iconName: 'business-outline' },
  Academic: { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)',  iconName: 'school-outline'   },
  Social:   { color: '#F472B6', bg: 'rgba(244,114,182,0.15)', iconName: 'people-outline'   },
  Sports:   { color: '#34D399', bg: 'rgba(52,211,153,0.15)',  iconName: 'trophy-outline'   },
  Tech:     { color: '#FFD700', bg: 'rgba(255,215,0,0.15)',   iconName: 'laptop-outline'   },
};
