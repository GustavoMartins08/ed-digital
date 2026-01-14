import { NewsItem, Editorial, Video, Columnist } from '../types';
import { supabase } from './supabase';

// Helper to map DB columns to NewsItem type
const mapNewsItem = (item: any): NewsItem => ({
  id: item.id,
  title: item.title,
  excerpt: item.excerpt,
  content: item.content,
  category: item.category,
  source: item.source,
  imageUrl: item.image_url, // map image_url to imageUrl
  timestamp: new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }),
  keyPoints: item.key_points || []
});

export const fetchLatestNews = async (category?: string): Promise<NewsItem[]> => {
  let query = supabase
    .from('news_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'Todas') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return (data || []).map(mapNewsItem);
};

export const fetchNewsByIds = async (ids: string[]): Promise<NewsItem[]> => {
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from('news_items')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error('Error fetching news by IDs:', error);
    return [];
  }

  return (data || []).map(mapNewsItem);
};

export const fetchEditorials = async (): Promise<Editorial[]> => {
  const { data, error } = await supabase
    .from('newsletter_editions')
    .select('*')
    .order('publication_date', { ascending: false });

  if (error) {
    console.error('Error fetching editorials:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    monthYear: new Date(item.publication_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    theme: item.title,
    imageUrl: item.cover_image_url,
    summary: item.synthesis
  }));
};

export const fetchVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    duration: item.duration,
    platform: item.platform,
    imageUrl: item.thumbnail_url,
    category: item.category,
    // video_id_or_url needed? Type Video doesn't have it, but maybe needed for detail? 
    // Checking types.ts: Video interface has: id, title, duration, platform, imageUrl, category.
    // So we adhere to the interface.
  }));
};

export const fetchColumns = async (): Promise<Columnist[]> => {
  const { data, error } = await supabase
    .from('columnists')
    .select('*');

  if (error) {
    console.error('Error fetching columnists:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    company: item.company,
    avatarUrl: item.avatar_url,
    bio: item.bio
  }));
};