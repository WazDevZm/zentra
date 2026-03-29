import type { Event } from '@/store/app-store';
import { supabase } from '@/lib/supabase';

type EventRow = {
  id: string;
  title: string;
  category: Event['category'];
  date: string;
  time: string;
  location: string;
  description: string;
  organizer_name: string;
  attendance_estimate: number | null;
  views: number | null;
  zone: string;
  image_url: string | null;
  poster_url: string | null;
  organizer_phone: string | null;
  organizer_whatsapp: string | null;
  interested_count?: number | null;
};

function mapRowToEvent(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    time: row.time,
    location: row.location,
    description: row.description,
    organizer: row.organizer_name,
    interested: row.interested_count ?? 0,
    views: row.views ?? 0,
    attendanceEstimate: row.attendance_estimate ?? 0,
    interestedByMe: false,
    zone: row.zone,
    organizerPhone: row.organizer_phone ?? undefined,
    organizerWhatsApp: row.organizer_whatsapp ?? undefined,
    posterUrl: row.poster_url ?? undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

export async function fetchEventsFromSupabase(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events_with_interest_count')
    .select(
      'id,title,category,date,time,location,description,organizer_name,attendance_estimate,views,zone,image_url,poster_url,organizer_phone,organizer_whatsapp,interested_count'
    )
    .order('date', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(row => mapRowToEvent(row as EventRow));
}
